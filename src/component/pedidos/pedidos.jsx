import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Form,
  Table,
  Modal,
  Alert,
  InputGroup,
  FormControl,
  Pagination,
} from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";

// Utilidad para formatear fechas
const formatDate = (date) => {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(date).toLocaleDateString("es-ES", options);
};

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPedido, setEditingPedido] = useState(null);
  const [newPedido, setNewPedido] = useState({
    fecha: "",
    descripcion: "",
    idSede: "",
    idUsuario: "",
    estado: 1,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [sedes, setSedes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
    const [showPermissionModal, setShowPermissionModal] = useState(false); // Nuevo estado
    const [permissionMessage, setPermissionMessage] = useState('');
    const [permissions, setPermissions] = useState({});

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/usuarios/permisos', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Ajusta según dónde guardes el token
          },
        });
        setPermissions(response.data.permisos || {});
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };
  
    fetchPermissions();
    fetchPedidos();
    fetchSedes();
    fetchUsuarios();
  }, []);

  const checkPermission = (permission, message) => {
    if (!permissions[permission]) {
      setPermissionMessage(message);
      setShowPermissionModal(true);
      return false;
    }
    return true;
  };
  

  const fetchPedidos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/pedidos");
      setPedidos(response.data);
      setFilteredPedidos(response.data);
    } catch (error) {
      console.error("Error fetching pedidos:", error);
    }
  };

  const fetchActivePedidos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/pedidos/activas");
      setPedidos(response.data);
      setFilteredPedidos(response.data);
    } catch (error) {
      console.error("Error fetching active pedidos:", error);
    }
  };
  
  const fetchInactivePedidos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/pedidos/inactivas");
      setPedidos(response.data);
      setFilteredPedidos(response.data);
    } catch (error) {
      console.error("Error fetching inactive pedidos:", error);
    }
  };
  
  const fetchSedes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/sedes");
      setSedes(response.data);
    } catch (error) {
      console.error("Error fetching sedes:", error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/usuarios");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error fetching usuarios:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = pedidos.filter((pedido) =>
      pedido.descripcion.toLowerCase().includes(value)
    );

    setFilteredPedidos(filtered);
    setCurrentPage(1);
  };

  const handleShowModal = (pedido = null) => {
    if (pedido) {
      // Convertir fecha al formato compatible con datetime-local
      pedido.fecha = new Date(pedido.fecha).toISOString().slice(0, 10);
    }

    setEditingPedido(pedido);
    setNewPedido(
      pedido || {
        fecha: "",
        descripcion: "",
        idSede: "",
        idUsuario: "",
        estado: 1,
      }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPedido(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPedido({ ...newPedido, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const regexDescripcion = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,-]+$/;
    if (!regexDescripcion.test(newPedido.descripcion)) {
      setAlertMessage(
        "La descripción solo debe contener letras, números, espacios y los signos permitidos (.,-)."
      );
      setShowAlert(true);
      return;
    }

    try {
      if (editingPedido) {
        await axios.put(
          `http://localhost:5000/pedidos/${editingPedido.idPedido}`,
          newPedido
        );
        setAlertMessage("Pedido actualizado con éxito");
      } else {
        await axios.post("http://localhost:5000/pedidos", newPedido);
        setAlertMessage("Pedido creado con éxito");
      }
      fetchPedidos();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting pedido:", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/pedidos/${id}`, { estado: nuevoEstado });
      fetchPedidos();
      setAlertMessage(
        `Pedido ${nuevoEstado === 1 ? "activado" : "inactivado"} con éxito`
      );
      setShowAlert(true);
    } catch (error) {
      console.error("Error toggling estado:", error);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentPedidos = filteredPedidos.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredPedidos.length / rowsPerPage);

  const renderPagination = () => (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (currentPage > 1) setCurrentPage((prev) => prev - 1);
        }}
        style={{
          color: currentPage === 1 ? "gray" : "#007AC3",
          cursor: currentPage === 1 ? "default" : "pointer",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Anterior
      </a>

      <div className="d-flex align-items-center">
        <span style={{ marginRight: "10px", fontWeight: "bold" }}>Filas</span>
        <Form.Control
          as="select"
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          style={{
            width: "100px",
            height: "40px",
          }}
        >
          {[5, 10, 20, 50].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Form.Control>
      </div>

      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
        }}
        style={{
          color: currentPage === totalPages ? "gray" : "#007AC3",
          cursor: currentPage === totalPages ? "default" : "pointer",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Siguiente
      </a>
    </div>
  );

  return (
    <>
      <div className="row" style={{ textAlign: "center", marginBottom: "20px" }}>
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
            Gestión de Pedidos
          </h3>
        </div>
      </div>

      <div
        className="container mt-4"
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar pedido por descripción..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>

        <div className="d-flex justify-content-start align-items-center mb-3">
          <Button
            style={{
              backgroundColor: "#007abf",
              borderColor: "#007AC3",
              padding: "5px 10px",
              width: "180px",
              marginRight: "10px",
              fontWeight: "bold",
              color: "#fff",
            }}
            onClick={() => {
              if (checkPermission('Crear pedido', 'No tienes permisos para crear pedido')) {
                handleShowModal();
              }
            }}
          >
            Agregar Pedido
          </Button>
          <Button
            style={{
              backgroundColor: "#009B85",
              borderColor: "#007AC3",
              padding: "5px 10px",
              width: "100px",
              marginRight: "10px",
              fontWeight: "bold",
              color: "#fff",
            }}
            onClick={fetchActivePedidos}
          >
            Activos
          </Button>
          <Button
            style={{
              backgroundColor: "#bf2200",
              borderColor: "#007AC3",
              padding: "5px 10px",
              width: "100px",
              fontWeight: "bold",
              color: "#fff",
            }}
            onClick={fetchInactivePedidos}
          >
            Inactivos
          </Button>
        </div>

        <Alert
          variant="success"
          show={showAlert}
          onClose={() => setShowAlert(false)}
          dismissible
          style={{ marginTop: "20px", fontWeight: "bold" }}
        >
          {alertMessage}
        </Alert>

        <Table
          striped
          bordered
          hover
          responsive
          className="mt-3"
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            overflow: "hidden",
            marginTop: "20px",
          }}
        >
          <thead
            style={{ backgroundColor: "#007AC3", color: "#fff", textAlign: "center" }}
          >
            <tr>
              <th style={{ textAlign: "center" }}>ID</th>
              <th style={{ textAlign: "center" }}>Fecha</th>
              <th style={{ textAlign: "center" }}>Descripción</th>
              <th style={{ textAlign: "center" }}>Sede</th>
              <th style={{ textAlign: "center" }}>Usuario</th>
              <th style={{ textAlign: "center" }}>Estado</th>
              <th style={{ textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentPedidos.map((pedido) => (
              <tr key={pedido.idPedido}>
                <td style={{ textAlign: "center" }}>{pedido.idPedido}</td>
                <td style={{ textAlign: "center" }}>{formatDate(pedido.fecha)}</td>
                <td style={{ textAlign: "center" }}>{pedido.descripcion}</td>
                <td style={{ textAlign: "center" }}>
                  {sedes.find((sede) => sede.idSede === pedido.idSede)?.nombreSede ||
                    "N/A"}
                </td>
                <td style={{ textAlign: "center" }}>
                  {usuarios.find((usuario) => usuario.idUsuario === pedido.idUsuario)
                    ?.usuario || "N/A"}
                </td>
                <td style={{ textAlign: "center" }}>
                  {pedido.estado === 1 ? "Activo" : "Inactivo"}
                </td>
                <td style={{ textAlign: "center" }}>
                  <FaPencilAlt
                    style={{
                      color: "#007AC3",
                      cursor: "pointer",
                      marginRight: "10px",
                      fontSize: "20px",
                    }}
                    title="Editar"
                    onClick={() => {
                      if (checkPermission('Editar pedido', 'No tienes permisos para editar pedido')) {
                        handleShowModal(pedido);
                      }
                    }}
                  />
                  {pedido.estado === 1 ? (
                    <FaToggleOn
                      style={{
                        color: "#30c10c",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Inactivar"
                      onClick={() => {
                        if (checkPermission('Desactivar pedido', 'No tienes permisos para desactivar pedido')) {
                          toggleEstado(pedido.idPedido, pedido.estado);
                        }
                      }}
                    />
                  ) : (
                    <FaToggleOff
                      style={{
                        color: "#e10f0f",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Activar"
                      onClick={() => {
                        if (checkPermission('Activar pedido', 'No tienes permisos para activar pedido')) {
                          toggleEstado(pedido.idPedido, pedido.estado);
                        }
                      }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {renderPagination()}

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header
            closeButton
            style={{ backgroundColor: "#007AC3", color: "#fff" }}
          >
            <Modal.Title>
              {editingPedido ? "Editar Pedido" : "Agregar Pedido"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="fecha">
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha"
                  value={newPedido.fecha}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="descripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  name="descripcion"
                  value={newPedido.descripcion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idSede">
                <Form.Label>Sede</Form.Label>
                <Form.Control
                  as="select"
                  name="idSede"
                  value={newPedido.idSede}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar Sede</option>
                  {sedes.map((sede) => (
                    <option key={sede.idSede} value={sede.idSede}>
                      {sede.nombreSede}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="idUsuario">
                <Form.Label>Usuario</Form.Label>
                <Form.Control
                  as="select"
                  name="idUsuario"
                  value={newPedido.idUsuario}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar Usuario</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.idUsuario} value={usuario.idUsuario}>
                      {usuario.usuario}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Button
                style={{
                  backgroundColor: "#007AC3",
                  borderColor: "#007AC3",
                  padding: "5px 10px",
                  width: "100%",
                  fontWeight: "bold",
                  color: "#fff",
                }}
                type="submit"
              >
                {editingPedido ? "Actualizar" : "Crear"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
         <Modal show={showPermissionModal} onHide={() => setShowPermissionModal(false)}>
                 <Modal.Header closeButton>
                  <Modal.Title>Permiso Denegado</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>{permissionMessage}</Modal.Body>
                  <Modal.Footer>
                  <Button variant="primary" onClick={() => setShowPermissionModal(false)}>
                    Aceptar
                  </Button>
                 </Modal.Footer>
              </Modal>
      </div>
    </>
  );
}

export default Pedidos;

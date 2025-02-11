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

function TipoTraslado() {
  const [tipoTraslados, setTipoTraslados] = useState([]);
  const [filteredTipoTraslados, setFilteredTipoTraslados] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTipoTraslado, setEditingTipoTraslado] = useState(null);
  const [newTipoTraslado, setNewTipoTraslado] = useState({
    tipo: "",
    estado: 1,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showPermissionModal, setShowPermissionModal] = useState(false); // Nuevo estado
  const [permissionMessage, setPermissionMessage] = useState('');
  const [permissions, setPermissions] = useState({});
  const [hasViewPermission, setHasViewPermission] = useState(false);
  const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get('https://api.voluntariadoayuvi.com/usuarios/permisos', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Ajusta según dónde guardes el token
          },
        });
        setPermissions(response.data.permisos || {});

        const hasPermission =
        response.data.permisos['Ver tipo traslados']

      setHasViewPermission(hasPermission);
      setIsPermissionsLoaded(true);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermissions();
  }, []);

   useEffect(() => {
        if (isPermissionsLoaded) {
          if (hasViewPermission) {
            fetchTipoTraslados();
          } else {
            checkPermission('Ver tipo traslados', 'No tienes permisos para ver tipo traslados');
          }
        }
      }, [isPermissionsLoaded, hasViewPermission]);

  const checkPermission = (permission, message) => {
    if (!permissions[permission]) {
      setPermissionMessage(message);
      setShowPermissionModal(true);
      return false;
    }
    return true;
  };

  const fetchTipoTraslados = async () => {
    try {
      const response = await axios.get("https://api.voluntariadoayuvi.com/tipoTraslados");
      setTipoTraslados(response.data);
      setFilteredTipoTraslados(response.data);
    } catch (error) {
      console.error("Error fetching tipo traslados:", error);
    }
  };

  const fetchActiveTipoTraslados = async () => {
    try {
      if (hasViewPermission) {
      const response = await axios.get("https://api.voluntariadoayuvi.com/tipoTraslados/activas");
      setFilteredTipoTraslados(response.data);
    } else {
      checkPermission('Ver tipo traslados', 'No tienes permisos para ver tipo traslados')
    }
    } catch (error) {
      console.error("Error fetching active tipo traslados:", error);
    }
  };

  const fetchInactiveTipoTraslados = async () => {
    try {
      if (hasViewPermission) {
      const response = await axios.get("https://api.voluntariadoayuvi.com/tipoTraslados/inactivas");
      setFilteredTipoTraslados(response.data);
    } else {
      checkPermission('Ver tipo traslados', 'No tienes permisos para ver tipo traslados')
    }
    } catch (error) {
      console.error("Error fetching inactive tipo traslados:", error);
    }
  };

  const handleShowModal = (tipoTraslado = null) => {
    setEditingTipoTraslado(tipoTraslado);
    setNewTipoTraslado(tipoTraslado || { tipo: "", estado: 1 });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTipoTraslado(null);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = tipoTraslados.filter((tipoTraslado) =>
      tipoTraslado.tipo.toLowerCase().includes(value)
    );

    setFilteredTipoTraslados(filtered);
    setCurrentPage(1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTipoTraslado({ ...newTipoTraslado, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!regex.test(newTipoTraslado.tipo)) {
      setAlertMessage("El tipo de traslado solo debe contener letras y espacios.");
      setShowAlert(true);
      return;
    }

    try {
      if (editingTipoTraslado) {
        await axios.put(
          `https://api.voluntariadoayuvi.com/tipoTraslados/${editingTipoTraslado.idTipoTraslado}`,
          newTipoTraslado
        );
        setAlertMessage("Tipo de traslado actualizado con éxito");
      } else {
        await axios.post("https://api.voluntariadoayuvi.com/tipoTraslados", newTipoTraslado);
        setAlertMessage("Tipo de traslado creado con éxito");
      }
      fetchTipoTraslados();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting tipo traslado:", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`https://api.voluntariadoayuvi.com/tipoTraslados/${id}`, { estado: nuevoEstado });
      fetchTipoTraslados();
      setAlertMessage(
        `Tipo de traslado ${nuevoEstado === 1 ? "activado" : "inactivado"} con éxito`
      );
      setShowAlert(true);
    } catch (error) {
      console.error("Error toggling estado:", error);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentTipoTraslados = filteredTipoTraslados.slice(
    indexOfFirstRow,
    indexOfLastRow
  );

  const totalPages = Math.ceil(filteredTipoTraslados.length / rowsPerPage);

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
   <div className="row justify-content-center" style={{marginBottom: "20px" }}>
        <div className="col-12 text-center">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333", textAlign: "center" }}>
            Gestión de Tipos de Traslado
          </h3>
        </div>
      </div>

      <div
        className="container mt-4"
        style={{
          maxWidth: "100%",
          margin: "0 auto",
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar tipo de traslado..."
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
              if (checkPermission('Crear tipo traslado', 'No tienes permisos para crear tipo traslado')) {
                handleShowModal();
              }
            }}
          >
            Agregar Tipo de Traslado
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
            onClick={fetchActiveTipoTraslados}
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
            onClick={fetchInactiveTipoTraslados}
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
              <th style={{ textAlign: "center" }}>Tipo</th>
              <th style={{ textAlign: "center" }}>Estado</th>
              <th style={{ textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentTipoTraslados.map((tipoTraslado) => (
              <tr key={tipoTraslado.idTipoTraslado}>
                <td style={{ textAlign: "center" }}>{tipoTraslado.idTipoTraslado}</td>
                <td style={{ textAlign: "center" }}>{tipoTraslado.tipo}</td>
                <td style={{ textAlign: "center" }}>
                  {tipoTraslado.estado === 1 ? "Activo" : "Inactivo"}
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
                      if (checkPermission('Editar tipo traslado', 'No tienes permisos para editar tipo traslado')) {
                        handleShowModal(tipoTraslado);
                      }
                    }}
                  />
                  {tipoTraslado.estado === 1 ? (
                    <FaToggleOn
                      style={{
                        color: "#30c10c",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Inactivar"
                      onClick={() => {
                        if (checkPermission('Desactivar tipo traslado', 'No tienes permisos para desactivar tipo traslado')) {
                          toggleEstado(tipoTraslado.idTipoTraslado, tipoTraslado.estado);
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
                        if (checkPermission('Activar tipo traslado', 'No tienes permisos para activar tipo traslado')) {
                          toggleEstado(tipoTraslado.idTipoTraslado, tipoTraslado.estado);
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
              {editingTipoTraslado
                ? "Editar Tipo de Traslado"
                : "Agregar Tipo de Traslado"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="tipo">
                <Form.Label>Tipo</Form.Label>
                <Form.Control
                  type="text"
                  name="tipo"
                  value={newTipoTraslado.tipo}
                  onChange={handleChange}
                  placeholder="Ingrese tipo de traslado"
                  required
                />
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newTipoTraslado.estado}
                  onChange={handleChange}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
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
                  marginTop: "10px",
                }}
                type="submit"
              >
                {editingTipoTraslado ? "Actualizar" : "Crear"}
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

export default TipoTraslado;

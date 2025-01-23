import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl } from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";

function TipoPublicos() {
  const [tipoPublicos, setTipoPublicos] = useState([]);
  const [filteredTipoPublicos, setFilteredTipoPublicos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTipoPublico, setEditingTipoPublico] = useState(null);
  const [newTipoPublico, setNewTipoPublico] = useState({ nombreTipo: "", estado: 1 });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showValidationError, setShowValidationError] = useState(false); // Nuevo estado para validación
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
    fetchTipoPublicos();
  }, []);

  const checkPermission = (permission, message) => {
    if (!permissions[permission]) {
      setPermissionMessage(message);
      setShowPermissionModal(true);
      return false;
    }
    return true;
  };

  const fetchTipoPublicos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tipo_publicos");
      setTipoPublicos(response.data);
      setFilteredTipoPublicos(response.data);
    } catch (error) {
      console.error("Error fetching tipo_publicos:", error);
    }
  };

  const fetchActiveTipoPublicos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tipo_publicos/activos");
      setFilteredTipoPublicos(response.data);
    } catch (error) {
      console.error("Error fetching active tipo_publicos:", error);
    }
  };

  const fetchInactiveTipoPublicos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tipo_publicos/inactivos");
      setFilteredTipoPublicos(response.data);
    } catch (error) {
      console.error("Error fetching inactive tipo_publicos:", error);
    }
  };

  const handleShowModal = (tipoPublico = null) => {
    setEditingTipoPublico(tipoPublico);
    setNewTipoPublico(tipoPublico || { nombreTipo: "", estado: 1 });
    setShowValidationError(false); // Ocultar el mensaje de validación al abrir el modal
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTipoPublico(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convertir estado a número si es el campo "estado"
    const updatedValue = name === "estado" ? parseInt(value, 10) : value;

    setNewTipoPublico({ ...newTipoPublico, [name]: updatedValue });
  };

  // Nuevo manejador de evento para prevenir la entrada de números
  const handleKeyPress = (e) => {
    const regex = /^[A-Za-záéíóúÁÉÍÓÚÑñ\s]*$/;

    if (!regex.test(e.key)) {
      e.preventDefault(); // Evitar que se escriba el carácter inválido
      setShowValidationError(true); // Mostrar mensaje de validación
    } else {
      setShowValidationError(false); // Ocultar mensaje de validación si es válido
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTipoPublico) {
        await axios.put(
          `http://localhost:5000/tipo_publicos/update/${editingTipoPublico.idTipoPublico}`,
          newTipoPublico
        );
        setAlertMessage("Tipo de público actualizado con éxito");
      } else {
        await axios.post("http://localhost:5000/tipo_publicos/create", newTipoPublico);
        setAlertMessage("Tipo de público creado con éxito");
      }
      fetchTipoPublicos();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting tipo_publico:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = tipoPublicos.filter((tipoPublico) =>
      tipoPublico.nombreTipo.toLowerCase().includes(value)
    );

    setFilteredTipoPublicos(filtered);
    setCurrentPage(1);
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/tipo_publicos/update/${id}`, { estado: nuevoEstado });
      fetchTipoPublicos();
      setAlertMessage(
        `Tipo de público ${nuevoEstado === 1 ? "activado" : "inactivado"} con éxito`
      );
      setShowAlert(true);
    } catch (error) {
      console.error("Error toggling estado:", error);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentTipoPublicos = filteredTipoPublicos.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredTipoPublicos.length / rowsPerPage);

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
            Gestión de Tipos de Público para Venta de Mercancía
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
            placeholder="Buscar tipo de público por nombre..."
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
              if (checkPermission('Crear tipo publico', 'No tienes permisos para crear tipo publico')) {
                handleShowModal();
              }
            }}
          >
            Agregar Tipo de Público
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
            onClick={fetchActiveTipoPublicos}
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
            onClick={fetchInactiveTipoPublicos}
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
          <thead style={{ backgroundColor: "#007AC3", color: "#fff", textAlign: "center" }}>
            <tr>
              <th>ID</th>
              <th>Nombre Tipo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center" }}> 
            {currentTipoPublicos.map((tipoPublico) => (
              <tr key={tipoPublico.idTipoPublico}>
                <td>{tipoPublico.idTipoPublico}</td>
                <td>{tipoPublico.nombreTipo}</td>
                <td>{tipoPublico.estado === 1 ? "Activo" : "Inactivo"}</td>
                <td>
                  <FaPencilAlt
                    style={{
                      color: "#007AC3",
                      cursor: "pointer",
                      marginRight: "10px",
                      fontSize: "20px",
                    }}
                    title="Editar"
                    onClick={() => {
                      if (checkPermission('Editar tipo publico', 'No tienes permisos para editar tipo publico')) {
                        handleShowModal(tipoPublico);
                      }
                    }}
                  />
                  {tipoPublico.estado ? (
                    <FaToggleOn
                      style={{
                        color: "#30c10c",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Inactivar"
                      onClick={() => {
                        if (checkPermission('Desactivar tipo publico', 'No tienes permisos para desactivar tipo publico')) {
                          toggleEstado(tipoPublico.idTipoPublico, tipoPublico.estado);
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
                        if (checkPermission('Activar tipo publico', 'No tienes permisos para activar tipo publico')) {
                          toggleEstado(tipoPublico.idTipoPublico, tipoPublico.estado);
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
              {editingTipoPublico ? "Editar Tipo de Público" : "Agregar Tipo de Público"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nombreTipo">
                <Form.Label>Nombre del Tipo de Público</Form.Label>
                <Form.Control
                  type="text"
                  name="nombreTipo"
                  value={newTipoPublico.nombreTipo}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress} // Añadir el evento onKeyPress
                  required
                />
                {showValidationError && (
                  <Alert variant="danger" style={{ marginTop: "10px", fontWeight: "bold" }}>
                    Solamente letras
                  </Alert>
                )}
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newTipoPublico.estado}
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
                }}
                type="submit"
              >
                {editingTipoPublico ? "Actualizar" : "Crear"}
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

export default TipoPublicos;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl, Pagination } from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";

const formatDate = (date) => {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(date).toLocaleDateString("es-ES", options);
};

function Voluntarios() {
  const [voluntarios, setVoluntarios] = useState([]);
  const [filteredVoluntarios, setFilteredVoluntarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [editingVoluntario, setEditingVoluntario] = useState(null);
  const [newVoluntario, setNewVoluntario] = useState({
    codigoQR: "",
    fechaRegistro: "",
    fechaSalida: "",
    estado: 1,
    idPersona: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [personas, setPersonas] = useState([]);
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
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
          },
        });
        setPermissions(response.data.permisos || {});
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };
  
    fetchPermissions();
    fetchVoluntarios();
    fetchPersonas();
  }, []);

  const checkPermission = (permission, message) => {
    if (!permissions[permission]) {
      setPermissionMessage(message);
      setShowPermissionModal(true);
      return false;
    }
    return true;
  };

  const fetchVoluntarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/voluntarios");
      setVoluntarios(response.data);
      setFilteredVoluntarios(response.data);
    } catch (error) {
      console.error("Error fetching voluntarios:", error);
    }
  };

  const fetchPersonas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/personas");
      setPersonas(response.data);
    } catch (error) {
      console.error("Error fetching personas:", error);
    }
  };

  const fetchActiveVoluntarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/voluntarios/activos");
      setVoluntarios(response.data);
      setFilteredVoluntarios(response.data);
    } catch (error) {
      console.error("Error fetching active voluntarios:", error);
    }
  };

  const fetchInactiveVoluntarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/voluntarios/inactivos");
      setVoluntarios(response.data);
      setFilteredVoluntarios(response.data);
    } catch (error) {
      console.error("Error fetching inactive voluntarios:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = voluntarios.filter((voluntario) => {
      const persona = personas.find((p) => p.idPersona === voluntario.idPersona);
      const personaNombre = persona ? persona.nombre.toLowerCase() : "";

      return (
        voluntario.fechaRegistro.toLowerCase().includes(value) ||
        personaNombre.includes(value)
      );
    });

    setFilteredVoluntarios(filtered);
    setCurrentPage(1); // Reinicia a la primera página tras la búsqueda
  };

  const handleShowModal = (voluntario = null) => {
    setEditingVoluntario(voluntario);
    setNewVoluntario(
      voluntario || {
        fechaRegistro: "",
        fechaSalida: "",
        estado: 1,
        idPersona: "",
      }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVoluntario(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVoluntario({ ...newVoluntario, [name]: value });
  };

  const handleShowQRModal = (codigoQR) => {
    // Aquí puedes usar una URL de generación de QR como Google Chart API o algún servicio para mostrar el QR
    // Supongamos que tienes un backend que genera la imagen del QR a partir del valor:
    setQrCodeUrl(`http://localhost:5000/generateQR?data=${codigoQR}`);
    setShowQRModal(true);
  };
  
  const handleCloseQRModal = () => {
    setShowQRModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVoluntario) {
        await axios.put(
          `http://localhost:5000/voluntarios/update/${editingVoluntario.idVoluntario}`,
          newVoluntario
        );
        setAlertMessage("Voluntario actualizado con éxito");
      } else {
        await axios.post("http://localhost:5000/voluntarios/create", newVoluntario);
        setAlertMessage("Voluntario creado con éxito");
      }
      fetchVoluntarios();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting voluntario:", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/voluntarios/update/${id}`, { estado: nuevoEstado });
      fetchVoluntarios();
      setAlertMessage(
        `Voluntario ${nuevoEstado === 1 ? "activado" : "inactivado"} con éxito`
      );
      setShowAlert(true);
    } catch (error) {
      console.error("Error toggling estado:", error);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentVoluntarios = filteredVoluntarios.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredVoluntarios.length / rowsPerPage);

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
            Gestión de Voluntarios
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
            placeholder="Buscar por fecha de registro o nombre..."
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
              if (checkPermission('Crear voluntario', 'No tienes permisos para crear voluntario')) {
                handleShowModal();
              }
            }}
          >
            Agregar Voluntario
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
            onClick={fetchActiveVoluntarios}
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
            onClick={fetchInactiveVoluntarios}
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
            marginTop: "20px",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          <thead style={{ backgroundColor: "#007AC3", color: "#fff", textAlign: "center" }}>
            <tr>
              <th style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>ID</th>
              <th style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>Código QR</th>
              <th style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>Fecha Registro</th>
              <th style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>Fecha Salida</th>
              <th style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>Persona</th>
              <th style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>Estado</th>
              <th style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentVoluntarios.map((voluntario) => (
              <tr key={voluntario.idVoluntario}>
                <td style={{ textAlign: "center" }}>{voluntario.idVoluntario}</td>
                <td style={{ textAlign: "center" }}>
                  <span
                    style={{ color: "#007AC3", cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => handleShowQRModal(voluntario.codigoQR)}
                  >
                    {voluntario.codigoQR}
                  </span>
                </td>
                <td style={{ textAlign: "center" }}>{formatDate(voluntario.fechaRegistro)}</td>
                <td style={{ textAlign: "center" }}>{formatDate(voluntario.fechaSalida)}</td>
                <td style={{ textAlign: "center" }}>
                  {personas.find((persona) => persona.idPersona === voluntario.idPersona)?.nombre ||
                    "Desconocido"}
                </td>
                <td style={{ textAlign: "center" }}>
                  {voluntario.estado === 1 ? "Activo" : "Inactivo"}
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
                      if (checkPermission('Editar voluntario', 'No tienes permisos para editar voluntario')) {
                        handleShowModal(voluntario);
                      }
                    }}
                  />
                  {voluntario.estado ? (
                    <FaToggleOn
                      style={{ 
                        color: "#30c10c",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Inactivar"
                      onClick={() => {
                        if (checkPermission('Desactivar voluntario', 'No tienes permisos para desactivar voluntario')) {
                          toggleEstado(voluntario.idVoluntario, voluntario.estado);
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
                        if (checkPermission('Activar voluntario', 'No tienes permisos para activar voluntario')) {
                          toggleEstado(voluntario.idVoluntario, voluntario.estado);
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
        
        <Modal show={showQRModal} onHide={handleCloseQRModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Código QR</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ textAlign: "center" }}>
            {qrCodeUrl && (
              <img
                src={qrCodeUrl}
                alt="Código QR"
                style={{ width: "100%", maxWidth: "300px" }}
              />
            )}
          </Modal.Body>
        </Modal>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header
            closeButton
            style={{ backgroundColor: "#007AC3", color: "#fff" }}
          >
            <Modal.Title>
              {editingVoluntario ? "Editar Voluntario" : "Agregar Voluntario"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="fechaRegistro">
                <Form.Label>Fecha Registro</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaRegistro"
                  value={newVoluntario.fechaRegistro}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="fechaSalida">
                <Form.Label>Fecha Salida</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaSalida"
                  value={newVoluntario.fechaSalida}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idPersona">
                <Form.Label>Persona</Form.Label>
                <Form.Control
                  as="select"
                  name="idPersona"
                  value={newVoluntario.idPersona}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar Persona</option>
                  {personas.map((persona) => (
                    <option key={persona.idPersona} value={persona.idPersona}>
                      {persona.nombre}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newVoluntario.estado}
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
                {editingVoluntario ? "Actualizar" : "Crear"}
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

export default Voluntarios;

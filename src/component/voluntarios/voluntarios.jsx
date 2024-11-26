import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl, Pagination } from "react-bootstrap";

function Voluntarios() {
  const [voluntarios, setVoluntarios] = useState([]);
  const [filteredVoluntarios, setFilteredVoluntarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingVoluntario, setEditingVoluntario] = useState(null);
  const [newVoluntario, setNewVoluntario] = useState({
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

  useEffect(() => {
    fetchVoluntarios();
    fetchPersonas();
  }, []);

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
              width: "130px",
              marginRight: "10px",
              fontWeight: "bold",
              color: "#fff",
            }}
            onClick={() => handleShowModal()}
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
            borderRadius: "8px",
            marginTop: "20px",
          }}
        >
          <thead style={{ backgroundColor: "#007AC3", color: "#fff" }}>
            <tr>
              <th>ID</th>
              <th>Fecha Registro</th>
              <th>Fecha Salida</th>
              <th>Persona</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentVoluntarios.map((voluntario) => (
              <tr key={voluntario.idVoluntario}>
                <td>{voluntario.idVoluntario}</td>
                <td>{voluntario.fechaRegistro}</td>
                <td>{voluntario.fechaSalida}</td>
                <td>
                  {personas.find((persona) => persona.idPersona === voluntario.idPersona)?.nombre ||
                    "Desconocido"}
                </td>
                <td>{voluntario.estado === 1 ? "Activo" : "Inactivo"}</td>
                <td>
                  <Button
                    style={{
                      backgroundColor: "#007AC3",
                      borderColor: "#007AC3",
                      padding: "5px 10px",
                      width: "100px",
                      marginRight: "5px",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                    onClick={() => handleShowModal(voluntario)}
                  >
                    Editar
                  </Button>
                  <Button
                    style={{
                      backgroundColor: voluntario.estado ? "#6c757d" : "#28a745",
                      borderColor: voluntario.estado ? "#6c757d" : "#28a745",
                      padding: "5px 10px",
                      width: "100px",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                    onClick={() => toggleEstado(voluntario.idVoluntario, voluntario.estado)}
                  >
                    {voluntario.estado ? "Inactivar" : "Activar"}
                  </Button>
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
      </div>
    </>
  );
}

export default Voluntarios;

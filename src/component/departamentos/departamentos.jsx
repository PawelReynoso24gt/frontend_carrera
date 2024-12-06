import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, InputGroup, FormControl } from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";

function Departamentos() {
  const [departamentos, setDepartamentos] = useState([]);
  const [filteredDepartamentos, setFilteredDepartamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingDepartamento, setEditingDepartamento] = useState(null);
  const [newDepartamento, setNewDepartamento] = useState({ departamento: "", estado: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState("");

  useEffect(() => {
    fetchDepartamentos();
  }, []);

  const fetchDepartamentos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/departamentos");
      setDepartamentos(response.data);
      setFilteredDepartamentos(response.data);
    } catch (error) {
      console.error("Error fetching departamentos:", error);
    }
  };

  const fetchActiveDepartamentos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/departamentos/activas");
      setDepartamentos(response.data);
      setFilteredDepartamentos(response.data);
    } catch (error) {
      console.error("Error fetching active departamentos:", error);
    }
  };

  const fetchInactiveDepartamentos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/departamentos/inactivas");
      setDepartamentos(response.data);
      setFilteredDepartamentos(response.data);
    } catch (error) {
      console.error("Error fetching inactive departamentos:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = departamentos.filter((departamento) =>
      departamento.departamento.toLowerCase().includes(value)
    );

    setFilteredDepartamentos(filtered);
  };

  const handleShowModal = (departamento = null) => {
    setEditingDepartamento(departamento);
    setNewDepartamento(departamento || { departamento: "", estado: 1 });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDepartamento(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDepartamento({ ...newDepartamento, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDepartamento) {
        await axios.put(`http://localhost:5000/departamentos/${editingDepartamento.idDepartamento}`, newDepartamento);
        setMessageModalContent("Departamento actualizado con éxito");
      } else {
        await axios.post("http://localhost:5000/departamentos/create", newDepartamento);
        setMessageModalContent("Departamento creado con éxito");
      }
      fetchDepartamentos();
      setShowMessageModal(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting departamento:", error);
      setMessageModalContent("Error al procesar la solicitud.");
      setShowMessageModal(true);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/departamentos/${id}`, { estado: nuevoEstado });
      fetchDepartamentos();
      setMessageModalContent(
        `Departamento ${nuevoEstado === 1 ? "activado" : "inactivado"} con éxito`
      );
      setShowMessageModal(true);
    } catch (error) {
      console.error("Error toggling estado:", error);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentDepartamentos = filteredDepartamentos.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredDepartamentos.length / rowsPerPage);

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
      {/* Modal para mostrar mensajes */}
      <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Información</Modal.Title>
        </Modal.Header>
        <Modal.Body>{messageModalContent}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowMessageModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Encabezado */}
      <div className="row" style={{ textAlign: "center", marginBottom: "20px" }}>
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
            Gestión de Departamentos
          </h3>
        </div>
      </div>

      {/* Contenedor principal */}
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
            placeholder="Buscar por departamento..."
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
              marginRight: "10px",
              fontWeight: "bold",
              color: "#fff",
               width: "150px"
            }}
            onClick={() => handleShowModal()}
          >
            Agregar Departamento
          </Button>
          <Button
            style={{
              backgroundColor: "#009B85",
              borderColor: "#007AC3",
              padding: "5px 10px",
              marginRight: "10px",
              fontWeight: "bold",
              color: "#fff",
               width: "100px"
            }}
            onClick={fetchActiveDepartamentos}
          >
            Activos
          </Button>
          <Button
            style={{
              backgroundColor: "#bf2200",
              borderColor: "#007AC3",
              padding: "5px 10px",
              fontWeight: "bold",
              color: "#fff",
               width: "100px"
            }}
            onClick={fetchInactiveDepartamentos}
          >
            Inactivos
          </Button>
        </div>

        <Table
          striped
          bordered
          hover
          responsive
          className="mt-3"
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            overflow: "hidden",
            marginTop: "20px",
          }}
        >
          <thead style={{ backgroundColor: "#007AC3", color: "#fff", textAlign: "center" }}>
            <tr>
              <th style={{ textAlign: "center" }}>ID</th>
              <th style={{ textAlign: "center" }}>Nombre</th>
              <th style={{ textAlign: "center" }}>Estado</th>
              <th style={{ textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentDepartamentos.map((departamento) => (
              <tr key={departamento.idDepartamento}>
                <td style={{ textAlign: "center" }}>{departamento.idDepartamento}</td>
                <td style={{ textAlign: "center" }}>{departamento.departamento}</td>
                <td style={{ textAlign: "center" }}>
                  {departamento.estado === 1 ? "Activo" : "Inactivo"}
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
                    onClick={() => handleShowModal(departamento)}
                  />
                  {departamento.estado ? (
                    <FaToggleOn
                      style={{
                        color: "#30c10c",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Inactivar"
                      onClick={() => toggleEstado(departamento.idDepartamento, departamento.estado)}
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
                      onClick={() => toggleEstado(departamento.idDepartamento, departamento.estado)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {renderPagination()}
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#007AC3", color: "#fff" }}
        >
          <Modal.Title>
            {editingDepartamento ? "Editar Departamento" : "Agregar Departamento"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="departamento">
              <Form.Label>Departamento</Form.Label>
              <Form.Control
                type="text"
                name="departamento"
                value={newDepartamento.departamento}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="estado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                name="estado"
                value={newDepartamento.estado}
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
              {editingDepartamento ? "Actualizar" : "Crear"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Departamentos;

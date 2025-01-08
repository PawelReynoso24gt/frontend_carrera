import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Modal, Form, Alert, InputGroup, FormControl, Pagination } from "react-bootstrap";
import { FaPencilAlt, FaTrash } from "react-icons/fa";

function SoporteTecnico() {
  const [bitacoras, setBitacoras] = useState([]);
  const [filteredBitacoras, setFilteredBitacoras] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBitacora, setEditingBitacora] = useState(null);
  const [newBitacora, setNewBitacora] = useState({
    descripcion: "",
    idUsuario: 3, // Valor quemado para pruebas
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchProblemasDetectados(); // Cargar problemas detectados por defecto
  }, []);

  const fetchProblemasDetectados = async () => {
    try {
      const response = await axios.get("http://localhost:5000/bitacora/problemas");
      setBitacoras(response.data);
      setFilteredBitacoras(response.data);
    } catch (error) {
      console.error("Error fetching problemas detectados:", error);
    }
  };

  const fetchProblemasRevision = async () => {
    try {
      const response = await axios.get("http://localhost:5000/bitacora/problemasRevision");
      setBitacoras(response.data);
      setFilteredBitacoras(response.data);
    } catch (error) {
      console.error("Error fetching problemas en revisión:", error);
    }
  };

  const fetchProblemasSolucionados = async () => {
    try {
      const response = await axios.get("http://localhost:5000/bitacora/problemasSolucionados");
      setBitacoras(response.data);
      setFilteredBitacoras(response.data);
    } catch (error) {
      console.error("Error fetching problemas solucionados:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = bitacoras.filter((bitacora) =>
      bitacora.descripcion.toLowerCase().includes(value)
    );
    setFilteredBitacoras(filtered);
    setCurrentPage(1);
  };

  const handleShowCreateModal = () => {
    setShowCreateModal(true);
    setNewBitacora({
      descripcion: "",
      idUsuario: 3,
    });
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleShowEditModal = (bitacora) => {
    setEditingBitacora(bitacora);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingBitacora(null);
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setNewBitacora({ ...newBitacora, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingBitacora({ ...editingBitacora, [name]: value });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const bitacoraToCreate = {
      ...newBitacora,
      fechaHora: new Date().toISOString(), // Fecha y hora actual
      estado: "problema detectado",
      idCategoriaBitacora: 5,
    };

    try {
      await axios.post("http://localhost:5000/bitacora/create", bitacoraToCreate);
      setAlertMessage("Registro creado con éxito");
      setShowAlert(true);
      handleCloseCreateModal();
      fetchProblemasDetectados();
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error("Error creating registro:", error);
      setAlertMessage("Error al crear la registro");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:5000/bitacora/update/${editingBitacora.idBitacora}`, {
        descripcion: editingBitacora.descripcion,
        estado: editingBitacora.estado,
        fechaHora: new Date().toISOString(), // Actualizar la fecha y hora
      });
      setAlertMessage("Registro actualizado con éxito");
      setShowAlert(true);
      handleCloseEditModal();
      fetchProblemasDetectados();
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error("Error updating registro:", error);
      setAlertMessage("Error al actualizar la registro");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentBitacoras = filteredBitacoras.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredBitacoras.length / rowsPerPage);

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
            Gestión de situaciones que se han reportado
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
            placeholder="Buscar registro por descripción..."
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
            onClick={handleShowCreateModal}
          >
            Crear Registro
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
            onClick={fetchProblemasDetectados}
          >
            Detectados
          </Button>
          <Button
            style={{
              backgroundColor: "#f0ad4e",
              borderColor: "#007AC3",
              padding: "5px 10px",
              width: "100px",
              marginRight: "10px",
              fontWeight: "bold",
              color: "#fff",
            }}
            onClick={fetchProblemasRevision}
          >
            En Revisión
          </Button>
          <Button
            style={{
              backgroundColor: "#5cb85c",
              borderColor: "#007AC3",
              padding: "5px 10px",
              width: "120px",
              fontWeight: "bold",
              color: "#fff",
            }}
            onClick={fetchProblemasSolucionados}
          >
            Solucionados
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
            <thead style={{ backgroundColor: "#007AC3", color: "#fff", textAlign: "center" }}>
                <tr>
                <th>ID</th>
                <th>Descripción</th>
                <th>Fecha y Hora</th>
                <th>Usuario</th>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {currentBitacoras.map((bitacora) => (
                <tr key={bitacora.idBitacora}>
                    <td>{bitacora.idBitacora}</td>
                    <td>{bitacora.descripcion}</td>
                    <td>{new Date(bitacora.fechaHora).toLocaleString()}</td>
                    <td>{bitacora.usuario?.usuario || "Sin usuario"}</td>
                    <td>{bitacora.usuario?.persona?.nombre || "Sin nombre"}</td>
                    <td>{bitacora.estado}</td>
                    <td>
                    <FaPencilAlt
                        style={{
                        color: "#007AC3",
                        cursor: "pointer",
                        marginRight: "10px",
                        fontSize: "20px",
                        }}
                        title="Editar"
                        onClick={() => handleShowEditModal(bitacora)}
                    />
                    <FaTrash
                        style={{
                        color: "#e10f0f",
                        cursor: "pointer",
                        fontSize: "20px",
                        }}
                        title="Eliminar"
                        onClick={() => console.log("Eliminar")}
                    />
                    </td>
                </tr>
                ))}
            </tbody>
        </Table>

        {renderPagination()}

        {/* Modal para crear */}
        <Modal show={showCreateModal} onHide={handleCloseCreateModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Crear Nuevo Registro</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleCreateSubmit}>
              <Form.Group controlId="descripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  name="descripcion"
                  value={newBitacora.descripcion}
                  onChange={handleCreateChange}
                  required
                />
              </Form.Group>
              <Button
                type="submit"
                style={{
                  backgroundColor: "#007AC3",
                  borderColor: "#007AC3",
                  fontWeight: "bold",
                  width: "100%",
                }}
              >
                Crear
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Modal para editar */}
        <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Editar Registro</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEditSubmit}>
              <Form.Group controlId="descripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  name="descripcion"
                  value={editingBitacora?.descripcion || ""}
                  onChange={handleEditChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={editingBitacora?.estado || ""}
                  onChange={handleEditChange}
                  required
                >
                  <option value="problema detectado">Problema Detectado</option>
                  <option value="problema en revisión">Problema en Revisión</option>
                  <option value="problema solucionado">Problema Solucionado</option>
                </Form.Control>
              </Form.Group>
              <Button
                type="submit"
                style={{
                  backgroundColor: "#007AC3",
                  borderColor: "#007AC3",
                  fontWeight: "bold",
                  width: "100%",
                }}
              >
                Guardar Cambios
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default SoporteTecnico;

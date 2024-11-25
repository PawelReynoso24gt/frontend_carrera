import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl } from "react-bootstrap";

function Comisiones() {
  const [comisiones, setComisiones] = useState([]);
  const [filteredComisiones, setFilteredComisiones] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventos, setEventos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingComision, setEditingComision] = useState(null);
  const [newComision, setNewComision] = useState({
    comision: "",
    descripcion: "",
    estado: 1,
    idEvento: "",
    idDetalleHorario: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchComisiones();
    fetchEventos();
  }, []);

  const fetchComisiones = async () => {
    try {
      const response = await axios.get("http://localhost:5000/comisiones");
      setComisiones(response.data);
      setFilteredComisiones(response.data);
    } catch (error) {
      console.error("Error fetching comisiones:", error);
    }
  };

  const fetchEventos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/eventos");
      setEventos(response.data);
    } catch (error) {
      console.error("Error fetching eventos:", error);
    }
  };

  const fetchActiveComisiones = async () => {
    try {
      const response = await axios.get("http://localhost:5000/comisiones/activos");
      setFilteredComisiones(response.data);
    } catch (error) {
      console.error("Error fetching active comisiones:", error);
    }
  };

  const fetchInactiveComisiones = async () => {
    try {
      const response = await axios.get("http://localhost:5000/comisiones/inactivos");
      setFilteredComisiones(response.data);
    } catch (error) {
      console.error("Error fetching inactive comisiones:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = comisiones.filter((comision) =>
      comision.comision.toLowerCase().includes(value)
    );
    setFilteredComisiones(filtered);
  };

  const handleShowModal = (comision = null) => {
    setEditingComision(comision);
    setNewComision(
      comision || { comision: "", descripcion: "", estado: 1, idEvento: "", idDetalleHorario: "" }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingComision(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewComision({ ...newComision, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingComision) {
        await axios.put(
          `http://localhost:5000/comisiones/update/${editingComision.idComision}`,
          newComision
        );
        setAlertMessage("Comisión actualizada con éxito");
      } else {
        await axios.post("http://localhost:5000/comisiones/create", newComision);
        setAlertMessage("Comisión creada con éxito");
      }
      fetchComisiones();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting comision:", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/comisiones/update/${id}`, { estado: nuevoEstado });
      fetchComisiones();
      setAlertMessage(`Comisión ${nuevoEstado === 1 ? "activada" : "inactivada"} con éxito`);
      setShowAlert(true);
    } catch (error) {
      console.error("Error toggling estado:", error);
    }
  };

  return (
    <>
      <div className="row" style={{ textAlign: "center", marginBottom: "20px" }}>
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>Gestión de Comisiones</h3>
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
        {/* Barra de Búsqueda */}
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar comisión por nombre..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>

        <Button
          style={{
            backgroundColor: "#743D90",
            borderColor: "#007AC3",
            padding: "5px 10px",
            width: "130px",
            marginRight: "10px",
            fontWeight: "bold",
            color: "#fff",
          }}
          onClick={() => handleShowModal()}
        >
          Agregar Comisión
        </Button>
        <Button
          style={{
            backgroundColor: "#007AC3",
            borderColor: "#007AC3",
            padding: "5px 10px",
            width: "100px",
            marginRight: "10px",
            fontWeight: "bold",
            color: "#fff",
          }}
          onClick={fetchActiveComisiones}
        >
          Activas
        </Button>
        <Button
          style={{
            backgroundColor: "#009B85",
            borderColor: "#007AC3",
            padding: "5px 10px",
            width: "100px",
            fontWeight: "bold",
            color: "#fff",
          }}
          onClick={fetchInactiveComisiones}
        >
          Inactivas
        </Button>

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
              <th>Comisión</th>
              <th>Descripción</th>
              <th>Evento</th>
              <th>Detalle Horario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredComisiones.map((comision) => (
              <tr key={comision.idComision}>
                <td>{comision.idComision}</td>
                <td>{comision.comision}</td>
                <td>{comision.descripcion}</td>
                <td>{comision.evento?.nombreEvento || "No asignado"}</td>
                <td>{comision.idDetalleHorario || "No asignado"}</td>
                <td>{comision.estado === 1 ? "Activo" : "Inactivo"}</td>
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
                    onClick={() => handleShowModal(comision)}
                  >
                    Editar
                  </Button>
                  <Button
                    style={{
                      backgroundColor: comision.estado ? "#6c757d" : "#28a745",
                      borderColor: comision.estado ? "#6c757d" : "#28a745",
                      padding: "5px 10px",
                      width: "100px",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                    onClick={() => toggleEstado(comision.idComision, comision.estado)}
                  >
                    {comision.estado === 1 ? "Inactivar" : "Activar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header
            closeButton
            style={{ backgroundColor: "#007AC3", color: "#fff" }}
          >
            <Modal.Title>
              {editingComision ? "Editar Comisión" : "Agregar Comisión"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="comision">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Comisión
                </Form.Label>
                <Form.Control
                  type="text"
                  name="comision"
                  value={newComision.comision}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="descripcion">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Descripción
                </Form.Label>
                <Form.Control
                  type="text"
                  name="descripcion"
                  value={newComision.descripcion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idEvento">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Evento
                </Form.Label>
                <Form.Control
                  as="select"
                  name="idEvento"
                  value={newComision.idEvento}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar evento</option>
                  {eventos.map((evento) => (
                    <option key={evento.idEvento} value={evento.idEvento}>
                      {evento.nombreEvento}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="idDetalleHorario">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Detalle Horario
                </Form.Label>
                <Form.Control
                  type="text"
                  name="idDetalleHorario"
                  value={newComision.idDetalleHorario}
                  onChange={handleChange}
                  required
                />
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
                {editingComision ? "Actualizar" : "Crear"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Comisiones;

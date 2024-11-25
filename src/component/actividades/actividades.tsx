import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl } from "react-bootstrap";

function Actividades() {
  const [actividades, setActividades] = useState([]);
  const [filteredActividades, setFilteredActividades] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [comisiones, setComisiones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingActividad, setEditingActividad] = useState(null);
  const [newActividad, setNewActividad] = useState({
    actividad: "",
    descripcion: "",
    estado: 1,
    idComision: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchActividades();
    fetchComisiones();
  }, []);

  const fetchActividades = async () => {
    try {
      const response = await axios.get("http://localhost:5000/actividades");
      setActividades(response.data);
      setFilteredActividades(response.data);
    } catch (error) {
      console.error("Error fetching actividades:", error);
    }
  };

  const fetchComisiones = async () => {
    try {
      const response = await axios.get("http://localhost:5000/comisiones");
      setComisiones(response.data);
    } catch (error) {
      console.error("Error fetching comisiones:", error);
    }
  };

  const fetchActiveActividades = async () => {
    try {
      const response = await axios.get("http://localhost:5000/actividades/activos");
      setFilteredActividades(response.data);
    } catch (error) {
      console.error("Error fetching active actividades:", error);
    }
  };

  const fetchInactiveActividades = async () => {
    try {
      const response = await axios.get("http://localhost:5000/actividades/inactivos");
      setFilteredActividades(response.data);
    } catch (error) {
      console.error("Error fetching inactive actividades:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = actividades.filter((actividad) =>
      actividad.actividad.toLowerCase().includes(value)
    );
    setFilteredActividades(filtered);
  };

  const handleShowModal = (actividad = null) => {
    setEditingActividad(actividad);
    setNewActividad(
      actividad || { actividad: "", descripcion: "", estado: 1, idComision: "" }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingActividad(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewActividad({ ...newActividad, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingActividad) {
        await axios.put(
          `http://localhost:5000/actividades/update/${editingActividad.idActividad}`,
          newActividad
        );
        setAlertMessage("Actividad actualizada con éxito");
      } else {
        await axios.post("http://localhost:5000/actividades/create", newActividad);
        setAlertMessage("Actividad creada con éxito");
      }
      fetchActividades();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting actividad:", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/actividades/update/${id}`, { estado: nuevoEstado });
      fetchActividades();
      setAlertMessage(`Actividad ${nuevoEstado === 1 ? "activada" : "inactivada"} con éxito`);
      setShowAlert(true);
    } catch (error) {
      console.error("Error toggling estado:", error);
    }
  };

  return (
    <>
      <div className="row" style={{ textAlign: "center", marginBottom: "20px" }}>
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>Gestión de Actividades</h3>
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
            placeholder="Buscar actividad por nombre..."
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
          Agregar Actividad
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
          onClick={fetchActiveActividades}
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
          onClick={fetchInactiveActividades}
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
              <th>Actividad</th>
              <th>Descripción</th>
              <th>Comisión</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredActividades.map((actividad) => (
              <tr key={actividad.idActividad}>
                <td>{actividad.idActividad}</td>
                <td>{actividad.actividad}</td>
                <td>{actividad.descripcion}</td>
                <td>{actividad.comision?.comision || "No asignada"}</td>
                <td>{actividad.estado === 1 ? "Activo" : "Inactivo"}</td>
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
                    onClick={() => handleShowModal(actividad)}
                  >
                    Editar
                  </Button>
                  <Button
                    style={{
                      backgroundColor: actividad.estado ? "#6c757d" : "#28a745",
                      borderColor: actividad.estado ? "#6c757d" : "#28a745",
                      padding: "5px 10px",
                      width: "100px",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                    onClick={() => toggleEstado(actividad.idActividad, actividad.estado)}
                  >
                    {actividad.estado === 1 ? "Inactivar" : "Activar"}
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
              {editingActividad ? "Editar Actividad" : "Agregar Actividad"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="actividad">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Actividad
                </Form.Label>
                <Form.Control
                  type="text"
                  name="actividad"
                  value={newActividad.actividad}
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
                  value={newActividad.descripcion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idComision">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Comisión
                </Form.Label>
                <Form.Control
                  as="select"
                  name="idComision"
                  value={newActividad.idComision}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar comisión</option>
                  {comisiones.map((comision) => (
                    <option key={comision.idComision} value={comision.idComision}>
                      {comision.comision}
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
                {editingActividad ? "Actualizar" : "Crear"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Actividades;

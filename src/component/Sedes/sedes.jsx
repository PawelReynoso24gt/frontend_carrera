import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert } from "react-bootstrap";

function Sedes() {
  const [sedes, setSedes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSede, setEditingSede] = useState(null);
  const [newSede, setNewSede] = useState({
    nombreSede: "",
    informacion: "",
    estado: 1,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el buscador

  useEffect(() => {
    fetchSedes();
  }, []);

  const fetchSedes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/sedes");
      setSedes(response.data);
    } catch (error) {
      console.error("Error fetching sedes:", error);
    }
  };

  const fetchActiveSedes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/sedes/activas");
      setSedes(response.data);
    } catch (error) {
      console.error("Error fetching active sedes:", error);
    }
  };

  const fetchInactiveSedes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/sedes/inactivas");
      setSedes(response.data);
    } catch (error) {
      console.error("Error fetching inactive sedes:", error);
    }
  };

  const handleShowModal = (sede = null) => {
    setEditingSede(sede);
    setNewSede(sede || { nombreSede: "", informacion: "", estado: 1 });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSede(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSede({ ...newSede, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!regex.test(newSede.nombreSede)) {
      setAlertMessage("El nombre de la sede solo debe contener letras y espacios.");
      setShowAlert(true);
      return;
    }

    try {
      if (editingSede) {
        await axios.put(
          `http://localhost:5000/sedes/${editingSede.idSede}`,
          newSede
        );
        setAlertMessage("Sede actualizada con éxito");
      } else {
        await axios.post("http://localhost:5000/sedes", newSede);
        setAlertMessage("Sede creada con éxito");
      }
      fetchSedes();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting sede:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/sedes/${id}`, { estado: nuevoEstado });
      fetchSedes();
      setAlertMessage(`Sede ${nuevoEstado === 1 ? "activada" : "inactivada"} con éxito`);
      setShowAlert(true);
    } catch (error) {
      console.error("Error toggling estado:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredSedes = sedes.filter((sede) =>
    sede.nombreSede.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="row" style={{ textAlign: "center", marginBottom: "20px" }}>
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
            Gestión de Sedes
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
          Agregar Sede
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
          onClick={fetchActiveSedes}
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
          onClick={fetchInactiveSedes}
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

        {/* Buscador */}
        <Form.Group controlId="searchSede" className="mt-3">
          <Form.Control
            type="text"
            placeholder="Buscar sede por nombre..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Form.Group>

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
              <th>Sede</th>
              <th>Información</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSedes.map((sede) => (
              <tr key={sede.idSede}>
                <td>{sede.idSede}</td>
                <td>{sede.nombreSede}</td>
                <td>{sede.informacion}</td>
                <td>{sede.estado ? "Activo" : "Inactivo"}</td>
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
                    onClick={() => handleShowModal(sede)}
                  >
                    Editar
                  </Button>
                  <Button
                    style={{
                      backgroundColor: sede.estado ? "#6c757d" : "#28a745",
                      borderColor: sede.estado ? "#6c757d" : "#28a745",
                      padding: "5px 10px",
                      width: "100px",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                    onClick={() => toggleEstado(sede.idSede, sede.estado)}
                  >
                    {sede.estado ? "Desactivar" : "Activar"}
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
              {editingSede ? "Editar Sede" : "Agregar Sede"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nombreSede">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Nombre Sede
                </Form.Label>
                <Form.Control
                  type="text"
                  name="nombreSede"
                  value={newSede.nombreSede}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="informacion" className="mt-3">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Información
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="informacion"
                  value={newSede.informacion}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="estado" className="mt-3">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Estado
                </Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newSede.estado}
                  onChange={handleChange}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </Form.Control>
              </Form.Group>

              <div className="mt-4 text-center">
                <Button
                  type="submit"
                  style={{
                    backgroundColor: "#743D90",
                    borderColor: "#007AC3",
                    padding: "5px 10px",
                    width: "130px",
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  {editingSede ? "Actualizar" : "Crear"} Sede
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Sedes;

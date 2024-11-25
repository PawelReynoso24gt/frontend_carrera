import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert } from "react-bootstrap";

function Personas() {
  const [personas, setPersonas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPersona, setEditingPersona] = useState(null);
  const [newPersona, setNewPersona] = useState({
    nombre: "",
    fechaNacimiento: "",
    telefono: "",
    domicilio: "",
    CUI: "",
    correo: "",
    idMunicipio: "",
    estado: 1,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/personas");
      setPersonas(response.data);
    } catch (error) {
      console.error("Error fetching personas:", error);
    }
  };

  const fetchActivePersonas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/personas/activos");
      setPersonas(response.data);
    } catch (error) {
      console.error("Error fetching active personas:", error);
    }
  };

  const fetchInactivePersonas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/personas/inactivos");
      setPersonas(response.data);
    } catch (error) {
      console.error("Error fetching inactive personas:", error);
    }
  };

  const handleShowModal = (persona = null) => {
    setEditingPersona(persona);
    setNewPersona(
      persona || {
        nombre: "",
        fechaNacimiento: "",
        telefono: "",
        domicilio: "",
        CUI: "",
        correo: "",
        idMunicipio: "",
        estado: 1,
      }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPersona(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPersona({ ...newPersona, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPersona) {
        await axios.put(
          `http://localhost:5000/personas/update/${editingPersona.idPersona}`,
          newPersona
        );
        setAlertMessage("Persona actualizada con éxito");
      } else {
        await axios.post("http://localhost:5000/personas/create", newPersona);
        setAlertMessage("Persona creada con éxito");
      }
      fetchPersonas();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting persona:", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/personas/update/${id}`, {
        estado: nuevoEstado,
      });
      fetchPersonas();
      setAlertMessage(
        `Persona ${nuevoEstado === 1 ? "activada" : "inactivada"} con éxito`
      );
      setShowAlert(true);
    } catch (error) {
      console.error("Error toggling estado:", error);
    }
  };

  return (
    <>
      <div className="row" style={{ textAlign: "center", marginBottom: "20px" }}>
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
            Gestión de Personas
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
          Agregar Persona
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
          onClick={fetchActivePersonas}
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
          onClick={fetchInactivePersonas}
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
              <th>Nombre</th>
              <th>Fecha de Nacimiento</th>
              <th>Teléfono</th>
              <th>Domicilio</th>
              <th>CUI</th>
              <th>Correo</th>
              <th>Municipio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {personas.map((persona) => (
              <tr key={persona.idPersona}>
                <td>{persona.idPersona}</td>
                <td>{persona.nombre}</td>
                <td>{new Date(persona.fechaNacimiento).toLocaleDateString()}</td>
                <td>{persona.telefono}</td>
                <td>{persona.domicilio}</td>
                <td>{persona.CUI}</td>
                <td>{persona.correo}</td>
                <td>
                  {persona.municipio
                    ? persona.municipio.municipio
                    : "Sin municipio"}
                </td>
                <td>{persona.estado ? "Activo" : "Inactivo"}</td>
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
                    onClick={() => handleShowModal(persona)}
                  >
                    Editar
                  </Button>
                  <Button
                    style={{
                      backgroundColor: persona.estado
                        ? "#6c757d"
                        : "#28a745",
                      borderColor: persona.estado ? "#6c757d" : "#28a745",
                      padding: "5px 10px",
                      width: "100px",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                    onClick={() =>
                      toggleEstado(persona.idPersona, persona.estado)
                    }
                  >
                    {persona.estado ? "Inactivar" : "Activar"}
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
              {editingPersona ? "Editar Persona" : "Agregar Persona"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nombre">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Nombre
                </Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={newPersona.nombre}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="fechaNacimiento">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Fecha de Nacimiento
                </Form.Label>
                <Form.Control
                  type="date"
                  name="fechaNacimiento"
                  value={newPersona.fechaNacimiento}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="telefono">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Teléfono
                </Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  value={newPersona.telefono}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="domicilio">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Domicilio
                </Form.Label>
                <Form.Control
                  type="text"
                  name="domicilio"
                  value={newPersona.domicilio}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="CUI">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  CUI
                </Form.Label>
                <Form.Control
                  type="text"
                  name="CUI"
                  value={newPersona.CUI}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="correo">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Correo
                </Form.Label>
                <Form.Control
                  type="email"
                  name="correo"
                  value={newPersona.correo}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idMunicipio">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Municipio
                </Form.Label>
                <Form.Control
                  type="number"
                  name="idMunicipio"
                  value={newPersona.idMunicipio}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Estado
                </Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newPersona.estado}
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
                {editingPersona ? "Actualizar" : "Crear"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Personas;

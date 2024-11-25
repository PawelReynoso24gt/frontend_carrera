import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert } from "react-bootstrap";

function CategoriasHorarios() {
  const [categoriasHorarios, setCategoriasHorarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategoriaHorario, setEditingCategoriaHorario] = useState(null);
  const [newCategoriaHorario, setNewCategoriaHorario] = useState({ categoria: "", estado: 1 });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchCategoriasHorarios();
  }, []);

  const fetchCategoriasHorarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/categoriaHorarios");
      setCategoriasHorarios(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching categorías de horarios:", error);
    }
  };

  const fetchActiveCategoriasHorarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/categoriaHorarios/activas");
      setCategoriasHorarios(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching active categorías de horarios:", error);
    }
  };

  const fetchInactiveCategoriasHorarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/categoriaHorarios/inactivas");
      setCategoriasHorarios(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching inactive categorías de horarios:", error);
    }
  };

  const handleShowModal = (categoriaHorario = null) => {
    setEditingCategoriaHorario(categoriaHorario);
    setNewCategoriaHorario(categoriaHorario || { categoria: "", estado: 1 });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategoriaHorario(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategoriaHorario({ ...newCategoriaHorario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!regex.test(newCategoriaHorario.categoria)) {
      setAlertMessage("La categoría solo debe contener letras y espacios.");
      setShowAlert(true);
      return;
    }

    try {
      if (editingCategoriaHorario) {
        await axios.put(`http://localhost:5000/categoriaHorarios/${editingCategoriaHorario.idCategoriaHorario}`, newCategoriaHorario);
        setAlertMessage("Categoría de horario actualizada con éxito");
      } else {
        await axios.post("http://localhost:5000/categoriaHorarios", newCategoriaHorario);
        setAlertMessage("Categoría de horario creada con éxito");
      }
      fetchCategoriasHorarios();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting categoría de horario:", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/categoriaHorarios/${id}`, { estado: nuevoEstado });
      fetchCategoriasHorarios();
      setAlertMessage(`Categoría de horario ${nuevoEstado === 1 ? "activada" : "inactivada"} con éxito`);
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
            Gestión de Categorías de Horarios
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
          Agregar Categoría
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
          onClick={fetchActiveCategoriasHorarios}
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
          onClick={fetchInactiveCategoriasHorarios}
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
              <th>Categoría</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categoriasHorarios.map((categoria) => (
              <tr key={categoria.idCategoriaHorario}>
                <td>{categoria.idCategoriaHorario}</td>
                <td>{categoria.categoria}</td>
                <td>{categoria.estado ? "Activo" : "Inactivo"}</td>
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
                    onClick={() => handleShowModal(categoria)}
                  >
                    Editar
                  </Button>
                  <Button
                    style={{
                      backgroundColor: categoria.estado ? "#6c757d" : "#28a745",
                      borderColor: categoria.estado ? "#6c757d" : "#28a745",
                      padding: "5px 10px",
                      width: "100px",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                    onClick={() => toggleEstado(categoria.idCategoriaHorario, categoria.estado)}
                  >
                    {categoria.estado ? "Inactivar" : "Activar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton style={{ backgroundColor: "#007AC3", color: "#fff" }}>
            <Modal.Title>{editingCategoriaHorario ? "Editar Categoría de Horario" : "Agregar Categoría de Horario"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="categoria">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Categoría
                </Form.Label>
                <Form.Control
                  type="text"
                  name="categoria"
                  value={newCategoriaHorario.categoria}
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
                  value={newCategoriaHorario.estado}
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
                  marginTop: "10px",
                  fontWeight: "bold",
                  color: "#fff",
                }}
                type="submit"
              >
                {editingCategoriaHorario ? "Actualizar" : "Guardar"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default CategoriasHorarios;

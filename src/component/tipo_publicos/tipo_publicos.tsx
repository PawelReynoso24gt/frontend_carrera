import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert } from 'react-bootstrap';

function TipoPublicos() {
  const [tipoPublicos, setTipoPublicos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTipoPublico, setEditingTipoPublico] = useState(null);
  const [newTipoPublico, setNewTipoPublico] = useState({ nombreTipo: '', estado: 1 });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchTipoPublicos();
  }, []);

  const fetchTipoPublicos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tipo_publicos');
      setTipoPublicos(response.data);
    } catch (error) {
      console.error('Error fetching tipo_publicos:', error);
    }
  };

  const fetchActiveTipoPublicos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tipo_publicos/activos');
      setTipoPublicos(response.data);
    } catch (error) {
      console.error('Error fetching active tipo_publicos:', error);
    }
  };

  const fetchInactiveTipoPublicos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tipo_publicos/inactivos');
      setTipoPublicos(response.data);
    } catch (error) {
      console.error('Error fetching inactive tipo_publicos:', error);
    }
  };

  const handleShowModal = (tipoPublico = null) => {
    setEditingTipoPublico(tipoPublico);
    setNewTipoPublico(tipoPublico || { nombreTipo: '', estado: 1 });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTipoPublico(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTipoPublico({ ...newTipoPublico, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTipoPublico) {
        await axios.put(`http://localhost:5000/tipo_publicos/update/${editingTipoPublico.idTipoPublico}`, newTipoPublico);
        setAlertMessage('Tipo de público actualizado con éxito');
      } else {
        await axios.post('http://localhost:5000/tipo_publicos/create', newTipoPublico);
        setAlertMessage('Tipo de público creado con éxito');
      }
      fetchTipoPublicos();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting tipo_publico:', error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/tipo_publicos/update/${id}`, { estado: nuevoEstado });
      fetchTipoPublicos();
      setAlertMessage(`Tipo de público ${nuevoEstado === 1 ? 'activado' : 'inactivado'} con éxito`);
      setShowAlert(true);
    } catch (error) {
      console.error('Error toggling estado:', error);
    }
  };

  return (
    <>
      <div className="row" style={{ textAlign: "center", marginBottom: "20px" }}>
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
            Gestión de Tipos de Públicos
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
          Agregar Tipo de Público
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
          onClick={fetchActiveTipoPublicos}
        >
          Activos
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
          onClick={fetchInactiveTipoPublicos}
        >
          Inactivos
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
              <th>Nombre Tipo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tipoPublicos.map((tipoPublico) => (
              <tr key={tipoPublico.idTipoPublico}>
                <td>{tipoPublico.idTipoPublico}</td>
                <td>{tipoPublico.nombreTipo}</td>
                <td>{tipoPublico.estado ? "Activo" : "Inactivo"}</td>
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
                    onClick={() => handleShowModal(tipoPublico)}
                  >
                    Editar
                  </Button>
                  <Button
                    style={{
                      backgroundColor: tipoPublico.estado ? "#6c757d" : "#28a745",
                      borderColor: tipoPublico.estado ? "#6c757d" : "#28a745",
                      padding: "5px 10px",
                      width: "100px",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                    onClick={() =>
                      toggleEstado(tipoPublico.idTipoPublico, tipoPublico.estado)
                    }
                  >
                    {tipoPublico.estado ? "Inactivar" : "Activar"}
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
              {editingTipoPublico
                ? "Editar Tipo de Público"
                : "Agregar Tipo de Público"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nombreTipo">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Nombre del Tipo de Público
                </Form.Label>
                <Form.Control
                  type="text"
                  name="nombreTipo"
                  value={newTipoPublico.nombreTipo}
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
      </div>
    </>
  );
}

export default TipoPublicos;

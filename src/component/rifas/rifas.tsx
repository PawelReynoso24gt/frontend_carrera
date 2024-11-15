import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert } from 'react-bootstrap';

function Rifas() {
  const [rifas, setRifas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRifa, setEditingRifa] = useState(null);
  const [newRifa, setNewRifa] = useState({ nombreRifa: '', descripcion: '', idSede: '', estado: 1 });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchRifas();
  }, []);

  const fetchRifas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/rifas');
      setRifas(response.data);
    } catch (error) {
      console.error('Error fetching rifas:', error);
    }
  };

  const fetchActiveRifas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/rifas/activos');
      setRifas(response.data);
    } catch (error) {
      console.error('Error fetching active rifas:', error);
    }
  };

  const fetchInactiveRifas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/rifas/inactivos');
      setRifas(response.data);
    } catch (error) {
      console.error('Error fetching inactive rifas:', error);
    }
  };

  const handleShowModal = (rifa = null) => {
    setEditingRifa(rifa);
    setNewRifa(rifa || { nombreRifa: '', descripcion: '', idSede: '', estado: 1 });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRifa(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRifa({ ...newRifa, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRifa) {
        await axios.put(`http://localhost:5000/rifas/${editingRifa.idRifa}`, newRifa);
        setAlertMessage('Rifa actualizada con éxito');
      } else {
        await axios.post('http://localhost:5000/rifas', newRifa);
        setAlertMessage('Rifa creada con éxito');
      }
      fetchRifas();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting rifa:', error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/rifas/${id}`, { estado: nuevoEstado });
      fetchRifas();
      setAlertMessage(`Rifa ${nuevoEstado === 1 ? 'activada' : 'inactivada'} con éxito`);
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
            Gestión de Rifas
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
          Agregar Rifa
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
          onClick={fetchActiveRifas}
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
          onClick={fetchInactiveRifas}
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
              <th>Nombre Rifa</th>
              <th>Descripción</th>
              <th>Sede</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rifas.map((rifa) => (
              <tr key={rifa.idRifa}>
                <td>{rifa.idRifa}</td>
                <td>{rifa.nombreRifa}</td>
                <td>{rifa.descripcion}</td>
                <td>{rifa.sede ? rifa.sede.nombreSede : 'Sin sede'}</td>
                <td>{rifa.estado ? 'Activo' : 'Inactivo'}</td>
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
                    onClick={() => handleShowModal(rifa)}
                  >
                    Editar
                  </Button>
                  <Button
                    style={{
                      backgroundColor: rifa.estado ? "#6c757d" : "#28a745",
                      borderColor: rifa.estado ? "#6c757d" : "#28a745",
                      padding: "5px 10px",
                      width: "100px",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                    onClick={() => toggleEstado(rifa.idRifa, rifa.estado)}
                  >
                    {rifa.estado ? "Inactivar" : "Activar"}
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
              {editingRifa ? "Editar Rifa" : "Agregar Rifa"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nombreRifa">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Nombre de la Rifa
                </Form.Label>
                <Form.Control
                  type="text"
                  name="nombreRifa"
                  value={newRifa.nombreRifa}
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
                  value={newRifa.descripcion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idSede">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Sede
                </Form.Label>
                <Form.Control
                  type="number"
                  name="idSede"
                  value={newRifa.idSede}
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
                  value={newRifa.estado}
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
                {editingRifa ? "Actualizar" : "Crear"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Rifas;

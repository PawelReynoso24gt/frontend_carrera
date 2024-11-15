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
        // Actualizar rifa
        await axios.put(`http://localhost:5000/rifas/${editingRifa.idRifa}`, newRifa);
        setAlertMessage('Rifa actualizada con éxito');
      } else {
        // Crear nueva rifa
        await axios.post('http://localhost:5000/rifas', newRifa);
        setAlertMessage('Rifa creada con éxito');
      }
      fetchRifas();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting rifa:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
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
      <div className="row">
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <div className="crancy-section-title mg-btm-10">
            <h3 className="crancy-section__title">CRUD Rifas</h3>
          </div>
        </div>
      </div>

      {/* Botones para Filtrar Rifas */}
      <div className="container mt-4">
        <Button variant="primary" onClick={() => handleShowModal()}>Agregar Rifa</Button>
        <Button variant="success" className="ml-2" onClick={fetchActiveRifas}>Activas</Button>
        <Button variant="danger" className="ml-2" onClick={fetchInactiveRifas}>Inactivas</Button>

        <Alert variant="success" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>

        <Table striped bordered hover className="mt-3">
          <thead>
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
                  <Button variant="warning" onClick={() => handleShowModal(rifa)}>Editar</Button>
                  <Button
                    variant={rifa.estado ? "secondary" : "success"}
                    onClick={() => toggleEstado(rifa.idRifa, rifa.estado)}
                  >
                    {rifa.estado ? "Inactivar" : "Activar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal para crear y editar rifas */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editingRifa ? 'Editar Rifa' : 'Agregar Rifa'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nombreRifa">
                <Form.Label>Nombre de la Rifa</Form.Label>
                <Form.Control
                  type="text"
                  name="nombreRifa"
                  value={newRifa.nombreRifa}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="descripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  name="descripcion"
                  value={newRifa.descripcion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idSede">
                <Form.Label>Sede</Form.Label>
                <Form.Control
                  type="number"
                  name="idSede"
                  value={newRifa.idSede}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
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
              <Button variant="primary" type="submit">
                {editingRifa ? 'Actualizar' : 'Crear'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Rifas;

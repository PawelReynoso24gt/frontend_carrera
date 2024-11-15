import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert } from 'react-bootstrap';

function Traslados() {
  const [traslados, setTraslados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTraslado, setEditingTraslado] = useState(null);
  const [newTraslado, setNewTraslado] = useState({ fecha: '', descripcion: '', estado: 1, idTipoTraslado: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [tipoTraslados, setTipoTraslados] = useState([]);

  useEffect(() => {
    fetchTraslados();
    fetchTipoTraslados();
  }, []);

  const fetchTraslados = async () => {
    try {
      const response = await axios.get('http://localhost:5000/traslados');
      setTraslados(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching traslados:', error);
    }
  };

  const fetchActiveTraslados = async () => {
    try {
      const response = await axios.get('http://localhost:5000/traslados/activas');
      setTraslados(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching active traslados:', error);
    }
  };

  const fetchInactiveTraslados = async () => {
    try {
      const response = await axios.get('http://localhost:5000/traslados/inactivas');
      setTraslados(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching inactive traslados:', error);
    }
  };

  const fetchTipoTraslados = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tipoTraslados');
      setTipoTraslados(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching tipo traslados:', error);
    }
  };

  const handleShowModal = (traslado = null) => {
    setEditingTraslado(traslado);
    setNewTraslado(traslado || { fecha: '', descripcion: '', estado: 1, idTipoTraslado: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTraslado(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTraslado({ ...newTraslado, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const regexDescripcion = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,-]+$/;
    if (!regexDescripcion.test(newTraslado.descripcion)) {
      setAlertMessage('La descripción solo debe contener letras, números, espacios y los signos permitidos (.,-).');
      setShowAlert(true);
      return;
    }

    try {
      if (editingTraslado) {
        await axios.put(`http://localhost:5000/traslados/${editingTraslado.idTraslado}`, newTraslado);
        setAlertMessage('Traslado actualizado con éxito');
      } else {
        await axios.post('http://localhost:5000/traslados', newTraslado);
        setAlertMessage('Traslado creado con éxito');
      }
      fetchTraslados();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting traslado:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/traslados/${id}`, { estado: nuevoEstado });
      fetchTraslados();
      setAlertMessage(`Traslado ${nuevoEstado === 1 ? 'activado' : 'inactivado'} con éxito`);
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
            <h3 className="crancy-section__title">CRUD Traslados</h3>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <Button variant="primary" onClick={() => handleShowModal()}>Agregar Traslado</Button>
        <Button variant="success" className="ml-2" onClick={fetchActiveTraslados}>Activos</Button>
        <Button variant="danger" className="ml-2" onClick={fetchInactiveTraslados}>Inactivos</Button>

        <Alert variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Tipo de Traslado</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {traslados.map((traslado) => (
              <tr key={traslado.idTraslado}>
                <td>{traslado.idTraslado}</td>
                <td>{traslado.fecha}</td>
                <td>{traslado.descripcion}</td>
                <td>{traslado.tipoTraslado?.tipo || 'Sin asignar'}</td>
                <td>{traslado.estado ? 'Activo' : 'Inactivo'}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShowModal(traslado)}>Editar</Button>
                  <Button
                    variant={traslado.estado ? "secondary" : "success"}
                    onClick={() => toggleEstado(traslado.idTraslado, traslado.estado)}
                  >
                    {traslado.estado ? "Inactivar" : "Activar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editingTraslado ? 'Editar Traslado' : 'Agregar Traslado'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="fecha">
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha"
                  value={newTraslado.fecha}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="descripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  name="descripcion"
                  value={newTraslado.descripcion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idTipoTraslado">
                <Form.Label>Tipo de Traslado</Form.Label>
                <Form.Control
                  as="select"
                  name="idTipoTraslado"
                  value={newTraslado.idTipoTraslado}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar Tipo de Traslado</option>
                  {tipoTraslados.map((tipo) => (
                    <option key={tipo.idTipoTraslado} value={tipo.idTipoTraslado}>{tipo.tipo}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newTraslado.estado}
                  onChange={handleChange}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit">
                {editingTraslado ? 'Actualizar' : 'Crear'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Traslados;

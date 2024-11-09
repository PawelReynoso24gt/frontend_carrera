import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert } from 'react-bootstrap';

function DetalleHorariosComponent() {
  const [detalles, setDetalles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDetalle, setEditingDetalle] = useState(null);
  const [newDetalle, setNewDetalle] = useState({ cantidadPersonas: '', idHorario: '', idCategoriaHorario: '', estado: 1 });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [filter, setFilter] = useState('activos');

  useEffect(() => {
    fetchActiveDetalles();
  }, []);

  const fetchDetalles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/detalle_horarios');
      setDetalles(response.data);
    } catch (error) {
      console.error('Error fetching detalles:', error);
    }
  };

  const fetchActiveDetalles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/detalle_horarios/activos');
      setDetalles(response.data.filter(detalle => detalle.estado === 1));
      setFilter('activos');
    } catch (error) {
      console.error('Error fetching active detalles:', error);
    }
  };

  const fetchInactiveDetalles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/detalle_horarios', {
        params: { estado: 0 }
      });
      setDetalles(response.data.filter(detalle => detalle.estado === 0));
      setFilter('inactivos');
    } catch (error) {
      console.error('Error fetching inactive detalles:', error);
    }
  };

  const handleShowModal = (detalle = null) => {
    setEditingDetalle(detalle);
    setNewDetalle(detalle || { cantidadPersonas: '', idHorario: '', idCategoriaHorario: '', estado: 1 });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDetalle(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDetalle({ ...newDetalle, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDetalle) {
        // Actualizar detalle de horario
        await axios.put(`http://localhost:5000/detalle_horarios/${editingDetalle.idDetalleHorario}`, newDetalle);
        setAlertMessage('Detalle de horario actualizado con éxito');
      } else {
        // Crear nuevo detalle de horario
        await axios.post('http://localhost:5000/detalle_horarios', newDetalle);
        setAlertMessage('Detalle de horario creado con éxito');
      }
      filter === 'activos' ? fetchActiveDetalles() : fetchInactiveDetalles();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting detalle de horario:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);  // Muestra detalles del error desde el backend
      }
    }
  };

  const toggleDetalleEstado = async (id, currentEstado) => {
    try {
      const newEstado = currentEstado === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/detalle_horarios/${id}`, { estado: newEstado });
      setAlertMessage(`Detalle de horario ${newEstado === 1 ? 'activado' : 'desactivado'} con éxito`);
      setShowAlert(true);
      filter === 'activos' ? fetchActiveDetalles() : fetchInactiveDetalles();
    } catch (error) {
      console.error('Error toggling estado of detalle de horario:', error);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <div className="crancy-section-title mg-btm-10">
            <h3 className="crancy-section__title">DETALLE HORARIOS</h3>
            <p className="crancy-section__text">
              Aquí puedes gestionar los detalles de los horarios.
            </p>
          </div>
        </div>
      </div>

      {/* Botones para Filtrar Detalles de Horarios */}
      <div className="container mt-4">
        <Button variant="primary" onClick={() => handleShowModal()}>Agregar Detalle de Horario</Button>
        <Button variant="success" className="ml-2" onClick={fetchActiveDetalles}>Activos</Button>
        <Button variant="secondary" className="ml-2" onClick={fetchInactiveDetalles}>Inactivos</Button>

        <Alert variant="success" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cantidad de Personas</th>
              <th>ID Horario</th>
              <th>ID Categoría Horario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {detalles.filter(detalle => filter === 'activos' ? detalle.estado === 1 : detalle.estado === 0).map((detalle) => (
              <tr key={detalle.idDetalleHorario}>
                <td>{detalle.idDetalleHorario}</td>
                <td>{detalle.cantidadPersonas}</td>
                <td>{detalle.idHorario}</td>
                <td>{detalle.idCategoriaHorario}</td>
                <td>{detalle.estado ? 'Activo' : 'Inactivo'}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShowModal(detalle)}>Editar</Button>
                  <Button
                    variant={detalle.estado ? "danger" : "success"}
                    className="ml-2"
                    onClick={() => toggleDetalleEstado(detalle.idDetalleHorario, detalle.estado)}
                  >
                    {detalle.estado ? "Desactivar" : "Activar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal para crear y editar detalles de horarios */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editingDetalle ? 'Editar Detalle de Horario' : 'Agregar Detalle de Horario'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="cantidadPersonas">
                <Form.Label>Cantidad de Personas</Form.Label>
                <Form.Control
                  type="number"
                  name="cantidadPersonas"
                  value={newDetalle.cantidadPersonas}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idHorario">
                <Form.Label>ID Horario</Form.Label>
                <Form.Control
                  type="number"
                  name="idHorario"
                  value={newDetalle.idHorario}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idCategoriaHorario">
                <Form.Label>ID Categoría Horario</Form.Label>
                <Form.Control
                  type="number"
                  name="idCategoriaHorario"
                  value={newDetalle.idCategoriaHorario}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newDetalle.estado}
                  onChange={handleChange}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit">
                {editingDetalle ? 'Actualizar' : 'Crear'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default DetalleHorariosComponent;
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert } from 'react-bootstrap';

function HorariosComponent() {
  const [horarios, setHorarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingHorario, setEditingHorario] = useState(null);
  const [newHorario, setNewHorario] = useState({ horarioInicio: '', horarioFinal: '', estado: 1 });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [filter, setFilter] = useState('activos');

  useEffect(() => {
    fetchActiveHorarios();
  }, []);

  const fetchHorarios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/horarios');
      setHorarios(response.data);
    } catch (error) {
      console.error('Error fetching horarios:', error);
    }
  };

  const fetchActiveHorarios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/horarios/activos');
      setHorarios(response.data.filter(horario => horario.estado === 1));
      setFilter('activos');
    } catch (error) {
      console.error('Error fetching active horarios:', error);
    }
  };

  const fetchInactiveHorarios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/horarios', {
        params: { estado: 0 }
      });
      setHorarios(response.data.filter(horario => horario.estado === 0));
      setFilter('inactivos');
    } catch (error) {
      console.error('Error fetching inactive horarios:', error);
    }
  };

  const handleShowModal = (horario = null) => {
    setEditingHorario(horario);
    setNewHorario(horario || { horarioInicio: '', horarioFinal: '', estado: 1 });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingHorario(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewHorario({ ...newHorario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHorario) {
        // Actualizar horario
        await axios.put(`http://localhost:5000/horarios/${editingHorario.idHorario}`, newHorario);
        setAlertMessage('Horario actualizado con éxito');
      } else {
        // Crear nuevo horario
        await axios.post('http://localhost:5000/horarios', newHorario);
        setAlertMessage('Horario creado con éxito');
      }
      filter === 'activos' ? fetchActiveHorarios() : fetchInactiveHorarios();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting horario:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);  // Muestra detalles del error desde el backend
      }
    }
  };

  const toggleHorarioEstado = async (id, currentEstado) => {
    try {
      const newEstado = currentEstado === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/horarios/${id}`, { estado: newEstado });
      setAlertMessage(`Horario ${newEstado === 1 ? 'activado' : 'desactivado'} con éxito`);
      setShowAlert(true);
      filter === 'activos' ? fetchActiveHorarios() : fetchInactiveHorarios();
    } catch (error) {
      console.error('Error toggling estado of horario:', error);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <div className="crancy-section-title mg-btm-10">
            <h3 className="crancy-section__title">HORARIOS</h3>
            <p className="crancy-section__text">
              Aquí puedes gestionar los horarios disponibles.
            </p>
          </div>
        </div>
      </div>

      {/* Botones para Filtrar Horarios */}
      <div className="container mt-4">
        <Button variant="primary" onClick={() => handleShowModal()}>Agregar Horario</Button>
        <Button variant="success" className="ml-2" onClick={fetchActiveHorarios}>Activos</Button>
        <Button variant="secondary" className="ml-2" onClick={fetchInactiveHorarios}>Inactivos</Button>

        <Alert variant="success" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Horario Inicio</th>
              <th>Horario Final</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {horarios.filter(horario => filter === 'activos' ? horario.estado === 1 : horario.estado === 0).map((horario) => (
              <tr key={horario.idHorario}>
                <td>{horario.idHorario}</td>
                <td>{horario.horarioInicio}</td>
                <td>{horario.horarioFinal}</td>
                <td>{horario.estado ? 'Activo' : 'Inactivo'}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShowModal(horario)}>Editar</Button>
                  <Button
                    variant={horario.estado ? "danger" : "success"}
                    className="ml-2"
                    onClick={() => toggleHorarioEstado(horario.idHorario, horario.estado)}
                  >
                    {horario.estado ? "Desactivar" : "Activar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal para crear y editar horarios */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editingHorario ? 'Editar Horario' : 'Agregar Horario'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="horarioInicio">
                <Form.Label>Horario Inicio</Form.Label>
                <Form.Control
                  type="text"
                  name="horarioInicio"
                  value={newHorario.horarioInicio}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="horarioFinal">
                <Form.Label>Horario Final</Form.Label>
                <Form.Control
                  type="text"
                  name="horarioFinal"
                  value={newHorario.horarioFinal}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newHorario.estado}
                  onChange={handleChange}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit">
                {editingHorario ? 'Actualizar' : 'Crear'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default HorariosComponent;
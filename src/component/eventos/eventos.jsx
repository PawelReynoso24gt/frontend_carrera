import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert } from 'react-bootstrap';

function Eventos() {
  const [eventos, setEventos] = useState([]); 
  const [showModal, setShowModal] = useState(false);
  const [editingEvento, setEditingEvento] = useState(null);
  const [newEvento, setNewEvento] = useState({ nombreEvento: '', fechaHoraInicio: '', fechaHoraFin: '', descripcion: '', direccion: '', estado: 1, idSede: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [sedes, setSedes] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEventos();
    fetchSedes();
  }, []);

  const fetchEventos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/eventos');
      setEventos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching eventos:', error);
    }
  };

  const fetchActiveEventos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/eventos/activas');
      setEventos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching active eventos:', error);
    }
  };

  const fetchInactiveEventos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/eventos/inactivas');
      setEventos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching inactive eventos:', error);
    }
  };

  const fetchSedes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/sedes');
      setSedes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching sedes:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEventos = eventos.filter((evento) =>
    evento.nombreEvento.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleShowModal = (evento = null) => {
    setEditingEvento(evento);
    setNewEvento(evento || { nombreEvento: '', fechaHoraInicio: '', fechaHoraFin: '', descripcion: '', direccion: '', estado: 1, idSede: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEvento(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvento({ ...newEvento, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentDateTime = new Date().toISOString().slice(0, 16);
    if (newEvento.fechaHoraInicio < currentDateTime || newEvento.fechaHoraFin < currentDateTime) {
      setAlertMessage("La fecha de inicio y fin no pueden ser en el pasado.");
      setShowAlert(true);
      return;
    }

    if (newEvento.fechaHoraFin < newEvento.fechaHoraInicio) {
      setAlertMessage("La fecha de fin no puede ser anterior a la fecha de inicio.");
      setShowAlert(true);
      return;
    }

    const regexNombreEvento = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const regexDescripcion = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,-]+$/;
    const regexDireccion = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,#/-]+$/;

    if (!regexNombreEvento.test(newEvento.nombreEvento)) {
      setAlertMessage('El nombre del evento solo debe contener letras y espacios.');
      setShowAlert(true);
      return;
    }

    if (newEvento.descripcion && !regexDescripcion.test(newEvento.descripcion)) {
      setAlertMessage('La descripción solo puede contener letras, números, espacios y los signos .,-');
      setShowAlert(true);
      return;
    }

    if (!regexDireccion.test(newEvento.direccion)) {
      setAlertMessage('La dirección solo puede contener letras, números, espacios y los signos ., #/-');
      setShowAlert(true);
      return;
    }

    try {
      if (editingEvento) {
        await axios.put(`http://localhost:5000/eventos/${editingEvento.idEvento}`, newEvento);
        setAlertMessage('Evento actualizado con éxito');
      } else {
        await axios.post('http://localhost:5000/eventos', newEvento);
        setAlertMessage('Evento creado con éxito');
      }
      fetchEventos();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting evento:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/eventos/${id}`, { estado: nuevoEstado });
      fetchEventos();
      setAlertMessage(`Evento ${nuevoEstado === 1 ? 'activado' : 'inactivado'} con éxito`);
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
            <h3 className="crancy-section__title">CRUD Eventos</h3>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <Button variant="primary" onClick={() => handleShowModal()}>Agregar Evento</Button>
        <Button variant="success" className="ml-2" onClick={fetchActiveEventos}>Activos</Button>
        <Button variant="danger" className="ml-2" onClick={fetchInactiveEventos}>Inactivos</Button>

        <Alert variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>

         {/* Buscador */}
         <Form.Group controlId="searchSede" className="mt-3">
          <Form.Control
            type="text"
            placeholder="Buscar evento por nombre..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Form.Group>

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Evento</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Descripción</th>
              <th>Dirección</th>
              <th>Estado</th>
              <th>Sede</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEventos.map((evento) => (
              <tr key={evento.idEvento}>
                <td>{evento.idEvento}</td>
                <td>{evento.nombreEvento}</td>
                <td>{evento.fechaHoraInicio}</td>
                <td>{evento.fechaHoraFin}</td>
                <td>{evento.descripcion}</td>
                <td>{evento.direccion}</td>
                <td>{evento.estado ? 'Activo' : 'Inactivo'}</td>
                <td>{evento.idSede}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShowModal(evento)}>Editar</Button>
                  <Button
                    variant={evento.estado ? "secondary" : "success"}
                    onClick={() => toggleEstado(evento.idEvento, evento.estado)}
                  >
                    {evento.estado ? "Inactivar" : "Activar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editingEvento ? 'Editar Evento' : 'Agregar Evento'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nombreEvento">
                <Form.Label>Nombre del Evento</Form.Label>
                <Form.Control
                  type="text"
                  name="nombreEvento"
                  value={newEvento.nombreEvento}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="fechaHoraInicio">
                <Form.Label>Fecha y Hora de Inicio</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="fechaHoraInicio"
                  value={newEvento.fechaHoraInicio}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="fechaHoraFin">
                <Form.Label>Fecha y Hora de Fin</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="fechaHoraFin"
                  value={newEvento.fechaHoraFin}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="descripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  name="descripcion"
                  value={newEvento.descripcion}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="direccion">
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  type="text"
                  name="direccion"
                  value={newEvento.direccion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idSede">
                <Form.Label>Sede</Form.Label>
                <Form.Control
                  as="select"
                  name="idSede"
                  value={newEvento.idSede}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar Sede</option>
                  {sedes.map((sede) => (
                    <option key={sede.idSede} value={sede.idSede}>{sede.nombreSede}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newEvento.estado}
                  onChange={handleChange}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit">
                {editingEvento ? 'Actualizar' : 'Crear'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Eventos;

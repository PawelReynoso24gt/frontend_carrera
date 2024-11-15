import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert } from 'react-bootstrap';

function Personas() {
  const [personas, setPersonas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPersona, setEditingPersona] = useState(null);
  const [newPersona, setNewPersona] = useState({
    nombre: '',
    fechaNacimiento: '',
    telefono: '',
    domicilio: '',
    CUI: '',
    correo: '',
    idMunicipio: '',
    estado: 1
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/personas');
      setPersonas(response.data);
    } catch (error) {
      console.error('Error fetching personas:', error);
    }
  };

  const fetchActivePersonas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/personas/activos');
      setPersonas(response.data);
    } catch (error) {
      console.error('Error fetching active personas:', error);
    }
  };

  const fetchInactivePersonas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/personas/inactivos');
      setPersonas(response.data);
    } catch (error) {
      console.error('Error fetching inactive personas:', error);
    }
  };

  const handleShowModal = (persona = null) => {
    setEditingPersona(persona);
    setNewPersona(
      persona || {
        nombre: '',
        fechaNacimiento: '',
        telefono: '',
        domicilio: '',
        CUI: '',
        correo: '',
        idMunicipio: '',
        estado: 1
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
        // Actualizar persona
        await axios.put(`http://localhost:5000/personas/update/${editingPersona.idPersona}`, newPersona);
        setAlertMessage('Persona actualizada con éxito');
      } else {
        // Crear nueva persona
        await axios.post('http://localhost:5000/personas/create', newPersona);
        setAlertMessage('Persona creada con éxito');
      }
      fetchPersonas();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting persona:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/personas/update/${id}`, { estado: nuevoEstado });
      fetchPersonas();
      setAlertMessage(`Persona ${nuevoEstado === 1 ? 'activada' : 'inactivada'} con éxito`);
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
            <h3 className="crancy-section__title">CRUD Personas</h3>
          </div>
        </div>
      </div>

      {/* Botones para Filtrar Personas */}
      <div className="container mt-4">
        <Button variant="primary" onClick={() => handleShowModal()}>Agregar Persona</Button>
        <Button variant="success" className="ml-2" onClick={fetchActivePersonas}>Activas</Button>
        <Button variant="danger" className="ml-2" onClick={fetchInactivePersonas}>Inactivas</Button>

        <Alert variant="success" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>

        <Table striped bordered hover className="mt-3">
          <thead>
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
                <td>{persona.municipio ? persona.municipio.municipio : 'Sin municipio'}</td>
                <td>{persona.estado ? 'Activo' : 'Inactivo'}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShowModal(persona)}>Editar</Button>
                  <Button
                    variant={persona.estado ? "secondary" : "success"}
                    onClick={() => toggleEstado(persona.idPersona, persona.estado)}
                  >
                    {persona.estado ? "Inactivar" : "Activar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal para crear y editar personas */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editingPersona ? 'Editar Persona' : 'Agregar Persona'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={newPersona.nombre}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="fechaNacimiento">
                <Form.Label>Fecha de Nacimiento</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaNacimiento"
                  value={newPersona.fechaNacimiento}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="telefono">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  value={newPersona.telefono}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="domicilio">
                <Form.Label>Domicilio</Form.Label>
                <Form.Control
                  type="text"
                  name="domicilio"
                  value={newPersona.domicilio}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="CUI">
                <Form.Label>CUI</Form.Label>
                <Form.Control
                  type="text"
                  name="CUI"
                  value={newPersona.CUI}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="correo">
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  type="email"
                  name="correo"
                  value={newPersona.correo}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idMunicipio">
                <Form.Label>Municipio</Form.Label>
                <Form.Control
                  type="number"
                  name="idMunicipio"
                  value={newPersona.idMunicipio}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
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
              <Button variant="primary" type="submit">
                {editingPersona ? 'Actualizar' : 'Crear'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Personas;

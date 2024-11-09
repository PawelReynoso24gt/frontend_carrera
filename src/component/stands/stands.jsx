import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert } from 'react-bootstrap';

function Stand() {
  const [stands, setStands] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStand, setEditingStand] = useState(null);
  const [newStand, setNewStand] = useState({ nombreStand: '', direccion: '', estado: 1, idSede: '', idTipoStands: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [sedes, setSedes] = useState([]); // Para almacenar los ID de sedes
  const [tiposStands, setTiposStands] = useState([]); // Para almacenar los ID de tipos de stands

  useEffect(() => {
    fetchStands();
    fetchSedes();
    fetchTiposStands();
  }, []);

  const fetchStands = async () => {
    try {
      const response = await axios.get('http://localhost:5000/stand');
      setStands(response.data);
    } catch (error) {
      console.error('Error fetching stands:', error);
    }
  };

  const fetchSedes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/sedes'); // Cambia esta URL a la ruta correcta para obtener las sedes
      setSedes(response.data);
    } catch (error) {
      console.error('Error fetching sedes:', error);
    }
  };

  const fetchTiposStands = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tipo_stands'); // Cambia esta URL a la ruta correcta para obtener los tipos de stands
      setTiposStands(response.data);
    } catch (error) {
      console.error('Error fetching tipos de stands:', error);
    }
  };

  const fetchActiveStands = async () => {
    try {
      const response = await axios.get('http://localhost:5000/stand/activas');
      setStands(response.data);
    } catch (error) {
      console.error('Error fetching active stands:', error);
    }
  };

  const fetchInactiveStands = async () => {
    try {
      const response = await axios.get('http://localhost:5000/stand/inactivas');
      setStands(response.data);
    } catch (error) {
      console.error('Error fetching inactive stands:', error);
    }
  };

  const handleShowModal = (stand = null) => {
    setEditingStand(stand);
    setNewStand(stand || { nombreStand: '', direccion: '', estado: 1, idSede: '', idTipoStands: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStand(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStand({ ...newStand, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStand) {
        // Actualizar stand
        await axios.put(`http://localhost:5000/stand/update/${editingStand.idStand}`, newStand);
        setAlertMessage('Stand actualizado con éxito');
      } else {
        // Crear nuevo stand
        await axios.post('http://localhost:5000/stand/create', newStand);
        setAlertMessage('Stand creado con éxito');
      }
      fetchStands();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting stand:', error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/stand/update/${id}`, { estado: nuevoEstado });
      fetchStands();
      setAlertMessage(`Stand ${nuevoEstado === 1 ? 'activado' : 'inactivado'} con éxito`);
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
            <h3 className="crancy-section__title">CRUD de Stands</h3>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <Button variant="primary" onClick={() => handleShowModal()}>Agregar Stand</Button>
        <Button variant="success" className="ml-2" onClick={fetchActiveStands}>Activos</Button>
        <Button variant="danger" className="ml-2" onClick={fetchInactiveStands}>Inactivos</Button>

        <Alert variant="success" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Stand</th>
              <th>Dirección</th>
              <th>ID Sede</th>
              <th>ID Tipo Stand</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {stands.map((stand) => (
              <tr key={stand.idStand}>
                <td>{stand.idStand}</td>
                <td>{stand.nombreStand}</td>
                <td>{stand.direccion}</td>
                <td>{stand.idSede}</td>
                <td>{stand.idTipoStands}</td>
                <td>{stand.estado ? 'Activo' : 'Inactivo'}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShowModal(stand)}>Editar</Button>
                  <Button
                    variant={stand.estado ? "secondary" : "success"}
                    onClick={() => toggleEstado(stand.idStand, stand.estado)}
                  >
                    {stand.estado ? "Inactivar" : "Activar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editingStand ? 'Editar Stand' : 'Agregar Stand'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nombreStand">
                <Form.Label>Nombre Stand</Form.Label>
                <Form.Control
                  type="text"
                  name="nombreStand"
                  value={newStand.nombreStand}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="direccion">
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  type="text"
                  name="direccion"
                  value={newStand.direccion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newStand.estado}
                  onChange={handleChange}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="idSede">
                <Form.Label>ID Sede</Form.Label>
                <Form.Control
                  as="select"
                  name="idSede"
                  value={newStand.idSede}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar Sede</option>
                  {sedes.map((sede) => (
                    <option key={sede.idSede} value={sede.idSede}>{sede.idSede}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="idTipoStands">
                <Form.Label>ID Tipo Stand</Form.Label>
                <Form.Control
                  as="select"
                  name="idTipoStands"
                  value={newStand.idTipoStands}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar Tipo Stand</option>
                  {tiposStands.map((tipo) => (
                    <option key={tipo.idTipoStands} value={tipo.idTipoStands}>{tipo.idTipoStands}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit">
                {editingStand ? 'Actualizar' : 'Crear'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Stand;

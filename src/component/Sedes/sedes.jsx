import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert } from 'react-bootstrap';

function Sedes() {
  const [sedes, setSedes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSede, setEditingSede] = useState(null);
  const [newSede, setNewSede] = useState({ nombreSede: '', informacion: '', estado: 1 });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el buscador

  useEffect(() => {
    fetchSedes();
  }, []);

  const fetchSedes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/sedes');
      setSedes(response.data);
    } catch (error) {
      console.error('Error fetching sedes:', error);
    }
  };

  const fetchActiveSedes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/sedes/activas');
      setSedes(response.data);
    } catch (error) {
      console.error('Error fetching active sedes:', error);
    }
  };

  const fetchInactiveSedes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/sedes/inactivas');
      setSedes(response.data);
    } catch (error) {
      console.error('Error fetching inactive sedes:', error);
    }
  };

  const handleShowModal = (sede = null) => {
    setEditingSede(sede);
    setNewSede(sede || { nombreSede: '', informacion: '', estado: 1 });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSede(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSede({ ...newSede, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!regex.test(newSede.nombreSede)) {
      setAlertMessage('El nombre de la sede solo debe contener letras y espacios.');
      setShowAlert(true);
      return;
    }

    try {
      if (editingSede) {
        await axios.put(`http://localhost:5000/sedes/${editingSede.idSede}`, newSede);
        setAlertMessage('Sede actualizada con éxito');
      } else {
        await axios.post('http://localhost:5000/sedes', newSede);
        setAlertMessage('Sede creada con éxito');
      }
      fetchSedes();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting sede:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/sedes/${id}`, { estado: nuevoEstado });
      fetchSedes();
      setAlertMessage(`Sede ${nuevoEstado === 1 ? 'activada' : 'inactivada'} con éxito`);
      setShowAlert(true);
    } catch (error) {
      console.error('Error toggling estado:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredSedes = sedes.filter((sede) =>
    sede.nombreSede.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="row">
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <div className="crancy-section-title mg-btm-10">
            <h3 className="crancy-section__title">CRUD Sedes</h3>
            <p className="crancy-section__text"></p>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <Button variant="primary" onClick={() => handleShowModal()}>Agregar Sede</Button>
        <Button variant="success" className="ml-2" onClick={fetchActiveSedes}>Activas</Button>
        <Button variant="danger" className="ml-2" onClick={fetchInactiveSedes}>Inactivas</Button>

        <Alert variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>

        {/* Buscador */}
        <Form.Group controlId="searchSede" className="mt-3">
          <Form.Control
            type="text"
            placeholder="Buscar sede por nombre..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Form.Group>

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Sede</th>
              <th>Información</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSedes.map((sede) => (
              <tr key={sede.idSede}>
                <td>{sede.idSede}</td>
                <td>{sede.nombreSede}</td>
                <td>{sede.informacion}</td>
                <td>{sede.estado ? 'Activo' : 'Inactivo'}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShowModal(sede)}>Editar</Button>
                  <Button
                    variant={sede.estado ? "secondary" : "success"}
                    onClick={() => toggleEstado(sede.idSede, sede.estado)}
                  >
                    {sede.estado ? "Desactivar" : "Activar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editingSede ? 'Editar Sede' : 'Agregar Sede'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nombreSede">
                <Form.Label>Nombre Sede</Form.Label>
                <Form.Control
                  type="text"
                  name="nombreSede"
                  value={newSede.nombreSede}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="informacion">
                <Form.Label>Información</Form.Label>
                <Form.Control
                  type="text"
                  name="informacion"
                  value={newSede.informacion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newSede.estado}
                  onChange={handleChange}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit">
                {editingSede ? 'Actualizar' : 'Crear'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Sedes;

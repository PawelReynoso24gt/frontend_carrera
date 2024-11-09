import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert } from 'react-bootstrap';

function TipoStandsComponent() {
  const [tipoStands, setTipoStands] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTipoStand, setEditingTipoStand] = useState(null);
  const [newTipoStand, setNewTipoStand] = useState({ tipo: '', descripcion: '', estado: 1 });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [filter, setFilter] = useState('activos');

  useEffect(() => {
    fetchActiveTipoStands();
  }, []);

  const fetchTipoStands = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tipo_stands');
      setTipoStands(response.data);
    } catch (error) {
      console.error('Error fetching tipoStands:', error);
    }
  };

  const fetchActiveTipoStands = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tipo_stands/activos');
      setTipoStands(response.data.filter(tipoStand => tipoStand.estado === 1));
      setFilter('activos');
    } catch (error) {
      console.error('Error fetching active tipoStands:', error);
    }
  };

  const fetchInactiveTipoStands = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tipo_stands', {
        params: { estado: 0 }
      });
      setTipoStands(response.data.filter(tipoStand => tipoStand.estado === 0));
      setFilter('inactivos');
    } catch (error) {
      console.error('Error fetching inactive tipoStands:', error);
    }
  };

  const handleShowModal = (tipoStand = null) => {
    setEditingTipoStand(tipoStand);
    setNewTipoStand(tipoStand || { tipo: '', descripcion: '', estado: 1 });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTipoStand(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTipoStand({ ...newTipoStand, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTipoStand) {
        // Actualizar tipo de stand
        await axios.put(`http://localhost:5000/tipo_stands/${editingTipoStand.idTipoStands}`, newTipoStand);
        setAlertMessage('Tipo de stand actualizado con éxito');
      } else {
        // Crear nuevo tipo de stand
        await axios.post('http://localhost:5000/tipo_stands', newTipoStand);
        setAlertMessage('Tipo de stand creado con éxito');
      }
      filter === 'activos' ? fetchActiveTipoStands() : fetchInactiveTipoStands();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting tipo de stand:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);  // Muestra detalles del error desde el backend
      }
    }
  };

  const toggleTipoStandEstado = async (id, currentEstado) => {
    try {
      const newEstado = currentEstado === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/tipo_stands/${id}`, { estado: newEstado });
      setAlertMessage(`Tipo de stand ${newEstado === 1 ? 'activado' : 'desactivado'} con éxito`);
      setShowAlert(true);
      filter === 'activos' ? fetchActiveTipoStands() : fetchInactiveTipoStands();
    } catch (error) {
      console.error('Error toggling estado of tipo de stand:', error);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <div className="crancy-section-title mg-btm-10">
            <h3 className="crancy-section__title">TIPO STANDS</h3>
            <p className="crancy-section__text">
              Aquí puedes gestionar los tipos de stands disponibles.
            </p>
          </div>
        </div>
      </div>

      {/* Botones para Filtrar Tipos de Stands */}
      <div className="container mt-4">
        <Button variant="primary" onClick={() => handleShowModal()}>Agregar Tipo de Stand</Button>
        <Button variant="success" className="ml-2" onClick={fetchActiveTipoStands}>Activos</Button>
        <Button variant="secondary" className="ml-2" onClick={fetchInactiveTipoStands}>Inactivos</Button>

        <Alert variant="success" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tipoStands.filter(tipoStand => filter === 'activos' ? tipoStand.estado === 1 : tipoStand.estado === 0).map((tipoStand) => (
              <tr key={tipoStand.idTipoStands}>
                <td>{tipoStand.idTipoStands}</td>
                <td>{tipoStand.tipo}</td>
                <td>{tipoStand.descripcion}</td>
                <td>{tipoStand.estado ? 'Activo' : 'Inactivo'}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShowModal(tipoStand)}>Editar</Button>
                  <Button
                    variant={tipoStand.estado ? "danger" : "success"}
                    className="ml-2"
                    onClick={() => toggleTipoStandEstado(tipoStand.idTipoStands, tipoStand.estado)}
                  >
                    {tipoStand.estado ? "Desactivar" : "Activar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal para crear y editar tipos de stands */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editingTipoStand ? 'Editar Tipo de Stand' : 'Agregar Tipo de Stand'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="tipo">
                <Form.Label>Tipo</Form.Label>
                <Form.Control
                  type="text"
                  name="tipo"
                  value={newTipoStand.tipo}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="descripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  name="descripcion"
                  value={newTipoStand.descripcion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newTipoStand.estado}
                  onChange={handleChange}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit">
                {editingTipoStand ? 'Actualizar' : 'Crear'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default TipoStandsComponent;
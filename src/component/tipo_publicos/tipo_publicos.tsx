import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert } from 'react-bootstrap';

function TipoPublicos() {
  const [tipoPublicos, setTipoPublicos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTipoPublico, setEditingTipoPublico] = useState(null);
  const [newTipoPublico, setNewTipoPublico] = useState({ nombreTipo: '', estado: 1 });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchTipoPublicos();
  }, []);

  const fetchTipoPublicos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tipo_publicos');
      setTipoPublicos(response.data);
    } catch (error) {
      console.error('Error fetching tipo_publicos:', error);
    }
  };

  const fetchActiveTipoPublicos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tipo_publicos/activos');
      setTipoPublicos(response.data);
    } catch (error) {
      console.error('Error fetching active tipo_publicos:', error);
    }
  };

  const fetchInactiveTipoPublicos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tipo_publicos/inactivos');
      setTipoPublicos(response.data);
    } catch (error) {
      console.error('Error fetching inactive tipo_publicos:', error);
    }
  };

  const handleShowModal = (tipoPublico = null) => {
    setEditingTipoPublico(tipoPublico);
    setNewTipoPublico(tipoPublico || { nombreTipo: '', estado: 1 });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTipoPublico(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTipoPublico({ ...newTipoPublico, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTipoPublico) {
        // Actualizar tipo de público
        await axios.put(`http://localhost:5000/tipo_publicos/update/${editingTipoPublico.idTipoPublico}`, newTipoPublico);
        setAlertMessage('Tipo de público actualizado con éxito');
      } else {
        // Crear nuevo tipo de público
        await axios.post('http://localhost:5000/tipo_publicos/create', newTipoPublico);
        setAlertMessage('Tipo de público creado con éxito');
      }
      fetchTipoPublicos();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting tipo_publico:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/tipo_publicos/update/${id}`, { estado: nuevoEstado });
      fetchTipoPublicos();
      setAlertMessage(`Tipo de público ${nuevoEstado === 1 ? 'activado' : 'inactivado'} con éxito`);
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
            <h3 className="crancy-section__title">CRUD Tipo de Públicos</h3>
            <p className="crancy-section__text">
            </p>
          </div>
        </div>
      </div>

      {/* Botones para Filtrar Tipos de Público */}
      <div className="container mt-4">
        <Button variant="primary" onClick={() => handleShowModal()}>Agregar Tipo de Público</Button>
        <Button variant="success" className="ml-2" onClick={fetchActiveTipoPublicos}>Activos</Button>
        <Button variant="danger" className="ml-2" onClick={fetchInactiveTipoPublicos}>Inactivos</Button>

        <Alert variant="success" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Tipo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tipoPublicos.map((tipoPublico) => (
              <tr key={tipoPublico.idTipoPublico}>
                <td>{tipoPublico.idTipoPublico}</td>
                <td>{tipoPublico.nombreTipo}</td>
                <td>{tipoPublico.estado ? 'Activo' : 'Inactivo'}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShowModal(tipoPublico)}>Editar</Button>
                  <Button
                    variant={tipoPublico.estado ? "secondary" : "success"}
                    onClick={() => toggleEstado(tipoPublico.idTipoPublico, tipoPublico.estado)}
                  >
                    {tipoPublico.estado ? "Inactivar" : "Activar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal para crear y editar tipo de público */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editingTipoPublico ? 'Editar Tipo de Público' : 'Agregar Tipo de Público'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nombreTipo">
                <Form.Label>Nombre del Tipo de Público</Form.Label>
                <Form.Control
                  type="text"
                  name="nombreTipo"
                  value={newTipoPublico.nombreTipo}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newTipoPublico.estado}
                  onChange={handleChange}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit">
                {editingTipoPublico ? 'Actualizar' : 'Crear'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default TipoPublicos;

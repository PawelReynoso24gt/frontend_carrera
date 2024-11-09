import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert } from 'react-bootstrap';

function Departamentos() {
  const [departamentos, setDepartamentos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartamento, setEditingDepartamento] = useState(null);
  const [newDepartamento, setNewDepartamento] = useState({ departamento: '', estado: 1 });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchDepartamentos();
  }, []);

  const fetchDepartamentos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/departamentos');
      setDepartamentos(response.data);
    } catch (error) {
      console.error('Error fetching departamentos:', error);
    }
  };

  const fetchActiveDepartamentos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/departamentos/activas');
      setDepartamentos(response.data);
    } catch (error) {
      console.error('Error fetching active departamentos:', error);
    }
  };

  const fetchInactiveDepartamentos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/departamentos/inactivas');
      setDepartamentos(response.data);
    } catch (error) {
      console.error('Error fetching inactive departamentos:', error);
    }
  };

  const handleShowModal = (departamento = null) => {
    setEditingDepartamento(departamento);
    setNewDepartamento(departamento || { departamento: '', estado: 1 });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDepartamento(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDepartamento({ ...newDepartamento, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDepartamento) {
        // Actualizar departamento
        await axios.put(`http://localhost:5000/departamentos/${editingDepartamento.idDepartamento}`, newDepartamento);
        setAlertMessage('Departamento actualizado con éxito');
      } else {
        // Crear nuevo departamento
        await axios.post('http://localhost:5000/departamentos/create', newDepartamento);
        setAlertMessage('Departamento creado con éxito');
      }
      fetchDepartamentos();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting departamento:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);  // Muestra detalles del error desde el backend
      }
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      // Cambiar el estado a su opuesto
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/departamentos/${id}`, { estado: nuevoEstado });
      fetchDepartamentos();
      setAlertMessage(`Departamento ${nuevoEstado === 1 ? 'activado' : 'inactivado'} con éxito`);
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
            <h3 className="crancy-section__title">CRUD</h3>
            <p className="crancy-section__text">
            </p>
          </div>
        </div>
      </div>

      {/* Botones para Filtrar Departamentos */}
      <div className="container mt-4">
        <Button variant="primary" onClick={() => handleShowModal()}>Agregar Departamento</Button>
        <Button variant="success" className="ml-2" onClick={fetchActiveDepartamentos}>Activos</Button>
        <Button variant="danger" className="ml-2" onClick={fetchInactiveDepartamentos}>Inactivos</Button>

        <Alert variant="success" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Departamento</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {departamentos.map((departamento) => (
              <tr key={departamento.idDepartamento}>
                <td>{departamento.idDepartamento}</td>
                <td>{departamento.departamento}</td>
                <td>{departamento.estado ? 'Activo' : 'Inactivo'}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShowModal(departamento)}>Editar</Button>
                  <Button
                    variant={departamento.estado ? "secondary" : "success"}
                    onClick={() => toggleEstado(departamento.idDepartamento, departamento.estado)}
                  >
                    {departamento.estado ? "Inactivar" : "Activar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal para crear y editar departamentos */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editingDepartamento ? 'Editar Departamento' : 'Agregar Departamento'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="departamento">
                <Form.Label>Departamento</Form.Label>
                <Form.Control
                  type="text"
                  name="departamento"
                  value={newDepartamento.departamento}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newDepartamento.estado}
                  onChange={handleChange}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit">
                {editingDepartamento ? 'Actualizar' : 'Crear'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Departamentos;

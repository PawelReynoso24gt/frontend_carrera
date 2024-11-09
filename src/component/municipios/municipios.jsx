import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert } from 'react-bootstrap';

function Municipio() {
  const [municipios, setMunicipios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMunicipio, setEditingMunicipio] = useState(null);
  const [newMunicipio, setNewMunicipio] = useState({ municipio: '', estado: 1, idDepartamento: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [departamentos, setDepartamentos] = useState([]); // Para almacenar los ID de departamentos

  useEffect(() => {
    fetchMunicipios();
    fetchDepartamentos();
  }, []);

  const fetchMunicipios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/municipios');
      setMunicipios(response.data);
    } catch (error) {
      console.error('Error fetching municipios:', error);
    }
  };

  const fetchDepartamentos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/departamentos'); // Cambia esta URL si es necesario
      setDepartamentos(response.data);
    } catch (error) {
      console.error('Error fetching departamentos:', error);
    }
  };

  const fetchActiveMunicipios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/municipios/activas');
      setMunicipios(response.data);
    } catch (error) {
      console.error('Error fetching active municipios:', error);
    }
  };

  const fetchInactiveMunicipios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/municipios/inactivas');
      setMunicipios(response.data);
    } catch (error) {
      console.error('Error fetching inactive municipios:', error);
    }
  };

  const handleShowModal = (municipio = null) => {
    setEditingMunicipio(municipio);
    setNewMunicipio(municipio || { municipio: '', estado: 1, idDepartamento: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMunicipio(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMunicipio({ ...newMunicipio, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMunicipio) {
        // Actualizar municipio
        await axios.put(`http://localhost:5000/municipios/update/${editingMunicipio.idMunicipio}`, newMunicipio);
        setAlertMessage('Municipio actualizado con éxito');
      } else {
        // Crear nuevo municipio
        await axios.post('http://localhost:5000/municipios/create', newMunicipio);
        setAlertMessage('Municipio creado con éxito');
      }
      fetchMunicipios();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting municipio:', error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/municipios/update/${id}`, { estado: nuevoEstado });
      fetchMunicipios();
      setAlertMessage(`Municipio ${nuevoEstado === 1 ? 'activado' : 'inactivado'} con éxito`);
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
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <Button variant="primary" onClick={() => handleShowModal()}>Agregar Municipio</Button>
        <Button variant="success" className="ml-2" onClick={fetchActiveMunicipios}>Activos</Button>
        <Button variant="danger" className="ml-2" onClick={fetchInactiveMunicipios}>Inactivos</Button>

        <Alert variant="success" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Municipio</th>
              <th>ID Departamento</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {municipios.map((municipio) => (
              <tr key={municipio.idMunicipio}>
                <td>{municipio.idMunicipio}</td>
                <td>{municipio.municipio}</td>
                <td>{municipio.idDepartamento}</td>
                <td>{municipio.estado ? 'Activo' : 'Inactivo'}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShowModal(municipio)}>Editar</Button>
                  <Button
                    variant={municipio.estado ? "secondary" : "success"}
                    onClick={() => toggleEstado(municipio.idMunicipio, municipio.estado)}
                  >
                    {municipio.estado ? "Inactivar" : "Activar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editingMunicipio ? 'Editar Municipio' : 'Agregar Municipio'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="municipio">
                <Form.Label>Municipio</Form.Label>
                <Form.Control
                  type="text"
                  name="municipio"
                  value={newMunicipio.municipio}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newMunicipio.estado}
                  onChange={handleChange}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="idDepartamento">
                <Form.Label>ID Departamento</Form.Label>
                <Form.Control
                  as="select"
                  name="idDepartamento"
                  value={newMunicipio.idDepartamento}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar Departamento</option>
                  {departamentos.map((departamento) => (
                    <option key={departamento.idDepartamento} value={departamento.idDepartamento}>{departamento.idDepartamento}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit">
                {editingMunicipio ? 'Actualizar' : 'Crear'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Municipio;

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert } from 'react-bootstrap';

function TipoTraslado() {
  const [tipoTraslados, setTipoTraslados] = useState([]); // Inicializa como arreglo vacío
  const [showModal, setShowModal] = useState(false);
  const [editingTipoTraslado, setEditingTipoTraslado] = useState(null);
  const [newTipoTraslado, setNewTipoTraslado] = useState({ tipo: '', estado: 1 });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchTipoTraslados();
  }, []);

  const fetchTipoTraslados = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tipoTraslados');
      // Verifica si response.data es un arreglo antes de asignarlo
      if (Array.isArray(response.data)) {
        setTipoTraslados(response.data);
      } else {
        console.error('La respuesta de la API no es un arreglo:', response.data);
        setTipoTraslados([]); // Establece como arreglo vacío si la respuesta no es un arreglo
      }
    } catch (error) {
      console.error('Error fetching tipo traslados:', error);
      setTipoTraslados([]); // Establece como arreglo vacío en caso de error
    }
  };

  const fetchActiveTipoTraslados = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tipoTraslados/activas');
      if (Array.isArray(response.data)) {
        setTipoTraslados(response.data);
      } else {
        setTipoTraslados([]);
      }
    } catch (error) {
      console.error('Error fetching active tipo traslados:', error);
    }
  };

  const fetchInactiveTipoTraslados = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tipoTraslados/inactivas');
      if (Array.isArray(response.data)) {
        setTipoTraslados(response.data);
      } else {
        setTipoTraslados([]);
      }
    } catch (error) {
      console.error('Error fetching inactive tipo traslados:', error);
    }
  };

  const handleShowModal = (tipoTraslado = null) => {
    setEditingTipoTraslado(tipoTraslado);
    setNewTipoTraslado(tipoTraslado || { tipo: '', estado: 1 });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTipoTraslado(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTipoTraslado({ ...newTipoTraslado, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!regex.test(newTipoTraslado.tipo)) {
      setAlertMessage('El tipo de traslado solo debe contener letras y espacios.');
      setShowAlert(true);
      return;
    }

    try {
      if (editingTipoTraslado) {
        await axios.put(`http://localhost:5000/tipoTraslados/${editingTipoTraslado.idTipoTraslado}`, newTipoTraslado);
        setAlertMessage('Tipo de traslado actualizado con éxito');
      } else {
        await axios.post('http://localhost:5000/tipoTraslados', newTipoTraslado);
        setAlertMessage('Tipo de traslado creado con éxito');
      }
      fetchTipoTraslados();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting tipo traslado:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/tipoTraslados/${id}`, { estado: nuevoEstado });
      fetchTipoTraslados();
      setAlertMessage(`Tipo de traslado ${nuevoEstado === 1 ? 'activado' : 'inactivado'} con éxito`);
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
            <h3 className="crancy-section__title">CRUD Tipo de Traslado</h3>
            <p className="crancy-section__text"></p>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <Button variant="primary" onClick={() => handleShowModal()}>Agregar Tipo de Traslado</Button>
        <Button variant="success" className="ml-2" onClick={fetchActiveTipoTraslados}>Activos</Button>
        <Button variant="danger" className="ml-2" onClick={fetchInactiveTipoTraslados}>Inactivos</Button>

        <Alert variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(tipoTraslados) && tipoTraslados.map((tipoTraslado) => (
              <tr key={tipoTraslado.idTipoTraslado}>
                <td>{tipoTraslado.idTipoTraslado}</td>
                <td>{tipoTraslado.tipo}</td>
                <td>{tipoTraslado.estado ? 'Activo' : 'Inactivo'}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShowModal(tipoTraslado)}>Editar</Button>
                  <Button
                    variant={tipoTraslado.estado ? "secondary" : "success"}
                    onClick={() => toggleEstado(tipoTraslado.idTipoTraslado, tipoTraslado.estado)}
                  >
                    {tipoTraslado.estado ? "Inactivar" : "Activar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editingTipoTraslado ? 'Editar Tipo de Traslado' : 'Agregar Tipo de Traslado'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="tipo">
                <Form.Label>Tipo</Form.Label>
                <Form.Control
                  type="text"
                  name="tipo"
                  value={newTipoTraslado.tipo}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newTipoTraslado.estado}
                  onChange={handleChange}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit">
                {editingTipoTraslado ? 'Actualizar' : 'Crear'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default TipoTraslado;

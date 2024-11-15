import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert } from 'react-bootstrap';

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [newCategoria, setNewCategoria] = useState({ nombreCategoria: '', estado: 1 });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get('http://localhost:5000/categorias');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error fetching categorias:', error);
    }
  };

  const fetchActiveCategorias = async () => {
    try {
      const response = await axios.get('http://localhost:5000/categorias/activas');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error fetching active categorias:', error);
    }
  };

  const fetchInactiveCategorias = async () => {
    try {
      const response = await axios.get('http://localhost:5000/categorias/inactivas');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error fetching inactive categorias:', error);
    }
  };

  const handleShowModal = (categoria = null) => {
    setEditingCategoria(categoria);
    setNewCategoria(categoria || { nombreCategoria: '', estado: 1 });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategoria(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategoria({ ...newCategoria, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación del nombre de la categoría con regex
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!regex.test(newCategoria.nombreCategoria)) {
      setAlertMessage('El nombre de la categoría solo debe contener letras y espacios.');
      setShowAlert(true);
      return; // Detiene el proceso si la validación falla
    }

    try {
      if (editingCategoria) {
        // Actualizar categoría
        await axios.put(`http://localhost:5000/categorias/${editingCategoria.idCategoria}`, newCategoria);
        setAlertMessage('Categoría actualizada con éxito');
      } else {
        // Crear nueva categoría
        await axios.post('http://localhost:5000/categorias', newCategoria);
        setAlertMessage('Categoría creada con éxito');
      }
      fetchCategorias();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting categoria:', error);
      if (error.response) {
        console.error('Error response:', error.response.data); // Muestra el mensaje de error desde el backend
      }
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/categorias/${idSede}`, { estado: nuevoEstado });
      fetchCategorias();
      setAlertMessage(`Categoría ${nuevoEstado === 1 ? 'activada' : 'inactivada'} con éxito`);
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
            <h3 className="crancy-section__title">CRUD Categorías</h3>
            <p className="crancy-section__text"></p>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <Button variant="primary" onClick={() => handleShowModal()}>Agregar Categoría</Button>
        <Button variant="success" className="ml-2" onClick={fetchActiveCategorias}>Activas</Button>
        <Button variant="danger" className="ml-2" onClick={fetchInactiveCategorias}>Desactivar</Button>

        <Alert variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.idCategoria}>
                <td>{categoria.idCategoria}</td>
                <td>{categoria.nombreCategoria}</td>
                <td>{categoria.estado ? 'Activo' : 'Inactivo'}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShowModal(categoria)}>Editar</Button>
                  <Button
                    variant={categoria.estado ? "secondary" : "success"}
                    onClick={() => toggleEstado(categoria.idCategoria, categoria.estado)}
                  >
                    {categoria.estado ? "Inactivar" : "Activar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editingCategoria ? 'Editar Categoría' : 'Agregar Categoría'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nombreCategoria">
                <Form.Label>Nombre Categoría</Form.Label>
                <Form.Control
                  type="text"
                  name="nombreCategoria"
                  value={newCategoria.nombreCategoria}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newCategoria.estado}
                  onChange={handleChange}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit">
                {editingCategoria ? 'Actualizar' : 'Crear'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Categorias;

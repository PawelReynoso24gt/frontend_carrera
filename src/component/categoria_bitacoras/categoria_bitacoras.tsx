import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert } from 'react-bootstrap';

function CategoriaBitacoras() {
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [newCategoria, setNewCategoria] = useState({ categoria: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get('http://localhost:5000/categoria_bitacoras');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error fetching categorias:', error);
    }
  };

  const handleShowModal = (categoria = null) => {
    setEditingCategoria(categoria);
    setNewCategoria(categoria || { categoria: '' });
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
    try {
      if (editingCategoria) {
        // Actualizar categoría de bitácora
        await axios.put(`http://localhost:5000/categoria_bitacoras/update/${editingCategoria.idCategoriaBitacora}`, newCategoria);
        setAlertMessage('Categoría de bitácora actualizada con éxito');
      } else {
        // Crear nueva categoría de bitácora
        await axios.post('http://localhost:5000/categoria_bitacoras/create', newCategoria);
        setAlertMessage('Categoría de bitácora creada con éxito');
      }
      fetchCategorias();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting categoria:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/categoria_bitacoras/delete/${id}`);
      fetchCategorias();
      setAlertMessage('Categoría de bitácora eliminada correctamente');
      setShowAlert(true);
    } catch (error) {
      console.error('Error deleting categoria:', error);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <div className="crancy-section-title mg-btm-10">
            <h3 className="crancy-section__title">CRUD Categorías de Bitácoras</h3>
            <p className="crancy-section__text">
            </p>
          </div>
        </div>
      </div>

      {/* Botón para agregar nueva categoría */}
      <div className="container mt-4">
        <Button variant="primary" onClick={() => handleShowModal()}>Agregar Categoría</Button>

        <Alert variant="success" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.idCategoriaBitacora}>
                <td>{categoria.idCategoriaBitacora}</td>
                <td>{categoria.categoria}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShowModal(categoria)}>Editar</Button>
                  <Button variant="danger" onClick={() => handleDelete(categoria.idCategoriaBitacora)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal para crear y editar categoría de bitácora */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editingCategoria ? 'Editar Categoría' : 'Agregar Categoría'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="categoria">
                <Form.Label>Categoría</Form.Label>
                <Form.Control
                  type="text"
                  name="categoria"
                  value={newCategoria.categoria}
                  onChange={handleChange}
                  required
                />
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

export default CategoriaBitacoras;

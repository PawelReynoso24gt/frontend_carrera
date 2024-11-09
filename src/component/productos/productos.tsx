import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert } from 'react-bootstrap';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [newProducto, setNewProducto] = useState({
    talla: '',
    precio: '',
    nombreProducto: '',
    descripcion: '',
    cantidadMinima: '',
    cantidadMaxima: '',
    idCategoria: '',
    estado: 1
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/productos');
      setProductos(response.data);
    } catch (error) {
      console.error('Error fetching productos:', error);
    }
  };

  const fetchActiveProductos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/productos/activos');
      setProductos(response.data);
    } catch (error) {
      console.error('Error fetching active productos:', error);
    }
  };

  const fetchInactiveProductos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/productos/inactivos');
      setProductos(response.data);
    } catch (error) {
      console.error('Error fetching inactive productos:', error);
    }
  };

  const handleShowModal = (producto = null) => {
    setEditingProducto(producto);
    setNewProducto(
      producto || {
        talla: '',
        precio: '',
        nombreProducto: '',
        descripcion: '',
        cantidadMinima: '',
        cantidadMaxima: '',
        idCategoria: '',
        estado: 1
      }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProducto(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProducto({ ...newProducto, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProducto) {
        // Actualizar producto
        await axios.put(`http://localhost:5000/productos/${editingProducto.idProducto}`, newProducto);
        setAlertMessage('Producto actualizado con éxito');
      } else {
        // Crear nuevo producto
        await axios.post('http://localhost:5000/productos', newProducto);
        setAlertMessage('Producto creado con éxito');
      }
      fetchProductos();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting producto:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/productos/${id}`, { estado: nuevoEstado });
      fetchProductos();
      setAlertMessage(`Producto ${nuevoEstado === 1 ? 'activado' : 'inactivado'} con éxito`);
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
            <h3 className="crancy-section__title">CRUD Productos</h3>
          </div>
        </div>
      </div>

      {/* Botones para Filtrar Productos */}
      <div className="container mt-4">
        <Button variant="primary" onClick={() => handleShowModal()}>Agregar Producto</Button>
        <Button variant="success" className="ml-2" onClick={fetchActiveProductos}>Activos</Button>
        <Button variant="danger" className="ml-2" onClick={fetchInactiveProductos}>Inactivos</Button>

        <Alert variant="success" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Producto</th>
              <th>Talla</th>
              <th>Precio</th>
              <th>Descripción</th>
              <th>Cantidad Mínima</th>
              <th>Cantidad Máxima</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.idProducto}>
                <td>{producto.idProducto}</td>
                <td>{producto.nombreProducto}</td>
                <td>{producto.talla}</td>
                <td>{producto.precio}</td>
                <td>{producto.descripcion}</td>
                <td>{producto.cantidadMinima}</td>
                <td>{producto.cantidadMaxima}</td>
                <td>{producto.categoria ? producto.categoria.nombreCategoria : 'Sin categoría'}</td>
                <td>{producto.estado ? 'Activo' : 'Inactivo'}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShowModal(producto)}>Editar</Button>
                  <Button
                    variant={producto.estado ? "secondary" : "success"}
                    onClick={() => toggleEstado(producto.idProducto, producto.estado)}
                  >
                    {producto.estado ? "Inactivar" : "Activar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal para crear y editar productos */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editingProducto ? 'Editar Producto' : 'Agregar Producto'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nombreProducto">
                <Form.Label>Nombre del Producto</Form.Label>
                <Form.Control
                  type="text"
                  name="nombreProducto"
                  value={newProducto.nombreProducto}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="talla">
                <Form.Label>Talla</Form.Label>
                <Form.Control
                  type="text"
                  name="talla"
                  value={newProducto.talla}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="precio">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  type="number"
                  name="precio"
                  value={newProducto.precio}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="descripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  name="descripcion"
                  value={newProducto.descripcion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="cantidadMinima">
                <Form.Label>Cantidad Mínima</Form.Label>
                <Form.Control
                  type="number"
                  name="cantidadMinima"
                  value={newProducto.cantidadMinima}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="cantidadMaxima">
                <Form.Label>Cantidad Máxima</Form.Label>
                <Form.Control
                  type="number"
                  name="cantidadMaxima"
                  value={newProducto.cantidadMaxima}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idCategoria">
                <Form.Label>Categoría</Form.Label>
                <Form.Control
                  type="number"
                  name="idCategoria"
                  value={newProducto.idCategoria}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newProducto.estado}
                  onChange={handleChange}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit">
                {editingProducto ? 'Actualizar' : 'Crear'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Productos;

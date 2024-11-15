import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert } from 'react-bootstrap';

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPedido, setEditingPedido] = useState(null);
  const [newPedido, setNewPedido] = useState({ fecha: '', descripcion: '', idSede: '', idUsuario: '', estado: 1 });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [sedes, setSedes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetchPedidos();
    fetchSedes();
    fetchUsuarios();
  }, []);

  const fetchPedidos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/pedidos');
      setPedidos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching pedidos:', error);
    }
  };

  const fetchActivePedidos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/pedidos/activas');
      setPedidos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching active pedidos:', error);
    }
  };

  const fetchInactivePedidos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/pedidos/inactivas');
      setPedidos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching inactive pedidos:', error);
    }
  };

  const fetchSedes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/sedes');
      setSedes(response.data);
    } catch (error) {
      console.error('Error fetching sedes:', error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
    }
  };

  const handleShowModal = (pedido = null) => {
    setEditingPedido(pedido);
    setNewPedido(pedido || { fecha: '', descripcion: '', idSede: '', idUsuario: '', estado: 1 });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPedido(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPedido({ ...newPedido, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const regexDescripcion = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,-]+$/;
    if (!regexDescripcion.test(newPedido.descripcion)) {
      setAlertMessage('La descripción solo debe contener letras, números, espacios y los signos permitidos (.,-).');
      setShowAlert(true);
      return;
    }

    try {
      if (editingPedido) {
        await axios.put(`http://localhost:5000/pedidos/${editingPedido.idPedido}`, newPedido);
        setAlertMessage('Pedido actualizado con éxito');
      } else {
        await axios.post('http://localhost:5000/pedidos', newPedido);
        setAlertMessage('Pedido creado con éxito');
      }
      fetchPedidos();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting pedido:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/pedidos/${id}`, { estado: nuevoEstado });
      fetchPedidos();
      setAlertMessage(`Pedido ${nuevoEstado === 1 ? 'activado' : 'inactivado'} con éxito`);
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
            <h3 className="crancy-section__title">CRUD Pedidos</h3>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <Button variant="primary" onClick={() => handleShowModal()}>Agregar Pedido</Button>
        <Button variant="success" className="ml-2" onClick={fetchActivePedidos}>Ver Activos</Button>
        <Button variant="danger" className="ml-2" onClick={fetchInactivePedidos}>Ver Inactivos</Button>

        <Alert variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Sede</th>
              <th>Usuario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.idPedido}>
                <td>{pedido.idPedido}</td>
                <td>{pedido.fecha}</td>
                <td>{pedido.descripcion}</td>
                <td>{pedido.sede ? pedido.sede.nombreSede : pedido.idSede}</td>
                <td>{pedido.usuario ? pedido.usuario.nombreUsuario : pedido.idUsuario}</td>
                <td>{pedido.estado ? 'Activo' : 'Inactivo'}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShowModal(pedido)}>Editar</Button>
                  <Button
                    variant={pedido.estado ? "secondary" : "success"}
                    onClick={() => toggleEstado(pedido.idPedido, pedido.estado)}
                  >
                    {pedido.estado ? "Desactivar" : "Activar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editingPedido ? 'Editar Pedido' : 'Agregar Pedido'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="fecha">
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha"
                  value={newPedido.fecha}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="descripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  name="descripcion"
                  value={newPedido.descripcion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idSede">
                <Form.Label>Sede</Form.Label>
                <Form.Control
                  as="select"
                  name="idSede"
                  value={newPedido.idSede}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar Sede</option>
                  {sedes.map((sede) => (
                    <option key={sede.idSede} value={sede.idSede}>{sede.nombreSede}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="idUsuario">
                <Form.Label>Usuario</Form.Label>
                <Form.Control
                  as="select"
                  name="idUsuario"
                  value={newPedido.idUsuario}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar Usuario</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.idUsuario} value={usuario.idUsuario}>{usuario.nombreUsuario}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newPedido.estado}
                  onChange={handleChange}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit">
                {editingPedido ? 'Actualizar' : 'Crear'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Pedidos;

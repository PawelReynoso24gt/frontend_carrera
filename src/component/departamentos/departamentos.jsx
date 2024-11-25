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
        await axios.put(`http://localhost:5000/departamentos/${editingDepartamento.idDepartamento}`, newDepartamento);
        setAlertMessage('Departamento actualizado con éxito');
      } else {
        await axios.post('http://localhost:5000/departamentos/create', newDepartamento);
        setAlertMessage('Departamento creado con éxito');
      }
      fetchDepartamentos();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting departamento:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
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
      <div className="row" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>Gestión de Departamentos</h3>
        </div>
      </div>

      <div className="container mt-4" style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <Button
          style={{
            backgroundColor: "#743D90",
            borderColor: "#007AC3",
            padding: "5px 10px",
            width: "130px",
            marginRight: "10px",
            color: '#fff',
            fontWeight: 'bold'
          }}
          onClick={() => handleShowModal()}
        >
          Agregar Departamento
        </Button>
        <Button
          style={{
            backgroundColor: "#007AC3",
            borderColor: "#007AC3",
            padding: "5px 10px",
            width: "100px",
            marginRight: "10px",
            color: '#fff',
            fontWeight: 'bold'
          }}
          onClick={fetchActiveDepartamentos}
        >
          Activos
        </Button>
        <Button
          style={{
            backgroundColor: "#009B85",
            borderColor: "#007AC3",
            padding: "5px 10px",
            width: "100px",
            color: '#fff',
            fontWeight: 'bold'
          }}
          onClick={fetchInactiveDepartamentos}
        >
          Inactivos
        </Button>

        <Alert variant="success" show={showAlert} onClose={() => setShowAlert(false)} dismissible style={{ marginTop: '20px', fontWeight: 'bold' }}>
          {alertMessage}
        </Alert>

        <Table striped bordered hover responsive className="mt-3" style={{ backgroundColor: '#ffffff', borderRadius: '8px', marginTop: '20px' }}>
          <thead style={{ backgroundColor: '#007AC3', color: '#fff' }}>
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
                  <Button
                    style={{
                      backgroundColor: "#007AC3",
                      borderColor: "#007AC3",
                      padding: "5px 10px",
                      width: "100px",
                      marginRight: "5px",
                      color: '#fff',
                      fontWeight: 'bold'
                    }}
                    onClick={() => handleShowModal(departamento)}
                  >
                    Editar
                  </Button>
                  <Button
                    style={{
                      backgroundColor: departamento.estado ? "#6c757d" : "#28a745",
                      borderColor: departamento.estado ? "#6c757d" : "#28a745",
                      padding: "5px 10px",
                      width: "100px",
                      color: '#fff',
                      fontWeight: 'bold'
                    }}
                    onClick={() => toggleEstado(departamento.idDepartamento, departamento.estado)}
                  >
                    {departamento.estado ? "Inactivar" : "Activar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton style={{ backgroundColor: '#007AC3', color: '#fff' }}>
            <Modal.Title>{editingDepartamento ? 'Editar Departamento' : 'Agregar Departamento'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="departamento">
                <Form.Label style={{ fontWeight: 'bold', color: '#333' }}>Departamento</Form.Label>
                <Form.Control
                  type="text"
                  name="departamento"
                  value={newDepartamento.departamento}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label style={{ fontWeight: 'bold', color: '#333' }}>Estado</Form.Label>
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
              <Button
                style={{
                  backgroundColor: "#007AC3",
                  borderColor: "#007AC3",
                  padding: "5px 10px",
                  width: "100%",
                  color: '#fff',
                  fontWeight: 'bold'
                }}
                type="submit"
              >
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

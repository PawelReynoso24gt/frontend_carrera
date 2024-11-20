import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert } from 'react-bootstrap';

function HorariosComponent() {
  const [horarios, setHorarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingHorario, setEditingHorario] = useState(null);
  const [newHorario, setNewHorario] = useState({ horarioInicio: '', horarioFinal: '', estado: 1 });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [filter, setFilter] = useState('activos');

  useEffect(() => {
    fetchActiveHorarios();
  }, []);

  const fetchActiveHorarios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/horarios/activos');
      setHorarios(response.data);
      setFilter('activos');
    } catch (error) {
      console.error('Error fetching active horarios:', error);
    }
  };

  const fetchInactiveHorarios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/horarios', {
        params: { estado: 0 }
      });
      setHorarios(response.data.filter(horario => horario.estado === 0));
      setFilter('inactivos');
    } catch (error) {
      console.error('Error fetching inactive horarios:', error);
    }
  };

  const handleShowModal = (horario = null) => {
    setEditingHorario(horario);
    setNewHorario(horario || { horarioInicio: '', horarioFinal: '', estado: 1 });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingHorario(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewHorario({ ...newHorario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHorario) {
        await axios.put(`http://localhost:5000/horarios/${editingHorario.idHorario}`, newHorario);
        setAlertMessage('Horario actualizado con éxito');
      } else {
        await axios.post('http://localhost:5000/horarios', newHorario);
        setAlertMessage('Horario creado con éxito');
      }
      filter === 'activos' ? fetchActiveHorarios() : fetchInactiveHorarios();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting horario:', error);
    }
  };

  const toggleHorarioEstado = async (id, currentEstado) => {
    try {
      const newEstado = currentEstado === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/horarios/${id}`, { estado: newEstado });
      setAlertMessage(`Horario ${newEstado === 1 ? 'activado' : 'desactivado'} con éxito`);
      setShowAlert(true);
      filter === 'activos' ? fetchActiveHorarios() : fetchInactiveHorarios();
    } catch (error) {
      console.error('Error toggling estado of horario:', error);
    }
  };

  return (
    <>
      <div className="row" style={{ textAlign: "center", marginBottom: "20px" }}>
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
            Gestión de Horarios
          </h3>
        </div>
      </div>

      <div
        className="container mt-4"
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Button
          style={{
            backgroundColor: "#743D90",
            borderColor: "#007AC3",
            padding: "5px 10px",
            width: "180px",
            marginRight: "10px",
            fontWeight: "bold",
            color: "#fff",
          }}
          onClick={() => handleShowModal()}
        >
          Agregar Horario
        </Button>
        <Button
          style={{
            backgroundColor: "#007AC3",
            borderColor: "#007AC3",
            padding: "5px 10px",
            width: "100px",
            marginRight: "10px",
            fontWeight: "bold",
            color: "#fff",
          }}
          onClick={fetchActiveHorarios}
        >
          Activos
        </Button>
        <Button
          style={{
            backgroundColor: "#009B85",
            borderColor: "#007AC3",
            padding: "5px 10px",
            width: "100px",
            fontWeight: "bold",
            color: "#fff",
          }}
          onClick={fetchInactiveHorarios}
        >
          Inactivos
        </Button>

        <Alert
          variant="success"
          show={showAlert}
          onClose={() => setShowAlert(false)}
          dismissible
          style={{ marginTop: "20px", fontWeight: "bold" }}
        >
          {alertMessage}
        </Alert>

        <Table
          striped
          bordered
          hover
          responsive
          className="mt-3"
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            marginTop: "20px",
          }}
        >
          <thead style={{ backgroundColor: "#007AC3", color: "#fff" }}>
            <tr>
              <th>ID</th>
              <th>Horario Inicio</th>
              <th>Horario Final</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {horarios.map((horario) => (
              <tr key={horario.idHorario}>
                <td>{horario.idHorario}</td>
                <td>{horario.horarioInicio}</td>
                <td>{horario.horarioFinal}</td>
                <td>{horario.estado ? "Activo" : "Inactivo"}</td>
                <td>
                  <Button
                    style={{
                      backgroundColor: "#007AC3",
                      borderColor: "#007AC3",
                      padding: "5px 10px",
                      width: "100px",
                      marginRight: "5px",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                    onClick={() => handleShowModal(horario)}
                  >
                    Editar
                  </Button>
                  <Button
                    style={{
                      backgroundColor: horario.estado ? "#6c757d" : "#28a745",
                      borderColor: horario.estado ? "#6c757d" : "#28a745",
                      padding: "5px 10px",
                      width: "100px",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                    onClick={() => toggleHorarioEstado(horario.idHorario, horario.estado)}
                  >
                    {horario.estado ? "Desactivar" : "Activar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header
            closeButton
            style={{ backgroundColor: "#007AC3", color: "#fff" }}
          >
            <Modal.Title>
              {editingHorario ? "Editar Horario" : "Agregar Horario"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="horarioInicio">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Horario Inicio
                </Form.Label>
                <Form.Control
                  type="text"
                  name="horarioInicio"
                  value={newHorario.horarioInicio}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="horarioFinal">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Horario Final
                </Form.Label>
                <Form.Control
                  type="text"
                  name="horarioFinal"
                  value={newHorario.horarioFinal}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Estado
                </Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newHorario.estado}
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
                  fontWeight: "bold",
                  color: "#fff",
                }}
                type="submit"
              >
                {editingHorario ? "Actualizar" : "Crear"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default HorariosComponent;
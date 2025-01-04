import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert } from 'react-bootstrap';

function TipoStandsComponent() {
  const [tipoStands, setTipoStands] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTipoStand, setEditingTipoStand] = useState(null);
  const [newTipoStand, setNewTipoStand] = useState({ tipo: '', descripcion: '', estado: 1 });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [filter, setFilter] = useState('activos');

  useEffect(() => {
    fetchActiveTipoStands();
  }, []);

  const fetchActiveTipoStands = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tipo_stands/activos');
      setTipoStands(response.data);
      setFilter('activos');
    } catch (error) {
      console.error('Error fetching active tipoStands:', error);
    }
  };

  const fetchInactiveTipoStands = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tipo_stands', {
        params: { estado: 0 }
      });
      setTipoStands(response.data.filter(tipoStand => tipoStand.estado === 0));
      setFilter('inactivos');
    } catch (error) {
      console.error('Error fetching inactive tipoStands:', error);
    }
  };

  const handleShowModal = (tipoStand = null) => {
    setEditingTipoStand(tipoStand);
    setNewTipoStand(tipoStand || { tipo: '', descripcion: '', estado: 1 });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTipoStand(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTipoStand({ ...newTipoStand, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTipoStand) {
        await axios.put(`http://localhost:5000/tipo_stands/${editingTipoStand.idTipoStands}`, newTipoStand);
        setAlertMessage('Tipo de stand actualizado con éxito');
      } else {
        await axios.post('http://localhost:5000/tipo_stands', newTipoStand);
        setAlertMessage('Tipo de stand creado con éxito');
      }
      filter === 'activos' ? fetchActiveTipoStands() : fetchInactiveTipoStands();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting tipo de stand:', error);
    }
  };

  const toggleTipoStandEstado = async (id, currentEstado) => {
    try {
      const newEstado = currentEstado === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/tipo_stands/${id}`, { estado: newEstado });
      setAlertMessage(`Tipo de stand ${newEstado === 1 ? 'activado' : 'desactivado'} con éxito`);
      setShowAlert(true);
      filter === 'activos' ? fetchActiveTipoStands() : fetchInactiveTipoStands();
    } catch (error) {
      console.error('Error toggling estado of tipo de stand:', error);
    }
  };

  return (
    <>
      <div className="row" style={{ textAlign: "center", marginBottom: "20px" }}>
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
            Gestión de Tipos de Stands
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
            backgroundColor: "#007abf",
            borderColor: "#007AC3",
            padding: "5px 10px",
            width: "180px",
            marginRight: "10px",
            fontWeight: "bold",
            color: "#fff",
          }}
          onClick={() => handleShowModal()}
        >
          Agregar Tipo de Stand
        </Button>
        <Button
          style={{
            backgroundColor: "#009B85",
            borderColor: "#007AC3",
            padding: "5px 10px",
            width: "100px",
            marginRight: "10px",
            fontWeight: "bold",
            color: "#fff",
          }}
          onClick={fetchActiveTipoStands}
        >
          Activos
        </Button>
        <Button
          style={{
            backgroundColor: "#bf2200",
            borderColor: "#007AC3",
            padding: "5px 10px",
            width: "100px",
            fontWeight: "bold",
            color: "#fff",
          }}
          onClick={fetchInactiveTipoStands}
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
            borderRadius: "20px",
            overflow: "hidden",
            marginTop: "20px",
          }}
        >
          <thead style={{ backgroundColor: "#007AC3", color: "#fff",  textAlign: "center"  }}>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center" }}>
            {tipoStands.map((tipoStand) => (
              <tr key={tipoStand.idTipoStands}>
                <td>{tipoStand.idTipoStands}</td>
                <td>{tipoStand.tipo}</td>
                <td>{tipoStand.descripcion}</td>
                <td>{tipoStand.estado ? "Activo" : "Inactivo"}</td>
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
                    onClick={() => handleShowModal(tipoStand)}
                  >
                    Editar
                  </Button>
                  <Button
                    style={{
                      backgroundColor: tipoStand.estado ? "#6c757d" : "#28a745",
                      borderColor: tipoStand.estado ? "#6c757d" : "#28a745",
                      padding: "5px 10px",
                      width: "100px",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                    onClick={() => toggleTipoStandEstado(tipoStand.idTipoStands, tipoStand.estado)}
                  >
                    {tipoStand.estado ? "Desactivar" : "Activar"}
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
              {editingTipoStand ? "Editar Tipo de Stand" : "Agregar Tipo de Stand"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="tipo">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Tipo
                </Form.Label>
                <Form.Control
                  type="text"
                  name="tipo"
                  value={newTipoStand.tipo}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="descripcion">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Descripción
                </Form.Label>
                <Form.Control
                  type="text"
                  name="descripcion"
                  value={newTipoStand.descripcion}
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
                  value={newTipoStand.estado}
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
                {editingTipoStand ? "Actualizar" : "Crear"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default TipoStandsComponent;
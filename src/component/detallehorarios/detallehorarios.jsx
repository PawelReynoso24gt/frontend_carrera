import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert } from 'react-bootstrap';

function DetalleHorariosComponent() {
  const [detalles, setDetalles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDetalle, setEditingDetalle] = useState(null);
  const [newDetalle, setNewDetalle] = useState({ cantidadPersonas: '', idHorario: '', idCategoriaHorario: '', estado: 1 });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [filter, setFilter] = useState('activos');
    const [showPermissionModal, setShowPermissionModal] = useState(false); // Nuevo estado
    const [permissionMessage, setPermissionMessage] = useState('');
    const [permissions, setPermissions] = useState({});

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/usuarios/permisos', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Ajusta según dónde guardes el token
          },
        });
        setPermissions(response.data.permisos || {});
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };
  
    fetchPermissions();
    fetchDetalleHorarios();
  }, []);


  const checkPermission = (permission, message) => {
    if (!permissions[permission]) {
      setPermissionMessage(message);
      setShowPermissionModal(true);
      return false;
    }
    return true;
  };
  
 const fetchDetalleHorarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/detalle_horarios");
      setDetalles(response.data);
      setFilter(response.data);
    } catch (error) {
      console.error("Error fetching detalle de horarios:", error);
    }
  };

  const fetchActiveDetalles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/detalle_horarios/activos');
      setDetalles(response.data);
      setFilter('activos');
    } catch (error) {
      console.error('Error fetching active detalles:', error);
    }
  };

  const fetchInactiveDetalles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/detalle_horarios/inactivos');
      setDetalles(response.data);
      setFilter('inactivos');
    } catch (error) {
      console.error('Error fetching active detalles:', error);
    }
  };

  const handleShowModal = (detalle = null) => {
    setEditingDetalle(detalle);
    setNewDetalle(detalle || { cantidadPersonas: '', idHorario: '', idCategoriaHorario: '', estado: 1 });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDetalle(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDetalle({ ...newDetalle, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDetalle) {
        await axios.put(`http://localhost:5000/detalle_horarios/${editingDetalle.idDetalleHorario}`, newDetalle);
        setAlertMessage('Detalle de horario actualizado con éxito');
      } else {
        await axios.post('http://localhost:5000/detalle_horarios', newDetalle);
        setAlertMessage('Detalle de horario creado con éxito');
      }
      filter === 'activos' ? fetchActiveDetalles() : fetchInactiveDetalles();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting detalle de horario:', error);
    }
  };

  const toggleDetalleEstado = async (id, currentEstado) => {
    try {
      const newEstado = currentEstado === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/detalle_horarios/${id}`, { estado: newEstado });
      setAlertMessage(`Detalle de horario ${newEstado === 1 ? 'activado' : 'desactivado'} con éxito`);
      setShowAlert(true);
      filter === 'activos' ? fetchActiveDetalles() : fetchInactiveDetalles();
    } catch (error) {
      console.error('Error toggling estado of detalle de horario:', error);
    }
  };

  return (
    <>
      <div className="row" style={{ textAlign: "center", marginBottom: "20px" }}>
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
            Gestión de Detalles de Horarios
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
            width: "220px",
            marginRight: "10px",
            fontWeight: "bold",
            color: "#fff",
          }}
          onClick={() => {
            if (checkPermission('Crear detalle horario', 'No tienes permisos para crear detalle horario')) {
              handleShowModal();
            }
          }}
        >
          Agregar Detalle de Horario
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
          onClick={fetchActiveDetalles}
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
          onClick={fetchInactiveDetalles}
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
              <th>Cantidad de Personas</th>
              <th>ID Horario</th>
              <th>ID Categoría Horario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {detalles.map((detalle) => (
              <tr key={detalle.idDetalleHorario}>
                <td>{detalle.idDetalleHorario}</td>
                <td>{detalle.cantidadPersonas}</td>
                <td>{detalle.idHorario}</td>
                <td>{detalle.idCategoriaHorario}</td>
                <td>{detalle.estado ? "Activo" : "Inactivo"}</td>
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
                    onClick={() => {
                      if (checkPermission('Editar detalle horario', 'No tienes permisos para editar detalle horario')) {
                        handleShowModal(detalle);
                      }
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    style={{
                      backgroundColor: detalle.estado ? "#6c757d" : "#28a745",
                      borderColor: detalle.estado ? "#6c757d" : "#28a745",
                      padding: "5px 10px",
                      width: "100px",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                    onClick={() => {
                      const actionPermission = detalle.estado ? 'Desactivar detalle horario' : 'Activar detalle horario';
                      const actionMessage = detalle.estado
                        ? 'No tienes permisos para desactivar detalle horario'
                        : 'No tienes permisos para activar detalle horario';
  
                      if (checkPermission(actionPermission, actionMessage)) {
                        toggleDetalleEstado(detalle.idDetalleHorario, detalle.estado);
                      }
                    }}
                  >
                    {detalle.estado ? "Desactivar" : "Activar"}
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
              {editingDetalle ? "Editar Detalle de Horario" : "Agregar Detalle de Horario"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="cantidadPersonas">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Cantidad de Personas
                </Form.Label>
                <Form.Control
                  type="number"
                  name="cantidadPersonas"
                  value={newDetalle.cantidadPersonas}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idHorario">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  ID Horario
                </Form.Label>
                <Form.Control
                  type="number"
                  name="idHorario"
                  value={newDetalle.idHorario}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idCategoriaHorario">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  ID Categoría Horario
                </Form.Label>
                <Form.Control
                  type="number"
                  name="idCategoriaHorario"
                  value={newDetalle.idCategoriaHorario}
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
                  value={newDetalle.estado}
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
                {editingDetalle ? "Actualizar" : "Crear"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
            <Modal show={showPermissionModal} onHide={() => setShowPermissionModal(false)}>
                 <Modal.Header closeButton>
                  <Modal.Title>Permiso Denegado</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>{permissionMessage}</Modal.Body>
                  <Modal.Footer>
                  <Button variant="primary" onClick={() => setShowPermissionModal(false)}>
                    Aceptar
                  </Button>
                 </Modal.Footer>
               </Modal>
      </div>
    </>
  );
}

export default DetalleHorariosComponent;
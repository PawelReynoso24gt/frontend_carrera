import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert } from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";

function HorariosComponent() {
  const [horarios, setHorarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingHorario, setEditingHorario] = useState(null);
  const [newHorario, setNewHorario] = useState({
    horarioInicio: "",
    horarioFinal: "",
    estado: 1,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [filter, setFilter] = useState("activos");
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
    fetchActiveHorarios();
  }, []);

  const checkPermission = (permission, message) => {
    if (!permissions[permission]) {
      setPermissionMessage(message);
      setShowPermissionModal(true);
      return false;
    }
    return true;
  };

  const fetchActiveHorarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/horarios/activos");
      setHorarios(formatDates(response.data));
      setFilter("activos");
    } catch (error) {
      console.error("Error fetching active horarios:", error);
    }
  };

  const fetchInactiveHorarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/horarios");
      // Filtrar horarios con estado 0
      const inactiveHorarios = response.data.filter((horario) => horario.estado === 0);
      setHorarios(formatDates(inactiveHorarios));
      setFilter("inactivos");
    } catch (error) {
      console.error("Error fetching inactive horarios:", error);
    }
  };  

  const formatDates = (data) => {
    return data.map((item) => ({
      ...item,
      horarioInicio: item.horarioInicio.replace("T", " ").split(".")[0],
      horarioFinal: item.horarioFinal.replace("T", " ").split(".")[0],
    }));
  };

  const handleShowModal = (horario = null) => {
    setEditingHorario(horario);
    setNewHorario(
      horario || {
        horarioInicio: "",
        horarioFinal: "",
        estado: 1,
      }
    );
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
      // Convertimos los valores de horarioInicio y horarioFinal al formato requerido
      const formattedHorario = {
        ...newHorario,
        horarioInicio: new Date(newHorario.horarioInicio).toISOString().replace("T", " ").split(".")[0],
        horarioFinal: new Date(newHorario.horarioFinal).toISOString().replace("T", " ").split(".")[0],
      };

      if (editingHorario) {
        await axios.put(`http://localhost:5000/horarios/${editingHorario.idHorario}`, formattedHorario);
        setAlertMessage("Horario actualizado con éxito");
      } else {
        await axios.post("http://localhost:5000/horarios", formattedHorario);
        setAlertMessage("Horario creado con éxito");
      }
      filter === "activos" ? fetchActiveHorarios() : fetchInactiveHorarios();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting horario:", error.response?.data || error);
    }
  };

  const toggleHorarioEstado = async (id, currentEstado) => {
    try {
      const newEstado = currentEstado === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/horarios/${id}`, { estado: newEstado });
      setAlertMessage(`Horario ${newEstado === 1 ? "activado" : "desactivado"} con éxito`);
      setShowAlert(true);
      filter === "activos" ? fetchActiveHorarios() : fetchInactiveHorarios();
    } catch (error) {
      console.error("Error toggling estado of horario:", error);
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
        <div className="d-flex justify-content-start mb-3">
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
            onClick={() => {
              if (checkPermission('Crear horario', 'No tienes permisos para crear horario')) {
                handleShowModal();
              }
            }}
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
        </div>

        <Alert
          variant="success"
          show={showAlert}
          onClose={() => setShowAlert(false)}
          dismissible
          style={{ marginTop: "20px", fontWeight: "bold" }}
        >
          {alertMessage}
        </Alert>

        <Table striped bordered hover responsive>
          <thead style={{ backgroundColor: "#007AC3", color: "#fff" }}>
            <tr>
              <th style={{ textAlign: "center" }}>ID</th>
              <th style={{ textAlign: "center" }}>Horario Inicio</th>
              <th style={{ textAlign: "center" }}>Horario Final</th>
              <th style={{ textAlign: "center" }}>Estado</th>
              <th style={{ textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {horarios.map((horario) => (
              <tr key={horario.idHorario}>
                <td style={{ textAlign: "center" }}>{horario.idHorario}</td>
                <td style={{ textAlign: "center" }}>{horario.horarioInicio}</td>
                <td style={{ textAlign: "center" }}>{horario.horarioFinal}</td>
                <td style={{ textAlign: "center" }}>{horario.estado ? "Activo" : "Inactivo"}</td>
                <td style={{ textAlign: "center" }}>
                  <FaPencilAlt
                    style={{
                      color: "#007AC3",
                      cursor: "pointer",
                      marginRight: "10px",
                      fontSize: "20px",
                    }}
                    title="Editar"
                    onClick={() => {
                      if (checkPermission('Editar horario', 'No tienes permisos para editar horario')) {
                        handleShowModal(horario);
                      }
                    }}
                  />
                  {horario.estado ? (
                    <FaToggleOn
                      style={{
                        color: "#30c10c",
                        cursor: "pointer",
                        fontSize: "20px",
                      }}
                      title="Inactivar"
                      onClick={() => {
                        if (checkPermission('Desactivar horario', 'No tienes permisos para desactivar horario')) {
                          toggleHorarioEstado(horario.idHorario, horario.estado);
                        }
                      }}
                    />
                  ) : (
                    <FaToggleOff
                      style={{
                        color: "#e10f0f",
                        cursor: "pointer",
                        fontSize: "20px",
                      }}
                      title="Activar"
                      onClick={() => {
                        if (checkPermission('Activar horario', 'No tienes permisos para activar horario')) {
                          toggleHorarioEstado(horario.idHorario, horario.estado);
                        }
                      }}
                    />
                  )}
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
                <Form.Label>Horario Inicio</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="horarioInicio"
                  value={newHorario.horarioInicio}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="horarioFinal">
                <Form.Label>Horario Final</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="horarioFinal"
                  value={newHorario.horarioFinal}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
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
                type="submit"
                style={{
                  backgroundColor: "#007AC3",
                  color: "#fff",
                  width: "100%",
                  fontWeight: "bold",
                }}
              >
                {editingHorario ? "Actualizar" : "Crear"}
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

export default HorariosComponent;

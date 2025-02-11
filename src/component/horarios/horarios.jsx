import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert } from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { format } from "date-fns";
import { parseISO, parse } from "date-fns";

function HorariosComponent() {
  const [horarios, setHorarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filteredHorarios, setFilteredHorarios] = useState([]);
  const [editingHorario, setEditingHorario] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
  const [hasViewPermission, setHasViewPermission] = useState(false);
  const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get('https://api.voluntariadoayuvi.com/usuarios/permisos', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Ajusta según dónde guardes el token

          },
        });
        setPermissions(response.data.permisos || {});

        const hasPermission =
          response.data.permisos['Ver horarios']

        setHasViewPermission(hasPermission);
        setIsPermissionsLoaded(true);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermissions();
  }, []);

  useEffect(() => {
    if (isPermissionsLoaded) {
      if (hasViewPermission) {
        fetchActiveHorarios();
      } else {
        checkPermission('Ver horarios', 'No tienes permisos para ver horarios');
      }
    }
  }, [isPermissionsLoaded, hasViewPermission]);

  const checkPermission = (permission, message) => {
    if (!permissions[permission]) {
      setPermissionMessage(message);
      setShowPermissionModal(true);
      return false;
    }
    return true;
  };

  const validateHorario = (horarioInicio, horarioFinal) => {
    if (horarioInicio >= horarioFinal) {
      return "El horario de inicio no puede ser mayor o igual al horario final.";
    }
    return null; // No hay errores
  };

  const fetchActiveHorarios = async () => {
    try {
      if (hasViewPermission) {
        const response = await axios.get("https://api.voluntariadoayuvi.com/horarios/activos");
        setHorarios(formatDates(response.data));
        setFilter("activos");
      } else {
        checkPermission('Ver horarios', 'No tienes permisos para ver horarios')
      }
    } catch (error) {
      console.error("Error fetching active horarios:", error);
    }
  };

  const fetchInactiveHorarios = async () => {
    try {
      if (hasViewPermission) {
        const response = await axios.get("https://api.voluntariadoayuvi.com/horarios");
        //console.log(response.data);
        // Filtrar horarios con estado 0
        const inactiveHorarios = response.data.filter((horario) => horario.estado === 0);
        setHorarios(formatDates(inactiveHorarios));
        setFilter("inactivos");
      } else {
        checkPermission('Ver horarios', 'No tienes permisos para ver horarios')
      }
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
    setNewHorario((prev) => {
      const updatedHorario = { ...prev, [name]: value };
      //console.log("Nuevo estado de newHorario:", updatedHorario); // <-- Aquí
      return updatedHorario;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que el horario de inicio no sea mayor o igual al horario final
    const validationError = validateHorario(newHorario.horarioInicio, newHorario.horarioFinal);
    if (validationError) {
      setAlertMessage(validationError); // Mostrar mensaje de error
      setShowAlert(true);
      return; // Detener la ejecución
    }

    try {
      const [startHour, startMinute] = newHorario.horarioInicio.split(":");
      const [finalHour, finalMinute] = newHorario.horarioFinal.split(":");

      // Construir el formato "HH:mm:ss"
      const formattedInicio = `${startHour}:${startMinute}:00`;
      const formattedFinal = `${finalHour}:${finalMinute}:00`;

      const formattedHorario = {
        ...newHorario,
        horarioInicio: formattedInicio,
        horarioFinal: formattedFinal,
      };

      //console.log("Datos que se enviarán al backend:", formattedHorario);

      if (editingHorario) {
        //console.log("Modo: Editar horario. ID:", editingHorario.idHorario);
        await axios.put(`https://api.voluntariadoayuvi.com/horarios/${editingHorario.idHorario}`, formattedHorario);
        setAlertMessage("Horario actualizado con éxito");
      } else {
        //console.log("Modo: Crear horario");
        await axios.post("https://api.voluntariadoayuvi.com/horarios", formattedHorario);
        setAlertMessage("Horario creado con éxito");
      }

      filter === "activos" ? fetchActiveHorarios() : fetchInactiveHorarios();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting horario:", error.response?.data || error);
      setAlertMessage("Error al procesar la solicitud");
      setShowAlert(true);
    }
  };

  const toggleHorarioEstado = async (id, currentEstado) => {
    try {
      const newEstado = currentEstado === 1 ? 0 : 1;
      await axios.put(`https://api.voluntariadoayuvi.com/horarios/${id}`, { estado: newEstado });
      setAlertMessage(`Horario ${newEstado === 1 ? "activado" : "desactivado"} con éxito`);
      setShowAlert(true);
      filter === "activos" ? fetchActiveHorarios() : fetchInactiveHorarios();
    } catch (error) {
      console.error("Error toggling estado of horario:", error);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentHorarios = filteredHorarios.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredHorarios.length / rowsPerPage);

  const renderPagination = () => (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (currentPage > 1) setCurrentPage((prev) => prev - 1);
        }}
        style={{
          color: currentPage === 1 ? "gray" : "#007AC3",
          cursor: currentPage === 1 ? "default" : "pointer",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Anterior
      </a>

      <div className="d-flex align-items-center">
        <span style={{ marginRight: "10px", fontWeight: "bold" }}>Filas</span>
        <Form.Control
          as="select"
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          style={{
            width: "100px",
            height: "40px",
          }}
        >
          {[5, 10, 20, 50].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Form.Control>
      </div>

      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
        }}
        style={{
          color: currentPage === totalPages ? "gray" : "#007AC3",
          cursor: currentPage === totalPages ? "default" : "pointer",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Siguiente
      </a>
    </div>
  );


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
          maxWidth: "100%",
          margin: "0 auto",
        }}
      >
        <div className="d-flex justify-content-start mb-3">
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
              backgroundColor: "#009B85",
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
              backgroundColor: "#bf2200",
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

        <Table striped bordered hover responsive
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            overflow: "hidden",
            marginTop: "20px",
          }}>
          <thead
            style={{ backgroundColor: "#007AC3", color: "#fff" }}>
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
                <td style={{ textAlign: "center" }}>
                  {horario.horarioInicio
                    ? format(parse(horario.horarioInicio, "HH:mm:ss", new Date()), "hh:mm a")
                    : "Sin fecha"}
                </td>
                <td style={{ textAlign: "center" }}>
                  {horario.horarioFinal
                    ? format(parse(horario.horarioFinal, "HH:mm:ss", new Date()), "hh:mm a")
                    : "Sin fecha"}
                </td>
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

        {renderPagination()}

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
                  type="time"
                  name="horarioInicio"
                  value={newHorario.horarioInicio}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="horarioFinal">
                <Form.Label>Horario Final</Form.Label>
                <Form.Control
                  type="time"
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

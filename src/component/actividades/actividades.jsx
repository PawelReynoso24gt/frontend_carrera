import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl } from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";

function Actividades() {
  const [actividades, setActividades] = useState([]);
  const [filteredActividades, setFilteredActividades] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [comisiones, setComisiones] = useState([]);
  const [eventos, setEventos] = useState([]); // Estado para almacenar los eventos
  const [selectedEvento, setSelectedEvento] = useState(null); // Estado para el evento seleccionado
  const [comisionesPorEvento, setComisionesPorEvento] = useState([]); // Estado para almacenar las comisiones por evento
  const [showModal, setShowModal] = useState(false);
  const [editingActividad, setEditingActividad] = useState(null);
  const [newActividad, setNewActividad] = useState({
    actividad: "",
    descripcion: "",
    estado: 1,
    idComision: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showValidationError, setShowValidationError] = useState(false);
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
          response.data.permisos['Ver actividades']

        setHasViewPermission(hasPermission);
        setIsPermissionsLoaded(true);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermissions();
    fetchComisiones();
  }, []);

  useEffect(() => {
    if (isPermissionsLoaded) {
      if (hasViewPermission) {
        fetchActividades();
      } else {
        checkPermission('Ver actividades', 'No tienes permisos para ver actividades');
      }
    }
  }, [isPermissionsLoaded, hasViewPermission]);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get("https://api.voluntariadoayuvi.com/eventos");
        setEventos(response.data);
      } catch (error) {
        console.error("Error fetching eventos:", error);
      }
    };

    fetchEventos();
  }, []);

  const checkPermission = (permission, message) => {
    if (!permissions[permission]) {
      setPermissionMessage(message);
      setShowPermissionModal(true);
      return false;
    }
    return true;
  };

  const fetchComisionesPorEvento = async (eventoId) => {
    try {
      setComisionesPorEvento([]); // Resetear las comisiones antes de hacer la solicitud
      const response = await axios.get("https://api.voluntariadoayuvi.com/comisiones/poreventoFr", {
        params: { eventoId }
      });
      setComisionesPorEvento(response.data);
    } catch (error) {
      console.error("Error fetching comisiones por evento:", error);
      setComisionesPorEvento([]); // Asegurarse de que no haya comisiones en caso de error
    }
  };

  const fetchActividades = async () => {
    try {
      const response = await axios.get("https://api.voluntariadoayuvi.com/actividades");
      setActividades(response.data);
      setFilteredActividades(response.data);
    } catch (error) {
      console.error("Error fetching actividades:", error);
    }
  };

  const fetchComisiones = async () => {
    try {
      const response = await axios.get("https://api.voluntariadoayuvi.com/comisiones");
      setComisiones(response.data);
    } catch (error) {
      console.error("Error fetching comisiones:", error);
    }
  };

  const fetchActiveActividades = async () => {
    try {
      if (hasViewPermission) {
        const response = await axios.get("https://api.voluntariadoayuvi.com/actividades/activos");
        setFilteredActividades(response.data);
      } else {
        checkPermission('Ver actividades', 'No tienes permisos para ver actividades')
      }
    } catch (error) {
      console.error("Error fetching active actividades:", error);
    }
  };

  const fetchInactiveActividades = async () => {
    try {
      if (hasViewPermission) {
        const response = await axios.get("https://api.voluntariadoayuvi.com/actividades/inactivos");
        setFilteredActividades(response.data);
      } else {
        checkPermission('Ver actividades', 'No tienes permisos para ver actividades')
      }
    } catch (error) {
      console.error("Error fetching inactive actividades:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = actividades.filter((actividad) =>
      actividad.actividad.toLowerCase().includes(value) ||
      actividad.descripcion.toLowerCase().includes(value)
    );

    setFilteredActividades(filtered);
    setCurrentPage(1);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingActividad(null);
    setSelectedEvento(null); // Resetear el evento seleccionado
    setComisionesPorEvento([]); // Resetear las comisiones
  };

  const handleShowModal = async (actividad = null) => {
    setEditingActividad(actividad);

    if (actividad) {
      //console.log("Actividad seleccionada para editar:", actividad);

      // Usar directamente el idEvento de la comisión asociada a la actividad
      const idEvento = actividad.comision.idEvento;
      //console.log("ID del evento asociado a la actividad:", idEvento);

      // Guardar solo el idEvento (sin buscar en la lista de eventos)
      setSelectedEvento({ idEvento });

      // Cargar las comisiones asociadas al evento
      await fetchComisionesPorEvento(idEvento);
    } else {
      // Si es una nueva actividad, resetear el evento seleccionado y las comisiones
      setSelectedEvento(null);
      setComisionesPorEvento([]);
    }

    // Establecer los datos de la actividad en el formulario
    setNewActividad(
      actividad || {
        actividad: "",
        descripcion: "",
        estado: 1,
        idComision: "",
        idEvento: "",
      }
    );

    setShowModal(true);
    setShowValidationError(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "actividad") {
      const regexActividad = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
      if (!regexActividad.test(value)) {
        setShowValidationError(true);
      } else {
        setShowValidationError(false);
      }
    }

    setNewActividad({ ...newActividad, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...newActividad,
        estado: parseInt(newActividad.estado, 10),
        idComision: parseInt(newActividad.idComision, 10),
      };

      if (editingActividad) {
        await axios.put(
          `https://api.voluntariadoayuvi.com/actividades/update/${editingActividad.idActividad}`,
          data
        );
        setAlertMessage("Actividad actualizada con éxito");
      } else {
        await axios.post("https://api.voluntariadoayuvi.com/actividades/create", data);
        setAlertMessage("Actividad creada con éxito");
      }
      fetchActividades();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting actividad:", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`https://api.voluntariadoayuvi.com/actividades/update/${id}`, { estado: nuevoEstado });
      fetchActividades();
      setAlertMessage(
        `Actividad ${nuevoEstado === 1 ? "activada" : "inactivada"} con éxito`
      );
      setShowAlert(true);
    } catch (error) {
      console.error("Error toggling estado:", error);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentActividades = filteredActividades.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredActividades.length / rowsPerPage);

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
            Gestión de Actividades
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
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar actividad por nombre o descripción..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>

        <div className="d-flex justify-content-start align-items-center mb-3">
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
              if (checkPermission('Crear actividad', 'No tienes permisos para crear actividad')) {
                handleShowModal();
              }
            }}
          >
            Agregar Actividad
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
            onClick={fetchActiveActividades}
          >
            Activas
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
            onClick={fetchInactiveActividades}
          >
            Inactivas
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
          <thead style={{ backgroundColor: "#007AC3", color: "#fff", textAlign: "center" }}>
            <tr>
              <th>ID</th>
              <th>Actividad</th>
              <th>Descripción</th>
              <th>Comisión</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center" }}>
            {currentActividades.map((actividad) => (
              <tr key={actividad.idActividad}>
                <td>{actividad.idActividad}</td>
                <td>{actividad.actividad}</td>
                <td>{actividad.descripcion}</td>
                <td>
                  {comisiones.find((comision) => comision.idComision === actividad.idComision)?.comision ||
                    "Sin Comisión"}
                </td>
                <td>{actividad.estado === 1 ? "Activo" : "Inactivo"}</td>
                <td>
                  <FaPencilAlt
                    style={{
                      color: "#007AC3",
                      cursor: "pointer",
                      marginRight: "10px",
                      fontSize: "20px",
                    }}
                    title="Editar"
                    onClick={() => {
                      if (checkPermission('Editar actividad', 'No tienes permisos para editar actividad')) {
                        handleShowModal(actividad);
                      }
                    }}
                  />
                  {actividad.estado ? (
                    <FaToggleOn
                      style={{
                        color: "#30c10c",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Inactivar"
                      onClick={() => {
                        if (checkPermission('Desactivar actividad', 'No tienes permisos para desactivar actividad')) {
                          toggleEstado(actividad.idActividad, actividad.estado);
                        }
                      }}
                    />
                  ) : (
                    <FaToggleOff
                      style={{
                        color: "#e10f0f",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Activar"
                      onClick={() => {
                        if (checkPermission('Activar actividad', 'No tienes permisos para activar actividad')) {
                          toggleEstado(actividad.idActividad, actividad.estado);
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
              {editingActividad ? "Editar Actividad" : "Agregar Actividad"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="actividad">
                <Form.Label>Actividad</Form.Label>
                <Form.Control
                  type="text"
                  name="actividad"
                  value={newActividad.actividad}
                  onChange={handleChange}
                  required
                />
                {showValidationError && (
                  <Alert variant="danger" style={{ marginTop: "10px", fontWeight: "bold" }}>
                    El nombre de la actividad solo puede contener letras y espacios.
                  </Alert>
                )}
              </Form.Group>
              <Form.Group controlId="descripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  name="descripcion"
                  value={newActividad.descripcion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="evento">
                <Form.Label>Evento</Form.Label>
                <Form.Control
                  as="select"
                  name="evento"
                  value={selectedEvento ? selectedEvento.idEvento : ""}
                  onChange={(e) => {
                    const eventoId = e.target.value;
                    const eventoSeleccionado = eventos.find((evento) => evento.idEvento === parseInt(eventoId));
                    setSelectedEvento(eventoSeleccionado);
                    fetchComisionesPorEvento(eventoId);
                  }}
                  required
                >
                  <option value="">Seleccionar Evento</option>
                  {eventos.map((evento) => (
                    <option key={evento.idEvento} value={evento.idEvento}>
                      {evento.nombreEvento}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="comision">
                <Form.Label>Comisión</Form.Label>
                {comisionesPorEvento.length > 0 ? (
                  <Form.Control
                    as="select"
                    name="idComision"
                    value={newActividad.idComision}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar Comisión</option>
                    {comisionesPorEvento.map((comision) => (
                      <option key={comision.idComision} value={comision.idComision}>
                        {comision.comision}
                      </option>
                    ))}
                  </Form.Control>
                ) : (
                  <Alert variant="info" style={{ marginTop: "10px", fontWeight: "bold" }}>
                    No hay comisiones disponibles para este evento.
                  </Alert>
                )}
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newActividad.estado}
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
                {editingActividad ? "Actualizar" : "Crear"}
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

export default Actividades;

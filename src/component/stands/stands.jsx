import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl } from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff, FaEye } from "react-icons/fa";
import { getUserDataFromToken } from "../../utils/jwtUtils"; // token
import { format, parseISO } from "date-fns";

function Stand() {
  const [stands, setStands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingStand, setEditingStand] = useState(null);
  const [newStand, setNewStand] = useState({
    nombreStand: "",
    direccion: "",
    estado: 1,
    idSede: "",
    idTipoStands: "",
    idEvento: "",
    fechaInicio: "",
    fechaFinal: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [sedes, setSedes] = useState([]);
  const [tiposStands, setTiposStands] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [showPermissionModal, setShowPermissionModal] = useState(false); // Nuevo estado
  const [permissionMessage, setPermissionMessage] = useState('');
  const [permissions, setPermissions] = useState({});
  const [selectedHorarios, setSelectedHorarios] = useState([]);
  const [availableHorarios, setAvailableHorarios] = useState([]); // Lista de horarios disponibles
  const [standHorarios, setStandHorarios] = useState([]); // Para almacenar horarios del stand
  const [showDetailsModal, setShowDetailsModal] = useState(false); // Controla la visibilidad del modal
  const [hasViewPermission, setHasViewPermission] = useState(false);
  const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);


  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/usuarios/permisos', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Ajusta según dónde guardes el token
          },
        });
        setPermissions(response.data.permisos || {});

        const hasPermission =
        response.data.permisos['Ver stands']

      setHasViewPermission(hasPermission);
      setIsPermissionsLoaded(true);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermissions();
    fetchSedes();
    fetchTiposStands();
    fetchEventos();
    fetchHorarios();
  }, []);

  useEffect(() => {
      if (isPermissionsLoaded) {
        if (hasViewPermission) {
          fetchStands();
        } else {
          checkPermission('Ver stands', 'No tienes permisos para ver stands');
        }
      }
    }, [isPermissionsLoaded, hasViewPermission]);

  const idUsuario = getUserDataFromToken(localStorage.getItem("token"))?.idUsuario; //! usuario del token

  const checkPermission = (permission, message) => {
    if (!permissions[permission]) {
      setPermissionMessage(message);
      setShowPermissionModal(true);
      return false;
    }
    return true;
  };

  const fetchHorarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/detalle_horarios/activos");

      // Filtrar horarios cuya categoría sea "Stands"
      const horariosFiltrados = response.data.filter(
        (horario) => horario.categoriaHorario.categoria === "Stands"
      );

      setAvailableHorarios(horariosFiltrados);
    } catch (error) {
      console.error("Error fetching horarios:", error.response?.data || error.message);
    }
  };

  const fetchStands = async () => {
    try {
      const response = await axios.get("http://localhost:5000/stand");
      setStands(response.data);
    } catch (error) {
      console.error("Error fetching stands:", error);
    }
  };

  const fetchSedes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/sedes");
      setSedes(response.data);
    } catch (error) {
      console.error("Error fetching sedes:", error);
    }
  };

  const fetchTiposStands = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tipo_stands");
      setTiposStands(response.data);
    } catch (error) {
      console.error("Error fetching tipos de stands:", error);
    }
  };

  const fetchEventos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/eventos/activas");
      setEventos(response.data);
    } catch (error) {
      console.error("Error fetching eventos:", error);
    }
  };

  const handleShowDetailsModal = async (idStand) => {
    if (!idStand) return;

    try {
      const response = await axios.get(`http://localhost:5000/standHorario/${idStand}`);
      setStandHorarios(response.data); // Guardar los horarios del stand
      setShowDetailsModal(true); // Mostrar el modal
    } catch (error) {
      console.error("Error fetching stand horarios:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  };

  const filteredStands = stands.filter((stand) =>
    stand.nombreStand?.toLowerCase().includes(searchTerm)
  );

  const handleShowModal = async (stand = null) => {
    setEditingStand(stand);
    setSelectedHorarios([]); // Reiniciar horarios seleccionados por defecto

    if (stand) {
      try {
        // Obtener horarios asociados al stand
        const response = await axios.get(`http://localhost:5000/standHorario/${stand.idStand}`);
        setSelectedHorarios(response.data.map((h) => h.idDetalleHorario)); // Extraer IDs de horarios asociados
      } catch (error) {
        console.error("Error fetching stand horarios:", error);
      }
    }

    setNewStand(
      stand || {
        nombreStand: "",
        direccion: "",
        estado: 1,
        idSede: "",
        idTipoStands: "",
        idEvento: "",
        fechaInicio: "",
        fechaFinal: "",
      }
    );
    setShowModal(true);
  };


  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStand(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStand({ ...newStand, [name]: value });
  };

  const logBitacora = async (descripcion, idCategoriaBitacora) => {
    const bitacoraData = {
      descripcion,
      idCategoriaBitacora,
      idUsuario,
      fechaHora: new Date()
    };

    try {
      await axios.post("http://localhost:5000/bitacora/create", bitacoraData);
    } catch (error) {
      console.error("Error logging bitacora:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const standData = {
        nombreStand: newStand.nombreStand,
        direccion: newStand.direccion,
        estado: newStand.estado,
        idSede: newStand.idSede,
        idTipoStands: newStand.idTipoStands,
        idEvento: newStand.idEvento,
        fechaInicio: newStand.fechaInicio,
        fechaFinal: newStand.fechaFinal,
      };

      const horarios = selectedHorarios.map((idDetalleHorario) => ({
        idDetalleHorario,
      }));

      if (editingStand) {
        await axios.put(`http://localhost:5000/stand/update/${editingStand.idStand}`, {
          standData,
          horarios,
        });
        setAlertMessage("Stand actualizado con éxito");
        await logBitacora(`Stand ${newStand.nombreStand} actualizado`, 17);
      } else {
        await axios.post("http://localhost:5000/stand/createHorarios", {
          standData,
          horarios,
        });
        setAlertMessage("Stand creado con éxito");
        await logBitacora(`Stand ${newStand.nombreStand} creado`, 13);
      }

      fetchStands();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting stand:", error);
    }
  };


  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/stand/update/${id}`, {
        estado: nuevoEstado,
      });
      fetchStands();
      setAlertMessage(
        `Stand ${nuevoEstado === 1 ? "activado" : "inactivado"} con éxito`
      );
      setShowAlert(true);
    } catch (error) {
      console.error("Error toggling estado:", error);
    }
  };

  const fetchActiveStands = async () => {
    try {
      if (hasViewPermission) {
      const response = await axios.get("http://localhost:5000/stand/activas");
      const data = Array.isArray(response.data) ? response.data : []; // Validación
      setStands(data);
    } else {
      checkPermission('Ver stands', 'No tienes permisos para ver stands')
    }
    } catch (error) {
      console.error("Error fetching active stands:", error);
      setStands([]); // Respaldo en caso de error
    }
  };

  const fetchInactiveStands = async () => {
    try {
      if (hasViewPermission) {
      const response = await axios.get("http://localhost:5000/stand/inactivas");
      const data = Array.isArray(response.data) ? response.data : []; // Validación
      setStands(data);
    } else {
      checkPermission('Ver stands', 'No tienes permisos para ver stands')
    }
    } catch (error) {
      console.error("Error fetching inactive stands:", error);
      setStands([]); // Respaldo en caso de error
    }
  };


  // Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentStands = stands.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(stands.length / rowsPerPage);

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

  const currentFilteredStands = filteredStands.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <>
      <div className="row justify-content-center" style={{marginBottom: "20px" }}>
        <div className="col-12 text-center">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333", textAlign: "center" }}>
            Gestión de Stands
          </h3>
        </div>
      </div>


      {/* Barra de búsqueda */}
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Buscar stand..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </InputGroup>

      <div
        className="container mt-4"
        style={{
          maxWidth: "100%",
          margin: "0 auto",
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="d-flex justify-content-start align-items-center mb-3">
          <Button
            style={{
              backgroundColor: "#007abf",
              borderColor: "#007AC3",
              padding: "5px 10px",
              width: "130px",
              marginRight: "10px",
              fontWeight: "bold",
              color: "#fff",
            }}
            onClick={() => {
              if (checkPermission('Crear stand', 'No tienes permisos para crear stand')) {
                handleShowModal();
              }
            }}
          >
            Agregar Stand
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
            onClick={fetchActiveStands}
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
            onClick={fetchInactiveStands}
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
              <th>Nombre Stand</th>
              <th>Dirección</th>
              <th>Fecha Inicio</th>
              <th>Fecha Final</th>
              <th>Sede</th>
              <th>Evento</th>
              <th>Tipo Stand</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody style={{ textAlign: "center" }}>
            {currentFilteredStands.map((stand) => (
              <tr key={stand.idStand}>
                <td>{stand.idStand}</td>
                <td>{stand.nombreStand}</td>
                <td>{stand.direccion}</td>
                <td>{stand.fechaInicio ? format(parseISO(stand.fechaInicio), "dd-MM-yyyy") : "Sin fecha"}</td>
                <td>{stand.fechaFinal ? format(parseISO(stand.fechaFinal), "dd-MM-yyyy") : "Sin fecha"}</td>
                <td>  {
                  sedes.find((sede) => sede.idSede === stand.idSede)?.nombreSede || "Sin sede"
                }</td>
                <td>  {
                  eventos.find((evento) => evento.idEvento === stand.idEvento)?.nombreEvento || "Sin evento"
                }</td>
                <td>{
                  tiposStands.find((tipo_stand) => tipo_stand.idTipoStands === stand.idTipoStands)?.tipo || "Sin tipo"
                }</td>
                <td>{stand.estado ? "Activo" : "Inactivo"}</td>
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
                      if (checkPermission('Editar stand', 'No tienes permisos para editar stand')) {
                        handleShowModal(stand);
                      }
                    }}
                  />
                  {stand.estado ? (
                    <FaToggleOn
                      style={{
                        color: "#30c10c",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Inactivar"
                      onClick={() => {
                        if (checkPermission('Desactivar stand', 'No tienes permisos para desactivar stand')) {
                          toggleEstado(stand.idStand, stand.estado);
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
                        if (checkPermission('Activar stand', 'No tienes permisos para activar stand')) {
                          toggleEstado(stand.idStand, stand.estado);
                        }
                      }}
                    />
                  )}
                  <FaEye
                    style={{
                      color: "#007AC3",
                      cursor: "pointer",
                      marginLeft: "10px",
                      fontSize: "20px",
                    }}
                    title="Ver detalles"
                    onClick={() => handleShowDetailsModal(stand.idStand)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {renderPagination()}
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingStand ? "Editar Stand" : "Agregar Stand"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="nombreStand">
              <Form.Label>Nombre del Stand</Form.Label>
              <Form.Control
                type="text"
                name="nombreStand"
                value={newStand.nombreStand}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="direccion">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="direccion"
                value={newStand.direccion}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="fechaInicio">
              <Form.Label>Fecha de Inicio</Form.Label>
              <Form.Control
                type="date"
                name="fechaInicio"
                value={newStand.fechaInicio}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="fechaFinal">
              <Form.Label>Fecha Final</Form.Label>
              <Form.Control
                type="date"
                name="fechaFinal"
                value={newStand.fechaFinal}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="idSede">
              <Form.Label>Sede</Form.Label>
              <Form.Control
                as="select"
                name="idSede"
                value={newStand.idSede}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar Sede</option>
                {sedes.map((sede) => (
                  <option key={sede.idSede} value={sede.idSede}>
                    {sede.nombreSede}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="idEvento">
              <Form.Label>Evento</Form.Label>
              <Form.Control
                as="select"
                name="idEvento"
                value={newStand.idEvento}
                onChange={handleChange}
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
            <Form.Group controlId="idTipoStands">
              <Form.Label>Tipo de Stand</Form.Label>
              <Form.Control
                as="select"
                name="idTipoStands"
                value={newStand.idTipoStands}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar Tipo</option>
                {tiposStands.map((tipo) => (
                  <option key={tipo.idTipoStands} value={tipo.idTipoStands}>
                    {tipo.tipo}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="horarios">
              <Form.Label>Horarios</Form.Label>
              {availableHorarios.map((horario) => {
                // Convertir las horas a un formato legible
                const horarioInicio = format(new Date(`1970-01-01T${horario.horario.horarioInicio}`), "hh:mm a");
                const horarioFinal = format(new Date(`1970-01-01T${horario.horario.horarioFinal}`), "hh:mm a");

                return (
                  <Form.Check
                    key={horario.idDetalleHorario}
                    type="checkbox"
                    label={`Horario ${horarioInicio} - ${horarioFinal} | Cupo: ${horario.cantidadPersonas}`}
                    value={horario.idDetalleHorario}
                    checked={selectedHorarios.includes(horario.idDetalleHorario)} // Marcar si está seleccionado
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setSelectedHorarios((prev) =>
                        e.target.checked
                          ? [...prev, value] // Añadir a seleccionados
                          : prev.filter((id) => id !== value) // Eliminar de seleccionados
                      );
                    }}
                  />
                );
              })}
            </Form.Group>
            <Form.Group controlId="estado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                name="estado"
                value={newStand.estado}
                onChange={handleChange}
                required
              >
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
              </Form.Control>
            </Form.Group>

            <Button
              type="submit"
              style={{
                backgroundColor: "#007AC3",
                borderColor: "#007AC3",
                width: "100%",
                marginTop: "15px",
              }}
            >
              {editingStand ? "Actualizar" : "Crear"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de Horarios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {standHorarios.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Horario</th>
                  <th>Cupo</th>
                </tr>
              </thead>
              <tbody>
                {standHorarios.map((horario, index) => {
                  const detalleHorario = horario?.detalle_horario;
                  const horarioInfo = detalleHorario?.horario;

                  // Validar si los datos necesarios existen
                  if (!detalleHorario || !horarioInfo) {
                    return (
                      <tr key={index}>
                        <td colSpan="3">Información incompleta</td>
                      </tr>
                    );
                  }

                  // Formatear las horas
                  const horarioInicio = format(new Date(`1970-01-01T${horarioInfo.horarioInicio}`), "hh:mm a");
                  const horarioFinal = format(new Date(`1970-01-01T${horarioInfo.horarioFinal}`), "hh:mm a");

                  return (
                    <tr key={horario.idStandHorario}>
                      <td>{index + 1}</td>
                      <td>{`${horarioInicio} - ${horarioFinal}`}</td>
                      <td>{detalleHorario.cantidadPersonas}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <p>No hay horarios asociados a este stand.</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
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
    </>
  );
}

export default Stand;

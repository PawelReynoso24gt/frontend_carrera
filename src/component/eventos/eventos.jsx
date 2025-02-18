import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Form,
  Table,
  Modal,
  Alert,
  InputGroup,
  FormControl,
  Pagination,
} from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { getUserDataFromToken } from "../../utils/jwtUtils";
import { format } from "date-fns";
import { parseISO } from "date-fns";



function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [filteredEventos, setFilteredEventos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingEvento, setEditingEvento] = useState(null);
  const [newEvento, setNewEvento] = useState({
    nombreEvento: "",
    fechaHoraInicio: "",
    fechaHoraFin: "",
    descripcion: "",
    direccion: "",
    estado: 1,
    idSede: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [sedes, setSedes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showPermissionModal, setShowPermissionModal] = useState(false); // Nuevo estado
  const [permissionMessage, setPermissionMessage] = useState('');
  const [permissions, setPermissions] = useState({});
  const [hasViewPermission, setHasViewPermission] = useState(false);
  const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // extraer el dato para idSede
  const sedeId = getUserDataFromToken(localStorage.getItem("token"))?.idSede; // ! USO DE LA FUNCIÓN getUserDataFromToken

  const idUsuario = getUserDataFromToken(localStorage.getItem("token"))?.idUsuario; // ! USO DE LA FUNCIÓN getUserDataFromToken

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
          response.data.permisos['Ver eventos']

        setHasViewPermission(hasPermission);
        setIsPermissionsLoaded(true);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermissions();
    fetchSedes();
  }, []);

  useEffect(() => {
    if (isPermissionsLoaded) {
      if (hasViewPermission) {
        fetchActiveEventos(); 
      } else {
        checkPermission('Ver eventos', 'No tienes permisos para ver eventos');
      }
    }
  }, [isPermissionsLoaded, hasViewPermission]);

  const logBitacora = async (descripcion, idCategoriaBitacora) => {
    const bitacoraData = {
      descripcion,
      idCategoriaBitacora,
      idUsuario,
      fechaHora: new Date()
    };

    try {
      await axios.post("https://api.voluntariadoayuvi.com/bitacora/create", bitacoraData);
    } catch (error) {
      console.error("Error logging bitacora:", error);
    }
  };

  const checkPermission = (permission, message) => {
    if (!permissions[permission]) {
      setPermissionMessage(message);
      setShowPermissionModal(true);
      return false;
    }
    return true;
  };

  const fetchEventos = async () => {
    try {
      const response = await axios.get("https://api.voluntariadoayuvi.com/eventos");
      setEventos(response.data);
      setFilteredEventos(response.data);
    } catch (error) {
      console.error("Error fetching eventos:", error);
    }
  };

  const fetchActiveEventos = async () => {
    try {
      if (hasViewPermission) {
        const response = await axios.get("https://api.voluntariadoayuvi.com/eventos/activas");
        setEventos(response.data);
        setFilteredEventos(response.data);
      } else {
        checkPermission('Ver eventos', 'No tienes permisos para ver eventos')
      }
    } catch (error) {
      console.error("Error fetching active eventos:", error);
    }
  };

  const fetchInactiveEventos = async () => {
    try {
      if (hasViewPermission) {
        const response = await axios.get("https://api.voluntariadoayuvi.com/eventos/inactivas");
        setEventos(response.data);
        setFilteredEventos(response.data);
      } else {
        checkPermission('Ver eventos', 'No tienes permisos para ver eventos')
      }
    } catch (error) {
      console.error("Error fetching inactive eventos:", error);
    }
  };

  const fetchSedes = async () => {
    try {
      const response = await axios.get("https://api.voluntariadoayuvi.com/sedes");
      setSedes(response.data);
    } catch (error) {
      console.error("Error fetching sedes:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = eventos.filter((evento) =>
      evento.nombreEvento.toLowerCase().includes(value)
    );

    setFilteredEventos(filtered);
    setCurrentPage(1);
  };

  const handleShowModal = (evento = null) => {
    if (evento) {
      // Convertir fechas al formato requerido por datetime-local
      evento.fechaHoraInicio = format(parseISO(evento.fechaHoraInicio), "yyyy-MM-dd'T'HH:mm");
      evento.fechaHoraFin = format(parseISO(evento.fechaHoraFin), "yyyy-MM-dd'T'HH:mm");

    }

    setEditingEvento(evento);
    setNewEvento(
      evento || {
        nombreEvento: "",
        fechaHoraInicio: "",
        fechaHoraFin: "",
        descripcion: "",
        direccion: "",
        estado: 1,
        idSede: sedeId || "",
      }
    );
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEvento(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvento({ ...newEvento, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nombreEvento, fechaHoraInicio, fechaHoraFin, descripcion, direccion, idSede } = newEvento;

    // Expresiones regulares basadas en el backend
    const regexNombreEvento = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/; // Solo letras y espacios
    const regexDescripcion = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,-]+$/; // Letras, números, espacios y signos .,-
    const regexDireccion = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,#/-]+$/; // Dirección con signos comunes

    // **Validaciones**

    if (!regexNombreEvento.test(nombreEvento)) {
      setErrorMessage("El nombre del evento solo debe contener letras y espacios.");
      return;
    }

    if (new Date(fechaHoraInicio) >= new Date(fechaHoraFin)) {
      setErrorMessage("La fecha de inicio debe ser anterior a la fecha de fin.");
      return;
    }
    if (descripcion && !regexDescripcion.test(descripcion)) {
      setErrorMessage("La descripción solo puede contener letras, números, espacios y los signos .,-");
      return;
    }
    if (!regexDireccion.test(direccion)) {
      setErrorMessage("La dirección solo puede contener letras, números, espacios y los signos ., #/-");
      return;
    }

    try {
      const data = {
        ...newEvento,
        idSede: sedeId || newEvento.idSede, // Priorizar el `sedeId` almacenado
      };
      if (editingEvento) {
        await axios.put(
          `https://api.voluntariadoayuvi.com/eventos/${editingEvento.idEvento}`,
          newEvento
        );
        setAlertMessage("Evento actualizado con éxito");
        // Log the update action in the bitacora
        await logBitacora(`Evento ${newEvento.nombreEvento} actualizado`, 27);
      } else {
        await axios.post("https://api.voluntariadoayuvi.com/eventos", newEvento);
        setAlertMessage("Evento creado con éxito");
        // Log the create action in the bitacora
        await logBitacora(`Evento ${newEvento.nombreEvento} creado`, 23);
      }
      fetchEventos();
      setShowAlert(true);
      setErrorMessage("");
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting evento:", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`https://api.voluntariadoayuvi.com/eventos/${id}`, { estado: nuevoEstado });
      fetchEventos();
      setAlertMessage(
        `Evento ${nuevoEstado === 1 ? "activado" : "inactivado"} con éxito`
      );
      setShowAlert(true);
    } catch (error) {
      console.error("Error toggling estado:", error);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentEventos = filteredEventos.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredEventos.length / rowsPerPage);

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
 <div className="row justify-content-center" style={{marginBottom: "20px" }}>
        <div className="col-12 text-center">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333", textAlign: "center" }}>
            Gestión de Eventos
          </h3>
        </div>
      </div>


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
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar evento por nombre..."
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
              if (checkPermission('Crear evento', 'No tienes permisos para crear evento')) {
                handleShowModal();
              }
            }}
          >
            Agregar Evento
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
            onClick={fetchActiveEventos}
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
            onClick={fetchInactiveEventos}
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
          <thead
            style={{ backgroundColor: "#007AC3", color: "#fff", textAlign: "center" }}
          >
            <tr>
              <th style={{ textAlign: "center" }}>ID</th>
              <th style={{ textAlign: "center" }}>Evento</th>
              <th style={{ textAlign: "center" }}>Fecha Inicio</th>
              <th style={{ textAlign: "center" }}>Fecha Fin</th>
              <th style={{ textAlign: "center" }}>Descripción</th>
              <th style={{ textAlign: "center" }}>Dirección</th>
              <th style={{ textAlign: "center" }}>Estado</th>
              <th style={{ textAlign: "center" }}>Sede</th>
              <th style={{ textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentEventos.map((evento) => (
              <tr key={evento.idEvento}>
                <td style={{ textAlign: "center" }}>{evento.idEvento}</td>
                <td style={{ textAlign: "center" }}>{evento.nombreEvento}</td>
                <td style={{ textAlign: "center" }}>
                  {(evento.fechaHoraInicio ? format(parseISO(evento.fechaHoraInicio), "dd-MM-yyyy - hh:mm a") : "Sin fecha")}
                </td>
                <td style={{ textAlign: "center" }}>
                  {(evento.fechaHoraFin ? format(parseISO(evento.fechaHoraFin), "dd-MM-yyyy - hh:mm a") : "Sin fecha")}
                </td>
                <td style={{ textAlign: "center" }}>{evento.descripcion}</td>
                <td style={{ textAlign: "center" }}>{evento.direccion}</td>
                <td style={{ textAlign: "center" }}>
                  {evento.estado === 1 ? "Activo" : "Inactivo"}
                </td>
                <td style={{ textAlign: "center" }}>
                  {sedes.find((sede) => sede.idSede === evento.idSede)?.nombreSede ||
                    "N/A"}
                </td>
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
                      if (checkPermission('Editar evento', 'No tienes permisos para editar evento')) {
                        handleShowModal(evento);
                      }
                    }}
                  />
                  {evento.estado === 1 ? (
                    <FaToggleOn
                      style={{
                        color: "#30c10c",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Inactivar"
                      onClick={() => {
                        if (checkPermission('Desactivar evento', 'No tienes permisos para desactivar evento')) {
                          toggleEstado(evento.idEvento, evento.estado);
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
                        if (checkPermission('Activar evento', 'No tienes permisos para activar evento')) {
                          toggleEstado(evento.idEvento, evento.estado);
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
              {editingEvento ? "Editar Evento" : "Agregar Evento"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nombreEvento">
                <Form.Label>Nombre Evento</Form.Label>
                <Form.Control
                  type="text"
                  name="nombreEvento"
                  value={newEvento.nombreEvento}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="fechaHoraInicio">
                <Form.Label>Fecha Inicio</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="fechaHoraInicio"
                  value={newEvento.fechaHoraInicio}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="fechaHoraFin">
                <Form.Label>Fecha Fin</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="fechaHoraFin"
                  value={newEvento.fechaHoraFin}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="descripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  name="descripcion"
                  value={newEvento.descripcion}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="direccion">
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  type="text"
                  name="direccion"
                  value={newEvento.direccion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idSede">
                <Form.Label>Sede</Form.Label>
                <Form.Control
                  as="select"
                  name="idSede"
                  value={newEvento.idSede}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una sede</option>
                  {sedes.map((sede) => (
                    <option key={sede.idSede} value={sede.idSede}>
                      {sede.nombreSede}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              {/* Campo de estado */}
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newEvento.estado}
                  onChange={handleChange}
                  required
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
                {editingEvento ? "Actualizar" : "Crear"}
              </Button>
              {errorMessage && (
                <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible>
                  {errorMessage}
                </Alert>
              )}
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

export default Eventos;

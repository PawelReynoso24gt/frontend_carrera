import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Tabs,
  Tab,
  Card,
  Button,
  Row,
  Col,
  Modal,
  Form,
  Spinner,
  Pagination,
} from "react-bootstrap";
import { getUserDataFromToken } from "../../utils/jwtUtils";

function SituacionesPorEstado() {
  const [estados] = useState([
    "Reportada",
    "En Revisión",
    "Próximo a Solucionarse",
    "Resuelta",
    "Sin Solución",
  ]);
  const [situaciones, setSituaciones] = useState([]);
  const [tiposSituaciones, setTiposSituaciones] = useState([]);
  const [selectedEstado, setSelectedEstado] = useState("Reportada");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    descripcion: "",
    idTipoSituacion: "",
    estado: "",
    idUsuario: null, // Temporal: Cambia esto según tu sistema de usuarios
  });
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedSituacion, setSelectedSituacion] = useState(null);

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Número de elementos por página

  const [showPermissionModal, setShowPermissionModal] = useState(false); // Nuevo estado
  const [permissionMessage, setPermissionMessage] = useState('');
  const [permissions, setPermissions] = useState({});

  // para bitacora
  const UserID = getUserDataFromToken(localStorage.getItem("token")).idUsuario;


  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get('https://api.voluntariadoayuvi.com/usuarios/permisos', {
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
    fetchTiposSituaciones();
    fetchSituacionesByEstado(selectedEstado);
    obtenerIdUsuario();
  }, [selectedEstado]);

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSituaciones = situaciones.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(situaciones.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const fetchTiposSituaciones = async () => {
    try {
      const response = await axios.get("https://api.voluntariadoayuvi.com/tipo_situaciones");
      setTiposSituaciones(response.data);
    } catch (error) {
      console.error("Error fetching tipos de situaciones:", error);
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

  const fetchSituacionesByEstado = async (estado) => {
    setIsLoading(true);
    try {
      let url = "https://api.voluntariadoayuvi.com/situaciones";
      switch (estado) {
        case "Reportada":
          url += "/reportadas";
          break;
        case "En Revisión":
          url += "/en_revision";
          break;
        case "Próximo a Solucionarse":
          url += "/proximo_a_solucionarse";
          break;
        case "Resuelta":
          url += "/resueltas";
          break;
        case "Sin Solución":
          url += "/sin_solucion";
          break;
        default:
          console.error("Estado desconocido:", estado);
          return;
      }

      const response = await axios.get(url);
      setSituaciones(response.data);
    } catch (error) {
      console.error("Error fetching situaciones:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const obtenerIdUsuario = () => {
    const token = localStorage.getItem("token");
    const userData = getUserDataFromToken(token);
    if (userData && userData.idUsuario) {
      setFormData((prevData) => ({
        ...prevData,
        idUsuario: userData.idUsuario,
      }));
    } else {
      console.error("No se pudo obtener el idUsuario del token.");
    }
  };

  const handleCreate = () => {
    setFormData((prevData) => ({
      ...prevData,
      descripcion: "",
      idTipoSituacion: tiposSituaciones[0]?.idTipoSituacion || "",
      estado: "Reportada", // Estado por defecto al crear
    }));
    setEditMode(false);
    setShowModal(true);
  };

  const handleEdit = (situacion) => {
    setSelectedSituacion(situacion);
    setFormData({
      descripcion: situacion.descripcion,
      idTipoSituacion: situacion.idTipoSituacion,
      estado: situacion.estado,
      respuesta: situacion.respuesta || "",
      observaciones: situacion.observaciones || "",
      idPersona: situacion.usuario.persona.idPersona, // Agregar idPersona (para notificación)
    });
    setEditMode(true);
    setShowModal(true);
  };

  const logBitacora = async (descripcion, idCategoriaBitacora) => {
    const bitacoraData = {
      descripcion,
      idCategoriaBitacora,
      idUsuario: UserID,
      fechaHora: new Date(),
    };

    try {
      const response = await axios.post("https://api.voluntariadoayuvi.com/bitacora/create", bitacoraData);
      return response.data.idBitacora; // Asegúrate de que la API devuelve idBitacora
    } catch (error) {
      console.error("Error logging bitacora:", error);
      throw error; // Lanza el error para manejarlo en handleSave
    }
  };

  const createNotification = async (idBitacora, idTipoNotificacion, idPersona) => {
    const notificationData = {
      idBitacora,
      idTipoNotificacion,
      idPersona,
    };

    try {
      await axios.post("https://api.voluntariadoayuvi.com/notificaciones/create", notificationData);
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };

  const handleSave = async () => {
    let response; // Define response outside the try block
    try {
      if (editMode) {
        // Actualizar situación usando la ruta de actualización de respuesta
        response = await axios.put(
          `https://api.voluntariadoayuvi.com/situaciones/update/respuesta/${selectedSituacion.idSituacion}`,
          {
            idTipoSituacion: formData.idTipoSituacion,
            estado: formData.estado,
            respuesta: formData.respuesta,
            observaciones: formData.observaciones,
          }
        );
        // Log bitacora for editing and obtain idBitacora
        const idBitacora = await logBitacora(`Situación actualizada: ${formData.descripcion}`, 6);

        // Obtener idPersona del usuario que reportó la situación
        const idPersona = selectedSituacion.usuario.persona.idPersona;

        // Verifica que todos los campos necesarios estén presentes
        if (idBitacora && idPersona) {
          const idTipoNotificacion = 4; // Ajusta según tu lógica de tipos de notificaciones
          await createNotification(idBitacora, idTipoNotificacion, idPersona);
        } else {
          console.error("Faltan datos necesarios para crear la notificación");
        }
      } else {
        // Crear una nueva situación con el estado "Reportada" por defecto
        response = await axios.post("https://api.voluntariadoayuvi.com/situaciones/create", {
          ...formData,
          estado: "Reportada",
          idUsuario: formData.idUsuario,
        });
        // Log bitacora for creating
        await logBitacora(`Nueva situación creada: ${formData.descripcion}`, 5);
      }

      fetchSituacionesByEstado(selectedEstado);
      setShowModal(false);
    } catch (error) {
      console.error("Error saving situación:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Container className="mt-5" style={{
      maxWidth: "100%",
      margin: "0 auto",
    }}>
      <h2 className="text-center mb-4">Gestión de Situaciones por Estado</h2>
      <div className="text-center mb-4">
        <Button
          onClick={() => {
            if (checkPermission('Crear situación', 'No tienes permisos para crear situación')) {
              handleCreate();
            }
          }}
          variant="primary"
          style={{
            backgroundColor: "#007abf",
            borderColor: "#007AC3",
            padding: "5px 10px",
            width: "190px",
            marginRight: "10px",
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          Crear Situación
        </Button>
      </div>
      <Tabs
        activeKey={selectedEstado}
        onSelect={(k) => setSelectedEstado(k)}
        className="mb-3"
      >
        {estados.map((estado) => (
          <Tab key={estado} eventKey={estado} title={estado}>
            {isLoading ? (
              <div className="text-center">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <Row>
                {currentSituaciones.map((situacion) => (
                  <Col key={situacion.idSituacion} md={6} lg={4} className="mb-4">
                    <Card className="h-100 shadow-sm">
                      <Card.Body>
                        <Card.Title style={{ fontWeight: "bold" }}>
                          {situacion.descripcion}
                        </Card.Title>
                        <Card.Text >
                          <strong>Reportado por:</strong> {situacion.usuario.persona.nombre}
                          <br />
                          <strong>Tipo:</strong> {situacion.tipo_situacione?.tipoSituacion}
                          <br />
                          <strong>Fecha:</strong>{" "}
                          {new Date(situacion.fechaOcurrencia).toLocaleDateString()}
                          <br />
                          <strong>Estado:</strong> {situacion.estado}
                          <br />
                          <strong style={{ fontSize: "18px" }}>Respuesta:</strong>
                          <br />
                          {situacion.respuesta}
                          <br />
                          <strong style={{ fontSize: "18px" }}>Observaciones:</strong>
                          <br />
                          {situacion.observaciones}
                        </Card.Text>
                      </Card.Body>
                      <Card.Footer className="text-center">
                        <Button
                          className="btn-primary"
                          onClick={() => {
                            if (checkPermission('Editar situación', 'No tienes permisos para editar situación')) {
                              handleEdit(situacion);
                            }
                          }}
                          style={{
                            backgroundColor: "#007abf",
                            borderColor: "#007AC3",
                            padding: "5px 10px",
                            width: "180px",
                            marginRight: "10px",
                            fontWeight: "bold",
                            color: "#fff",
                          }}
                        >
                          Editar
                        </Button>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Tab>
        ))}
      </Tabs>

      {/* Barra de paginación */}
      <Pagination className="justify-content-center mt-4">
        {[...Array(totalPages).keys()].map((number) => (
          <Pagination.Item
            key={number + 1}
            active={number + 1 === currentPage}
            onClick={() => handlePageChange(number + 1)}
          >
            {number + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* Modal para Crear/Editar Situaciones */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? "Editar Situación" : "Crear Nueva Situación"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            {/* Descripción */}
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Ingrese la descripción"
                readOnly={editMode} // Editable solo en modo de creación
              />
            </Form.Group>

            {/* Tipo de Situación - Editable en ambos modos */}
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Situación</Form.Label>
              {editMode ? (
                <Form.Control
                  type="text"
                  value={
                    tiposSituaciones.find(
                      (tipo) => tipo.idTipoSituacion === formData.idTipoSituacion
                    )?.tipoSituacion || "No disponible"
                  }
                  readOnly
                />
              ) : (
                <Form.Select
                  name="idTipoSituacion"
                  value={formData.idTipoSituacion}
                  onChange={handleInputChange}
                >
                  {tiposSituaciones.map((tipo) => (
                    <option key={tipo.idTipoSituacion} value={tipo.idTipoSituacion}>
                      {tipo.tipoSituacion}
                    </option>
                  ))}
                </Form.Select>
              )}
            </Form.Group>

            {/* Campos adicionales solo en modo de edición */}
            {editMode && (
              <>
                {/* Estado */}
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                  >
                    {estados.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Respuesta */}
                <Form.Group className="mb-3">
                  <Form.Label>Respuesta</Form.Label>
                  <Form.Control
                    type="text"
                    name="respuesta"
                    value={formData.respuesta}
                    onChange={handleInputChange}
                    placeholder="Ingrese la respuesta (opcional)"
                  />
                </Form.Group>

                {/* Observaciones */}
                <Form.Group className="mb-3">
                  <Form.Label>Observaciones</Form.Label>
                  <Form.Control
                    type="text"
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleInputChange}
                    placeholder="Ingrese las observaciones (opcional)"
                  />
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar
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
    </Container>
  );
}

export default SituacionesPorEstado;

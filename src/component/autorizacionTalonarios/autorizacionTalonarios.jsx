import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Card, Row, Col } from "react-bootstrap";
import { getUserDataFromToken } from "../../utils/jwtUtils"; // token

function AutorizacionTalonarios() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [modalContent, setModalContent] = useState("");
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
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
    fetchSolicitudes();
  }, []);

  const idUsuario = getUserDataFromToken(localStorage.getItem("token"))?.idUsuario; //! usuario del token

  const checkPermission = (permission, message) => {
    if (!permissions[permission]) {
      setPermissionMessage(message);
      setShowPermissionModal(true);
      return false;
    }
    return true;
  };

  const fetchSolicitudes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/solicitudes");
      setSolicitudes(response.data);
    } catch (error) {
      console.error("Error fetching solicitudes:", error);
    }
  };

  const handleAccept = (idSolicitud) => {
    setConfirmationAction(() => () => updateSolicitud(idSolicitud, 2));
    setModalContent("¿Está seguro de aceptar esta solicitud?");
    setShowConfirmationModal(true);
  };

  const handleDeny = (idSolicitud) => {
    setConfirmationAction(() => () => updateSolicitud(idSolicitud, 0));
    setModalContent("¿Está seguro de denegar esta solicitud?");
    setShowConfirmationModal(true);
  };

  const logBitacora = async (descripcion, idCategoriaBitacora) => {
    const bitacoraData = {
        descripcion,
        idCategoriaBitacora,
        idUsuario,
        fechaHora: new Date(),
    };
  
    try {
        const response = await axios.post("http://localhost:5000/bitacora/create", bitacoraData);
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
  
    //console.log("Datos enviados para crear la notificación:", notificationData);
  
    try {
      await axios.post("http://localhost:5000/notificaciones/create", notificationData);
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };

  const getVoluntario = async (idVoluntario) => {
    try {
      const response = await axios.get(`http://localhost:5000/voluntarios/${idVoluntario}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el voluntario ${idVoluntario}:`, error);
      throw error;
    }
  };

  const updateSolicitud = async (idSolicitud, estado) => {
    try {
      // Actualizar estado de la solicitud
      await axios.put(`http://localhost:5000/solicitudes/${idSolicitud}`, { estado });
  
      // Obtener nuevamente la solicitud completa
      const responseSolicitud = await axios.get(`http://localhost:5000/solicitudes/${idSolicitud}`);
      //console.log("API Response Solicitud:", responseSolicitud);
  
      const solicitud = responseSolicitud.data;
  
      // Verificar la estructura de la respuesta antes de acceder a voluntario
      if (solicitud && solicitud.idVoluntario) {
        // Obtener la información del voluntario
        const voluntario = await getVoluntario(solicitud.idVoluntario);
        //console.log("API Response Voluntario:", voluntario);
  
        // Verificar que voluntario y persona existan
        if (voluntario && voluntario.persona && voluntario.persona.idPersona) {
          const idPersona = voluntario.persona.idPersona;
  
          // Log de bitácora y obtener idBitacora
          const idBitacora = await logBitacora(`Solicitud de talonario ${idSolicitud} actualizada`, 21);
  
          // Verifica que todos los campos necesarios estén presentes
          if (idBitacora && idPersona) {
            const idTipoNotificacion = 4; 
            await createNotification(idBitacora, idTipoNotificacion, idPersona);
          } else {
            console.error("Faltan datos necesarios para crear la notificación");
          }
        } else {
          console.error("La estructura de la respuesta del voluntario no contiene los datos esperados");
        }
      } else {
        console.error("La estructura de la respuesta de la solicitud no contiene los datos esperados");
      }
  
      // Actualizamos la lista de solicitudes después de cambiar el estado
      fetchSolicitudes();
      setShowConfirmationModal(false);
    } catch (error) {
      console.error(`Error al actualizar la solicitud ${idSolicitud}:`, error);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4" style={{ fontWeight: "bold", color: "#007abf" }}>
        AUTORIZACIÓN DE SOLICITUDES DE TALONARIOS
      </h3>
      <Row>
        {solicitudes.map((solicitud) => (
          <Col key={solicitud.idSolicitudTalonario} sm={12} md={6} lg={4}>
            <Card
              className="mb-3"
              style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", position: "relative" }}
            >
              <Card.Body>
                <Card.Title>Solicitud ID: {solicitud.idSolicitudTalonario}</Card.Title>
                <Card.Text>Estado: {solicitud.estado === 1 ? "Pendiente" : solicitud.estado === 2 ? "Aceptado" : "Denegado"}</Card.Text>
                <Card.Text>Fecha de Solicitud: {new Date(solicitud.fechaSolicitud).toLocaleDateString("es-ES")}</Card.Text>
                <Card.Text>Voluntario: {solicitud.voluntario.persona.nombre}</Card.Text>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  {/* Mostrar botones dinámicamente según el estado */}
                  {solicitud.estado === 1 && (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => {
                          if (checkPermission('Aceptar solicitud de talonario', 'No tienes permisos para aceptar solicitud de talonario')) {
                            handleAccept(solicitud.idSolicitudTalonario);
                          }
                        }}
                        style={{ minWidth: "70px", width: "100px" }}
                      >
                        Aceptar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          if (checkPermission('Denegar solicitud de talonario', 'No tienes permisos para denegar solicitud de talonario')) {
                            handleDeny(solicitud.idSolicitudTalonario);
                          }
                        }}
                        style={{ minWidth: "70px", width: "100px" }}
                      >
                        Denegar
                      </Button>
                    </>
                  )}
                  {solicitud.estado === 2 && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        if (checkPermission('Denegar solicitud de talonario', 'No tienes permisos para denegar solicitud de talonario')) {
                          handleDeny(solicitud.idSolicitudTalonario);
                        }
                      }}
                      style={{ minWidth: "70px", width: "100px" }}
                    >
                      Denegar
                    </Button>
                  )}
                  {solicitud.estado === 0 && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => {
                        if (checkPermission('Aceptar solicitud de talonario', 'No tienes permisos para aceptar solicitud de talonario')) {
                          handleAccept(solicitud.idSolicitudTalonario);
                        }
                      }}
                      style={{ minWidth: "70px", width: "100px" }}
                    >
                      Aceptar
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal de confirmación */}
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmación</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent}</Modal.Body>
        <Modal.Footer style={{ justifyContent: "center" }}>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowConfirmationModal(false)}
            style={{
              minWidth: "70px",
              fontSize: "14px",
              marginRight: "10px",
              width: "100px",
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={confirmationAction}
            style={{
              fontSize: "14px",
              width: "100px",
            }}
          >
            Confirmar
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
    </div>
  );
}

export default AutorizacionTalonarios;

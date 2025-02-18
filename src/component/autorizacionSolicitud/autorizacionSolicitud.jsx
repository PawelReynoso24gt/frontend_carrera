import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Card, Row, Col, Pagination, Form } from "react-bootstrap";
import { getUserDataFromToken } from "../../utils/jwtUtils"; // token

import { format } from "date-fns";
import { parseISO } from "date-fns";

const formatDate = (date) => {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(date).toLocaleDateString("es-ES", options);
};

function SolicitudesVoluntariado() {
  const [aspirantes, setAspirantes] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false); // Nuevo estado
  const [permissionMessage, setPermissionMessage] = useState('');
  const [permissions, setPermissions] = useState({});
  const [hasViewPermission, setHasViewPermission] = useState(false);
  const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);

  const [showDenialModal, setShowDenialModal] = useState(false);
  const [denialDescription, setDenialDescription] = useState("");
  const [denyingAspiranteId, setDenyingAspiranteId] = useState(null);

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(6);

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
          response.data.permisos['Ver aspirantes']

        setHasViewPermission(hasPermission);
        setIsPermissionsLoaded(true);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermissions();
    fetchPersonas();
  }, []);

  useEffect(() => {
    if (isPermissionsLoaded) {
      if (hasViewPermission) {
        fetchAspirantes();
      } else {
        checkPermission('Ver aspirantes', 'No tienes permisos para ver aspirantes');
      }
    }
  }, [isPermissionsLoaded, hasViewPermission]);

  const idUsuario = getUserDataFromToken(localStorage.getItem("token"))?.idUsuario; //! usuario del token

  const logBitacora = async (descripcion, idCategoriaBitacora) => {
    const bitacoraData = {
      descripcion,
      idCategoriaBitacora,
      idUsuario,
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

    //console.log("Datos enviados para crear la notificación:", notificationData);

    try {
      await axios.post("https://api.voluntariadoayuvi.com/notificaciones/create", notificationData);
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };

  const getAspirante = async (idAspirante) => {
    if (!idAspirante || typeof idAspirante !== "number") {
      console.error(`ID de aspirante inválido: ${JSON.stringify(idAspirante)}`);
      return;
    }  
   
    try {
      const response = await axios.get(`https://api.voluntariadoayuvi.com/aspirantes/${idAspirante}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el aspirante ${idAspirante}:`, error);
      throw error;
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

  const fetchAspirantes = async () => {
    try {
      const response = await axios.get("https://api.voluntariadoayuvi.com/aspirantes");
      
      const activos = response.data.filter((aspirante) => aspirante.estado === 1);
      setAspirantes(activos);
    } catch (error) {
      console.error("Error fetching aspirantes:", error);
    }
  };

  const fetchPersonas = async () => {
    try {
      const response = await axios.get("https://api.voluntariadoayuvi.com/personas");
      setPersonas(response.data);
    } catch (error) {
      console.error("Error fetching personas:", error);
    }
  };

  const handleMoreInfo = (idPersona) => {
    const persona = personas.find((p) => p.idPersona === idPersona);
    setSelectedPersona(persona);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPersona(null);
  };

  const handleAccept = (idAspirante) => {
    setConfirmationAction(() => () => acceptSolicitud(idAspirante));
    setModalContent("¿Está seguro de aceptar la solicitud?");
    setShowConfirmationModal(true);
  };

  const handleDeny = (idAspirante) => {
    if (!idAspirante || typeof idAspirante !== "number") {
      console.error(`Error: ID de aspirante inválido ${JSON.stringify(idAspirante)}`);
      return;
    }
  
    setDenyingAspiranteId(idAspirante);
    setShowDenialModal(true);
  };
  
  const acceptSolicitud = async (idAspirante) => {
  try {
    // Actualizar estado del aspirante
    await axios.put(`https://api.voluntariadoayuvi.com/aspirantes/aceptar/${idAspirante}`);
    fetchAspirantes();
    setShowConfirmationModal(false);

      // Obtener la información del aspirante
      const aspirante = await getAspirante(idAspirante);

      // Verificar que aspirante y persona existan
      if (aspirante && aspirante.idPersona) {
        const idPersona = aspirante.idPersona;

        // Buscar la persona correspondiente en la lista de personas
        const persona = personas.find((p) => p.idPersona === idPersona);

        if (persona) {
          const nombrePersona = persona.nombre; // Obtener el nombre de la persona

        // Log de bitácora y obtener idBitacora
        const idBitacora = await logBitacora(
          // Incluir el nombre en el mensaje con un agradecimiento
          `Solicitud de aspirante ID: ${idAspirante} aceptada, ¡Bienvenido(a) ${nombrePersona}! 🎉 Muchas gracias por formar parte de AYUVI 💙`,
          20
        );

        // Crear la notificación
        if (idBitacora && idPersona) {
          const idTipoNotificacion = 4; // Ajusta según tu lógica de tipos de notificaciones
          await createNotification(idBitacora, idTipoNotificacion, idPersona);
        } else {
          console.error("Faltan datos necesarios para crear la notificación");
        }
      } else {
        console.error("No se encontró la persona asociada al aspirante");
      }
    } else {
      console.error("La estructura de la respuesta del aspirante no contiene los datos esperados");
    }
  } catch (error) {
    console.error("Error accepting solicitud:", error);
  }
};
  
const denySolicitud = async (idAspirante) => {
  if (!idAspirante || typeof idAspirante !== "number") {
    console.error(`Error: ID de aspirante inválido ${JSON.stringify(idAspirante)}`);
    return;
  }
  
  try {
    // Actualizar estado del aspirante
    await axios.put(`https://api.voluntariadoayuvi.com/aspirantes/denegar/${denyingAspiranteId  }`, {
      descripcion: denialDescription, });
     fetchAspirantes();
      setShowDenialModal(false);
      setDenialDescription("");
      setDenyingAspiranteId(null);
    // Obtener la información del aspirante
    const aspirante = await getAspirante(idAspirante);

      // Verificar que aspirante y persona existan
      if (aspirante && aspirante.idPersona) {
        const idPersona = aspirante.idPersona;

        // Buscar la persona correspondiente en la lista de personas
        const persona = personas.find((p) => p.idPersona === idPersona);

        if (persona) {
          const nombrePersona = persona.nombre; // Obtener el nombre de la persona

        // Log de bitácora y obtener idBitacora
        const idBitacora = await logBitacora(
          `Solicitud de aspirante ${idAspirante} (${nombrePersona}) denegada. Motivo: "${denialDescription}"`, // Incluir el nombre en el mensaje
          26
        );

          // Crear la notificación
          if (idBitacora && idPersona) {
            const idTipoNotificacion = 4; // Ajusta según tu lógica de tipos de notificaciones
            await createNotification(idBitacora, idTipoNotificacion, idPersona);
          } else {
            console.error("Faltan datos necesarios para crear la notificación");
          }
        } else {
          console.error("No se encontró la persona asociada al aspirante");
        }
      } else {
        console.error("La estructura de la respuesta del aspirante no contiene los datos esperados");
      }
    } catch (error) {
      console.error("Error denying solicitud:", error);
    }
  };

  // Paginación
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentAspirantes = aspirantes.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(aspirantes.length / cardsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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
        <span style={{ marginRight: "10px", fontWeight: "bold" }}>Tarjetas por página</span>
        <Form.Control
          as="select"
          value={cardsPerPage}
          onChange={(e) => {
            setCardsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          style={{
            width: "100px",
            height: "40px",
          }}
        >
          {[6, 12, 24].map((option) => (
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
    <div className="container mt-4" style={{ maxWidth: "100%", margin: "0 auto" }}>

      <div className="row justify-content-center" style={{ marginBottom: "20px" }}>
        <div className="col-12 text-center">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333", textAlign: "center" }}>
            SOLICITUDES ENTRANTES PARA VOLUNTARIO
          </h3>
        </div>
      </div>

      <Row>
        {currentAspirantes.map((aspirante) => (
          <div class="col-sm-4 mb-4" key={aspirante.idAspirante} sm={12} md={6} lg={4} style={{ marginBottom: "20px" }}>
            <Card
              className="mb-3"
              style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", position: "relative" }}
            >
              <Card.Body style={{ position: "relative", paddingBottom: "40px" }}>
                <Card.Title>Aspirante ID: {aspirante.idAspirante}</Card.Title>
                <Card.Text>Estado: {aspirante.estado === 1 ? "Activo" : "Inactivo"}</Card.Text>
                <Card.Text>Fecha de Registro: {format(parseISO(aspirante.fechaRegistro), "dd-MM-yyyy")}</Card.Text>
                <div style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => {
                      if (checkPermission('Aceptar solicitud de aspirantes', 'No tienes permisos para aceptar la solicitud de aspirantes')) {
                        handleAccept(aspirante.idAspirante);
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
                      if (checkPermission('Denegar solicitud de aspirantes', 'No tienes permisos para denegar la solicitud de aspirantes')) {
                        handleDeny(aspirante.idAspirante);
                      }
                    }}
                    style={{ minWidth: "70px", width: "100px" }}
                  >
                    Denegar
                  </Button>
                </div>
                <a
                  href="#"
                  onClick={() => handleMoreInfo(aspirante.idPersona)}
                  style={{
                    fontSize: "14px",
                    textDecoration: "underline",
                    color: "#0b71a4",
                    position: "absolute",
                    bottom: "10px",
                    left: "10px",
                  }}
                >
                  Más información
                </a>
              </Card.Body>
            </Card>
          </div>
        ))}
      </Row>

      {renderPagination()}

      <Modal show={showDenialModal} onHide={() => setShowDenialModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Denegar Solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label htmlFor="denialDescription">Razón de denegación:</label>
          <textarea
            id="denialDescription"
            className="form-control mt-2"
            rows="3"
            value={denialDescription}
            onChange={(e) => setDenialDescription(e.target.value)}
          ></textarea>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDenialModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => denySolicitud(denyingAspiranteId)}>
            Confirmar Denegación
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para mostrar más información */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Información de la Persona</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPersona ? (
            <>
              <p style={{ color: "#000000" }}><strong>Nombre:</strong> {selectedPersona.nombre}</p>
              <p style={{ color: "#000000" }}><strong>Correo:</strong> {selectedPersona.correo}</p>
              <p style={{ color: "#000000" }}><strong>Teléfono:</strong> {selectedPersona.telefono}</p>
              <p style={{ color: "#000000" }}><strong>Domicilio:</strong> {selectedPersona.domicilio}</p>
              <p style={{ color: "#000000" }}><strong>CUI:</strong> {selectedPersona.CUI}</p>
              <p style={{ color: "#000000" }}><strong>Fecha de Nacimiento:</strong> {format(parseISO(selectedPersona.fechaNacimiento), "dd-MM-yyyy")}</p>
              <p style={{ color: "#000000" }}><strong>Estado:</strong> {selectedPersona.estado === 1 ? "Activo" : "Inactivo"}</p>
            </>
          ) : (
            <p>No se encontró información.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCloseModal}
            style={{ minWidth: "70px", width: "100px", marginRight: "185px", backgroundColor: "#007abf" }}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

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
              backgroundColor: "#a40b22",
              borderColor: "#FF6B6B",
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
              backgroundColor: "#1e7f06",
              borderColor: "#28A745",
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

export default SolicitudesVoluntariado;

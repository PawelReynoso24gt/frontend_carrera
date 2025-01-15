import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Card, Row, Col, Form } from "react-bootstrap";
import { getUserDataFromToken } from "../../utils/jwtUtils"; // token

function AutorizacionTalonarios() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [modalContent, setModalContent] = useState("");
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(9);

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const idUsuario = getUserDataFromToken(localStorage.getItem("token"))?.idUsuario; //! usuario del token

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
      fechaHora: new Date()
    };
  
    try {
      await axios.post("http://localhost:5000/bitacora/create", bitacoraData);
    } catch (error) {
      console.error("Error logging bitacora:", error);
    }
  };

  const updateSolicitud = async (idSolicitud, estado) => {
    try {
      await axios.put(`http://localhost:5000/solicitudes/${idSolicitud}`, {
        estado,
      });
      fetchSolicitudes();
      setShowConfirmationModal(false);

      // Log de bitácora
      await logBitacora(`Solicitud de talonario ${idSolicitud} actualizada`, 21); 
    } catch (error) {
      console.error(`Error al actualizar la solicitud ${idSolicitud}:`, error);
    }
  };

  // Pagination Logic
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentSolicitudes = solicitudes.slice(indexOfFirstCard, indexOfLastCard);

  const totalPages = Math.ceil(solicitudes.length / cardsPerPage);

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
          {[9, 18, 27].map((option) => (
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
    <div className="container mt-4">
      <h3 className="text-center mb-4" style={{ fontWeight: "bold", color: "#007abf" }}>
        AUTORIZACIÓN DE SOLICITUDES DE TALONARIOS
      </h3>
      <Row>
        {currentSolicitudes.map((solicitud) => (
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
                  {solicitud.estado === 1 && (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleAccept(solicitud.idSolicitudTalonario)}
                        style={{ minWidth: "70px", width: "100px" }}
                      >
                        Aceptar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeny(solicitud.idSolicitudTalonario)}
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
                      onClick={() => handleDeny(solicitud.idSolicitudTalonario)}
                      style={{ minWidth: "70px", width: "100px" }}
                    >
                      Denegar
                    </Button>
                  )}
                  {solicitud.estado === 0 && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleAccept(solicitud.idSolicitudTalonario)}
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

      {renderPagination()}

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
    </div>
  );
}

export default AutorizacionTalonarios;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Card, Row, Col } from "react-bootstrap";

function AutorizacionTalonarios() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [modalContent, setModalContent] = useState("");
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    fetchSolicitudes();
  }, []);

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

  const updateSolicitud = async (idSolicitud, estado) => {
    try {
      await axios.put(`http://localhost:5000/solicitudes/${idSolicitud}`, {
        estado, // Solo enviamos el estado
      });
      fetchSolicitudes(); // Actualizamos la lista de solicitudes después de cambiar el estado
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
                <Card.Text>Fecha de Solicitud: {solicitud.fechaSolicitud}</Card.Text>
                <Card.Text>Voluntario: {solicitud.voluntario.persona.nombre}</Card.Text>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  {/* Mostrar botones dinámicamente según el estado */}
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
    </div>
  );
}

export default AutorizacionTalonarios;

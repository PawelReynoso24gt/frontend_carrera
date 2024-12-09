import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Card, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



function SolicitudesVoluntariado() {  
  const [aspirantes, setAspirantes] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    fetchAspirantes();
    fetchPersonas();
  }, []);

  const fetchAspirantes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/aspirantes");
      // Filtrar los aspirantes con estado activo (1)
      const aspirantesActivos = response.data.filter((aspirante) => aspirante.estado === 1);
      setAspirantes(aspirantesActivos);
    } catch (error) {
      console.error("Error fetching aspirantes:", error);
      toast.error("Error al cargar aspirantes.");
    }
  };

  const fetchPersonas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/personas");
      setPersonas(response.data);
    } catch (error) {
      console.error("Error fetching personas:", error);
      toast.error("Error al cargar personas.");
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
    setConfirmationAction(() => () => denySolicitud(idAspirante));
    setModalContent("¿Está seguro de denegar la solicitud?");
    setShowConfirmationModal(true);
  };

  const acceptSolicitud = async (idAspirante) => {
    try {
      const response = await axios.put(`http://localhost:5000/aspirantes/aceptar/${idAspirante}`);
      toast.success("Solicitud aceptada exitosamente.");
      fetchAspirantes(); // Actualizar lista de aspirantes
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Error accepting solicitud:", error.response?.data || error.message);
      toast.error("No se pudo aceptar la solicitud.");
    }
  };

  const denySolicitud = async (idAspirante) => {
    try {
      await axios.put(`http://localhost:5000/aspirantes/denegar/${idAspirante}`);
      fetchAspirantes(); // Actualizar lista de aspirantes
      setShowConfirmationModal(false);
      toast.info("Solicitud denegada.");
    } catch (error) {
      console.error("Error denying solicitud:", error.response?.data || error.message);
      toast.error("Error al denegar la solicitud.");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4" style={{ fontWeight: "bold", color: "#007abf" }}>
        SOLICITUDES ENTRANTES PARA VOLUNTARIADO
      </h3>
      <Row>
        {aspirantes.map((aspirante) => (
          <Col key={aspirante.idAspirante} sm={12} md={6} lg={4}>
            <Card
              className="mb-3"
              style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", position: "relative" }}
            >
              <Card.Body style={{ position: "relative", paddingBottom: "40px" }}>
                <Card.Title>Aspirante ID: {aspirante.idAspirante}</Card.Title>
                <Card.Text>Estado: {aspirante.estado === 1 ? "Activo" : "Inactivo"}</Card.Text>
                <Card.Text>Fecha de Registro: {aspirante.fechaRegistro}</Card.Text>
                <div style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleAccept(aspirante.idAspirante)}
                    style={{ minWidth: "70px", width: "100px" }}
                  >
                    Aceptar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeny(aspirante.idAspirante)}
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
          </Col>
        ))}
      </Row>

      {/* Modal para mostrar más información */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Información de la Persona</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPersona ? (
            <>
              <p><strong>Nombre:</strong> {selectedPersona.nombre}</p>
              <p><strong>Correo:</strong> {selectedPersona.correo}</p>
              <p><strong>Teléfono:</strong> {selectedPersona.telefono}</p>
              <p><strong>Domicilio:</strong> {selectedPersona.domicilio}</p>
              <p><strong>CUI:</strong> {selectedPersona.CUI}</p>
              <p><strong>Fecha de Nacimiento:</strong> {selectedPersona.fechaNacimiento}</p>
              <p><strong>Estado:</strong> {selectedPersona.estado === 1 ? "Activo" : "Inactivo"}</p>
            </>
          ) : (
            <p>No se encontró información.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={handleCloseModal}>
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
        <Modal.Footer>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowConfirmationModal(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={confirmationAction}
          >
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SolicitudesVoluntariado;

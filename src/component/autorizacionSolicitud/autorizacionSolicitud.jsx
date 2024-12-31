import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Card, Row, Col, Pagination } from "react-bootstrap";

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

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Número de elementos por página

  useEffect(() => {
    fetchAspirantes();
    fetchPersonas();
  }, []);

  const fetchAspirantes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/aspirantes");
      setAspirantes(response.data);
    } catch (error) {
      console.error("Error fetching aspirantes:", error);
    }
  };

  const fetchPersonas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/personas");
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
    setConfirmationAction(() => () => denySolicitud(idAspirante));
    setModalContent("¿Está seguro de denegar la solicitud?");
    setShowConfirmationModal(true);
  };

  const acceptSolicitud = async (idAspirante) => {
    try {
      await axios.put(`http://localhost:5000/aspirantes/aceptar/${idAspirante}`);
      fetchAspirantes();
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Error accepting solicitud:", error);
    }
  };

  const denySolicitud = async (idAspirante) => {
    try {
      await axios.put(`http://localhost:5000/aspirantes/denegar/${idAspirante}`);
      fetchAspirantes();
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Error denying solicitud:", error);
    }
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAspirantes = aspirantes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(aspirantes.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4" style={{ fontWeight: "bold", color: "#007abf" }}>
        SOLICITUDES ENTRANTES PARA VOLUNTARIADO
      </h3>
      <Row>
        {currentAspirantes.map((aspirante) => (
          <Col key={aspirante.idAspirante} sm={12} md={6} lg={4}>
            <Card
              className="mb-3"
              style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", position: "relative" }}
            >
              <Card.Body style={{ position: "relative", paddingBottom: "40px" }}>
                <Card.Title>Aspirante ID: {aspirante.idAspirante}</Card.Title>
                <Card.Text>Estado: {aspirante.estado === 1 ? "Activo" : "Inactivo"}</Card.Text>
                <Card.Text>Fecha de Registro: {formatDate(aspirante.fechaRegistro)}</Card.Text>
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
              <p style={{ color: "#000000" }}><strong>Fecha de Nacimiento:</strong> {formatDate(selectedPersona.fechaNacimiento)}</p>
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
    </div>
  );
}

export default SolicitudesVoluntariado;

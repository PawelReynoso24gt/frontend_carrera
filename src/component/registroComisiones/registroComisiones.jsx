import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Container, Row, Col, Table, Modal } from "react-bootstrap";
import { QrReader } from "react-qr-reader";

function EventosActivos() {
  const [eventos, setEventos] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [showInscripcionesModal, setShowInscripcionesModal] = useState(false);
  const [showQRScannerModal, setShowQRScannerModal] = useState(false);
  const [selectedInscripcion, setSelectedInscripcion] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);

  useEffect(() => {
    fetchEventosActivos();
  }, []);

  const fetchEventosActivos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/eventos/activas");
      setEventos(response.data);
    } catch (error) {
      console.error("Error fetching eventos activos:", error);
    }
  };

  const handleShowInscripciones = async (idEvento) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/inscripcion_eventos/activos?eventoId=${idEvento}`
      );
      setInscripciones(response.data);
      setSelectedEvento(idEvento);
      setShowInscripcionesModal(true);
    } catch (error) {
      console.error("Error fetching inscripciones:", error);
    }
  };

  const handleCloseInscripcionesModal = () => {
    setShowInscripcionesModal(false);
    setSelectedEvento(null);
    setInscripciones([]);
  };

  const handleOpenQRScanner = (inscripcion) => {
    setSelectedInscripcion(inscripcion);
    setShowQRScannerModal(true);
    setHasScanned(false);
  };

  const handleCloseQRScannerModal = () => {
    setShowQRScannerModal(false);
    setSelectedInscripcion(null);
  };

  const handleScan = (scannedData) => {
    if (scannedData && !hasScanned) {
      setHasScanned(true);
      handleCompareQRCode(scannedData);
    }
  };

  const handleError = (err) => {
    console.error("Error scanning QR Code:", err);
  };

  const handleCompareQRCode = async (scannedCode) => {
    if (selectedInscripcion) {
      const expectedCode = selectedInscripcion.voluntario.codigoQR;

      if (scannedCode === expectedCode) {
        try {
          await axios.post(`http://localhost:5000/asistencia_eventos/create`, {
            idInscripcionEvento: selectedInscripcion.idInscripcionEvento,
            fechaHoraAsistencia: new Date(),
            estado: 1,
            idEmpleado: 2,
          });

          handleCloseQRScannerModal();
          setShowSuccessModal(true);

          // Refrescar la lista de inscripciones
          await handleShowInscripciones(selectedEvento);

          // Cerrar el mensaje de éxito después de 3 segundos
          setTimeout(() => {
            setShowSuccessModal(false);
          }, 3000);
        } catch (error) {
          console.error("Error registrando asistencia:", error);
          alert("Error al registrar la asistencia");
        }
      } else {
        alert("Código QR no coincide con el voluntario esperado. Asistencia no registrada.");
      }
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4" style={{ fontWeight: "bold" }}>
        Inscripciones a comisiones Activas
      </h2>
      <Row>
        {eventos.length > 0 ? (
          eventos.map((evento) => (
            <Col key={evento.idEvento} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{evento.nombreEvento}</Card.Title>
                  <Card.Text>
                    <strong>Fecha Inicio:</strong>{" "}
                    {new Date(evento.fechaHoraInicio).toLocaleString()} <br />
                    <strong>Fecha Fin:</strong>{" "}
                    {new Date(evento.fechaHoraFin).toLocaleString()} <br />
                    <strong>Descripción:</strong> {evento.descripcion} <br />
                    <strong>Dirección:</strong> {evento.direccion} <br />
                    <strong>Sede:</strong>{" "}
                    {evento.sede ? evento.sede.nombreSede : "Sin sede asignada"}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="text-center">
                  <Button
                    variant="primary"
                    onClick={() => handleShowInscripciones(evento.idEvento)}
                  >
                    Ver Inscripciones
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center">No hay eventos activos disponibles.</p>
        )}
      </Row>

      <Modal
        show={showInscripcionesModal}
        onHide={handleCloseInscripcionesModal}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Registros a comisiones</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {inscripciones.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID Inscripción</th>
                  <th>Fecha y Hora de Inscripción</th>
                  <th>Voluntario ID</th>
                  <th>Código QR Voluntario</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {inscripciones.map((inscripcion) => (
                  <tr key={inscripcion.idInscripcionEvento}>
                    <td>{inscripcion.idInscripcionEvento}</td>
                    <td>{new Date(inscripcion.fechaHoraInscripcion).toLocaleString()}</td>
                    <td>{inscripcion.voluntario.idVoluntario}</td>
                    <td>{inscripcion.voluntario.codigoQR}</td>
                    <td>
                      <Button
                        variant="success"
                        onClick={() => handleOpenQRScanner(inscripcion)}
                      >
                        Tomar Asistencia
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center">No hay inscripciones para este evento.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseInscripcionesModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showQRScannerModal} onHide={handleCloseQRScannerModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Escanear Código QR del Voluntario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <QrReader
            onResult={(result, error) => {
              if (!!result) {
                handleScan(result?.text);
              }

              if (!!error) {
                handleError(error);
              }
            }}
            style={{ width: "100%" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseQRScannerModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de éxito que se cierra automáticamente */}
      <Modal show={showSuccessModal} centered>
        <Modal.Body className="text-center">
          <h4>Asistencia registrada con éxito</h4>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default EventosActivos;
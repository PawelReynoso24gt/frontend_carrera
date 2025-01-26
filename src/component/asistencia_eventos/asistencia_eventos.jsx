import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Card, Button, Container, Row, Col, Table, Modal } from "react-bootstrap";
import jsQR from "jsqr";

function EventosActivos() {
  const [eventos, setEventos] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [showInscripcionesModal, setShowInscripcionesModal] = useState(false);
  const [showQRScannerModal, setShowQRScannerModal] = useState(false);
  const [selectedInscripcion, setSelectedInscripcion] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false); // Nuevo estado
  const [permissionMessage, setPermissionMessage] = useState('');
  const [permissions, setPermissions] = useState({});
  const [hasViewPermission, setHasViewPermission] = useState(false);
  const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/usuarios/permisos', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPermissions(response.data.permisos || {});

        const hasPermission =
          response.data.permisos['Ver inscripciones a eventos']

        setHasViewPermission(hasPermission);
        setIsPermissionsLoaded(true);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermissions();
  }, []);

  useEffect(() => {
    if (isPermissionsLoaded) {
      if (hasViewPermission) {
        fetchEventosActivos();
      } else {
        checkPermission('Ver inscripciones a eventos', 'No tienes permisos para ver inscripciones a eventos');
      }
    }
  }, [isPermissionsLoaded, hasViewPermission]);

  const checkPermission = (permission, message) => {
    if (!permissions[permission]) {
      setPermissionMessage(message);
      setShowPermissionModal(true);
      return false;
    }
    return true;
  };

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
    startCamera();
  };

  const handleCloseQRScannerModal = () => {
    setShowQRScannerModal(false);
    setSelectedInscripcion(null);
    setHasScanned(false); // Resetear para futuros escaneos
    stopCamera();
  };

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
      });
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code) {
      handleScan(code.data);
    } else {
      alert("No se detectó ningún código QR. Inténtalo de nuevo.");
    }
  };

  const handleScan = (scannedData) => {
    if (scannedData && !hasScanned && selectedInscripcion) {
      setHasScanned(true); // Marcar que ya se ha escaneado
      handleCompareQRCode(scannedData);
    }
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

          // Cerrar el mensaje de éxito después de 3 segundos y recargar la página para evitar el bucle
          setTimeout(() => {
            setShowSuccessModal(false);
            window.location.reload(); // Recargar la página
          }, 3000);
        } catch (error) {
          console.error("Error registrando asistencia:", error);
          alert("Error al registrar la asistencia");
        }
      } else {
        alert("Código QR no coincide con el voluntario esperado. Asistencia no registrada.");
        setHasScanned(false); // Permitir un nuevo intento si el código no coincide
      }
    }
  };

  return (
    <Container className="mt-5" style={{ backgroundColor: "#CEECF2" }}>
      <h2 className="text-center mb-4" style={{ fontWeight: "bold" }}>
        Eventos Activos
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
                    onClick={() => {
                      if (checkPermission('Ver inscripciones a eventos', 'No tienes permisos para ver inscripciones a eventos')) {
                        handleShowInscripciones(evento.idEvento)
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
          <Modal.Title>Inscripciones del Evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {inscripciones.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID Inscripción</th>
                  <th>Fecha y Hora de Inscripción</th>
                  <th>Voluntario</th>
                  <th>Código QR Voluntario</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {inscripciones.map((inscripcion) => (
                  <tr key={inscripcion.idInscripcionEvento}>
                    <td>{inscripcion.idInscripcionEvento}</td>
                    <td>{new Date(inscripcion.fechaHoraInscripcion).toLocaleString()}</td>
                    <td>{inscripcion.voluntario.persona.nombre}</td>
                    <td>{inscripcion.voluntario.codigoQR}</td>
                    <td>
                      <Button
                        variant="success"
                        onClick={() => {
                          if (checkPermission('Tomar asistencia', 'No tienes permisos para ver tomar asistencia')) {
                            handleOpenQRScanner(inscripcion)
                          }
                        }}
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <video ref={videoRef} style={{ width: '100%', maxWidth: '500px' }} />
            <canvas ref={canvasRef} style={{ display: 'none' }} width="500" height="500" />
            <Button variant="success" onClick={capturePhoto} style={{ marginTop: '10px' }}>
              Capturar Foto
            </Button>
          </div>
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

export default EventosActivos;
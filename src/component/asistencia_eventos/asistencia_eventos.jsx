import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Card, Button, Container, Row, Col, Table, Modal } from "react-bootstrap";
import jsQR from "jsqr";
import { getUserDataFromToken } from "../../utils/jwtUtils"; // token
import { format } from "date-fns";
import { parseISO } from "date-fns";
import { FaCheckCircle } from "react-icons/fa";

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
  const [asistencias, setAsistencias] = useState([]);
  const [showAsistenciasModal, setShowAsistenciasModal] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const idEmpleado = getUserDataFromToken(localStorage.getItem("token"))?.idEmpleado; // ! USO DE LA FUNCIÓN getUserDataFromToken

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get('https://api.voluntariadoayuvi.com/usuarios/permisos', {
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
      const response = await axios.get("https://api.voluntariadoayuvi.com/eventos/activas");
      setEventos(response.data);
    } catch (error) {
      console.error("Error fetching eventos activos:", error);
    }
  };

  const handleShowAsistencias = async (idEvento) => {
    try {
      const response = await axios.get(
        `https://api.voluntariadoayuvi.com/asistencia_eventos/evento/${idEvento}`
      );
      setAsistencias(response.data);
      setSelectedEvento(idEvento);
      setShowAsistenciasModal(true);
    } catch (error) {
      console.error("Error fetching asistencias:", error);
    }
  };

  const handleShowInscripciones = async (idEvento) => {
    try {
      const response = await axios.get(
        `https://api.voluntariadoayuvi.com/inscripcion_eventos/activos?eventoId=${idEvento}`
      );
      setInscripciones(response.data);
      setSelectedEvento(idEvento);
      setShowInscripcionesModal(true);
    } catch (error) {
      console.error("Error fetching inscripciones:", error);
    }
  };

  const handleCloseAsistenciasModal = () => {
    setShowAsistenciasModal(false);
    setSelectedEvento(null);
    setAsistencias([]);
  };

  const handleCloseInscripcionesModal = () => {
    setShowInscripcionesModal(false);
    setSelectedEvento(null);
    setInscripciones([]);
  };

  const handleOpenQRScanner = (inscripcion) => {
    setSelectedInscripcion(inscripcion);
    
    // Simular el escaneo del código QR "ABC123"
    //const scannedCode = "ABC123"; // Código QR quemado
    //handleScan(scannedCode); // Llamar directamente a handleScan con el código quemado
  
    // No abrir el modal del escáner
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
          await axios.post(`https://api.voluntariadoayuvi.com/asistencia_eventos/create`, {
            idInscripcionEvento: selectedInscripcion.idInscripcionEvento,
            fechaHoraAsistencia: new Date(),
            estado: 1,
            idEmpleado: idEmpleado,
          });

            // Cerrar el modal del escáner
          handleCloseQRScannerModal();

          // Mostrar el modal de éxito
          setShowSuccessModal(true);

          // Refrescar la lista de inscripciones y asistencias
          await handleShowInscripciones(selectedEvento);
          //await handleShowAsistencias(selectedEvento);

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
                    {evento.fechaHoraInicio ? format(parseISO(evento.fechaHoraInicio), "dd-MM-yyyy hh:mm a") : "Sin fecha"} <br />
                    <strong>Fecha Fin:</strong>{" "}
                    {evento.fechaHoraFin ? format(parseISO(evento.fechaHoraFin), "dd-MM-yyyy hh:mm a") : "Sin fecha"} <br />
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
                  {/* Ver asistencias */}
                  <Button
                    variant="info"
                    onClick={() => {
                      {
                        handleShowAsistencias(evento.idEvento);
                      }
                    }}
                    style={{
                      backgroundColor: "#009B85",
                      borderColor: "#007AC3",
                      padding: "5px 10px",
                      width: "180px",
                      marginTop: "10px",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                  >
                    Ver Asistencias
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
                    <td>{inscripcion.fechaHoraInscripcion ? format(parseISO(inscripcion.fechaHoraInscripcion), "dd-MM-yyyy hh:mm a") : "Sin fecha"}</td>
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

      <Modal
        show={showAsistenciasModal}
        onHide={() => setShowAsistenciasModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Asistencias del Evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {asistencias.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID Asistencia</th>
                  <th>Fecha y Hora de Asistencia</th>
                  <th>Voluntario</th>
                  <th>Empleado que Registró</th>
                </tr>
              </thead>
              <tbody>
                {asistencias.map((asistencia) => (
                  <tr key={asistencia.idAsistenciaEvento}>
                    <td>{asistencia.idAsistenciaEvento}</td>
                    <td>{asistencia.fechaHoraAsistencia ? format(parseISO(asistencia.fechaHoraAsistencia), "dd-MM-yyyy hh:mm a") : "Sin fecha"}</td>
                    <td>{asistencia.inscripcionEvento?.voluntario?.persona?.nombre || 'Nombre no disponible'}</td>
                    <td>{asistencia.empleado?.persona?.nombre || 'Nombre no disponible'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center">No hay asistencias registradas para este evento.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAsistenciasModal(false)}>
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
        <Modal.Body
          className="text-center"
          style={{
            backgroundColor: "#fff", // Fondo blanco
            color: "#000", // Texto negro
            borderRadius: "10px",
            padding: "20px",
            border: "2px solid #007BFF", // Bordes azules
          }}
        >
          <FaCheckCircle
            style={{
              fontSize: "50px",
              marginBottom: "10px",
              color: "#28a745", // Ícono verde
            }}
          />
          <h4 style={{ fontWeight: "bold", marginBottom: "10px", color: "#000" }}>
            Asistencia registrada con éxito
          </h4>
          <p style={{ fontSize: "16px", marginBottom: "0", color: "#000" }}>
            La asistencia ha sido registrada correctamente.
          </p>
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
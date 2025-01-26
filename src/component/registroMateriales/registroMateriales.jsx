import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Container, Row, Col, Spinner, Modal, Button } from "react-bootstrap";

function InscripcionesMateriales() {
  const [inscripciones, setInscripciones] = useState([]); // Manejar múltiples detalles
  const [isLoading, setIsLoading] = useState(true);
  const [showPermissionModal, setShowPermissionModal] = useState(false); // Nuevo estado
  const [permissionMessage, setPermissionMessage] = useState('');
  const [permissions, setPermissions] = useState({});
  const [hasViewPermission, setHasViewPermission] = useState(false);
  const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);

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
          response.data.permisos['Ver inscripciones a materiales']

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
        fetchInscripciones();
      } else {
        checkPermission('Ver inscripciones a materiales', 'No tienes permisos para ver inscripciones a materiales');
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


  const fetchInscripciones = async () => {
    try {
      setIsLoading(true);

      // Hacer la solicitud al backend
      const response = await axios.get("http://localhost:5000/detalle_inscripcion_materiales");


      // Procesar los datos
      const inscripcionesData = response.data.map((inscripcion) => ({
        idDetalleInscripcionMaterial: inscripcion.idDetalleInscripcionMaterial,
        estado: inscripcion.estado === 1 ? "Activo" : "Inactivo",
        cantidadMaterial: inscripcion.cantidadMaterial || "No disponible",
        nombreEvento: inscripcion.inscripcionEvento?.evento?.nombreEvento || "No disponible",
        nombreComision: inscripcion.inscripcion_comisione?.comisione?.comision || "No disponible",
        nombreMaterial: inscripcion.material?.material || "No disponible",
      }));

      setInscripciones(inscripcionesData);
    } catch (error) {
      console.error("Error fetching inscripciones:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4" style={{ fontWeight: "bold" }}>
        Detalle de Inscripciones de Materiales
      </h2>
      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" variant="info" />
          <p>Cargando datos...</p>
        </div>
      ) : inscripciones.length > 0 ? (
        <Row>
          {inscripciones.map((inscripcion, index) => (
            <Col key={index} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>
                    Inscripción #{inscripcion.idDetalleInscripcionMaterial}
                  </Card.Title>
                  <Card.Text>
                    <strong>Evento:</strong> {inscripcion.nombreEvento}<br />
                    <strong>Comisión:</strong> {inscripcion.nombreComision}<br />
                    <strong>Material:</strong> {inscripcion.nombreMaterial}<br />
                    <strong>Cantidad Material:</strong> {inscripcion.cantidadMaterial}<br />
                    <strong>Estado:</strong> {inscripcion.estado}<br />
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center">
          <p>No se encontraron inscripciones.</p>
        </div>
      )}
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

export default InscripcionesMateriales;

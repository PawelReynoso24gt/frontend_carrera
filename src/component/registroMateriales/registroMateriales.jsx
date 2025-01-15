import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";

function InscripcionesMateriales() {
  const [inscripciones, setInscripciones] = useState([]); // Manejar múltiples detalles
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInscripciones();
  }, []);

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
    </Container>
  );
}

export default InscripcionesMateriales;

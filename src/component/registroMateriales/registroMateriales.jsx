import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";

function InscripcionesMateriales() {
  const [inscripciones, setInscripciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInscripciones();
  }, []);

  const fetchInscripciones = async () => {
    try {
      setIsLoading(true);

      // Obtener las inscripciones iniciales
      const response = await axios.get("http://localhost:5000/detalle_inscripcion_materiales");

      const inscripcionesData = await Promise.all(
        response.data.map(async (inscripcion) => {
          let nombrePersona = "No disponible"; // Aseguramos un valor por defecto

          try {
            // Obtener datos del evento y la comisión
            const [evento, comision] = await Promise.all([
              axios.get(`http://localhost:5000/eventos/${inscripcion.idInscripcionEvento}`),
              axios.get(`http://localhost:5000/comisiones/${inscripcion.idInscripcionComision}`),
            ]);

            // Obtener el ID del voluntario desde la comisión relacionada
            const idVoluntario = comision.data?.idVoluntario;

            // Si existe el ID del voluntario, buscamos el nombre de la persona
            if (idVoluntario) {
              const voluntarioResponse = await axios.get(`http://localhost:5000/voluntarios/${idVoluntario}`);
              if (voluntarioResponse.data?.persona) {
                nombrePersona = voluntarioResponse.data.persona.nombre || "No disponible";
              }
            }

            return {
              ...inscripcion,
              nombreEvento: evento.data.nombreEvento || "No disponible",
              nombreComision: comision.data.comision || "No disponible",
              nombrePersona: nombrePersona,
            };
          } catch (error) {
            console.error("Error al mapear inscripciones:", error);
            return {
              ...inscripcion,
              nombreEvento: "No disponible",
              nombreComision: "No disponible",
              nombrePersona: nombrePersona,
            };
          }
        })
      );

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
        Detalle de Inscripciones Materiales
      </h2>
      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" variant="info" />
          <p>Cargando datos...</p>
        </div>
      ) : (
        <Row>
          {inscripciones.map((inscripcion) => (
            <Col key={inscripcion.idDetalleInscripcionMaterial} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>Inscripción #{inscripcion.idDetalleInscripcionMaterial}</Card.Title>
                  <Card.Text>
                    <strong>Nombre del Evento:</strong> {inscripcion.nombreEvento}
                    <br />
                    <strong>Nombre de la Comisión:</strong> {inscripcion.nombreComision}
                    <br />
                    <strong>Nombre del Voluntario:</strong> {inscripcion.nombrePersona}
                    <br />
                    <strong>Cantidad de Material:</strong> {inscripcion.cantidadMaterial}
                    <br />
                    <strong>Estado:</strong> {inscripcion.estado === 1 ? "Activo" : "Inactivo"}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default InscripcionesMateriales;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";

function InscripcionesActividades() {
  const [inscripciones, setInscripciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInscripciones();
  }, []);

  const fetchInscripciones = async () => {
    try {
      setIsLoading(true);

      // Obtener los registros iniciales
      const response = await axios.get("http://localhost:5000/detalle_inscripcion_actividades");

      const inscripcionesData = await Promise.all(
        response.data.map(async (inscripcion) => {
          try {
            // Obtener los datos relacionados: evento, comisión y actividad
            const [evento, comision, actividad] = await Promise.all([
              axios.get(`http://localhost:5000/eventos/${inscripcion.idInscripcionEvento}`),
              axios.get(`http://localhost:5000/comisiones/${inscripcion.idInscripcionComision}`),
              axios.get(`http://localhost:5000/actividades/${inscripcion.idActividad}`),
            ]);

            // Procesar los datos
            const eventoData = evento.data;
            const comisionData = comision.data;
            const actividadData = actividad.data;

            return {
              ...inscripcion,
              nombreEvento: eventoData.nombreEvento || "No disponible",
              nombreComision: comisionData.comision || "No disponible",
              nombreActividad: actividad.data.actividad || "No disponible",
            };
          } catch (error) {
            console.error("Error al mapear inscripciones:", error);
            return {
              ...inscripcion,
              nombreEvento: "No disponible",
              nombreComision: "No disponible",
              nombreActividad: "No disponible",
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
        Detalle de Inscripciones Actividades
      </h2>
      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" variant="info" />
          <p>Cargando datos...</p>
        </div>
      ) : (
        <Row>
          {inscripciones.map((inscripcion) => (
            <Col key={inscripcion.idDetalleInscripcionActividad} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>Inscripción #{inscripcion.idDetalleInscripcionActividad}</Card.Title>
                  <Card.Text>
                    <strong>Nombre del Evento:</strong> {inscripcion.nombreEvento}
                    <br />
                    <strong>Nombre de la Comisión:</strong> {inscripcion.nombreComision}
                    <br />
                    <strong>Nombre de la Actividad:</strong> {inscripcion.nombreActividad}
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

export default InscripcionesActividades;

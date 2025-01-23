import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Table,
  Spinner,
} from "react-bootstrap";

function EventosActivos() {
  const [eventos, setEventos] = useState([]);
  const [comisiones, setComisiones] = useState({});
  const [selectedVoluntarios, setSelectedVoluntarios] = useState([]);
  const [isLoadingVoluntarios, setIsLoadingVoluntarios] = useState(false);
  const [isVoluntariosLoaded, setIsVoluntariosLoaded] = useState(false);

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

  const fetchComisionesByEvento = async (idEvento) => {
    
    setComisiones({});
    setIsVoluntariosLoaded(false);
    try {
      const responseComisiones = await axios.get(
        `http://localhost:5000/comisiones/porevento?eventoId=${idEvento}`
      );

      const responseInscripciones = await axios.get(
        `http://localhost:5000/inscripcion_comisiones/activos?eventoId=${idEvento}`
      );

      const comisionesConVoluntarios = responseComisiones.data.map((comision) => {
        const totalVoluntarios = responseInscripciones.data.filter(
          (inscripcion) => inscripcion.comisione?.idComision === comision.idComision
        ).length;

        return {
          ...comision,
          totalVoluntarios,
        };
      });

      setComisiones((prevComisiones) => ({
        ...prevComisiones,
        [idEvento]: comisionesConVoluntarios,
      }));
    } catch (error) {
      console.error("Error fetching comisiones o inscripciones:", error);
    }
  };

  const fetchVoluntariosByComision = async (idComision, idEvento) => {
    setIsLoadingVoluntarios(true);
    setIsVoluntariosLoaded(false);
  
    try {
      console.log("ID del evento:", idEvento);
      console.log("ID de la comisión:", idComision);
  
      const response = await axios.get(
        `http://localhost:5000/inscripcion_comisiones/activos?eventoId=${idEvento}`
      );
  
      console.log("Respuesta completa de la API:", response.data);
  
      // Filtrar inscripciones por idComision y mapear datos del voluntario
      const voluntarios = response.data
        .filter((inscripcion) => {
          console.log("ID Comisión en inscripción:", inscripcion.idComision);
          return inscripcion.idComision === idComision; // Comparar directamente con idComision
        })
        .map((inscripcion) => ({
          idComision: inscripcion.idComision,
          idVoluntario: inscripcion.voluntario?.idVoluntario || "N/A",
          nombre: inscripcion.voluntario?.persona?.nombre || "Nombre no disponible", // Extraer nombre desde persona
        }));
  
      console.log("Voluntarios filtrados:", voluntarios);
  
      setSelectedVoluntarios(voluntarios);
      setIsVoluntariosLoaded(true);
    } catch (error) {
      console.error("Error fetching voluntarios:", error);
      setSelectedVoluntarios([]);
    } finally {
      setIsLoadingVoluntarios(false);
    }
  };
  
  return (
    <Container className="mt-5" style={{maxWidth: "100%", margin: "0 auto" }}>
      <h2 className="text-center mb-4" style={{ fontWeight: "bold" }}>
        Inscripciones a comisiones activas
      </h2>

      <Tabs
        defaultActiveKey="eventos"
        id="eventos-tabs"
        className="mb-3"
        onSelect={(key) => {
          if (key !== "eventos") fetchComisionesByEvento(key);
          setSelectedVoluntarios([]); // Limpiar voluntarios al cambiar de pestaña
          setIsVoluntariosLoaded(false);
        }}
      >
        <Tab eventKey="eventos" title="Eventos Disponibles">
          <Row>
            {eventos.map((evento) => (
              <div class="col-sm-4 mb-4" key={evento.idEvento} md={6} lg={4} style={{ marginBottom: "20px" }}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title>{evento.nombreEvento}</Card.Title>
                    <Card.Text>
                      <strong>Descripción:</strong> {evento.descripcion}
                      <br />
                      <strong>Fecha:</strong>{" "}
                      {new Date(evento.fechaHoraInicio).toLocaleDateString()}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </Row>
        </Tab>

        {eventos.map((evento) => (
          <Tab key={evento.idEvento} eventKey={evento.idEvento} title={evento.nombreEvento}>
            <h4 className="text-center mb-3">Comisiones de: {evento.nombreEvento}</h4>
            <Row>
              {comisiones[evento.idEvento]?.map((comision) => {
                const maxPersonas = comision.detalleHorario?.cantidadPersonas || 0;
                const totalVoluntarios = comision.totalVoluntarios || 0;
                const isFull = totalVoluntarios >= maxPersonas; // Verifica si la comisión está llena

                return (
                  <div class="col-sm-4 mb-4" key={comision.idComision} md={6} lg={4} style={{ marginBottom: "20px" }}>
                    <Card className="h-100 shadow-sm">
                      <Card.Body>
                        <Card.Title>{comision.comision}</Card.Title>
                        <Card.Text>
                          <strong>Descripción:</strong> {comision.descripcion || "No disponible"}
                          <br />
                          <strong>Personas inscritas:</strong> {totalVoluntarios} / {maxPersonas}
                        </Card.Text>
                        {isFull && (
                          <p className="text-danger mt-3">
                            Ya no se pueden inscribir más personas a esta comisión.
                          </p>
                          
                        )}
                      </Card.Body>
                      <Card.Footer className="text-center">
                        <Button
                          className="btn-primary"
                          onClick={() => fetchVoluntariosByComision(comision.idComision, evento.idEvento)}
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
                          Ver Voluntarios
                        </Button>
                      </Card.Footer>
                    </Card>
                  </div>
                );
              })}
            </Row>

            {/* Tabla de voluntarios */}
            {isLoadingVoluntarios && (
              <div className="text-center mt-3">
                <Spinner animation="border" variant="primary" />
                <p>Cargando voluntarios...</p>
              </div>
            )}

            {isVoluntariosLoaded && (
              <Table striped bordered hover className="mt-4">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>ID Voluntario</th>
                    <th>Nombre</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedVoluntarios.length > 0 ? (
                    selectedVoluntarios.map((voluntario, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{voluntario.idVoluntario}</td>
                        <td>{voluntario.nombre}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No hay voluntarios registrados para esta comisión.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </Tab>
        ))}
      </Tabs>
    </Container>
  );
}

export default EventosActivos;

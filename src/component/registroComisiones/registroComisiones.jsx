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
  Pagination,
  Spinner,
} from "react-bootstrap";

function EventosActivos() {
  const [eventos, setEventos] = useState([]);
  const [comisiones, setComisiones] = useState({});
  const [selectedVoluntarios, setSelectedVoluntarios] = useState([]);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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
    setSelectedVoluntarios([]);
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

      setSelectedEvento(idEvento);
    } catch (error) {
      console.error("Error fetching comisiones o inscripciones:", error);
    }
  };

  const fetchVoluntariosByComision = async (idComision) => {
    setIsLoadingVoluntarios(true);
    setIsVoluntariosLoaded(false);

    try {
      const response = await axios.get(
        `http://localhost:5000/inscripcion_comisiones/activos?eventoId=${selectedEvento}`
      );

      const voluntarios = response.data
        .filter((inscripcion) => inscripcion.comisione?.idComision === idComision)
        .map((inscripcion) => ({
          idComision: inscripcion.comisione?.idComision,
          idVoluntario: inscripcion.voluntario?.idVoluntario || "N/A",
          nombre: inscripcion.voluntario?.persona?.nombre || "Nombre no disponible",
        }));

      setSelectedVoluntarios(voluntarios);
      setIsVoluntariosLoaded(true);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching voluntarios:", error);
    } finally {
      setIsLoadingVoluntarios(false);
    }
  };

  const paginatedVoluntarios = selectedVoluntarios.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <>
      {/* Estilos CSS integrados */}
      <style>
        {`
          .custom-card {
            background-color: #f8f9fa;
            border: 1px solid #ddd;
            border-radius: 10px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s ease-in-out;
          }

          .custom-card:hover {
            transform: translateY(-5px);
          }

          .custom-button {
            background-color: #007bff;
            color: white;
            font-weight: bold;
            border: none;
            transition: background-color 0.3s ease-in-out;
            padding: 5px 10px; 
            width: 200px
          }

          .custom-button:hover {
            background-color: #0056b3;
          }

          .full-commission {
            background-color: #ffc0c0;
            color: red;
            font-weight: bold;
            text-align: center;
            padding: 10px 0;
          }
        `}
      </style>

      {/* Componente principal */}
      <Container className="mt-5">
        <h2 className="text-center mb-4" style={{ fontWeight: "bold" }}>
          Inscripciones a comisiones activas
        </h2>

        <Tabs
          defaultActiveKey="eventos"
          id="eventos-tabs"
          className="mb-3"
          onSelect={(key) => {
            setSelectedVoluntarios([]);
            setIsVoluntariosLoaded(false);
            if (key !== "eventos") fetchComisionesByEvento(key);
          }}
        >
          <Tab eventKey="eventos" title="Eventos Disponibles">
            <Row>
              {eventos.map((evento) => (
                <Col key={evento.idEvento} md={6} lg={4} className="mb-4">
                  <Card className="custom-card h-100">
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
                </Col>
              ))}
            </Row>
          </Tab>

          {eventos.map((evento) => (
            <Tab
              key={evento.idEvento}
              eventKey={evento.idEvento}
              title={evento.nombreEvento}
            >
              <h4 className="text-center mb-3">Comisiones de: {evento.nombreEvento}</h4>
              <Row>
                {comisiones[evento.idEvento]?.map((comision) => {
                  const maxPersonas = comision.detalleHorario?.cantidadPersonas || 0;
                  const totalVoluntarios = comision.totalVoluntarios || 0;

                  return (
                    <Col key={comision.idComision} md={6} lg={4} className="mb-4">
                      <Card className="custom-card h-100">
                        <Card.Body>
                          <Card.Title>{comision.comision}</Card.Title>
                          <Card.Text>
                            <strong>Descripción:</strong> {comision.descripcion || "No disponible"}
                            <br />
                            <strong>Personas inscritas:</strong> {totalVoluntarios} / {maxPersonas}
                          </Card.Text>
                        </Card.Body>

                        {totalVoluntarios >= maxPersonas && (
                          <div className="full-commission">Comisión Llena</div>
                        )}

                        <Card.Footer className="text-center">
                          <Button
                            className="custom-button"
                            onClick={() => fetchVoluntariosByComision(comision.idComision)}
                          >
                            Ver Voluntarios
                          </Button>
                        </Card.Footer>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Tab>
          ))}
        </Tabs>
      </Container>
    </>
  );
}

export default EventosActivos;

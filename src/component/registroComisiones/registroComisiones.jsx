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
  Modal
} from "react-bootstrap";

function EventosActivos() {
  const [eventos, setEventos] = useState([]);
  const [comisiones, setComisiones] = useState({});
  const [selectedVoluntarios, setSelectedVoluntarios] = useState([]);
  const [isLoadingVoluntarios, setIsLoadingVoluntarios] = useState(false);
  const [isVoluntariosLoaded, setIsVoluntariosLoaded] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false); // Nuevo estado
  const [permissionMessage, setPermissionMessage] = useState('');
  const [permissions, setPermissions] = useState({});
  const [hasViewPermission, setHasViewPermission] = useState(false);
  const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);

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
          response.data.permisos['Ver inscripciones a comisiones']

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
        checkPermission('Ver inscripciones a comisiones', 'No tienes permisos para ver inscripciones a comisiones');
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

  const fetchComisionesByEvento = async (idEvento) => {

    setComisiones({});
    setIsVoluntariosLoaded(false);
    try {
      const responseComisiones = await axios.get(
        `https://api.voluntariadoayuvi.com/comisiones/poreventoFr?eventoId=${idEvento}`
      );

      const responseInscripciones = await axios.get(
        `https://api.voluntariadoayuvi.com/inscripcion_comisiones/activos?eventoId=${idEvento}`
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
      // console.log("ID del evento:", idEvento);
      // console.log("ID de la comisión:", idComision);

      const response = await axios.get(
        `https://api.voluntariadoayuvi.com/inscripcion_comisiones/activos?eventoId=${idEvento}`
      );

      //console.log("Respuesta completa de la API:", response.data);

      // Filtrar inscripciones por idComision y mapear datos del voluntario
      const voluntarios = response.data
        .filter((inscripcion) => {
          //console.log("ID Comisión en inscripción:", inscripcion.idComision);
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
    <Container className="mt-5" style={{
      maxWidth: "100%",
      margin: "0 auto",
    }}>
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
              <Col key={evento.idEvento} md={6} lg={4} className="mb-4">
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
              </Col>
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
                  <Col key={comision.idComision} md={6} lg={4} className="mb-4">
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
                  </Col>
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

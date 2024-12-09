import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Alert, Spinner, Breadcrumb, Button } from "react-bootstrap";

function AsignacionStands() {
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAsignaciones();
  }, []);

  const fetchAsignaciones = async () => {
    try {
      const response = await axios.get("http://localhost:5000/asignacion_stands/voluntarios_por_stand");
      if (Array.isArray(response.data)) {
        setAsignaciones(response.data);
        setLoading(false);
      } else {
        throw new Error("La respuesta de la API no es un arreglo");
      }
    } catch (err) {
      console.error("Error al obtener las asignaciones:", err);
      setError("Error al obtener las asignaciones de voluntarios.");
      setLoading(false);
    }
  };

  const fetchAsignacionesActivas = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/asignacion_stands/voluntarios_por_stand/activos"
      );
      if (Array.isArray(response.data)) {
        setAsignaciones(response.data);
      } else {
        throw new Error("La respuesta de la API no es un arreglo");
      }
    } catch (err) {
      console.error("Error al obtener asignaciones activas:", err);
      setError("Error al obtener las asignaciones activas.");
    }
  };

  const fetchAsignacionesInactivas = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/asignacion_stands/voluntarios_por_stand/inactivos"
      );
      if (Array.isArray(response.data)) {
        setAsignaciones(response.data);
      } else {
        throw new Error("La respuesta de la API no es un arreglo");
      }
    } catch (err) {
      console.error("Error al obtener asignaciones inactivas:", err);
      setError("Error al obtener las asignaciones inactivas.");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spinner animation="border" variant="primary" />
        <p>Cargando asignaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" style={{ marginTop: "20px", textAlign: "center" }}>
        {error}
      </Alert>
    );
  }

  return (
    <div className="container mt-4">
      {/* Título y Breadcrumb */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
         .
        </h3>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item active>Asignación de Voluntarios a Stands</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      {/* Contenedor Principal */}
      <div
        className="container mt-4"
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
          <div className="row" style={{ textAlign: "center", marginBottom: "20px" }}>
           <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
            <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
            Asignación de Voluntarios a Stands
          </h3>
        </div>

         {/* Botones de filtro */}
      <div className="d-flex justify-content-center mb-4">
      <Button
          style={{
            backgroundColor: "#007abf",
            borderColor: "#007AC3",
            padding: "5px 10px",
            width: "100px",
            marginRight: "10px",
            fontWeight: "bold",
            color: "#fff",
          }}
          onClick={fetchAsignaciones}
        >
          Todas
        </Button>
        <Button
          style={{
            backgroundColor: "#009B85",
            borderColor: "#007AC3",
            padding: "5px 10px",
            width: "100px",
            marginRight: "10px",
            fontWeight: "bold",
            color: "#fff",
          }}
          onClick={fetchAsignacionesActivas}
        >
          Activas
        </Button>
        <Button
          style={{
            backgroundColor: "#bf2200",
            borderColor: "#007AC3",
            padding: "5px 10px",
            width: "100px",
            fontWeight: "bold",
            color: "#fff",
          }}
          onClick={fetchAsignacionesInactivas}
        >
          Inactivas
        </Button>
      </div>

      </div>
        {asignaciones.length > 0 ? (
          asignaciones.map((stand) => (
            <div key={stand.standId} className="stand-group mb-4">
              <h5 style={{ color: "#007AC3", fontWeight: "bold", marginBottom: "15px" }}>
                {stand.standNombre}
              </h5>
              <Table striped bordered hover responsive>
                <thead style={{ backgroundColor: "#007AC3", color: "#fff", textAlign: "center" }}>
                  <tr>
                    <th>ID Voluntario</th>
                    <th>Voluntario</th>
                    <th>Teléfono</th>
                    <th>Horario</th>
                  </tr>
                </thead>
                <tbody>
                  {stand.voluntarios.map((voluntario) => (
                    <tr key={voluntario.idVoluntario}>
                      <td>{voluntario.idVoluntario}</td>
                      <td>{voluntario.nombreVoluntario}</td>
                      <td>{voluntario.telefonoVoluntario}</td>
                      <td>
                        {new Date(voluntario.horarioInicio).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {new Date(voluntario.horarioFinal).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ))
        ) : (
          <p className="text-center">No hay asignaciones disponibles.</p>
        )}
      </div>
    </div>
  );
}

export default AsignacionStands;

import React, { useEffect, useState } from "react";
import axios from "axios";

function ActivitySection({ className }) {
  const [asistencias, setAsistencias] = useState([]);
  const [voluntarioDestacado, setVoluntarioDestacado] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [asistenciasResponse, voluntarioDelMesResponse] = await Promise.all([
        axios.get("http://localhost:5000/asistencia_eventos"),
        axios.get("http://localhost:5000/voluntarioDelMes"),
      ]);

      const asistenciasData = asistenciasResponse.data || [];
      const voluntarioDelMesData = voluntarioDelMesResponse.data || {};

      setAsistencias(asistenciasData);
      setVoluntarioDestacado(voluntarioDelMesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setAsistencias([]);
      setVoluntarioDestacado(null);
    }
  };

  const styles = {
    container: {
      backgroundColor: "#f0f8ff", // Fondo azul claro
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      padding: "20px",
      marginBottom: "20px",
    },
    heading: {
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "24px",
      color: "#2a9d8f", // Verde
      marginBottom: "20px",
    },
    alert: {
      backgroundColor: "#EBE02E", // Amarillo
      color: "#264653", // Verde oscuro
      padding: "10px",
      borderRadius: "4px",
      textAlign: "center",
      fontWeight: "bold",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    tableHead: {
      backgroundColor: "#284CDB", // Verde oscuro
      color: "#ffffff",
    },
    tableRow: {
      textAlign: "center",
    },
    tableCell: {
      border: "1px solid #ddd",
      padding: "8px",
    },
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  };


  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>ASISTENCIAS Y VOLUNTARIO DEL MES</h3>

      {voluntarioDestacado && (
        <div style={styles.alert} >
           <span style={{ fontSize: '25px' }}>
          <strong>Voluntario del mes:</strong> El voluntario{" "}
          <strong>{voluntarioDestacado.nombreVoluntario}</strong> tiene{" "}
          <strong>{voluntarioDestacado.puntos.punteo}</strong> puntos.
          </span>
        </div>
      )}

      <table style={styles.table}>
        <thead style={styles.tableHead}>
          <tr>
            <th style={styles.tableCell}>ID Asistencia</th>
            <th style={styles.tableCell}>Evento</th>
            <th style={styles.tableCell}>Voluntario</th>
            <th style={styles.tableCell}>Fecha</th>
            <th style={styles.tableCell}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {asistencias.map((asistencia) => (
            <tr key={asistencia.idAsistenciaEvento} style={styles.tableRow}>
              <td style={styles.tableCell}>{asistencia.idAsistenciaEvento}</td>
              <td style={styles.tableCell}>
                {asistencia.inscripcionEvento && asistencia.inscripcionEvento.evento 
                  ? asistencia.inscripcionEvento.evento.nombreEvento 
                  : "Desconocido"}
              </td>
              <td style={styles.tableCell}>
                {asistencia.inscripcionEvento && asistencia.inscripcionEvento.voluntario 
                  ? asistencia.inscripcionEvento.voluntario.persona.nombre 
                  : "Desconocido"}
              </td>
              <td style={styles.tableCell}>{formatDate(asistencia.createdAt)}</td>
              <td style={styles.tableCell}>
                {asistencia.estado === 1 ? "Activo" : "Inactivo"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ActivitySection;

import React, { useEffect, useState } from "react";
import axios from "axios";

function ActivitySection({ className }) {
  const [asistencias, setAsistencias] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [empleadoDestacado, setEmpleadoDestacado] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [asistenciasResponse, empleadosResponse, personasResponse] =
        await Promise.all([
          axios.get("http://localhost:5000/asistencia_eventos"),
          axios.get("http://localhost:5000/empleados"),
          axios.get("http://localhost:5000/personas"),
        ]);

      const asistenciasData = asistenciasResponse.data || [];
      const empleadosData = empleadosResponse.data || [];
      const personasData = personasResponse.data || [];

      setAsistencias(asistenciasData);
      setEmpleados(empleadosData);
      setPersonas(personasData);

      calcularEmpleadoDestacado(asistenciasData, empleadosData, personasData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setAsistencias([]);
      setEmpleados([]);
      setPersonas([]);
    }
  };

  const calcularEmpleadoDestacado = (asistenciasData, empleadosData, personasData) => {
    const asistenciaPorEmpleado = {};

    asistenciasData.forEach((asistencia) => {
      const key = `${asistencia.idEvento}-${asistencia.idEmpleado}`;
      asistenciaPorEmpleado[key] = (asistenciaPorEmpleado[key] || 0) + 1;
    });

    let maxAsistencias = 0;
    let destacado = null;

    Object.keys(asistenciaPorEmpleado).forEach((key) => {
      const [idEvento, idEmpleado] = key.split("-");
      const asistencias = asistenciaPorEmpleado[key];

      if (asistencias > maxAsistencias) {
        maxAsistencias = asistencias;
        destacado = { idEvento, idEmpleado: parseInt(idEmpleado), asistencias };
      }
    });

    if (destacado) {
      const empleado = empleadosData.find(
        (emp) => emp.idEmpleado === destacado.idEmpleado
      );

      if (empleado) {
        const persona = personasData.find(
          (pers) => pers.idPersona === empleado.idPersona
        );

        destacado.nombreEmpleado = persona ? persona.nombre : "Desconocido";
      } else {
        destacado.nombreEmpleado = "Desconocido";
      }
    }

    setEmpleadoDestacado(destacado);
  };

  const obtenerNombreEmpleado = (idEmpleado) => {
    const empleado = empleados.find(
      (empleado) => empleado.idEmpleado === idEmpleado
    );
    if (empleado) {
      const persona = personas.find(
        (persona) => persona.idPersona === empleado.idPersona
      );
      return persona ? persona.nombre : "Desconocido";
    }
    return "Desconocido";
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
      <h3 style={styles.heading}>ASISTENCIA DE PARTICIPANTES</h3>

      {empleadoDestacado && (
        <div style={styles.alert}>
          <strong>Empleado destacado:</strong> El empleado{" "}
          <strong>{empleadoDestacado.nombreEmpleado}</strong> tiene{" "}
          <strong>{empleadoDestacado.asistencias}</strong> asistencias, equivalente al mayor número registrado.
        </div>
      )}

      <table style={styles.table}>
        <thead style={styles.tableHead}>
          <tr>
            <th style={styles.tableCell}>ID Asistencia</th>
            <th style={styles.tableCell}>Estado</th>
            <th style={styles.tableCell}>ID Inscripción</th>
            <th style={styles.tableCell}>Empleado</th>
            <th style={styles.tableCell}>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {asistencias.map((asistencia) => (
            <tr key={asistencia.idAsistenciaEvento} style={styles.tableRow}>
              <td style={styles.tableCell}>{asistencia.idAsistenciaEvento}</td>
              <td style={styles.tableCell}>
                {asistencia.estado === 1 ? "Activo" : "Inactivo"}
              </td>
              <td style={styles.tableCell}>{asistencia.idInscripcionEvento}</td>
              <td style={styles.tableCell}>
                {obtenerNombreEmpleado(asistencia.idEmpleado)}
              </td>
              <td style={styles.tableCell}>{formatDate(asistencia.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ActivitySection;

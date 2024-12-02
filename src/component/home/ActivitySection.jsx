import React, { useEffect, useState } from "react";
import SelectInput from "../form/SelectInput";
import axios from "axios";

function ActivitySection({ className }) {
  const [asistencias, setAsistencias] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [empleadoDestacado, setEmpleadoDestacado] = useState(null);
  const [page, setPage] = useState(1);
  const [show, setShow] = useState(4);

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

      calcularEmpleadoDestacado(asistenciasData, empleadosData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setAsistencias([]);
      setEmpleados([]);
      setPersonas([]);
    }
  };

  const calcularEmpleadoDestacado = (asistenciasData, empleadosData) => {
    const asistenciaPorEmpleado = {};

    // Contar las asistencias por empleado
    asistenciasData.forEach((asistencia) => {
      const key = `${asistencia.idEvento}-${asistencia.idEmpleado}`;
      asistenciaPorEmpleado[key] = (asistenciaPorEmpleado[key] || 0) + 1;
    });

    // Buscar el empleado con más asistencias
    let maxAsistencias = 0;
    let destacado = null;

    Object.keys(asistenciaPorEmpleado).forEach((key) => {
      const [idEvento, idEmpleado] = key.split("-");
      const asistencias = asistenciaPorEmpleado[key];

      if (asistencias > maxAsistencias) {
        maxAsistencias = asistencias;
        destacado = { idEvento, idEmpleado, asistencias };
      }
    });

    if (destacado) {
      const empleado = empleadosData.find(
        (empleado) => empleado.idEmpleado === parseInt(destacado.idEmpleado)
      );
      if (empleado) {
        const persona = personas.find(
          (persona) => persona.idPersona === empleado.idPersona
        );
        destacado.nombreEmpleado = persona ? persona.nombre : "Desconocido";
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

  return (
    <div className={`${className ? className : "crancy-table"} mg-top-30`}>
      <div className="crancy-table__heading">
        <h3 className="crancy-table__title mb-0">Asistencia de Participantes</h3>
        <SelectInput
          options={[" Last 7 Days", " Last 15 Days", "Last Month"]}
        />
      </div>

      {/* Empleado destacado */}
      {empleadoDestacado && (
        <div className="alert alert-info" role="alert">
          <strong>Empleado destacado:</strong> El empleado{" "}
          <strong>{empleadoDestacado.nombreEmpleado}</strong> tiene{" "}
          <strong>{empleadoDestacado.asistencias}</strong> asistencias 
        </div>
      )}

      <div className="tab-content" id="myTabContent">
        <div
          className="tab-pane fade show active"
          id="table_1"
          role="tabpanel"
          aria-labelledby="table_1"
        >
          {/* Tabla de asistencias */}
          <table
            id="crancy-table__main"
            className="crancy-table__main crancy-table__main-v1"
          >
            <thead className="crancy-table__head">
              <tr>
                <th>ID Asistencia</th>
                <th>Estado</th>
                <th>ID Inscripción</th>
                <th>Empleado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody className="crancy-table__body">
              {asistencias?.map((asistencia) => (
                <tr key={asistencia.idAsistenciaEvento}>
                  <td>{asistencia.idAsistenciaEvento}</td>
                  <td>{asistencia.estado === 1 ? "Activo" : "Inactivo"}</td>
                  <td>{asistencia.idInscripcionEvento}</td>
                  <td>{obtenerNombreEmpleado(asistencia.idEmpleado)}</td>
                  <td>{asistencia.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ActivitySection;

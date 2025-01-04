import React, { useEffect, useState } from "react";
import axios from "axios";

function TopSeller() {
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    fetchAsistencias();
  }, []);

  const fetchAsistencias = async () => {
    try {
      const asistenciasResponse = await axios.get(
        "http://localhost:5000/asistencia_eventos"
      );
      const empleadosResponse = await axios.get(
        "http://localhost:5000/empleados"
      );
      const personasResponse = await axios.get(
        "http://localhost:5000/personas"
      );

      const asistencias = asistenciasResponse.data;
      const empleadosData = empleadosResponse.data;
      const personasData = personasResponse.data;

      // Contar asistencias por empleado
      const asistenciasPorEmpleado = {};
      asistencias.forEach((asistencia) => {
        if (asistenciasPorEmpleado[asistencia.idEmpleado]) {
          asistenciasPorEmpleado[asistencia.idEmpleado]++;
        } else {
          asistenciasPorEmpleado[asistencia.idEmpleado] = 1;
        }
      });

      // Crear lista de empleados con nombres y asistencias
      const empleadosConNombres = Object.entries(asistenciasPorEmpleado).map(
        ([idEmpleado, asistencias]) => {
          const empleado = empleadosData.find(
            (emp) => emp.idEmpleado === parseInt(idEmpleado)
          );
          const persona = empleado
            ? personasData.find((pers) => pers.idPersona === empleado.idPersona)
            : null;
          return {
            idEmpleado,
            nombre: persona ? persona.nombre : "Desconocido",
            asistencias,
          };
        }
      );

      // Ordenar empleados por número de asistencias (descendente)
      empleadosConNombres.sort((a, b) => b.asistencias - a.asistencias);

      setEmpleados(empleadosConNombres);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="col-xl-12 col-lg-6 col-md-6 col-12 crancy-sidebar__widget" >
      <div className="crancy-sidebar__single" style={{ backgroundColor: "#D9F5ED" }}>
        <div className="crancy-sidebar__heading">
          <h4 className="crancy-sidebar__title" >Top Empleados</h4>
        </div>
        <div className="crancy-sidebar__creators" >
          <ul className="crancy-sidebar__creatorlist crancy-sidebar__creatorlist--sellers">
            {empleados.map((empleado, index) => (
              <li key={empleado.idEmpleado}>
                <div className="crancy-sidebar__creator">
                  <img
                    src={`https://via.placeholder.com/50?text=${empleado.nombre}`}
                    alt={`Empleado ${empleado.nombre}`}
                  />
                  <a href="#">
                    <b className="crancy-sidebar__creator-name">
                      {empleado.nombre}
                    </b>
                    <span className="crancy-sidebar__creator-badge crancy-color1">
                      {empleado.asistencias} Asistencias
                    </span>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TopSeller;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Table, Button } from "react-bootstrap";
import Chart from "chart.js/auto";

function RecaudacionDashboard() {
  const [recaudaciones, setRecaudaciones] = useState([]);
  const [chartData, setChartData] = useState(null); // Inicializar como null
  const [showTable, setShowTable] = useState(false); // Alternar entre tabla y gráfica

  useEffect(() => {
    fetchRecaudaciones();
  }, []);

  const fetchRecaudaciones = async () => {
    try {
      const response = await axios.get("http://localhost:5000/recaudacion_evento");
      const data = response.data;

      setRecaudaciones(data);
      generateChartData(data);
    } catch (error) {
      console.error("Error fetching recaudaciones:", error);
    }
  };

  const generateChartData = (data) => {
    const labels = data.map((evento) => evento.fechaRegistro || "Sin fecha");
    const recaudaciones = data.map((evento) => parseFloat(evento.recaudacion || 0));

    setChartData({
      labels,
      datasets: [
        {
          label: "Recaudación ($)",
          data: recaudaciones,
          backgroundColor: "rgba(170, 114, 243)",
          borderColor: "rgba(10, 6, 16)",
          borderWidth: 1,
        },
      ],
    });
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4" style={{ fontWeight: "bold", color: "#0A82FD" }}>
        Recaudaciones
      </h3>

      {/* Botón para alternar vista */}
      <div className="text-center mb-4">
        <Button variant="primary" onClick={() => setShowTable(!showTable)} style={{ width: "200px"}}>
          {showTable ? "Ver Gráfica" : "Ver Tabla"}
        </Button>
      </div>

      {/* Mostrar gráfica o tabla según el estado */} 
      {showTable ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Recaudación (Q)</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {recaudaciones.map((evento) => (
              <tr key={evento.idRecaudacionEvento}>
                <td>{evento.idRecaudacionEvento}</td>
                <td>{evento.fechaRegistro || "Sin fecha"}</td>
                <td>{parseFloat(evento.recaudacion || 0).toFixed(2)}</td>
                <td>{evento.estado === 1 ? "Activo" : "Inactivo"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {chartData && (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: "top",
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default RecaudacionDashboard;

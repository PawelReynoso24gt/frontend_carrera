import React, { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut, Bar } from "react-chartjs-2";
import { Table, Button, Row, Col, Container } from "react-bootstrap";
import Chart from "chart.js/auto";

function RecaudacionDashboard() {
  const [recaudaciones, setRecaudaciones] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [rifas, setRifas] = useState([]);
  const [chartDataRecaudaciones, setChartDataRecaudaciones] = useState(null);
  const [chartDataVentas, setChartDataVentas] = useState(null);
  const [chartDataRifasBoletos, setChartDataRifasBoletos] = useState(null);
  const [chartDataRifasSubtotal, setChartDataRifasSubtotal] = useState(null);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    fetchRecaudaciones();
    fetchVentas();
    fetchRifas();
  }, []);

  const fetchRecaudaciones = async () => {
    try {
      const response = await axios.get("http://localhost:5000/recaudacion_evento");
      const data = response.data;
      setRecaudaciones(data);
      generateChartDataRecaudaciones(data);
    } catch (error) {
      console.error("Error fetching recaudaciones:", error);
    }
  };

  const fetchVentas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/ventas");
      const data = response.data;
      setVentas(data);
      generateChartDataVentas(data);
    } catch (error) {
      console.error("Error fetching ventas:", error);
    }
  };

  const fetchRifas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/recaudaciones");
      const data = response.data;
      setRifas(data);
      generateChartDataRifasBoletos(data);
      generateChartDataRifasSubtotal(data);
    } catch (error) {
      console.error("Error fetching rifas:", error);
    }
  };

  const generateChartDataRecaudaciones = (data) => {
    const labels = data.map((evento) => evento.fechaRegistro || "Sin fecha");
    const recaudaciones = data.map((evento) => parseFloat(evento.recaudacion || 0));

    setChartDataRecaudaciones({
      labels,
      datasets: [
        {
          label: "Recaudaciones (Q)",
          data: recaudaciones,
          backgroundColor: "rgba(54, 162, 235, 0.7)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    });
  };

  const generateChartDataVentas = (data) => {
    const labels = data.map((venta) => venta.fechaVenta || "Sin fecha");
    const ventasTotales = data.map((venta) => parseFloat(venta.totalVenta || 0));

    setChartDataVentas({
      labels,
      datasets: [
        {
          label: "Ventas Totales (Q)",
          data: ventasTotales,
          backgroundColor: "rgba(75, 192, 192, 0.7)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    });
  };

  const generateChartDataRifasBoletos = (data) => {
    const labels = data.map((rifa) => rifa.createdAt || "Sin fecha");
    const boletosVendidos = data.map((rifa) => rifa.boletosVendidos || 0);

    setChartDataRifasBoletos({
      labels,
      datasets: [
        {
          label: "Boletos Vendidos",
          data: boletosVendidos,
          backgroundColor: "rgba(255, 99, 132, 0.7)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    });
  };

  const generateChartDataRifasSubtotal = (data) => {
    const labels = data.map((rifa) => rifa.createdAt || "Sin fecha");
    const subtotales = data.map((rifa) => parseFloat(rifa.subTotal || 0));

    setChartDataRifasSubtotal({
      labels,
      datasets: [
        {
          label: "Subtotal (Q)",
          data: subtotales,
          backgroundColor: "rgba(153, 102, 255, 0.7)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        },
      ],
    });
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4" style={{ fontWeight: "bold", color: "#0A82FD" }}>
        Dashboard de Recaudaciones, Ventas y Rifas
      </h3>

      <div className="text-center mb-4">
        <Button variant="primary" onClick={() => setShowTable(!showTable)} style={{ width: "200px" }}>
          {showTable ? "Ver Gráficas" : "Ver Tabla"}
        </Button>
      </div>

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
        <Container>
          <Row>
            <Col md={6}>
              <h5 className="text-center" style={{ fontWeight: "bold", marginBottom: "20px" }}>
                Recaudaciones por Fecha
              </h5>
              {chartDataRecaudaciones && (
                <div style={{ height: "400px" }}>
                  <Bar data={chartDataRecaudaciones} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              )}
            </Col>
            <Col md={6}>
              <h5 className="text-center" style={{ fontWeight: "bold", marginBottom: "20px" }}>
                Ventas Totales por Fecha
              </h5>
              {chartDataVentas && (
                <div style={{ height: "400px" }}>
                  <Bar data={chartDataVentas} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              )}
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h5 className="text-center" style={{ fontWeight: "bold", marginBottom: "20px" }}>
                Boletos Vendidos por Fecha
              </h5>
              {chartDataRifasBoletos && (
                <div style={{ height: "400px" }}>
                  <Bar data={chartDataRifasBoletos} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              )}
            </Col>
            <Col md={6}>
              <h5 className="text-center" style={{ fontWeight: "bold", marginBottom: "20px" }}>
                Subtotales de Rifas por Fecha
              </h5>
              {chartDataRifasSubtotal && (
                <div style={{ height: "400px" }}>
                  <Bar data={chartDataRifasSubtotal} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              )}
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
}

export default RecaudacionDashboard;

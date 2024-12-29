import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Table, Button, Row, Col, Container } from "react-bootstrap";

function RecaudacionDashboard() {
  const [recaudaciones, setRecaudaciones] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [rifas, setRifas] = useState([]);
  const [chartDataRecaudaciones, setChartDataRecaudaciones] = useState(null);
  const [chartDataVentas, setChartDataVentas] = useState(null);
  const [chartDataRifasBoletos, setChartDataRifasBoletos] = useState(null);
  const [chartDataRifasSubtotal, setChartDataRifasSubtotal] = useState(null);

  useEffect(() => {
    fetchRecaudaciones();
    fetchVentas();
    fetchRifas();
  }, []);

  const fetchRecaudaciones = async () => {
    try {
      const response = await axios.get("http://localhost:5000/recaudacion_evento");
      const data = response.data;
      if (data && data.length > 0) generateChartDataRecaudaciones(data);
      setRecaudaciones(data);
    } catch (error) {
      console.error("Error fetching recaudaciones:", error);
    }
  };

  const fetchVentas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/ventas");
      const data = response.data;
      if (data && data.length > 0) generateChartDataVentas(data);
      setVentas(data);
    } catch (error) {
      console.error("Error fetching ventas:", error);
    }
  };

  const fetchRifas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/recaudaciones");
      const data = response.data;
      if (data && data.length > 0) {
        generateChartDataRifasBoletos(data);
        generateChartDataRifasSubtotal(data);
      }
      setRifas(data);
    } catch (error) {
      console.error("Error fetching rifas:", error);
    }
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

  const generateChartOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 18,
          },
        },
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 22,
          weight: "bold",
        },
        color: "#284CDB",
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 16,
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 16,
          },
        },
      },
    },
  });

  const generateChartDataRecaudaciones = (data) => {
    const labels = data.map((evento) => formatDate(evento.fechaRegistro));
    const recaudaciones = data.map((evento) => parseFloat(evento.recaudacion || 0));
    setChartDataRecaudaciones({
      labels,
      datasets: [
        {
          label: "Recaudaciones (Q)",
          data: recaudaciones,
          backgroundColor: "#C466FA",
          borderColor: "#4B0082",
          borderWidth: 1,
        },
      ],
    });
  };

  const generateChartDataVentas = (data) => {
    const labels = data.map((venta) => formatDate(venta.fechaVenta));
    const ventasTotales = data.map((venta) => parseFloat(venta.totalVenta || 0));
    setChartDataVentas({
      labels,
      datasets: [
        {
          label: "Ventas Totales (Q)",
          data: ventasTotales,
          backgroundColor: "#528DFF",
          borderColor: "#0000FF",
          borderWidth: 1,
        },
      ],
    });
  };

  const generateChartDataRifasBoletos = (data) => {
    const labels = data.map((rifa) => formatDate(rifa.createdAt));
    const boletosVendidos = data.map((rifa) => rifa.boletosVendidos || 0);
    setChartDataRifasBoletos({
      labels,
      datasets: [
        {
          label: "Boletos Vendidos",
          data: boletosVendidos,
          backgroundColor: "#EBE02E",
          borderColor: "#FFD700",
          borderWidth: 1,
        },
      ],
    });
  };

  const generateChartDataRifasSubtotal = (data) => {
    const labels = data.map((rifa) => formatDate(rifa.createdAt));
    const subtotales = data.map((rifa) => parseFloat(rifa.subTotal || 0));
    setChartDataRifasSubtotal({
      labels,
      datasets: [
        {
          label: "Subtotal (Q)",
          data: subtotales,
          backgroundColor: "#F29F05",
          borderColor: "#008000",
          borderWidth: 1,
        },
      ],
    });
  };

  const styles = {
    header: {
      textAlign: "center",
      fontWeight: "bold",
      color: "#284CDB",
      marginBottom: "20px",
      fontSize: 25
    },
    chartContainer: {
      height: "500px",
      marginBottom: "30px",
      backgroundColor: "#ffffff",
      padding: "15px",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
  };

  return (
    <div className="container mt-4">
      <h3 style={styles.header}>RECAUDACIONES, VENTAS Y RIFAS</h3>
      <Container>
        <Row>
          <Col md={6}>
            <div style={styles.chartContainer}>
              {chartDataRecaudaciones && (
                <Bar data={chartDataRecaudaciones} options={generateChartOptions("Recaudaciones por Fecha")} />
              )}
            </div>
          </Col>
          <Col md={6}>
            <div style={styles.chartContainer}>
              {chartDataVentas && (
                <Bar data={chartDataVentas} options={generateChartOptions("Ventas Totales por Fecha")} />
              )}
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <div style={styles.chartContainer}>
              {chartDataRifasBoletos && (
                <Bar data={chartDataRifasBoletos} options={generateChartOptions("Boletos Vendidos por Fecha")} />
              )}
            </div>
          </Col>
          <Col md={6}>
            <div style={styles.chartContainer}>
              {chartDataRifasSubtotal && (
                <Bar data={chartDataRifasSubtotal} options={generateChartOptions("Recaudaciones de Rifas por Fecha")} />
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default RecaudacionDashboard;

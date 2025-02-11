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
      const response = await axios.get("https://api.voluntariadoayuvi.com/recaudacion_evento");
      const data = response.data;
      if (data && data.length > 0) generateChartDataRecaudaciones(data);
      setRecaudaciones(data);
    } catch (error) {
      console.error("Error fetching recaudaciones:", error);
    }
  };

  const fetchVentas = async () => {
    try {
      const response = await axios.get("https://api.voluntariadoayuvi.com/ventas");
      const data = response.data;
      if (data && data.length > 0) generateChartDataVentas(data);
      setVentas(data);
    } catch (error) {
      console.error("Error fetching ventas:", error);
    }
  };

  const fetchRifas = async () => {
    try {
      const response = await axios.get("https://api.voluntariadoayuvi.com/recaudaciones");
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
    // Ordena los eventos por fecha de registro en orden descendente
    const sortedData = [...data].sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro));
  
    // Toma los dos eventos más recientes
    const [mostRecent, previous] = sortedData;
  
    // Configura los datos del gráfico
    setChartDataRecaudaciones({
      labels: previous
        ? [formatDate(previous.fechaRegistro), formatDate(mostRecent.fechaRegistro)]
        : [formatDate(mostRecent.fechaRegistro)],
      datasets: [
        {
          label: "Número de Personas",
          data: previous
            ? [parseInt(previous.numeroPersonas || 0), parseInt(mostRecent.numeroPersonas || 0)]
            : [parseInt(mostRecent.numeroPersonas || 0)],
          backgroundColor: previous ? ["#FFA07A", "#C466FA"] : ["#C466FA"],
          borderColor: previous ? ["#FF6347", "#4B0082"] : ["#4B0082"],
          borderWidth: 1,
        },
      ],
    });
  };
  
  const generateChartDataVentas = (data) => {
    // Ordena las ventas por fecha en orden descendente
    const sortedData = [...data].sort((a, b) => new Date(b.fechaVenta) - new Date(a.fechaVenta));
  
    // Toma las dos ventas más recientes
    const [mostRecent, previous] = sortedData;
  
    // Configura los datos del gráfico
    setChartDataVentas({
      labels: previous ? [formatDate(previous.fechaVenta), formatDate(mostRecent.fechaVenta)] : [formatDate(mostRecent.fechaVenta)],
      datasets: [
        {
          label: "Comparación de ventas (Q)",
          data: previous ? [parseFloat(previous.totalVenta || 0), parseFloat(mostRecent.totalVenta || 0)] : [parseFloat(mostRecent.totalVenta || 0)],
          backgroundColor: previous ? ["#FFB84C", "#528DFF"] : ["#528DFF"],
          borderColor: previous ? ["#FF8C00", "#0000FF"] : ["#0000FF"],
          borderWidth: 1,
        },
      ],
    });
  };
  
  generateChartDataVentas
  const generateChartDataRifasBoletos = (data) => {
    // Ordena las rifas por fecha de creación de forma descendente
    const sortedData = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
    // Toma las dos rifas más recientes
    const [mostRecent, previous] = sortedData;
  
    // Configura los datos del gráfico
    setChartDataRifasBoletos({
      labels: previous ? [formatDate(previous.createdAt), formatDate(mostRecent.createdAt)] : [formatDate(mostRecent.createdAt)],
      datasets: [
        {
          label: "Total de boletos",
          data: previous ? [previous.boletosVendidos || 0, mostRecent.boletosVendidos || 0] : [mostRecent.boletosVendidos || 0],
          backgroundColor: "#EBE02E",
          borderColor: "#FFD700",
          borderWidth: 1,
        },
        {
          label: "Rifa Más Reciente - Anterior",
          data: previous ? [0, (mostRecent.boletosVendidos || 0) - (previous.boletosVendidos || 0)] : [0],
          backgroundColor: "#2E86C1",
          borderColor: "#2874A6",
          borderWidth: 1,
        },
      ],
    });
  };
  

  const generateChartDataRifasSubtotal = (data) => {
    // Ordena las rifas por fecha en orden descendente
    const sortedData = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
    // Toma las dos rifas más recientes
    const [mostRecent, previous] = sortedData;
  
    // Configura los datos del gráfico
    setChartDataRifasSubtotal({
      labels: previous ? [formatDate(previous.createdAt), formatDate(mostRecent.createdAt)] : [formatDate(mostRecent.createdAt)],
      datasets: [
        {
          label: "Subtotal (Q)",
          data: previous ? [parseFloat(previous.subTotal || 0), parseFloat(mostRecent.subTotal || 0)] : [parseFloat(mostRecent.subTotal || 0)],
          backgroundColor: previous ? ["#FFD700", "#F29F05"] : ["#F29F05"],
          borderColor: previous ? ["#FFA500", "#FFD700"] : ["#008000"],
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
          {/* Ventas Totales */}
          <Col md={6}>
            <div style={styles.chartContainer}>
              {chartDataVentas && (
                <Bar
                  data={chartDataVentas}
                  options={generateChartOptions("Comparación de ventas totales")}
                />
              )}
            </div>
          </Col>
  
          {/* Número de Personas en Evento */}
          <Col md={6}>
            <div style={styles.chartContainer}>
              {chartDataRecaudaciones && (
                <Bar
                  data={chartDataRecaudaciones}
                  options={generateChartOptions("Número de personas en evento")}
                />
              )}
            </div>
          </Col>
        </Row>
  
        <Row className="mt-4">
          {/* Comparación de Boletos Vendidos */}
          <Col md={6}>
            <div style={styles.chartContainer}>
              {chartDataRifasBoletos && (
                <Bar
                  data={chartDataRifasBoletos}
                  options={generateChartOptions("Comparación de boletos vendidos")}
                />
              )}
            </div>
          </Col>
  
          {/* Recaudaciones de Rifas por Fecha */}
          <Col md={6}>
            <div style={styles.chartContainer}>
              {chartDataRifasSubtotal && (
                <Bar
                  data={chartDataRifasSubtotal}
                  options={generateChartOptions("Recaudaciones de Rifas por Fecha")}
                />
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );  
}

export default RecaudacionDashboard;

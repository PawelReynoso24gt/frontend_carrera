import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../assets/img/LogoAYUVI_FullAzul.png"; // Importa el logo

function ReportePlayeras() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [reportes, setReportes] = useState([]);
  const [alerta, setAlerta] = useState("");
  const [revisor, setRevisor] = useState("");

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const fechaInicioFormato = fechaInicio.split("-").reverse().join("-"); // Convierte de DD-MM-YYYY a YYYY-MM-DD
        const fechaFinFormato = fechaFin.split("-").reverse().join("-"); // Convierte de DD-MM-YYYY a YYYY-MM-DD

        const response = await axios.get(
          `http://localhost:5000/reporte/playeras?fechaInicio=${fechaInicioFormato}&fechaFin=${fechaFinFormato}`
        );
        setReportes(response.data.reporte);
      } catch (error) {
        console.error("Error al cargar los reportes:", error);
        setAlerta("Hubo un error al cargar los reportes.");
      }
    };

    if (fechaInicio && fechaFin) {
      fetchReportes();
    }
  }, [fechaInicio, fechaFin]);

  const subtotalesPorTallaAsignadas = ["10", "12", "14", "16", "S", "M", "L", "XL"].reduce(
    (totales, talla) => {
      totales[talla] = reportes.reduce(
        (sum, stand) => sum + (stand.playerasAsignadas[talla] || 0),
        0
      );
      return totales;
    },
    {}
  );
  
  const subtotalesPorTallaVendidas = ["10", "12", "14", "16", "S", "M", "L", "XL"].reduce(
    (totales, talla) => {
      totales[talla] = reportes.reduce(
        (sum, stand) => sum + (stand.playerasVendidas[talla] || 0),
        0
      );
      return totales;
    },
    {}
  );

  const totalGeneral = {
    totalAsignadas: reportes.reduce((sum, stand) => {
      return sum + Object.values(stand.playerasAsignadas || {}).reduce((suma, cantidad) => suma + cantidad, 0);
    }, 0),
    totalVendidas: reportes.reduce((sum, stand) => {
      return sum + Object.values(stand.playerasVendidas || {}).reduce((suma, cantidad) => suma + cantidad, 0);
    }, 0),
    totalRecaudado: reportes.reduce((sum, stand) => {
      return sum + Object.keys(stand.subtotalesVendidos || {}).reduce((total, talla) => total + (stand.subtotalesVendidos[talla] || 0), 0);
    }, 0),
  };


  const generarPDF = () => {
    const doc = new jsPDF();

    // Logo y texto al lado
    doc.addImage(logo, "PNG", 10, 10, 60, 30);
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("Reporte de Playeras por Stand", 75, 20);
    doc.setFontSize(12);
    doc.text(new Date().toLocaleDateString("es-ES"), 75, 28);
    doc.setFontSize(10);
    const fechaInicioFormatted = fechaInicio.split("-").reverse().join("/");
    const fechaFinFormatted = fechaFin.split("-").reverse().join("/");
    doc.text(`Desde: ${fechaInicioFormatted}   Hasta: ${fechaFinFormatted}`, 75, 35);

    // Línea de separación
    doc.setLineWidth(0.5);
    doc.setDrawColor("#007AC3");
    doc.line(10, 50, 200, 50);

    // Crear la tabla de playeras asignadas
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Playeras Asignadas por Stand", 105, 56, { align: "center" });

    // Tabla de playeras asignadas
    doc.autoTable({
      startY: 60,
      head: [["Stand", "Talla 10", "Talla 12", "Talla 14", "Talla 16", "Talla S", "Talla M", "Talla L", "Talla XL"]],
      body: reportes.map((stand) => [
        stand.nombreStand,
        stand.playerasAsignadas["10"] || 0,
        stand.playerasAsignadas["12"] || 0,
        stand.playerasAsignadas["14"] || 0,
        stand.playerasAsignadas["16"] || 0,
        stand.playerasAsignadas.S || 0,
        stand.playerasAsignadas.M || 0,
        stand.playerasAsignadas.L || 0,
        stand.playerasAsignadas.XL || 0,
      ]),
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [0, 122, 195], textColor: 255 },
      theme: "grid",
    });

    // Línea de separación
    doc.setLineWidth(0.5);
    doc.setDrawColor("#007AC3");
    doc.line(10, doc.lastAutoTable.finalY + 10, 200, doc.lastAutoTable.finalY + 10);

    // Crear la tabla de playeras vendidas
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Playeras Vendidas por Stand", 105, doc.lastAutoTable.finalY + 15, { align: "center" });

    // Tabla de playeras vendidas
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Stand", "Talla 10", "Talla 12", "Talla 14", "Talla 16", "Talla S", "Talla M", "Talla L", "Talla XL", "Total Vendido", "Total Recaudado"]],
      body: reportes.map((stand) => {
        const totalVendidas = Object.values(stand.playerasVendidas || {}).reduce((sum, cantidad) => sum + cantidad, 0);
        const totalRecaudado = Object.keys(stand.subtotalesVendidos || {}).reduce((sum, talla) => sum + (stand.subtotalesVendidos[talla] || 0), 0);

        return [
          stand.nombreStand,
          stand.playerasVendidas["10"] || 0,
          stand.playerasVendidas["12"] || 0,
          stand.playerasVendidas["14"] || 0,
          stand.playerasVendidas["16"] || 0,
          stand.playerasVendidas.S || 0,
          stand.playerasVendidas.M || 0,
          stand.playerasVendidas.L || 0,
          stand.playerasVendidas.XL || 0,
          totalVendidas,
         `Q${totalRecaudado.toFixed(2)}`,
        ];
      }),
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [0, 122, 195], textColor: 255 },
      theme: "grid",
    });

    let startY = doc.lastAutoTable.finalY + 15; // Punto inicial después de la última tabla
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Subtotales y Métricas", 105, startY, { align: "center" });
    startY += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Total playeras asignadas y vendidas", 105, startY, { align: "center" });
    startY += 10; // Incremento para dejar espacio después del título
    
    // Agregar la tabla de totales generales de playeras asignadas y vendidas
    doc.setFontSize(12);
    doc.autoTable({
      startY: startY,
      head: [["Talla", "Asignadas", "Vendidas"]],
      body: ["10", "12", "14", "16", "S", "M", "L", "XL"].map((talla) => [
        talla,
        subtotalesPorTallaAsignadas[talla] || 0,
        subtotalesPorTallaVendidas[talla] || 0,
      ]),
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [0, 122, 195], textColor: 255 },
      theme: "grid",
    });
    
    startY = doc.lastAutoTable.finalY + 10; // Punto inicial después de la tabla
    
    // Totales generales
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Playeras Asignadas: ${totalGeneral.totalAsignadas}`, 105, startY, { align: "center" });
    doc.text(`Total Playeras Vendidas: ${totalGeneral.totalVendidas}`, 105, startY + 6, { align: "center" });
    doc.text(`Total Recaudado: Q${totalGeneral.totalRecaudado.toFixed(2)}`, 105, startY + 12, { align: "center" });
    
    const firmaStartY = doc.lastAutoTable.finalY + 35; // Calcula un espacio fijo después de la última tabla
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("_______________________________", 105, firmaStartY, { align: "center" });
    doc.text(revisor || "Sin nombre", 105, firmaStartY + 10, { align: "center" });
      
    // Guardar el documento
    doc.save(`Reporte_Playeras_${fechaInicioFormatted}_${fechaFinFormatted}.pdf`);
  };

  return (
    <div
      className="container mt-4"
      style={{
        backgroundColor: "#f8f9fa",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="row mb-3">
        <div className="col text-center">
          <h3 style={{ fontWeight: "bold", color: "#333" }}>Reporte de Playeras por Stand</h3>
        </div>
      </div>

      {alerta && <div className="alert alert-warning">{alerta}</div>}

      <div className="text-center mb-4">
        <div className="d-inline-flex align-items-center mb-3">
          <div style={{ marginRight: "10px" }}>
            <label>Fecha Inicio:</label>
            <input
              type="date"
              className="form-control"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              style={{ width: "150px" }}
            />
          </div>
          <div>
            <label>Fecha Fin:</label>
            <input
              type="date"
              className="form-control"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              style={{ width: "150px" }}
            />
          </div>
        </div>
        <div className="text-center mb-4">
        <label style={{ fontWeight: "bold", marginBottom: "10px" }}>Revisado por:</label>
        <input
          type="text"
          className="form-control mx-auto"
          value={revisor}
          onChange={(e) => setRevisor(e.target.value)}
          placeholder="Nombre del revisor"
          style={{
            width: "250px",
            textAlign: "center",
          }}
        />
       </div>
      </div>

      <div className="text-center mb-4">
        <button
          className="btn btn-success mx-auto"
          onClick={generarPDF}
          disabled={reportes.length === 0}
          style={{
            width: "20%",
            fontWeight: "bold",
            fontSize: "14px",
            backgroundColor: "#007AC3",
            borderBlockColor: "#007AC3",
          }}
        >
          Descargar PDF
        </button>
      </div>

      <h5>Playeras Asignadas por Stand</h5>
      <table
        className="table mt-4"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
        }}
      >
        <thead className="thead-dark">
          <tr>
            <th>Stand</th>
            <th>Talla 10</th>
            <th>Talla 12</th>
            <th>Talla 14</th>
            <th>Talla 16</th>
            <th>Talla S</th>
            <th>Talla M</th>
            <th>Talla L</th>
            <th>Talla XL</th>
          </tr>
        </thead>
        <tbody>
          {reportes.map((stand, index) => (
            <tr key={index}>
              <td>{stand.nombreStand}</td>
              <td>{stand.playerasAsignadas["10"] || 0}</td>
              <td>{stand.playerasAsignadas["12"] || 0}</td>
              <td>{stand.playerasAsignadas["14"] || 0}</td>
              <td>{stand.playerasAsignadas["16"] || 0}</td>
              <td>{stand.playerasAsignadas.S || 0}</td>
              <td>{stand.playerasAsignadas.M || 0}</td>
              <td>{stand.playerasAsignadas.L || 0}</td>
              <td>{stand.playerasAsignadas.XL || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h5>Playeras Vendidas por Stand</h5>
      <table
        className="table mt-4"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
        }}
      >
        <thead className="thead-dark">
          <tr>
            <th>Stand</th>
            <th>Talla 10</th>
            <th>Talla 12</th>
            <th>Talla 14</th>
            <th>Talla 16</th>
            <th>Talla S</th>
            <th>Talla M</th>
            <th>Talla L</th>
            <th>Talla XL</th>
            <th>Total Vendido</th>
            <th>Total Recaudado</th>
          </tr>
        </thead>
        <tbody>
          {reportes.map((stand, index) => {
            const totalVendidas = Object.values(stand.playerasVendidas || {}).reduce((sum, cantidad) => sum + cantidad, 0);
            const totalRecaudado = Object.keys(stand.subtotalesVendidos || {}).reduce((sum, talla) => sum + (stand.subtotalesVendidos[talla] || 0), 0);
            
            return (
              <tr key={index}>
                <td>{stand.nombreStand}</td>
                <td>{stand.playerasVendidas["10"] || 0}</td>
                <td>{stand.playerasVendidas["12"] || 0}</td>
                <td>{stand.playerasVendidas["14"] || 0}</td>
                <td>{stand.playerasVendidas["16"] || 0}</td>
                <td>{stand.playerasVendidas.S || 0}</td>
                <td>{stand.playerasVendidas.M || 0}</td>
                <td>{stand.playerasVendidas.L || 0}</td>
                <td>{stand.playerasVendidas.XL || 0}</td>
                <td>{totalVendidas}</td>
                <td>{totalRecaudado}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ReportePlayeras;

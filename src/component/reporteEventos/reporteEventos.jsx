import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../assets/img/LogoAYUVI_FullAzul.png"; // Importa el logo

function ReporteEventos() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [eventos, setEventos] = useState([]);
  const [alerta, setAlerta] = useState("");

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        // Convertir las fechas en el formato DD-MM-YYYY a YYYY-MM-DD antes de enviarlas al backend
        const fechaInicioFormato = fechaInicio.split("-").reverse().join("-"); // Convierte de DD-MM-YYYY a YYYY-MM-DD
        const fechaFinFormato = fechaFin.split("-").reverse().join("-"); // Convierte de DD-MM-YYYY a YYYY-MM-DD

        const response = await axios.get(
          `http://localhost:5000/eventos/reporte?fechaInicio=${fechaInicioFormato}&fechaFin=${fechaFinFormato}`
        );
        setEventos(response.data.eventos);
      } catch (error) {
        console.error("Error al cargar eventos:", error);
        setAlerta("Hubo un error al cargar los eventos.");
      }
    };

    if (fechaInicio && fechaFin) {
      fetchEventos();
    }
  }, [fechaInicio, fechaFin]);

  const generarPDF = () => {
    const doc = new jsPDF();

    // Logo y texto al lado
    doc.addImage(logo, "PNG", 10, 10, 60, 30); // Logo ajustado
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("Reporte de Eventos", 75, 20); // Título alineado al lado del logo
    doc.setFontSize(12);
    doc.text(new Date().toLocaleDateString("es-ES"), 75, 28); // Fecha de generación debajo del título
    doc.setFontSize(10);
    doc.text(`Desde: ${fechaInicio}   Hasta: ${fechaFin}`, 75, 35); // Rango de fechas

    // Línea de separación
    doc.setLineWidth(0.5);
    doc.setDrawColor("#007AC3"); // Línea en azul
    doc.line(10, 50, 200, 50);

    // Crear la tabla de eventos
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Eventos", 105, 56, { align: "center" });

    // Tabla de datos
    doc.autoTable({
      startY: 60,
      head: [
        ["Nombre Evento", "Recaudación Total", "Asistencia de voluntarios", "Fecha Inicio", "Fecha Fin"]
      ],
      body: eventos.map((evento) => [
        evento.nombreEvento,
        evento.recaudacionTotal,
        evento.cantidadVoluntariosAsistieron,
        new Date(evento.fechaHoraInicio).toLocaleString("es-ES", {
          timeZone: "UTC",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        new Date(evento.fechaHoraFin).toLocaleString("es-ES", {
          timeZone: "UTC",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      ]),
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [0, 122, 195], textColor: 255 }, // Fondo azul y texto blanco
      theme: "grid",
    });

    doc.save(`Reporte_Eventos_${fechaInicio}_${fechaFin}.pdf`);
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
          <h3 style={{ fontWeight: "bold", color: "#333" }}>Reporte de Eventos</h3>
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
      </div>

      <div className="text-center mb-4">
        <button
          className="btn btn-success mx-auto"
          onClick={generarPDF}
          disabled={eventos.length === 0}
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

      <table
        className="table mt-4"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
        }}
      >
        <thead className="thead-dark">
          <tr>
            <th>Nombre Evento</th>
            <th>Recaudación Total</th>
            <th>Cantidad Voluntarios Asistieron</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
          </tr>
        </thead>
        <tbody>
          {eventos.map((evento, index) => (
            <tr key={index}>
              <td>{evento.nombreEvento}</td>
              <td>{evento.recaudacionTotal}</td>
              <td>{evento.cantidadVoluntariosAsistieron}</td>
              <td>
                {new Date(evento.fechaHoraInicio).toLocaleString("es-ES", {
                  timeZone: "UTC",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td>
                {new Date(evento.fechaHoraFin).toLocaleString("es-ES", {
                  timeZone: "UTC",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReporteEventos;

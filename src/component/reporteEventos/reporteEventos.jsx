import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../assets/img/LogoAYUVI_FullAzul.png"; // Importa el logo

function ReporteEventos() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [eventos, setEventos] = useState([]);
  const [revisor, setRevisor] = useState("");
  const [alerta, setAlerta] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [cargo, setCargo] = useState("");

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        // Convertir las fechas en el formato DD-MM-YYYY a YYYY-MM-DD antes de enviarlas al backend
        const fechaInicioFormato = fechaInicio.split("-").reverse().join("-"); // Convierte de DD-MM-YYYY a YYYY-MM-DD
        const fechaFinFormato = fechaFin.split("-").reverse().join("-"); // Convierte de DD-MM-YYYY a YYYY-MM-DD

        const response = await axios.get(
          `https://api.voluntariadoayuvi.com/eventos/reporte?fechaInicio=${fechaInicioFormato}&fechaFin=${fechaFinFormato}`
        );
        setEventos(response.data.eventos);
      } catch (error) {
        console.error("Error al cargar eventos:", error);
        setAlerta("Hubo un error al cargar los eventos.");
      }
    };

    const fetchLoggedUser = async () => {
      try {
        const response = await axios.get("https://api.voluntariadoayuvi.com/usuarios/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Asegúrate de tener el token en localStorage
          },
        });
        setNombreUsuario(response.data.nombre);
      } catch (error) {
        console.error("Error al obtener el usuario logueado:", error);
        setNombreUsuario("Sin nombre");
      }
    };

    fetchLoggedUser();
    if (fechaInicio && fechaFin) {
      fetchEventos();
    }
  }, [fechaInicio, fechaFin]);


  // Calcular subtotales
  const totalRecaudacion = eventos
    .reduce((total, evento) => total + evento.recaudacionTotal, 0)
    .toFixed(2);
  const totalAsistencia = eventos.reduce(
    (total, evento) => total + evento.cantidadVoluntariosAsistieron,
    0
  );
  const totalEventos = eventos.length;
  const fechas = eventos.map((evento) => new Date(evento.fechaHoraInicio));
  const fechaMin = fechas.length
    ? new Date(Math.min(...fechas)).toLocaleDateString("es-ES")
    : "N/A";
  const fechaMax = fechas.length
    ? new Date(Math.max(...fechas)).toLocaleDateString("es-ES")
    : "N/A";
  const eventoMayorRecaudacion = eventos.reduce(
    (max, evento) =>
      evento.recaudacionTotal > max.recaudacionTotal ? evento : max,
    { nombreEvento: "N/A", recaudacionTotal: 0 }
  );
  const eventoMenorRecaudacion = eventos.reduce(
    (min, evento) =>
      evento.recaudacionTotal < min.recaudacionTotal ? evento : min,
    { nombreEvento: "N/A", recaudacionTotal: Infinity }
  );

  const generarPDF = () => {
    const doc = new jsPDF();

    // Logo y texto al lado
    doc.addImage(logo, "PNG", 10, 10, 60, 30);
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("Reporte de Eventos", 75, 20);
    doc.setFontSize(12);
    doc.text("Fecha de generación:", 75, 28);
    doc.setFontSize(10);
    doc.text(new Date().toLocaleDateString("es-ES"), 117, 28);
    doc.text(new Date().toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit', hour12: true }), 135, 28);
    doc.setFontSize(10);
    const fechaInicioFormatted = fechaInicio.split("-").reverse().join("/");
    const fechaFinFormatted = fechaFin.split("-").reverse().join("/");
    doc.text(`Desde: ${fechaInicioFormatted}   Hasta: ${fechaFinFormatted}`, 75, 35);
    doc.text(`Generado por: ${nombreUsuario}`, 75, 40);

    doc.setLineWidth(0.5);
    doc.setDrawColor("#007AC3");
    doc.line(10, 50, 200, 50);

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Eventos", 105, 56, { align: "center" });

    doc.autoTable({
      startY: 60,
      head: [
        [
          "Nombre Evento",
          "Recaudación Total",
          "Asistencia de voluntarios",
          "Número de participantes",
          "Fecha Inicio",
          "Fecha Fin",
        ],
      ],
      body: eventos.map((evento) => [
        evento.nombreEvento,
        `Q ${evento.recaudacionTotal.toFixed(2)}`,
        evento.cantidadVoluntariosAsistieron,
        evento.numeroPersonas,
        new Date(evento.fechaHoraInicio).toLocaleDateString("es-ES"),
        new Date(evento.fechaHoraFin).toLocaleDateString("es-ES"),
      ]),
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [0, 122, 195], textColor: 255 },
      theme: "grid",
    });

    // Subtotales al final del PDF
    const subtotalesStartY = doc.previousAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#333");
    doc.text("RESUMEN", 14, subtotalesStartY);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`• Total Recaudación: Q ${totalRecaudacion}`, 14, subtotalesStartY + 10);
    doc.text(`• Total Asistencia de Voluntarios: ${totalAsistencia}`, 14, subtotalesStartY + 20);
    doc.text(`• Total de Eventos: ${totalEventos}`, 14, subtotalesStartY + 30);
    doc.text(`• Período Cubierto: Desde ${fechaMin} hasta ${fechaMax}`, 14, subtotalesStartY + 40);
    doc.text(
      `• Evento Mayor Recaudación: ${eventoMayorRecaudacion.nombreEvento} (Q ${eventoMayorRecaudacion.recaudacionTotal.toFixed(
        2
      )})`,
      14,
      subtotalesStartY + 50
    );
    doc.text(
      `• Evento Menor Recaudación: ${eventoMenorRecaudacion.nombreEvento} (Q ${eventoMenorRecaudacion.recaudacionTotal.toFixed(
        2
      )})`,
      14,
      subtotalesStartY + 60
    );

    const firmaStartY = doc.previousAutoTable.finalY + 90;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("_______________________________", 105, firmaStartY, { align: "center" });
    doc.text(revisor || "Sin nombre", 105, firmaStartY + 10, { align: "center" });
    doc.text(cargo || "Sin cargo", 105, firmaStartY + 15, { align: "center" });


    doc.save(`Reporte_Eventos_${fechaInicioFormatted}_${fechaFinFormatted}.pdf`);
  };

  return (
    <div
      className="container mt-4"
      style={{
        backgroundColor: "#f8f9fa",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        maxWidth: "100%",
        margin: "0 auto",
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
        <div className="text-center mb-4">
          <label style={{ fontWeight: "bold", marginBottom: "10px" }}>Cargo:</label>
          <input
            type="text"
            className="form-control mx-auto"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            placeholder="Cargo"
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
            <th>Número de participantes</th>
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
              <td>{evento.numeroPersonas}</td>
              <td>
                {new Date(evento.fechaHoraInicio).toLocaleString("es-ES", {
                  timeZone: "UTC",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </td>
              <td>
                {new Date(evento.fechaHoraFin).toLocaleString("es-ES", {
                  timeZone: "UTC",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
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

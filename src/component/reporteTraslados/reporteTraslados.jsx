import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../assets/img/LogoAYUVI_FullAzul.png"; 

function ReporteTraslados() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [traslados, setTraslados] = useState([]);
  const [alerta, setAlerta] = useState("");
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [revisor, setRevisor] = useState("");
    const [cargo, setCargo] = useState("");

  useEffect(() => {
    const fetchTraslados = async () => {
        if (!fechaInicio || !fechaFin) return;
        try {
          // Convertir fechas de YYYY-MM-DD a DD-MM-YYYY
          const fechaInicioFormato = fechaInicio.split("-").reverse().join("-");
          const fechaFinFormato = fechaFin.split("-").reverse().join("-");
      
          const response = await axios.get(
            `https://api.voluntariadoayuvi.com/reporteTraslados?fechaInicio=${fechaInicioFormato}&fechaFin=${fechaFinFormato}`
          );
          setTraslados(response.data.reporte);
          setAlerta("");
        } catch (error) {
          console.error("Error al cargar traslados:", error);
          setAlerta("Hubo un error al cargar los traslados.");
        }
      };
    
      const fetchLoggedUser = async () => {
        try {
          const response = await axios.get("https://api.voluntariadoayuvi.com/usuarios/me", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setNombreUsuario(response.data.nombre);
        } catch (error) {
          console.error("Error al obtener el usuario logueado:", error);
          setNombreUsuario("Sin nombre");
        }
      };

      fetchLoggedUser();
    fetchTraslados();
  }, [fechaInicio, fechaFin]);

  const generarPDF = () => {
    const doc = new jsPDF();

    // Logo y encabezado
    doc.addImage(logo, "PNG", 10, 10, 60, 30);
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("Reporte de Traslados", 75, 20);
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

    // Tabla de traslados
    const body = traslados.map((traslado) => [
      traslado.idTraslado,
      traslado.fecha,
      traslado.descripcion,
      traslado.tipo,
      traslado.detalles
        .map((detalle) => `${detalle.nombreProducto} - ${detalle.cantidad}`)
        .join("\n"),
    ]);

    doc.autoTable({
      startY: 60,
      head: [["ID Traslado", "Fecha", "Descripción", "Tipo", "Detalles"]],
      body: body,
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [0, 122, 195], textColor: 255 },
      theme: "grid",
    });

  // Resumen
  let startY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("RESUMEN", 14, startY);

  let totalTraslados = traslados.length;
  let trasladosEnviados = traslados.filter((t) => t.tipo === "Enviado").length;
  let trasladosRecibidos = traslados.filter((t) => t.tipo === "Recibido").length;

  const totalPorProducto = {};
  traslados.forEach((traslado) => {
    traslado.detalles.forEach((detalle) => {
      if (!totalPorProducto[detalle.nombreProducto]) {
        totalPorProducto[detalle.nombreProducto] = { recibidos: 0, enviados: 0 };
      }
      if (traslado.tipo === "Recibido") {
        totalPorProducto[detalle.nombreProducto].recibidos += detalle.cantidad;
      } else if (traslado.tipo === "Enviado") {
        totalPorProducto[detalle.nombreProducto].enviados += detalle.cantidad;
      }
    });
  });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`• Total de traslados: ${totalTraslados}`, 14, startY + 10);
  doc.text(`• Cantidad traslados enviados: ${trasladosEnviados}`, 14, startY + 20);
  doc.text(`• Cantidad traslados recibidos: ${trasladosRecibidos}`, 14, startY + 30);

  let offsetY = 40;
  Object.entries(totalPorProducto).forEach(([producto, totales], index) => {
    doc.text(
      `• ${producto}: ${totales.recibidos} recibidos, ${totales.enviados} enviados`,
      14,
      startY + offsetY + index * 10
    );
  });

   // Espacio para la firma
   const firmaStartY = doc.lastAutoTable.finalY + 110;
   if (firmaStartY + 30 > doc.internal.pageSize.height) {
       doc.addPage();
       startY = 10;
   }

   if (revisor.trim() || cargo.trim()) {
   doc.setFontSize(12);
   doc.setFont("helvetica", "normal");
   doc.text("_______________________________", 105, firmaStartY, { align: "center" });
   doc.text(revisor || "Sin nombre", 105, firmaStartY + 10, { align: "center" });
   doc.text(cargo || "Sin cargo", 105, firmaStartY + 15, { align: "center" });
   }

    doc.save(`Reporte_Traslados_${fechaInicioFormatted}_${fechaFinFormatted}.pdf`);
  };

  return (
    <div className="container mt-4" style={{maxWidth: "100%", margin: "0 auto",}}>
       <div className="row justify-content-center" style={{marginBottom: "20px" }}>
        <div className="col-12 text-center">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333", textAlign: "center" }}>
           Reporte de Traslados
          </h3>
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
          disabled={traslados.length === 0}
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
            <th>ID Traslado</th>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Tipo</th>
            <th>Detalles</th>
          </tr>
        </thead>
        <tbody>
          {traslados.map((traslado) => (
            <tr key={traslado.idTraslado}>
              <td>{traslado.idTraslado}</td>
              <td>{traslado.fecha}</td>
              <td>{traslado.descripcion}</td>
              <td>{traslado.tipo}</td>
              <td>
                <ul>
                  {traslado.detalles.map((detalle) => (
                    <li key={detalle.idProducto}>
                      {detalle.nombreProducto} - {detalle.cantidad}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReporteTraslados;

import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../assets/img/LogoAYUVI_FullAzul.png";

function ReporteAspirantes() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [reporte, setReporte] = useState([]);
  const [totales, setTotales] = useState({ totalAspirantes: 0 });
  const [revisor, setRevisor] = useState("");
  const [alerta, setAlerta] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [cargo, setCargo] = useState("");

  useEffect(() => {
    const fetchLoggedUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/usuarios/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setNombreUsuario(response.data.nombre || "Sin nombre");
      } catch (error) {
        console.error("Error al obtener el usuario logueado:", error);
        setNombreUsuario("Sin nombre");
      }
    };

    fetchLoggedUser();
  }, []);

  const fetchReporte = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/reportesAspirantes",
        {
          fechaInicio,
          fechaFin,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setReporte(response.data.reporte || []);
      setTotales(response.data.totales || { totalAspirantes: 0 });
      setAlerta("");
    } catch (error) {
      console.error("Error al cargar el reporte:", error);
      setAlerta("Hubo un error al cargar el reporte.");
    }
  };

  const handleFechaInicio = (e) => {
    setFechaInicio(e.target.value.split("-").reverse().join("-"));
  };

  const handleFechaFin = (e) => {
    setFechaFin(e.target.value.split("-").reverse().join("-"));
  };

  const generarPDF = () => {
    const doc = new jsPDF();

    // Logo y encabezado
    doc.addImage(logo, "PNG", 10, 10, 60, 30);
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("Reporte de Aspirantes", 75, 20);
    doc.setFontSize(12);
    doc.text("Fecha de generación:", 75, 28);
    doc.setFontSize(10);
    doc.text(new Date().toLocaleDateString("es-ES"), 117, 28);
    doc.text(new Date().toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit', hour12: true }), 135, 28);
    doc.setFontSize(10);
    doc.text(`Desde: ${fechaInicio}   Hasta: ${fechaFin}`, 75, 35);
    doc.text(`Generado por: ${nombreUsuario}`, 75, 40);

    // Línea separadora
    doc.setLineWidth(0.5);
    doc.setDrawColor("#007AC3");
    doc.line(10, 50, 200, 50);

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Aspirantes Registrados", 105, 56, { align: "center" });

    // Tabla con los datos del reporte
    doc.autoTable({
      startY: 60,
      head: [["ID Aspirante", "Nombre", "Fecha Nacimiento", "Teléfono", "Domicilio", "CUI", "Correo"]],
      body: reporte.map((aspirante) => [
        aspirante.idAspirante,
        aspirante.nombre,
        aspirante.fechaNacimiento,
        aspirante.telefono,
        aspirante.domicilio,
        aspirante.CUI,
        aspirante.correo,
      ]),
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [0, 122, 195], textColor: 255 },
      theme: "grid",
    });

    // Resumen
    const subtotalesStartY = doc.previousAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#333");
    doc.text("RESUMEN", 14, subtotalesStartY);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`• Total de Aspirantes: ${totales.totalAspirantes}`, 14, subtotalesStartY + 10);

    const firmaStartY = subtotalesStartY + 40;
    doc.text("_______________________________", 105, firmaStartY, { align: "center" });
    doc.text(revisor || "Sin nombre", 105, firmaStartY + 10, { align: "center" });
    doc.text(cargo || "Sin cargo", 105, firmaStartY + 15, { align: "center" });

    doc.save(`Reporte_Aspirantes_${fechaInicio}_${fechaFin}.pdf`);
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
          <h3 style={{ fontWeight: "bold", color: "#333" }}>Reporte de Aspirantes</h3>
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
              onChange={handleFechaInicio}
              style={{ width: "150px" }}
            />
          </div>
          <div>
            <label>Fecha Fin:</label>
            <input
              type="date"
              className="form-control"
              onChange={handleFechaFin}
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
          className="btn btn-primary mx-auto"
          onClick={fetchReporte}
          style={{
            width: "20%",
            fontWeight: "bold",
            fontSize: "14px",
            backgroundColor: "#007AC3",
            borderBlockColor: "#007AC3",
          }}
        >
          Generar Reporte
        </button>
      </div>

      <div className="text-center mb-4">
        <button
          className="btn btn-success mx-auto"
          onClick={generarPDF}
          disabled={reporte.length === 0}
          style={{
            width: "20%",
            fontWeight: "bold",
            fontSize: "14px",
            backgroundColor: "#28a745",
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
            <th>ID Aspirante</th>
            <th>Nombre</th>
            <th>Fecha Nacimiento</th>
            <th>Teléfono</th>
            <th>Domicilio</th>
            <th>CUI</th>
            <th>Correo</th>
          </tr>
        </thead>
        <tbody>
          {reporte.map((aspirante, index) => (
            <tr key={index}>
              <td>{aspirante.idAspirante}</td>
              <td>{aspirante.nombre}</td>
              <td>{aspirante.fechaNacimiento}</td>
              <td>{aspirante.telefono}</td>
              <td>{aspirante.domicilio}</td>
              <td>{aspirante.CUI}</td>
              <td>{aspirante.correo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReporteAspirantes;
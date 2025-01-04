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
   const [nombreUsuario, setNombreUsuario] = useState("");

  useEffect(() => {
    const fetchLoggedUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/usuarios/me", {
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

    fetchLoggedUser();
    if (fechaInicio && fechaFin) {
      fetchReportes();
    }
  }, [fechaInicio, fechaFin]);


  const totalGeneral = {
    totalAsignadas: reportes.reduce((sum, stand) => {
      return (
        sum +
        Object.values(stand.productosAsignados || {}).reduce(
          (subtotal, tallas) =>
            subtotal +
            Object.values(tallas).reduce((sumTallas, cantidad) => sumTallas + cantidad, 0),
          0
        )
      );
    }, 0),
    totalVendidas: reportes.reduce((sum, stand) => {
      return (
        sum +
        Object.values(stand.productosVendidos || {}).reduce(
          (subtotal, tallas) =>
            subtotal +
            Object.values(tallas).reduce((sumTallas, detalles) => sumTallas + detalles.cantidad, 0),
          0
        )
      );
    }, 0),
    totalRecaudado: reportes.reduce((sum, stand) => {
      return (
        sum +
        Object.values(stand.productosVendidos || {}).reduce(
          (subtotal, tallas) =>
            subtotal +
            Object.values(tallas).reduce((sumTallas, detalles) => sumTallas + detalles.subTotal, 0),
          0
        )
      );
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
    doc.text(`Generado por: ${nombreUsuario}`, 75, 40);

    // Línea de separación
    doc.setLineWidth(0.5);
    doc.setDrawColor("#007AC3");
    doc.line(10, 50, 200, 50);

    // Crear la tabla de playeras asignadas
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Productos Asignados por Stand", 105, 56, { align: "center" });

       // Tabla de productos asignados
       doc.setFontSize(14);
       doc.setTextColor(0);
       doc.setFont("helvetica", "bold");
       doc.text("Productos Asignados por Stand", 105, 56, { align: "center" });
   
       doc.autoTable({
        startY: 60,
        head: [["Stand", "Producto", "Talla", "Cantidad Asignada"]],
        body: reportes.flatMap((stand) =>
          Object.entries(stand.productosAsignados || {}).flatMap(([producto, tallas]) =>
            Object.entries(tallas).map(([talla, cantidad]) => [
              stand.nombreStand,
              producto,
              talla,
              cantidad,
            ])
          )
        ),
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [0, 122, 195], textColor: 255 },
        theme: "grid",
      });
  
       // Línea de separación
       doc.setLineWidth(0.5);
       doc.setDrawColor("#007AC3");
       doc.line(10, doc.lastAutoTable.finalY + 10, 200, doc.lastAutoTable.finalY + 10);
   
       // Tabla de productos vendidos
       doc.setFontSize(14);
       doc.setTextColor(0);
       doc.setFont("helvetica", "bold");
       doc.text("Productos Vendidos por Stand", 105, doc.lastAutoTable.finalY + 15, { align: "center" });
   
       doc.autoTable({
        startY: doc.lastAutoTable.finalY + 20,
        head: [["Stand", "Producto", "Talla", "Cantidad Vendida", "Subtotal"]],
        body: reportes.flatMap((stand) =>
          Object.entries(stand.productosVendidos || {}).flatMap(([producto, tallas]) =>
            Object.entries(tallas).map(([talla, detalles]) => [
              stand.nombreStand,
              producto,
              talla,
              detalles.cantidad,
              `Q${(detalles.subTotal || 0).toFixed(2)}`,
            ])
          )
        ),
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [0, 122, 195], textColor: 255 },
        theme: "grid",
      });

      const startY = doc.lastAutoTable.finalY + 10; // Punto inicial después de la tabla

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Total Productos Asignados: ${totalGeneral.totalAsignadas}`, 105, startY, { align: "center" });
      doc.text(`Total Productos Vendidos: ${totalGeneral.totalVendidas}`, 105, startY + 6, { align: "center" });
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
          <h3 style={{ fontWeight: "bold", color: "#333" }}>Reporte de ventas por Stand</h3>
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

        <h5>Productos Asignados por Stand</h5>
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
            <th>Producto</th>
            <th>Talla</th>
            <th>Cantidad Asignada</th>
          </tr>
        </thead>
        <tbody>
          {reportes.flatMap((stand) =>
            Object.entries(stand.productosAsignados || {}).flatMap(([producto, tallas]) =>
              Object.entries(tallas).map(([talla, cantidad]) => (
                <tr key={`${stand.nombreStand}-${producto}-${talla}`}>
                  <td>{stand.nombreStand}</td>
                  <td>{producto}</td>
                  <td>{talla}</td>
                  <td>{cantidad}</td>
                </tr>
              ))
            )
          )}
        </tbody>
      </table>

      <h5>Productos Vendidos por Stand</h5>
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
            <th>Producto</th>
            <th>Talla</th>
            <th>Cantidad Vendida</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
  {reportes.flatMap((stand) =>
    Object.entries(stand.productosVendidos || {}).flatMap(([producto, tallas]) =>
      Object.entries(tallas).map(([talla, detalles]) => (
        <tr key={`${stand.nombreStand}-${producto}-${talla}`}>
          <td>{stand.nombreStand}</td>
          <td>{producto}</td>
          <td>{talla}</td>
          <td>{detalles.cantidad}</td>
          <td>Q{(detalles.subTotal || 0).toFixed(2)}</td>
        </tr>
      ))
    )
  )}
</tbody>
      </table>
    </div>
  );
}

export default ReportePlayeras;

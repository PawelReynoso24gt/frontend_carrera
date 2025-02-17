import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../assets/img/LogoAYUVI_FullAzul.png"; 

function ReportePedidos() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [pedidos, setPedidos] = useState([]);
  const [alerta, setAlerta] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("Sin nombre");
  const [revisor, setRevisor] = useState("");
  const [cargo, setCargo] = useState("");

  useEffect(() => {
    const fetchPedidos = async () => {
      if (!fechaInicio || !fechaFin) return;
      try {
        const fechaInicioFormato = fechaInicio.split("-").reverse().join("-");
        const fechaFinFormato = fechaFin.split("-").reverse().join("-");

        const response = await axios.get(
          `http://localhost:5000/reportePedidos?fechaInicio=${fechaInicioFormato}&fechaFin=${fechaFinFormato}`
        );
        setPedidos(response.data.reporte);
        const pedidosActivos = response.data.reporte.filter(pedido => pedido.estado === 1); // Filtrar solo pedidos activos
        setPedidos(pedidosActivos);
        setAlerta("");
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
        setAlerta("Hubo un error al cargar los pedidos.");
      }
    };

    const fetchLoggedUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/usuarios/me", {
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
    fetchPedidos();
  }, [fechaInicio, fechaFin]);

  const generarPDF = () => {
    const doc = new jsPDF();

    // Logo y encabezado
    doc.addImage(logo, "PNG", 10, 10, 60, 30);
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("Reporte de Pedidos", 75, 20);
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

    // Tabla de pedidos
    const body = pedidos.map((pedido) => [
      pedido.idPedido,
      pedido.fecha,
      pedido.descripcion,
      pedido.detalles
        .map((detalle) => `${detalle.nombreProducto} - ${detalle.cantidad}`)
        .join("\n"),
    ]);

    doc.autoTable({
      startY: 60,
      head: [["ID Pedido", "Fecha", "Descripción", "Detalles"]],
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

    let totalPedidos = pedidos.length;


    const totalPorProducto = {};
    pedidos.forEach((pedido) => {
      pedido.detalles.forEach((detalle) => {
        if (!totalPorProducto[detalle.nombreProducto]) {
          totalPorProducto[detalle.nombreProducto] = 0;
        }
        totalPorProducto[detalle.nombreProducto] += detalle.cantidad;
      });
    });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`• Total de pedidos: ${totalPedidos}`, 14, startY + 10);

    let offsetY = 20;
    Object.entries(totalPorProducto).forEach(([producto, total], index) => {
      doc.text(`• ${producto}: ${total} unidades`, 14, startY + offsetY + index * 10);
    });

    // Espacio para la firma
    const firmaStartY = doc.lastAutoTable.finalY + 90;
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

    doc.save(`Reporte_Pedidos_${fechaInicioFormatted}_${fechaFinFormatted}.pdf`);
  };

  return (
    <div className="container mt-4" style={{maxWidth: "100%", margin: "0 auto",}}>
      <div className="row justify-content-center" style={{marginBottom: "20px" }}>
        <div className="col-12 text-center">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333", textAlign: "center" }}>
            Reporte de Pedidos
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
          disabled={pedidos.length === 0}
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
      
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID Pedido</th>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Detalles</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.idPedido}>
              <td>{pedido.idPedido}</td>
              <td>{pedido.fecha}</td>
              <td>{pedido.descripcion}</td>
              <td>
                <ul>
                  {pedido.detalles.map((detalle) => (
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

export default ReportePedidos;

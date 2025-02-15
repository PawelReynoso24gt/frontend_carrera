import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { parseISO } from "date-fns";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../assets/img/LogoAYUVI_FullAzul.png"; // Importa el logo

const ReporteContabilidad = () => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [productos, setProductos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [traslados, setTraslados] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [ventasVoluntarios, setVentasVoluntarios] = useState([]);
  const [ventasStands, setVentasStands] = useState([]);
  const [recaudacionesRifas, setRecaudacionesRifas] = useState([]);
  const [recaudacionesEventos, setRecaudacionesEventos] = useState([]);
  const [alerta, setAlerta] = useState("");
  const [revisor, setRevisor] = useState("");
  const [cargo, setCargo] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");

  useEffect(() => {
    const fetchReporte = async () => {
      if (!fechaInicio || !fechaFin) return;

      try {
        // Log para ver las fechas antes de enviarlas en la solicitud
        // console.log('Fecha inicio (React):', fechaInicio);
        // console.log('Fecha fin (React):', fechaFin);

        const response = await axios.get("https://api.voluntariadoayuvi.com/reporteContabilidad", {
          params: {
            fechaInicio,
            fechaFin,
          },
        });

        // Log para ver la respuesta completa de la API
        //console.log('Respuesta de la API:', response);

        setProductos(response.data.productos);
        setMovimientos(response.data.movimientosProductos);
        setTraslados(response.data.traslados);
        setPedidos(response.data.pedidos);
        setVentasVoluntarios(response.data.ventasVoluntarios);
        setVentasStands(response.data.ventasStands);
        setRecaudacionesRifas(response.data.recaudacionesRifas);
        setRecaudacionesEventos(response.data.recaudacionesEventos);
      } catch (error) {
        console.error("Error al cargar el reporte:", error);
        setAlerta("Hubo un error al cargar el reporte.");
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
      if (fechaInicio && fechaFin) {
        fetchReporte();
      }

    fetchReporte();
  }, [fechaInicio, fechaFin]);

  const renderPago = (pago) => {
    // Verificar si la imagen de transferencia es una cadena en base64
    if (/^[A-Za-z0-9+/]+={0,2}$/.test(pago.imagenTransferencia)) {
        return <div style={{ width: '150px', height: '150px', overflow: 'hidden' }}>
            <img src={`data:image/png;base64,${pago.imagenTransferencia}`} alt="Imagen de Transferencia" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>;
    } else {
      return <span>{pago.imagenTransferencia}</span>;
    }
  };

  const generarPDF = () => {
    const doc = new jsPDF('landscape'); // Cambia la orientación a horizontal
  
    // Calcula los datos necesarios para el resumen
    const productosTotales = productos.reduce((acc, producto) => {
        if (!acc[producto.idProducto]) {
          acc[producto.idProducto] = {
            nombre: producto.nombreProducto,
            cantidad: 0
          };
        }
        acc[producto.idProducto].cantidad += producto.detalle_productos.reduce((sum, dp) => sum + dp.cantidad, 0);
        return acc;
    }, {});
  
    const movimientosPorCategoria = movimientos.reduce((acc, movimiento) => {
      const categoria = movimiento.categoria_bitacora.categoria;
      if (!acc[categoria]) {
        acc[categoria] = [];
      }
      acc[categoria].push(movimiento.descripcion);
      return acc;
    }, {});
  
    const trasladosPorTipo = traslados.reduce((acc, traslado) => {
      const tipo = traslado.tipoTraslado.tipo;
      if (!acc[tipo]) {
        acc[tipo] = [];
      }
      const detalles = traslado.detalle_traslados.map(detalle => `Producto: ${detalle.producto.nombreProducto} (ID: ${detalle.idProducto}), ${tipo === 'Recibido' ? 'Cantidad Recibida' : 'Cantidad Enviada'}: ${detalle.cantidad}`).join(", ");
      acc[tipo].push(detalles);
      return acc;
    }, {});
  
    const detallesPedidos = pedidos.map(pedido => pedido.detalle_pedidos.map(detalle => `Producto: ${detalle.producto.nombreProducto} (ID: ${detalle.idProducto}), Cantidad: ${detalle.cantidad}`).join(", ")).join("\n");
  
    const totalVentasVoluntarios = ventasVoluntarios.reduce((acc, venta) => acc + parseFloat(venta.totalVenta || 0), 0).toFixed(2);
    const totalVentasStands = ventasStands.reduce((acc, venta) => acc + parseFloat(venta.totalVenta || 0), 0).toFixed(2);
  
    const totalRecaudacionesRifas = recaudacionesRifas.reduce((acc, recaudacion) => {
      const rifa = recaudacion.solicitudTalonario.talonario.rifa.nombreRifa;
      if (!acc[rifa]) {
        acc[rifa] = 0;
      }
      acc[rifa] += parseFloat(recaudacion.subTotal || 0);
      return acc;
    }, {});
  
    const rifaMayorRecaudacion = Object.keys(totalRecaudacionesRifas).reduce((max, rifa) => totalRecaudacionesRifas[rifa] > totalRecaudacionesRifas[max] ? rifa : max, Object.keys(totalRecaudacionesRifas)[0]);
    const rifaMenorRecaudacion = Object.keys(totalRecaudacionesRifas).reduce((min, rifa) => totalRecaudacionesRifas[rifa] < totalRecaudacionesRifas[min] ? rifa : min, Object.keys(totalRecaudacionesRifas)[0]);
  
    const eventoMayorRecaudacion = recaudacionesEventos.length > 0 
    ? recaudacionesEventos.reduce((max, evento) => parseFloat(evento.recaudacion || 0) > parseFloat(max.recaudacion || 0) ? evento : max, recaudacionesEventos[0]) 
    : null;

    const eventoMenorRecaudacion = recaudacionesEventos.length > 0 
    ? recaudacionesEventos.reduce((min, evento) => parseFloat(evento.recaudacion || 0) < parseFloat(min.recaudacion || 0) ? evento : min, recaudacionesEventos[0]) 
    : null;

    const fechaInicioFormatted = fechaInicio ? fechaInicio.split("-").reverse().join("/") : "N/A";
    const fechaFinFormatted = fechaFin ? fechaFin.split("-").reverse().join("/") : "N/A";
    // Logo y encabezado
    doc.addImage(logo, "PNG", 10, 10, 60, 30);
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("Reporte de Contabilidad", 110, 20); // Ajusta la posición del texto
    doc.setFontSize(12);
    doc.text("Fecha de generación:", 110, 28);
    doc.setFontSize(10);
    doc.text(new Date().toLocaleDateString("es-ES"), 167, 28);
    doc.text(new Date().toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit', hour12: true }), 185, 28);
    doc.setFontSize(10);
    doc.text(`Desde: ${fechaInicioFormatted}   Hasta: ${fechaFinFormatted}`, 110, 35);
    doc.text(`Generado por: ${nombreUsuario}`, 110, 40);
  
    doc.setLineWidth(0.5);
    doc.setDrawColor("#007AC3");
    doc.line(10, 50, 290, 50); // Ajusta la longitud de la línea
  
    const tableLineStyle = {
      lineColor: [0, 0, 0], // Color de las líneas (negro)
      lineWidth: 0.75 // Grosor de las líneas
    };
  
    // Productos
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Productos", 145, 60, { align: "center" });
  
    doc.autoTable({
      startY: 65,
      head: [["Nombre Producto", "Talla", "Precio", "Descripción", "Cantidad Min.", "Cantidad Max.", "Categoría", "Sede", "Cantidad"]],
      body: productos.map((producto) => [
        producto.nombreProducto,
        producto.talla,
        `Q ${producto.precio}`,
        producto.descripcion,
        producto.cantidadMinima,
        producto.cantidadMaxima,
        producto.categoria.nombreCategoria,
        producto.detalle_productos.length ? producto.detalle_productos[0].sede.nombreSede : "N/A",
        producto.detalle_productos.length ? producto.detalle_productos[0].cantidad : "N/A",
      ]),
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [0, 122, 195], textColor: 255 },
      theme: "grid",
      tableLineStyle: tableLineStyle
    });
  
    // Movimientos de Productos
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Movimientos de Productos", 145, doc.previousAutoTable.finalY + 10, { align: "center" });
  
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 15,
      head: [["ID", "Fecha", "Descripción", "Categoría"]],
      body: movimientos.map((movimiento) => [
        movimiento.idBitacora,
        movimiento.fechaHora ? format(parseISO(movimiento.fechaHora), "dd-MM-yyyy hh:mm a") : "Sin fecha",
        movimiento.descripcion,
        movimiento.categoria_bitacora.categoria,
      ]),
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [0, 122, 195], textColor: 255 },
      theme: "grid",
      tableLineStyle: tableLineStyle
    });
  
    // Traslados
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Traslados", 145, doc.previousAutoTable.finalY + 10, { align: "center" });
  
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 15,
      head: [["ID", "Fecha", "Descripción", "Tipo", "Detalle"]],
      body: traslados.map((traslado) => [
        traslado.idTraslado,
        traslado.fecha ? format(parseISO(traslado.fecha), "dd-MM-yyyy") : "Sin fecha",
        traslado.descripcion,
        traslado.tipoTraslado.tipo,
        traslado.detalle_traslados.map(detalle => 
          `Producto: ${detalle.producto.nombreProducto} (ID: ${detalle.idProducto}), ${traslado.tipoTraslado.tipo === "Recibido" ? "Cantidad Recibida" : "Cantidad Enviada"}: ${detalle.cantidad}`
        ).join(", "),
      ]),
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [0, 122, 195], textColor: 255 },
      theme: "grid",
      tableLineStyle: tableLineStyle
    });
  
    // Pedidos
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Pedidos", 145, doc.previousAutoTable.finalY + 10, { align: "center" });
  
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 15,
      head: [["ID", "Fecha", "Descripción", "Sede", "Detalle"]],
      body: pedidos.map((pedido) => [
        pedido.idPedido,
        pedido.fecha ? format(parseISO(pedido.fecha), "dd-MM-yyyy") : "Sin fecha",
        pedido.descripcion,
        pedido.sede.nombreSede,
        pedido.detalle_pedidos.map(detalle => 
          `Producto: ${detalle.producto.nombreProducto} (ID: ${detalle.idProducto}), Cantidad: ${detalle.cantidad}`
        ).join(", "),
      ]),
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [0, 122, 195], textColor: 255 },
      theme: "grid",
      tableLineStyle: tableLineStyle
    });
  
    // Ventas de Voluntarios
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Ventas de Voluntarios", 145, doc.previousAutoTable.finalY + 10, { align: "center" });
  
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 15,
      head: [["ID Venta", "Total", "Fecha", "Tipo de Público", "Voluntario", "Detalle", "Pagos"]],
      body: ventasVoluntarios.map((venta) => [
        venta.idVenta,
        `Q ${venta.totalVenta}`,
        venta.fechaVenta ? format(parseISO(venta.fechaVenta), "dd-MM-yyyy") : "Sin fecha",
        venta.tipo_publico.nombreTipo,
        venta.detalle_ventas_voluntarios[0].voluntario.persona.nombre,
        venta.detalle_ventas_voluntarios.map(detalle => `Producto: ${detalle.producto.nombreProducto}, SubTotal: Q${detalle.subTotal}, Donación: Q${detalle.donacion}`).join(", "),
        venta.detalle_ventas_voluntarios.map(detalle => detalle.detalle_pago_ventas_voluntarios.map(pago => `Tipo de Pago: ${pago.tipo_pago.tipo}, Correlativo: ${pago.correlativo}, Pago: Q${pago.pago}`).join(", ")).join(", "),
      ]),
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [0, 122, 195], textColor: 255 },
      theme: "grid",
      tableLineStyle: tableLineStyle
    });
  
    // Ventas de Stands
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Ventas de Stands", 145, doc.previousAutoTable.finalY + 10, { align: "center" });
  
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 15,
      head: [["ID Venta", "Total", "Fecha", "Tipo de Público", "Stand", "Detalle", "Pagos"]],
      body: ventasStands.map((venta) => [
        venta.idVenta,
        `Q ${venta.totalVenta}`,
        venta.fechaVenta ? format(parseISO(venta.fechaVenta), "dd-MM-yyyy") : "Sin fecha",
        venta.tipo_publico.nombreTipo,
        venta.detalle_ventas_stands[0].stand.nombreStand,
        venta.detalle_ventas_stands.map(detalle => `Producto: ${detalle.producto.nombreProducto}, SubTotal: Q${detalle.subTotal}, Donación: Q${detalle.donacion}`).join(", "),
        venta.detalle_ventas_stands.map(detalle => detalle.detalle_pago_ventas_stands.map(pago => `Tipo de Pago: ${pago.tipo_pago.tipo}, Correlativo: ${pago.correlativo}, Pago: Q${pago.pago}`).join(", ")).join(", "),
      ]),
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [0, 122, 195], textColor: 255 },
      theme: "grid",
      tableLineStyle: tableLineStyle
    });
  
    // Recaudaciones de Rifas
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Recaudaciones de Rifas", 145, doc.previousAutoTable.finalY + 10, { align: "center" });
  
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 15,
      head: [["ID Recaudación", "Boletos Vendidos", "SubTotal", "Código Talonario", "Voluntario", "Rifa", "Fecha Inicio", "Fecha Fin", "Pagos"]],
      body: recaudacionesRifas.map((recaudacion) => [
        recaudacion.idRecaudacionRifa,
        recaudacion.boletosVendidos,
        `Q ${recaudacion.subTotal}`,
        recaudacion.solicitudTalonario.talonario.codigoTalonario,
        recaudacion.solicitudTalonario.voluntario.persona.nombre,
        recaudacion.solicitudTalonario.talonario.rifa.nombreRifa,
        recaudacion.solicitudTalonario.talonario.rifa.fechaInicio ? format(parseISO(recaudacion.solicitudTalonario.talonario.rifa.fechaInicio), "dd-MM-yyyy") : "Sin fecha",
        recaudacion.solicitudTalonario.talonario.rifa.fechaFin ? format(parseISO(recaudacion.solicitudTalonario.talonario.rifa.fechaFin), "dd-MM-yyyy") : "Sin fecha",
        recaudacion.detalle_pago_recaudacion_rifas.map(pago => `Tipo de Pago: ${pago.tipo_pago.tipo}, Correlativo: ${pago.correlativo}, Pago: Q${pago.pago}`).join(", "),
      ]),
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [0, 122, 195], textColor: 255 },
      theme: "grid",
      tableLineStyle: tableLineStyle
    });
  
    // Recaudaciones de Eventos
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Recaudaciones de Eventos", 145, doc.previousAutoTable.finalY + 10, { align: "center" });
  
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 15,
      head: [["ID Recaudación", "Recaudación", "Número de Personas", "Nombre del Evento", "Nombre de la Sede", "Fecha de Registro", "Nombre del Empleado"]],
      body: recaudacionesEventos.map((recaudacion) => [
        recaudacion.idRecaudacionEvento,
        `Q ${recaudacion.recaudacion}`,
        recaudacion.numeroPersonas,
        recaudacion.evento.nombreEvento,
        recaudacion.evento.sede.nombreSede,
        recaudacion.fechaRegistro ? format(parseISO(recaudacion.fechaRegistro), "dd-MM-yyyy") : "Sin fecha",
        recaudacion.empleado.persona.nombre,
      ]),
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [0, 122, 195], textColor: 255 },
      theme: "grid",
      tableLineStyle: tableLineStyle
    });

// Resumen al final del PDF
let currentY = doc.previousAutoTable.finalY + 20;

const verificarEspacio = (currentY, incremento) => {
  if (currentY + incremento > doc.internal.pageSize.height - 20) {
    doc.addPage();
    return 20; // Reinicia la posición en la nueva página
  }
  return currentY + incremento;
};

currentY = verificarEspacio(currentY, 10);
doc.setFontSize(12);
doc.setFont("helvetica", "bold");
doc.text("RESUMEN", 14, currentY);

currentY = verificarEspacio(currentY, 10);
doc.setFontSize(10);
doc.setFont("helvetica", "bold");
doc.text("Total de Productos:", 14, currentY);

Object.keys(productosTotales).forEach(id => {
  currentY = verificarEspacio(currentY, 10);
  doc.setFont("helvetica", "normal");
  doc.text(`- ID ${id} - ${productosTotales[id].nombre}: ${productosTotales[id].cantidad}`, 14, currentY);
});

// Movimientos por Categoría
currentY = verificarEspacio(currentY, 20);
doc.setFont("helvetica", "bold");
doc.text("Movimientos por Categoría:", 14, currentY);

Object.keys(movimientosPorCategoria).forEach(categoria => {
  currentY = verificarEspacio(currentY, 10);
  doc.setFont("helvetica", "normal");
  doc.text(`- ${categoria}:`, 14, currentY);
  movimientosPorCategoria[categoria].forEach(descripcion => {
    currentY = verificarEspacio(currentY, 10);
    doc.text(`  * ${descripcion}`, 14, currentY);
  });
});

// Traslados por Tipo
currentY = verificarEspacio(currentY, 20);
doc.setFont("helvetica", "bold");
doc.text("Traslados por Tipo:", 14, currentY);

Object.keys(trasladosPorTipo).forEach(tipo => {
  currentY = verificarEspacio(currentY, 10);
  doc.setFont("helvetica", "normal");
  doc.text(`- ${tipo}:`, 14, currentY);
  trasladosPorTipo[tipo].forEach(detalle => {
    currentY = verificarEspacio(currentY, 10);
    doc.text(`  * ${detalle}`, 14, currentY);
  });
});

// Pedidos
currentY = verificarEspacio(currentY, 20);
doc.setFont("helvetica", "bold");
doc.text("Detalles de Pedidos:", 14, currentY);
currentY = verificarEspacio(currentY, 10);
doc.setFont("helvetica", "normal");
doc.text(detallesPedidos, 14, currentY);

// Ventas de Voluntarios y Stands
currentY = verificarEspacio(currentY, 30);
doc.setFont("helvetica", "bold");
doc.text(`Total Ventas de Voluntarios: Q ${totalVentasVoluntarios}`, 14, currentY);
currentY = verificarEspacio(currentY, 10);
doc.text(`Total Ventas de Stands: Q ${totalVentasStands}`, 14, currentY);

// Recaudaciones de Rifas
currentY = verificarEspacio(currentY, 20);
doc.setFont("helvetica", "bold");
doc.text("Recaudaciones de Rifas:", 14, currentY);

Object.keys(totalRecaudacionesRifas).forEach(rifa => {
    currentY = verificarEspacio(currentY, 10);
    doc.setFont("helvetica", "normal");
    doc.text(`- ${rifa}: Q ${(totalRecaudacionesRifas[rifa] || 0).toFixed(2)}`, 14, currentY);
  });
  currentY = verificarEspacio(currentY, 10);
  doc.setFont("helvetica", "bold");
  doc.text(`Rifa Mayor Recaudación: ${rifaMayorRecaudacion} (Q ${(totalRecaudacionesRifas[rifaMayorRecaudacion] || 0).toFixed(2)})`, 14, currentY);
  currentY = verificarEspacio(currentY, 10);
  doc.text(`Rifa Menor Recaudación: ${rifaMenorRecaudacion} (Q ${(totalRecaudacionesRifas[rifaMenorRecaudacion] || 0).toFixed(2)})`, 14, currentY);

// Recaudaciones de Eventos
currentY = verificarEspacio(currentY, 20);
doc.setFont("helvetica", "bold");

if (eventoMayorRecaudacion) {
    doc.text(`Evento Mayor Recaudación: ${eventoMayorRecaudacion.evento.nombreEvento} (Q ${(parseFloat(eventoMayorRecaudacion.recaudacion || 0)).toFixed(2)})`, 14, currentY);
    currentY = verificarEspacio(currentY, 10);
} else {
    doc.text(`Evento Mayor Recaudación: N/A`, 14, currentY);
    currentY = verificarEspacio(currentY, 10);
}

if (eventoMenorRecaudacion) {
    doc.text(`Evento Menor Recaudación: ${eventoMenorRecaudacion.evento.nombreEvento} (Q ${(parseFloat(eventoMenorRecaudacion.recaudacion || 0)).toFixed(2)})`, 14, currentY);
} else {
    doc.text(`Evento Menor Recaudación: N/A`, 14, currentY);
}

// Firma
if (revisor.trim() || cargo.trim()) {
currentY = verificarEspacio(currentY, 30);
doc.setFont("helvetica", "normal");
doc.setFontSize(10);
doc.text("_______________________________", 147, currentY, { align: "center" });
doc.text(revisor || "Sin nombre", 147, currentY + 10, { align: "center" });
doc.text(cargo || "Sin cargo", 147, currentY + 20, { align: "center" });
}
// Guarda el PDF
doc.save(`Reporte_Contabilidad_${fechaInicioFormatted}_${fechaFinFormatted}.pdf`);
};

  return (
    <div className="container mt-4">
      <div className="row mb-3">
        <div className="col text-center">
          <h3>Reporte de Contabilidad</h3>
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
          disabled={!fechaFin}
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
      

      <h4>Productos</h4>
      <table className="table mt-4">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Nombre Producto</th>
            <th>Talla</th>
            <th>Precio</th>
            <th>Descripción</th>
            <th>Cantidad Min.</th>
            <th>Cantidad Max.</th>
            <th>Categoría</th>
            <th>Sede</th>
            <th>Cantidad</th>
            <th>Foto</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto, index) => (
            <tr key={index}>
                <td>{producto.idProducto}</td>
              <td>{producto.nombreProducto}</td>
              <td>{producto.talla}</td>
              <td>{`Q ${producto.precio}`}</td>
              <td>{producto.descripcion}</td>
              <td>{producto.cantidadMinima}</td>
              <td>{producto.cantidadMaxima}</td>
              <td>{producto.categoria.nombreCategoria}</td>
              <td>{producto.detalle_productos.length ? producto.detalle_productos[0].sede.nombreSede : "N/A"}</td>
              <td>{producto.detalle_productos.length ? producto.detalle_productos[0].cantidad : "N/A"}</td>
              <td>
                {producto.foto ? (
                  <img
                    src={`https://api.voluntariadoayuvi.com/${producto.foto}`}
                    alt={producto.nombreProducto}
                    style={{ width: "100px", height: "100px", objectFit: 'cover' }}
                  />
                ) : (
                  "N/A"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Movimientos de Productos</h4>
      <table className="table mt-4">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Categoría</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((movimiento, index) => (
            <tr key={index}>
              <td>{movimiento.idBitacora}</td>
              <td>{movimiento.fechaHora ? format(parseISO(movimiento.fechaHora), "dd-MM-yyyy hh:mm a") : "Sin fecha"}</td>
              <td>{movimiento.descripcion}</td>
              <td>{movimiento.categoria_bitacora.categoria}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Traslados</h4>
      <table className="table mt-4">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Tipo</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {traslados.map((traslado, index) => (
            <tr key={index}>
              <td>{traslado.idTraslado}</td>
              <td>{traslado.fecha ? format(parseISO(traslado.fecha), "dd-MM-yyyy") : "Sin fecha"}</td>
              <td>{traslado.descripcion}</td>
              <td>{traslado.tipoTraslado.tipo}</td>
              <td>
                <ul>
                  {traslado.detalle_traslados.map((detalle, idx) => (
                    <li key={idx}>
                      Producto: {detalle.producto.nombreProducto} (ID: {detalle.idProducto}), {traslado.tipoTraslado.tipo === "Recibido" ? "Cantidad Recibida" : "Cantidad Enviada"}: {detalle.cantidad}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Pedidos</h4>
      <table className="table mt-4">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Sede</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido, index) => (
            <tr key={index}>
              <td>{pedido.idPedido}</td>
              <td>{pedido.fecha? format(parseISO(pedido.fecha), "dd-MM-yyyy") : "Sin fecha"}</td>
              <td>{pedido.descripcion}</td>
              <td>{pedido.sede.nombreSede}</td>
              <td>
                <ul>
                  {pedido.detalle_pedidos.map((detalle, idx) => (
                    <li key={idx}>
                      Producto: {detalle.producto.nombreProducto} (ID: {detalle.idProducto}), Cantidad: {detalle.cantidad}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Ventas de Voluntarios</h4>
      <table className="table mt-4">
        <thead className="thead-dark">
          <tr>
            <th>ID Venta</th>
            <th>Total</th>
            <th>Fecha</th>
            <th>Tipo de Público</th>
            <th>Voluntario</th>
            <th>Detalle</th>
            <th>Pagos</th>
          </tr>
        </thead>
        <tbody>
          {ventasVoluntarios.map((venta, index) => (
            <tr key={index}>
              <td>{venta.idVenta}</td>
              <td>{`Q ${venta.totalVenta}`}</td>
              <td>{venta.fechaVenta ? format(parseISO(venta.fechaVenta), "dd-MM-yyyy") : "Sin fecha"}</td>
              <td>{venta.tipo_publico.nombreTipo}</td>
              <td>{venta.detalle_ventas_voluntarios[0].voluntario.persona.nombre}</td>
              <td>
                <ul>
                  {venta.detalle_ventas_voluntarios.map((detalle, idx) => (
                    <li key={idx}>
                      Producto: {detalle.producto.nombreProducto}, SubTotal: Q{detalle.subTotal}, Donación: Q{detalle.donacion}
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <ul>
                  {venta.detalle_ventas_voluntarios.map((detalle, idx) => (
                    detalle.detalle_pago_ventas_voluntarios.map((pago, pidx) => (
                      <li key={pidx}>
                        Tipo de Pago: {pago.tipo_pago.tipo}, Correlativo: {pago.correlativo} ,Pago: Q{pago.pago}, {renderPago(pago)}
                      </li>
                    ))
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Ventas de Stands</h4>
      <table className="table mt-4">
        <thead className="thead-dark">
          <tr>
            <th>ID Venta</th>
            <th>Total</th>
            <th>Fecha</th>
            <th>Tipo de Público</th>
            <th>Stand</th> {/* Nueva columna para el nombre del stand */}
            <th>Detalle</th>
            <th>Pagos</th>
          </tr>
        </thead>
        <tbody>
          {ventasStands.map((venta, index) => (
            <tr key={index}>
              <td>{venta.idVenta}</td>
              <td>{`Q ${venta.totalVenta}`}</td>
              <td>{venta.fechaVenta ? format(parseISO(venta.fechaVenta), "dd-MM-yyyy") : "Sin fecha"}</td>
              <td>{venta.tipo_publico.nombreTipo}</td>
              <td>{venta.detalle_ventas_stands[0].stand.nombreStand}</td> 
              <td>
                <ul>
                  {venta.detalle_ventas_stands.map((detalle, idx) => (
                    <li key={idx}>
                      Producto: {detalle.producto.nombreProducto}, SubTotal: Q{detalle.subTotal}, Donación: Q{detalle.donacion}
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <ul>
                  {venta.detalle_ventas_stands.map((detalle, idx) => (
                    detalle.detalle_pago_ventas_stands.map((pago, pidx) => (
                      <li key={pidx}>
                        Tipo de Pago: {pago.tipo_pago.tipo}, Correlativo: {pago.correlativo} ,Pago: Q{pago.pago}, {renderPago(pago)}
                      </li>
                    ))
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Recaudaciones de Rifas</h4>
      <table className="table mt-4">
        <thead className="thead-dark">
          <tr>
            <th>ID Recaudación</th>
            <th>Boletos Vendidos</th>
            <th>SubTotal</th>
            <th>Código Talonario</th>
            <th>Voluntario</th>
            <th>Rifa</th>
            <th>Fecha Inicio</th> 
            <th>Fecha Fin</th>
            <th>Pagos</th>
          </tr>
        </thead>
        <tbody>
          {recaudacionesRifas.map((recaudacion, index) => (
            <tr key={index}>
              <td>{recaudacion.idRecaudacionRifa}</td>
              <td>{recaudacion.boletosVendidos}</td>
              <td>{`Q ${recaudacion.subTotal}`}</td>
              <td>{recaudacion.solicitudTalonario.talonario.codigoTalonario}</td>
              <td>{recaudacion.solicitudTalonario.voluntario.persona.nombre}</td> 
              <td>{recaudacion.solicitudTalonario.talonario.rifa.nombreRifa}</td> 
              <td>{recaudacion.solicitudTalonario.talonario.rifa.fechaInicio ? format(parseISO(recaudacion.solicitudTalonario.talonario.rifa.fechaInicio), "dd-MM-yyyy") : "Sin fecha"}</td>
              <td>{recaudacion.solicitudTalonario.talonario.rifa.fechaFin ? format(parseISO(recaudacion.solicitudTalonario.talonario.rifa.fechaFin), "dd-MM-yyyy") : "Sin fecha"}</td>
              <td>
                <ul>
                  {recaudacion.detalle_pago_recaudacion_rifas.map((pago, idx) => (
                    <li key={idx}>
                      Tipo de Pago: {pago.tipo_pago.tipo}, Correlativo: {pago.correlativo} ,Pago: Q{pago.pago}, {renderPago(pago)}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Recaudaciones de Eventos</h4>
        <table className="table mt-4">
            <thead className="thead-dark">
                <tr>
                <th>ID Recaudación</th>
                <th>Recaudación</th>
                <th>Número de Personas</th>
                <th>Nombre del Evento</th>
                <th>Nombre de la Sede</th>
                <th>Fecha de Registro</th>
                <th>Nombre del Empleado</th>
                </tr>
            </thead>
            <tbody>
                {recaudacionesEventos.map((recaudacion, index) => (
                <tr key={index}>
                    <td>{recaudacion.idRecaudacionEvento}</td>
                    <td>{`Q ${recaudacion.recaudacion}`}</td>
                    <td>{recaudacion.numeroPersonas}</td>
                    <td>{recaudacion.evento.nombreEvento}</td>
                    <td>{recaudacion.evento.sede.nombreSede}</td>
                    <td>{recaudacion.fechaRegistro ? format(parseISO(recaudacion.fechaRegistro), "dd-MM-yyyy") : "Sin fecha"}</td>
                    <td>{recaudacion.empleado.persona.nombre}</td>
                </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
};

export default ReporteContabilidad;
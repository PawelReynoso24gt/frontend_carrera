import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../assets/img/LogoAYUVI_FullAzul.png"; // Importa el logo

function ReporteTecnico() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [registros, setRegistros] = useState([]);
  const [alerta, setAlerta] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [revisor, setRevisor] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const problemasDetectados = await axios.get("http://localhost:5000/bitacora/problemas");
        const problemasRevision = await axios.get("http://localhost:5000/bitacora/problemasRevision");
        const problemasSolucionados = await axios.get("http://localhost:5000/bitacora/problemasSolucionados");

        setRegistros([
          ...problemasDetectados.data.map((registro) => ({
            ...registro,
            estado: "problema detectado",
          })),
          ...problemasRevision.data.map((registro) => ({
            ...registro,
            estado: "problema en revisión",
          })),
          ...problemasSolucionados.data.map((registro) => ({
            ...registro,
            estado: "problema solucionado",
          })),
        ]);
      } catch (error) {
        console.error("Error al cargar registros:", error);
        setAlerta("Hubo un error al cargar los registros.");
      }
    };

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

    fetchData();
    fetchLoggedUser();
  }, []);
  
  function formatDateTimeFromUTC(dateString) {
    // La fecha de entrada se encuentra en formato ISO
    const [datePart, timePart] = dateString.split("T"); // Dividir la fecha y la hora
    const [year, month, day] = datePart.split("-"); // Separar año, mes y día
    const [hour, minute, second] = timePart.split(":"); // Separar hora, minutos y segundos
  
    // Convertir hora a formato 12 horas
    const hour12 = (hour % 12) || 12; // Convertir a formato 12 horas
    const amPm = hour >= 12 ? "p. m." : "a. m.";
  
    return `${day}/${month}/${year} ${hour12}:${minute} ${amPm}`;
  }
  
  const registrosFiltrados = useMemo(() => {
    if (!fechaInicio || !fechaFin) {
      return [];
    }
  
    // Interpretar fechas exactamente como seleccionadas
    const inicio = new Date(`${fechaInicio}T00:00:00`);
    const fin = new Date(`${fechaFin}T23:59:59`);
  
    return registros.filter((registro) => {
      const fechaRegistro = new Date(registro.fechaHora);
      return fechaRegistro >= inicio && fechaRegistro <= fin;
    });
  }, [fechaInicio, fechaFin, registros]);
  
  const generarPDF = () => {
    const doc = new jsPDF();
  
    // Logo y texto al lado
    doc.addImage(logo, "PNG", 10, 10, 60, 30); // Logo ajustado
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("Reporte de Soporte Técnico", 75, 20); // Título alineado al lado del logo
    doc.setFontSize(12);
    doc.text(new Date().toLocaleDateString("es-ES"), 75, 28); // Fecha de generación debajo del título
    doc.setFontSize(10);

      // Formato de fecha: DD-MM-YYYY
  const fechaInicioFormatted = fechaInicio.split("-").reverse().join("/");
  const fechaFinFormatted = fechaFin.split("-").reverse().join("/");

    doc.text(`Desde: ${fechaInicioFormatted}   Hasta: ${fechaFinFormatted}`, 75, 35); // Rango de fechas
    doc.text(`Generado por: ${nombreUsuario}`, 75, 40);
  
    // Línea de separación
    doc.setLineWidth(0.5);
    doc.setDrawColor("#007AC3"); // Línea en azul
    doc.line(10, 50, 200, 50);
  
    // Crear tablas por estado
    const estados = [
      { nombre: "Problemas detectados", clave: "problema detectado" },
      { nombre: "Problemas en revisión", clave: "problema en revisión" },
      { nombre: "Problemas solucionados", clave: "problema solucionado" },
    ];
    let startY = 55;
  
    estados.forEach(({ nombre, clave }) => {
      const datos = registrosFiltrados.filter((registro) => registro.estado === clave);
  
      if (datos.length > 0) {
        // Espacio adicional entre la línea y el título
        startY += 5;
  
        // Título de la sección
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold"); // Negrita
        doc.text(nombre, 105, startY, { align: "center" }); // Centrados y en negrita
  
        // Tabla de datos
        doc.autoTable({
          startY: startY + 5,
          head: [["ID", "Descripción", "Fecha y Hora", "Usuario", "Nombre"]],
          body: datos.map((registro) => [
            registro.idBitacora,
            registro.descripcion,
            formatDateTimeFromUTC(registro.fechaHora),
            registro.usuario?.usuario || "Sin usuario",
            registro.usuario?.persona?.nombre || "Sin nombre",
          ]),
          styles: { fontSize: 10, cellPadding: 2 },
          headStyles: { fillColor: [0, 122, 195], textColor: 255 }, // Fondo azul y texto blanco
          theme: "grid",
        });
  
        startY = doc.previousAutoTable.finalY + 10; // Ajustar posición para la siguiente tabla
      }
    });

  // Calcular subtotales
  const totalRegistros = registrosFiltrados.length;
  const totalPorEstado = {
    detectados: registrosFiltrados.filter((registro) => registro.estado === "problema detectado").length,
    enRevision: registrosFiltrados.filter((registro) => registro.estado === "problema en revisión").length,
    solucionados: registrosFiltrados.filter((registro) => registro.estado === "problema solucionado").length,
  };
  const usuarioConMasRegistros = registrosFiltrados.reduce((acc, registro) => {
    const usuario = registro.usuario?.usuario || "Sin usuario";
    acc[usuario] = (acc[usuario] || 0) + 1;
    return acc;
  }, {});
  const usuarioTop = Object.keys(usuarioConMasRegistros).reduce((max, usuario) =>
    usuarioConMasRegistros[usuario] > usuarioConMasRegistros[max] ? usuario : max
  );

  // Revisar si el resumen cabe en la página actual, de lo contrario, agregar nueva página
  if (startY + 60 > 280) { // 280 es el límite antes de la parte inferior
    doc.addPage();
    startY = 10; // Comenzar desde la parte superior de la nueva página
  }

  // Resumen
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#333");
  doc.text("RESUMEN", 14, startY);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`• Total de registros: ${totalRegistros}`, 14, startY + 10);
  doc.text(`• Problemas detectados: ${totalPorEstado.detectados}`, 14, startY + 20);
  doc.text(`• Problemas en revisión: ${totalPorEstado.enRevision}`, 14, startY + 30);
  doc.text(`• Problemas solucionados: ${totalPorEstado.solucionados}`, 14, startY + 40);
  doc.text(`• Período cubierto: Desde ${fechaInicioFormatted} hasta ${fechaFinFormatted}`, 14, startY + 50);
  doc.text(`• Usuario con más registros: ${usuarioTop} (${usuarioConMasRegistros[usuarioTop]} registros)`, 14, startY + 60);

  // Espacio para la firma
  const firmaStartY = startY + 80; // Ajustamos para que quede más cerca del resumen
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("_______________________________", 105, firmaStartY, { align: "center" });
  doc.text(revisor || "Sin nombre", 105, firmaStartY + 10, { align: "center" });

    doc.save(`Reporte_Soporte_Tecnico_${fechaInicioFormatted}_${fechaFinFormatted}.pdf`);
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
          <h3 style={{ fontWeight: "bold", color: "#333" }}>Reporte de Soporte Técnico</h3>
        </div>
      </div>

      {alerta && <div className="alert alert-warning">{alerta}</div>}

<div className="text-center mb-4"> {/* Contenedor centrado */}
  <div className="d-inline-flex align-items-center mb-3"> {/* Alineación en línea y centrado */}
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

<div className="text-center mb-4"> {/* Contenedor centrado */}
<button
    className="btn btn-success mx-auto" // Centrar el botón
    onClick={generarPDF}
    disabled={registrosFiltrados.length === 0}
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
            <th>ID</th>
            <th>Descripción</th>
            <th>Fecha y Hora</th>
            <th>Usuario</th>
            <th>Nombre</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {registrosFiltrados.map((registro) => (
            <tr key={registro.idBitacora}>
              <td>{registro.idBitacora}</td>
              <td>{registro.descripcion}</td>
              <td>{formatDateTimeFromUTC(registro.fechaHora)}</td>
              <td>{registro.usuario?.usuario || "Sin usuario"}</td>
              <td>{registro.usuario?.persona?.nombre || "Sin nombre"}</td>
              <td>{registro.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReporteTecnico;

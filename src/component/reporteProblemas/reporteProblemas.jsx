import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../assets/img/LogoAYUVI_FullAzul.png"; // Reemplaza por tu logo

function ReporteTecnico() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [situaciones, setSituaciones] = useState([]);
  const [alerta, setAlerta] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [revisor, setRevisor] = useState("");
  const [cargo, setCargo] = useState("");

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/usuarios/permisos', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Ajusta según dónde guardes el token
          },
        });
        setPermissions(response.data.permisos || {});
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermissions();

    const fetchSituaciones = async () => {
      try {
        const fechaInicioFormato = fechaInicio.split("-").reverse().join("-");
        const fechaFinFormato = fechaFin.split("-").reverse().join("-");

        setAlerta("");
        const response = await axios.get(
          `http://localhost:5000/situaciones/reporte?fechaInicio=${fechaInicioFormato}&fechaFin=${fechaFinFormato}`
        );

        const data = response.data.reporte;

        setSituaciones(data);
      } catch (error) {
        console.error("Error al cargar situaciones:", error);
        setAlerta("Hubo un error al cargar las situaciones.");
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
    if (fechaInicio && fechaFin) {
      fetchSituaciones();
    }

  }, [fechaInicio, fechaFin]);


  function formatDateTime(fecha) {
    if (!fecha) return "Sin fecha";
    return fecha; // Retorna directamente el string formateado desde el backend
  }

  const registrosFiltrados = useMemo(() => {
    if (!fechaInicio || !fechaFin) {
      return situaciones;
    }

    const checkPermission = (permission, message) => {
      if (!permissions[permission]) {
        setPermissionMessage(message);
        setShowPermissionModal(true);
        return false;
      }
      return true;
    };

    const inicio = new Date(`${fechaInicio}T00:00:00`);
    const fin = new Date(`${fechaFin}T23:59:59`);


    const filtrados = {};
    Object.entries(situaciones).forEach(([estado, registros]) => {
      filtrados[estado] = registros.filter((registro) => {
        if (!registro.fechaOcurrencia) return false;
        const fechaRegistro = new Date(registro.fechaOcurrencia);
        return fechaRegistro >= inicio && fechaRegistro <= fin;
      });
    });
    // Verificar los datos aquí
    return filtrados;
  }, [fechaInicio, fechaFin, situaciones]);



  const generarPDF = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    // Logo y texto al lado
    doc.addImage(logo, "PNG", 10, 10, 60, 30);
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("Reporte de Situaciones", 75, 20);
    doc.setFontSize(12);
    doc.text(new Date().toLocaleDateString("es-ES"), 75, 28);
    doc.setFontSize(10);
    const fechaInicioFormatted = fechaInicio.split("-").reverse().join("/");
    const fechaFinFormatted = fechaFin.split("-").reverse().join("/");
    doc.text(`Desde: ${fechaInicioFormatted}   Hasta: ${fechaFinFormatted}`, 75, 35);
    doc.text(`Generado por: ${nombreUsuario}`, 75, 40);

    doc.setLineWidth(0.5);
    doc.setDrawColor("#007AC3");
    doc.line(10, 50, 200, 50);


    let startY = 55;

    Object.entries(situaciones).forEach(([estado, registros]) => {
      if (registros.length > 0) {
        // Verificar si hay espacio suficiente antes de agregar el encabezado
        if (startY + 20 > pageHeight) {
          doc.addPage();
          startY = 10; // Reiniciar la posición en la nueva página
        }

        // Añadir título del estado
        doc.setFontSize(14);
        doc.text(estado, 105, startY, { align: "center" });

        // Ajustar espacio entre título y tabla
        startY += 8;

        // Verificar si hay espacio suficiente para la tabla
        if (startY + 30 > pageHeight) {
          doc.addPage();
          startY = 10; // Reiniciar la posición en la nueva página
        }

        doc.autoTable({
          startY: startY,
          head: [["ID", "Descripción", "Estado", "Fecha y Hora", "Usuario", "Nombre", "Respuesta", "Observaciones"]],
          body: registros.map((registro) => [
            registro.idSituacion,
            registro.descripcion,
            estado,
            registro.fechaOcurrencia,
            registro.usuario?.usuario || "Sin usuario",
            registro.usuario?.persona?.nombre || "Sin nombre",
            registro.respuesta || "Sin respuesta",
            registro.observaciones || "Sin observaciones",
          ]),
          styles: { fontSize: 10, cellPadding: 2 },
          headStyles: { fillColor: [0, 122, 195], textColor: 255 },
          theme: "grid",
        });

        startY = doc.previousAutoTable.finalY + 10;
      }
    });

    // Resumen
    let totalRegistros = 0;
    const totalPorEstado = {};

    Object.entries(situaciones).forEach(([estado, registros]) => {
      totalPorEstado[estado] = registros.length;
      totalRegistros += registros.length;
    });

    if (startY + 60 > 280) {
      doc.addPage();
      startY = 10;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#333");
    doc.text("RESUMEN", 14, startY);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`• Total de registros: ${totalRegistros}`, 14, startY + 10);
    Object.entries(totalPorEstado).forEach(([estado, total], index) => {
      doc.text(`• ${estado}: ${total}`, 14, startY + 20 + index * 10);
    });

    startY += 20 + Object.keys(totalPorEstado).length * 10;
    if (startY + 30> pageHeight) {
        doc.addPage();
        startY = 10;
    }
    
    // Espacio para la firma
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("_______________________________", 105, startY + 15, { align: "center" });
    doc.text(revisor || "Sin nombre", 105, startY + 20, { align: "center" });
    doc.text(cargo || "Sin cargo", 105, startY + 25, { align: "center" });

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
          <h3 style={{ fontWeight: "bold", color: "#333" }}>Reporte de Situaciones</h3>
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
            <th>Estado</th>
            <th>Fecha y Hora</th>
            <th>Usuario</th>
            <th>Nombre</th>
            <th>Respuesta</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(situaciones).map(([estado, registros]) => (
            <React.Fragment key={estado}>
              {registros.map((registro) => (
                <tr key={registro.idSituacion}>
                  <td>{registro.idSituacion}</td>
                  <td>{registro.descripcion}</td>
                  <td>{registro.estado}</td>
                  <td>{registro.fechaOcurrencia || "Sin fecha"}</td>{/* Aquí */}
                  <td>{registro.usuario?.usuario || "Sin usuario"}</td>
                  <td>{registro.usuario?.persona?.nombre || "Sin nombre"}</td>
                  <td>{registro.respuesta || "Sin respuesta"}</td>
                  <td>{registro.observaciones || "Sin observaciones"}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReporteTecnico;

import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../assets/img/LogoAYUVI_FullAzul.png";

function ReporteRifas() {
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [reporte, setReporte] = useState([]);
    const [revisor, setRevisor] = useState("");
    const [alerta, setAlerta] = useState("");
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [cargo, setCargo] = useState("");

    useEffect(() => {
        const fetchLoggedUser = async () => {
            try {
                const response = await axios.get("https://api.voluntariadoayuvi.com/usuarios/me", {
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

    useEffect(() => {
        const fetchReporte = async () => {
            try {
                const response = await axios.post(
                    "https://api.voluntariadoayuvi.com/reportesRifas",
                    {
                        fechaInicio,
                        fechaFin,
                    }
                );
                setReporte(response.data.reporte || []);
                setAlerta("");
            } catch (error) {
                console.error("Error al cargar el reporte:", error);
                setAlerta("Hubo un error al cargar el reporte.");
            }
        };

        if (fechaInicio && fechaFin) {
            fetchReporte();
        }
    }, [fechaInicio, fechaFin]);

    const handleFechaInicio = (e) => {
        const fecha = e.target.value.split("-").reverse().join("-");
        setFechaInicio(fecha);
    };

    const handleFechaFin = (e) => {
        const fecha = e.target.value.split("-").reverse().join("-");
        setFechaFin(fecha);
    };

    const generarPDF = () => {
        const doc = new jsPDF('landscape'); // Cambia la orientación a 'landscape'

        // Logo y encabezado
        doc.addImage(logo, "PNG", 10, 10, 60, 30);
        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.text("Reporte de Rifas", 75, 20);
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
        doc.line(10, 50, 280, 50); // Ajusta la longitud de la línea para el formato horizontal

        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");
        doc.text("Rifas", 148.5, 56, { align: "center" }); // Centra el texto en el formato horizontal

        // Tabla con los datos del reporte
        doc.autoTable({
            startY: 60,
            head: [
                [
                    "ID Rifa",
                    "Nombre",
                    "Descripción",
                    "Precio Boleto",
                    "Total Recaudación",
                    "Boletos Vendidos",
                    "Voluntario con Más Ventas",
                    "Boletos Vendidos por Voluntario",
                ],
            ],
            body: reporte.map((rifa) => [
                rifa.idRifa,
                rifa.nombreRifa,
                rifa.descripcion,
                `Q ${parseFloat(rifa.precioBoleto).toFixed(2)}`,
                `Q ${rifa.totalRecaudacion.toFixed(2)}`,
                rifa.boletosVendidos,
                rifa.voluntarioMasVentas?.nombre || "N/A",
                rifa.voluntarioMasVentas?.boletosVendidos || "N/A",
            ]),
            styles: { fontSize: 10, cellPadding: 2 },
            headStyles: { fillColor: [0, 122, 195], textColor: 255 },
            theme: "grid",
        });

        const firmaStartY = doc.previousAutoTable.finalY + 40;
        doc.text("_______________________________", 148.5, firmaStartY, { align: "center" });
        doc.text(revisor || "Sin nombre", 148.5, firmaStartY + 10, { align: "center" });
        doc.text(cargo || "Sin cargo", 148.5, firmaStartY + 15, { align: "center" });

        doc.save(`Reporte_Rifas_${fechaInicio}_${fechaFin}.pdf`);
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
                    <h3 style={{ fontWeight: "bold", color: "#333" }}>Reporte de Rifas</h3>
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
                    className="btn btn-success mx-auto"
                    onClick={generarPDF}
                    disabled={reporte.length === 0}
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
                        <th>ID Rifa</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio Boleto</th>
                        <th>Total Recaudación</th>
                        <th>Boletos Vendidos</th>
                        <th>Voluntario con Más Ventas</th>
                        <th>Boletos Vendidos por Voluntario</th>
                    </tr>
                </thead>
                <tbody>
                    {reporte.map((rifa, index) => (
                        <tr key={index}>
                            <td>{rifa.idRifa}</td>
                            <td>{rifa.nombreRifa}</td>
                            <td>{rifa.descripcion}</td>
                            <td>Q {parseFloat(rifa.precioBoleto).toFixed(2)}</td>
                            <td>Q {rifa.totalRecaudacion.toFixed(2)}</td>
                            <td>{rifa.boletosVendidos}</td>
                            <td>{rifa.voluntarioMasVentas?.nombre || "N/A"}</td>
                            <td>{rifa.voluntarioMasVentas?.boletosVendidos || "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ReporteRifas;

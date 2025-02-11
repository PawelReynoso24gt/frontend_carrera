import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Alert, InputGroup, FormControl, Button, Modal, Form } from "react-bootstrap";
import { FaPencilAlt, FaEye, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { getUserDataFromToken } from "../../utils/jwtUtils"; // token

function Recaudaciones() {
    const [recaudaciones, setRecaudaciones] = useState([]);
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredRecaudaciones, setFilteredRecaudaciones] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [detalleRecaudacion, setDetalleRecaudacion] = useState(null);
    const [rifas, setRifas] = useState([]);
    const [talonarios, setTalonarios] = useState([]);
    const [selectedRifa, setSelectedRifa] = useState("");
    const [selectedTalonario, setSelectedTalonario] = useState("");
    const [boletosVendidos, setBoletosVendidos] = useState(0);
    const [pagos, setPagos] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [tiposPagosOptions, setTiposPagosOptions] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [recaudacionToUpdate, setRecaudacionToUpdate] = useState(null);
    const [precioBoleto, setPrecioBoleto] = useState(0);
    const [showPermissionModal, setShowPermissionModal] = useState(false); // Nuevo estado
    const [permissionMessage, setPermissionMessage] = useState('');
    const [permissions, setPermissions] = useState({});
    const [hasViewPermission, setHasViewPermission] = useState(false);
    const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);



    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await axios.get('https://api.voluntariadoayuvi.com/usuarios/permisos', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Ajusta según dónde guardes el token
                    },
                });
                setPermissions(response.data.permisos || {});

                const hasPermission =
                    response.data.permisos['Ver recaudación de rifas']

                setHasViewPermission(hasPermission);
                setIsPermissionsLoaded(true);
            } catch (error) {
                console.error('Error fetching permissions:', error);
            }
        };

        fetchPermissions();
        fetchRifas();
        fetchTiposPagos();
    }, []);

    const idUsuario = getUserDataFromToken(localStorage.getItem("token"))?.idUsuario; //! usuario del token

    useEffect(() => {
        if (isPermissionsLoaded) {
            if (hasViewPermission) {
                fetchRecaudaciones();
            } else {
                checkPermission('Ver recaudación de rifas', 'No tienes permisos para ver recaudación de rifas');
            }
        }
    }, [isPermissionsLoaded, hasViewPermission]);

    const checkPermission = (permission, message) => {
        if (!permissions[permission]) {
            setPermissionMessage(message);
            setShowPermissionModal(true);
            return false;
        }
        return true;
    };

    const fetchRecaudaciones = async () => {
        try {
            const response = await axios.get("https://api.voluntariadoayuvi.com/recaudaciones/todas");
            if (Array.isArray(response.data)) {
                setRecaudaciones(response.data);
                setFilteredRecaudaciones(response.data);
            } else {
                console.error("La respuesta no es un array:", response.data);
                setFilteredRecaudaciones([]); // Asegurarte de que sea un array vacío si falla
            }
        } catch (error) {
            console.error("Error fetching recaudaciones:", error);
            setFilteredRecaudaciones([]); // Asegurar un array vacío en caso de error
        }
    };

    const fetchTiposPagos = async () => {
        try {
            const response = await axios.get("https://api.voluntariadoayuvi.com/tipospagos");
            setTiposPagosOptions(response.data); // Almacena los tipos de pago en el estado
        } catch (error) {
            console.error("Error fetching tipos pagos:", error);
        }
    };

    const fetchRifas = async () => {
        try {
            const response = await axios.get("https://api.voluntariadoayuvi.com/rifas");
            setRifas(response.data);
        } catch (error) {
            console.error("Error fetching rifas:", error);
        }
    };

    const fetchTalonarios = async (idRifa) => {
        try {
            const response = await axios.get(`https://api.voluntariadoayuvi.com/rifas/talonarios/${idRifa}`);
            setTalonarios(response.data);
        } catch (error) {
            console.error("Error fetching talonarios:", error);
        }
    };

    const calcularResumenPago = (boletosVendidos, precioBoleto) => {
        const subtotal = boletosVendidos * precioBoleto;
        return {
            precioBoleto,
            boletosVendidos,
            subtotal
        };
    };

    const fetchActiveRecaudaciones = async () => {
        try {
            if (hasViewPermission) {
                const response = await axios.get("https://api.voluntariadoayuvi.com/recaudaciones/todas");
                if (Array.isArray(response.data)) {
                    setFilteredRecaudaciones(response.data);
                } else {
                    console.error("La respuesta no es un array:", response.data);
                    setFilteredRecaudaciones([]); // Asegura que sea un array vacío en caso de error
                }
            } else {
                checkPermission('Ver recaudación de rifas', 'No tienes permisos para ver recaudación de rifas')
            }
        } catch (error) {
            console.error("Error fetching active recaudaciones:", error);
            setFilteredRecaudaciones([]); // Asegura un array vacío en caso de error
            setAlertMessage("Error al cargar las recaudaciones activas.");
            setShowAlert(true);
        }
    };

    const fetchInactiveRecaudaciones = async () => {
        try {
            if (hasViewPermission) {
                const response = await axios.get("https://api.voluntariadoayuvi.com/recaudaciones/todas/inactivas");
                if (Array.isArray(response.data)) {
                    setFilteredRecaudaciones(response.data);
                } else {
                    console.error("La respuesta no es un array:", response.data);
                    setFilteredRecaudaciones([]); // Asegura que sea un array vacío en caso de error
                }
            } else {
                checkPermission('Ver recaudación de rifas', 'No tienes permisos para ver recaudación de rifas')
            }
        } catch (error) {
            console.error("Error fetching inactive recaudaciones:", error);
            setFilteredRecaudaciones([]); // Asegura un array vacío en caso de error
            setAlertMessage("Error al cargar las recaudaciones inactivas.");
            setShowAlert(true);
        }
    };

    const toggleEstado = async (id, estadoActual) => {
        try {
            const nuevoEstado = estadoActual === 1 ? 0 : 1;
            await axios.put(`https://api.voluntariadoayuvi.com/recaudaciones/${id}`, { estado: nuevoEstado });
            fetchRecaudaciones();
            setAlertMessage(
                `Recaudación ${nuevoEstado === 1 ? "activada" : "inactivada"} con éxito`
            );
            setShowAlert(true);
        } catch (error) {
            console.error("Error toggling estado:", error);
            setAlertMessage("Error al cambiar el estado de la recaudación.");
            setShowAlert(true);
        }
    };

    const handleViewDetail = async (idRecaudacionRifa) => {
        try {
            const response = await axios.get(
                `https://api.voluntariadoayuvi.com/recaudaciones/detalle/${idRecaudacionRifa}`
            );
            setDetalleRecaudacion(response.data);
            setShowModal(true);
        } catch (error) {
            console.error("Error fetching detalle recaudación:", error);
            setAlertMessage("Error al cargar los detalles de la recaudación.");
            setShowAlert(true);
        }
    };

    const handleOpenUpdateModal = async (idRecaudacionRifa) => {
        try {
            const response = await axios.get(`https://api.voluntariadoayuvi.com/recaudaciones/detalle/${idRecaudacionRifa}`);

            const recaudacion = response.data;

            setRecaudacionToUpdate(recaudacion);

            // Asignar el ID de la rifa y el talonario desde la respuesta
            const idRifa = recaudacion.solicitudTalonario?.talonario?.rifa?.idRifa || "";
            const idTalonario = recaudacion.solicitudTalonario?.talonario?.idTalonario || "";
            const precio = parseFloat(recaudacion.solicitudTalonario?.talonario?.rifa?.precioBoleto) || 0;

            console.log("ID de la Rifa seleccionado:", idRifa);
            console.log("ID del Talonario seleccionado:", idTalonario);

            setSelectedRifa(idRifa);
            setSelectedTalonario(idTalonario);
            setBoletosVendidos(recaudacion.boletosVendidos);
            setPrecioBoleto(precio); // Establecer el precio del boleto
            setPagos(recaudacion.detalle_pago_recaudacion_rifas.map(pago => ({
                idTipoPago: pago.idTipoPago,
                monto: pago.pago,
                correlativo: pago.correlativo,
                imagenTransferencia: pago.imagenTransferencia
            })));

            // Agregar console.log para ver el JSON de la recaudación antes de abrir el modal
            console.log("Datos de la recaudación a actualizar:", JSON.stringify(response.data, null, 2));
            await fetchRifas(); // Cargar rifas disponibles
            await fetchTalonarios(idRifa); // Cargar talonarios para la rifa seleccionada
            setShowUpdateModal(true);
        } catch (error) {
            console.error("Error fetching detalle recaudación:", error);
            setAlertMessage("Error al cargar los detalles de la recaudación.");
            setShowAlert(true);
        }
    };

    const resetModalState = () => {
        setRecaudacionToUpdate(null);
        setSelectedRifa("");
        setSelectedTalonario("");
        setBoletosVendidos(0);
        setPagos([]);
        setPrecioBoleto(0);
    };

    const resetCreateModalState = () => {
        setSelectedRifa(""); // Reinicia la rifa seleccionada
        setSelectedTalonario(""); // Reinicia el talonario seleccionado
        setBoletosVendidos(0); // Reinicia el número de boletos vendidos
        setPagos([]); // Reinicia los pagos
        setPrecioBoleto(0); // Reinicia el precio del boleto
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setDetalleRecaudacion(null);
        resetModalState();
    };

    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
        resetModalState();
    };

    const handleUpdateRecaudacion = async () => {
        if (!selectedRifa) {
            alert("Seleccione una rifa.");
            return;
        }
        if (!selectedTalonario) {
            alert("Seleccione un talonario.");
            return;
        }
        if (boletosVendidos <= 0) {
            alert("Ingrese la cantidad de boletos vendidos.");
            return;
        }
        if (pagos.length === 0) {
            alert("Agregue al menos un pago.");
            return;
        }

        try {
            const recaudacionData = {
                idRecaudacionRifa: recaudacionToUpdate.idRecaudacionRifa,
                idTalonario: selectedTalonario,
                boletosVendidos,
                pagos,
            };

            const response = await axios.put(
                "https://api.voluntariadoayuvi.com/recaudaciones/rifa/completa/update/${recaudacionToUpdate.idRecaudacionRifa}",
                recaudacionData
            );

            if (response.status === 200) {
                const bitacoraData = {
                    descripcion: "Nueva recaudación de rifas actualizada",
                    idCategoriaBitacora: 32, // ID de categoría para creación
                    idUsuario: idUsuario,
                    fechaHora: new Date()
                };
                await axios.post("https://api.voluntariadoayuvi.com/bitacora/create", bitacoraData);

                alert("Recaudación actualizada con éxito.");
                setShowUpdateModal(false); // Cierra el modal
                resetModalState(); // Limpiar estado del modal
                fetchRecaudaciones(); // Refresca la lista de recaudaciones
            }
        } catch (error) {
            console.error("Error actualizando recaudación:", error.response?.data || error.message);
            alert("Error al actualizar la recaudación. Revise los datos ingresados.");
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        const filtered = recaudaciones.filter((recaudacion) =>
            recaudacion.solicitudTalonario?.talonario?.rifa?.nombreRifa
                ?.toLowerCase()
                .includes(value)
        );
        setFilteredRecaudaciones(filtered);
        setCurrentPage(1);
    };

    const handleCreateRecaudacion = async () => {
        if (!selectedRifa) {
            alert("Seleccione una rifa.");
            return;
        }
        if (!selectedTalonario) {
            alert("Seleccione un talonario.");
            return;
        }
        if (boletosVendidos <= 0) {
            alert("Ingrese la cantidad de boletos vendidos.");
            return;
        }
        if (pagos.length === 0) {
            alert("Agregue al menos un pago.");
            return;
        }

        try {
            const recaudacionData = {
                idTalonario: selectedTalonario,
                boletosVendidos,
                pagos,
            };

            // Agregar console.log para depuración
            //console.log("Datos enviados al backend:", JSON.stringify(recaudacionData, null, 2));

            const response = await axios.post(
                "https://api.voluntariadoayuvi.com/recaudaciones/rifa/completa",
                recaudacionData
            );

            if (response.status === 201) {

                const bitacoraData = {
                    descripcion: "Nueva recaudación de rifas creada",
                    idCategoriaBitacora: 33, // ID de categoría para creación
                    idUsuario: idUsuario,
                    fechaHora: new Date()
                };
                await axios.post("https://api.voluntariadoayuvi.com/bitacora/create", bitacoraData);

                alert("Recaudación creada con éxito.");
                resetCreateModalState(); // Reinicia el estado del modal
                setShowCreateModal(false); // Cierra el modal
                fetchRecaudaciones(); // Actualiza la lista de recaudaciones
            }
        } catch (error) {
            console.error("Error creando recaudación:", error.response?.data || error.message);
            alert("Error al crear la recaudación. Revise los datos ingresados.");
        }
    };

    const handleAddPago = () => {
        setPagos([...pagos, { idTipoPago: "", monto: 0, correlativo: "", imagenTransferencia: "" }]);
    };

    const handlePagoChange = (index, field, value) => {
        const updatedPagos = [...pagos];
        updatedPagos[index][field] = value;
        setPagos(updatedPagos);
    };

    const handleFileUpload = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedPagos = [...pagos];
                updatedPagos[index].imagenTransferencia = reader.result.split(",")[1];
                setPagos(updatedPagos);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePago = (index) => {
        const updatedPagos = pagos.filter((_, i) => i !== index);
        setPagos(updatedPagos);
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRecaudaciones = Array.isArray(filteredRecaudaciones)
        ? filteredRecaudaciones.slice(indexOfFirstRow, indexOfLastRow)
        : [];

    const totalPages = Math.ceil(filteredRecaudaciones.length / rowsPerPage);

    const renderPagination = () => (
        <div className="d-flex justify-content-between align-items-center mt-3">
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
                }}
                style={{
                    color: currentPage === 1 ? "gray" : "#007AC3",
                    cursor: currentPage === 1 ? "default" : "pointer",
                    textDecoration: "none",
                    fontWeight: "bold",
                }}
            >
                Anterior
            </a>
            <div className="d-flex align-items-center">
                <span style={{ marginRight: "10px", fontWeight: "bold" }}>Filas</span>
                <FormControl
                    as="select"
                    value={rowsPerPage}
                    onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                    style={{ width: "100px", height: "40px" }}
                >
                    {[5, 10, 20, 50].map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </FormControl>
            </div>
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
                }}
                style={{
                    color: currentPage === totalPages ? "gray" : "#007AC3",
                    cursor: currentPage === totalPages ? "default" : "pointer",
                    textDecoration: "none",
                    fontWeight: "bold",
                }}
            >
                Siguiente
            </a>
        </div>
    );

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
            <h3
                style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#333",
                    textAlign: "center",
                    marginBottom: "20px",
                }}
            >
                Gestión de recaudaciones de rifas
            </h3>

            <InputGroup className="mb-3">
                <FormControl
                    placeholder="Buscar rifa por nombre..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </InputGroup>

            {showAlert && (
                <Alert
                    variant="success"
                    onClose={() => setShowAlert(false)}
                    dismissible
                    style={{ marginTop: "20px", fontWeight: "bold" }}
                >
                    {alertMessage}
                </Alert>
            )}

            <div className="d-flex justify-content-start align-items-center mb-3">
                <Button
                    style={{
                        backgroundColor: "#007abf",
                        borderColor: "#007AC3",
                        padding: "5px 10px",
                        width: "130px",
                        marginRight: "10px",
                        fontWeight: "bold",
                        color: "#fff",
                    }}
                    onClick={() => {
                        if (checkPermission('Crear recaudación de rifa', 'No tienes permisos para crear recaudación de rifa')) {
                            setShowCreateModal(true); // Solo abre el modal
                            fetchRifas(); // Carga las rifas disponibles
                        }
                    }}
                >
                    Crear Recaudación
                </Button>
                <Button
                    style={{
                        backgroundColor: "#009B85",
                        borderColor: "#007AC3",
                        padding: "5px 10px",
                        width: "100px",
                        marginRight: "10px",
                        fontWeight: "bold",
                        color: "#fff",
                    }}
                    onClick={fetchActiveRecaudaciones}
                >
                    Activas
                </Button>
                <Button
                    style={{
                        backgroundColor: "#bf2200",
                        borderColor: "#007AC3",
                        padding: "5px 10px",
                        width: "100px",
                        fontWeight: "bold",
                        color: "#fff",
                    }}
                    onClick={fetchInactiveRecaudaciones}
                >
                    Inactivas
                </Button>
            </div>

            <Table
                striped
                bordered
                hover
                responsive
                className="mt-3"
                style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "20px",
                    overflow: "hidden",
                    textAlign: "center",
                }}
            >
                <thead style={{ backgroundColor: "#007AC3", color: "#fff" }}>
                    <tr>
                        <th>ID Recaudación</th>
                        <th>Nombre de Rifa</th>
                        <th>Precio por Boleto</th>
                        <th>Venta Total</th>
                        <th>Código de Talonario</th>
                        <th>Boletos Vendidos</th>
                        <th>Subtotal</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRecaudaciones.length > 0 ? (
                        currentRecaudaciones.map((recaudacion) => {
                            const talonario = recaudacion.solicitudTalonario?.talonario;
                            const rifa = talonario?.rifa;

                            return (
                                <tr key={recaudacion.idRecaudacionRifa}>
                                    <td>{recaudacion.idRecaudacionRifa}</td>
                                    <td>{rifa?.nombreRifa || "Sin nombre"}</td>
                                    <td>Q. {rifa?.precioBoleto || "0.00"}</td>
                                    <td>Q. {rifa?.ventaTotal || "0.00"}</td>
                                    <td>{talonario?.codigoTalonario || "N/A"}</td>
                                    <td>{recaudacion.boletosVendidos || 0}</td>
                                    <td>Q. {recaudacion.subTotal || "0.00"}</td>
                                    <td>
                                        <FaPencilAlt
                                            style={{ color: "#007AC3", cursor: "pointer", marginRight: "10px", fontSize: "20px" }}
                                            title="Editar"
                                            onClick={() => {
                                                if (checkPermission('Editar recaudación de rifa', 'No tienes permisos para editar recaudación de rifa')) {
                                                    handleOpenUpdateModal(recaudacion.idRecaudacionRifa);
                                                }
                                            }}
                                        />
                                        <FaEye
                                            style={{ color: "#007AC3", cursor: "pointer", marginRight: "10px", fontSize: "20px" }}
                                            title="Ver Detalle"
                                            onClick={() => handleViewDetail(recaudacion.idRecaudacionRifa)}
                                        />
                                        {recaudacion.estado === 1 ? (
                                            <FaToggleOn
                                                style={{ color: "#30c10c", cursor: "pointer", fontSize: "20px" }}
                                                title="Inactivar"
                                                onClick={() => {
                                                    if (checkPermission('Desactivar recaudación de rifa', 'No tienes permisos para desactivar recaudación de rifa')) {
                                                        toggleEstado(recaudacion.idRecaudacionRifa, recaudacion.estado)
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <FaToggleOff
                                                style={{ color: "#e10f0f", cursor: "pointer", fontSize: "20px" }}
                                                title="Activar"
                                                onClick={() => {
                                                    if (checkPermission('Activar recaudación de rifa', 'No tienes permisos para activar recaudación de rifa')) {
                                                        toggleEstado(recaudacion.idRecaudacionRifa, recaudacion.estado)
                                                    }
                                                }}
                                            />
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="8" style={{ textAlign: "center", fontWeight: "bold" }}>
                                No hay recaudaciones disponibles.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {renderPagination()}

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton style={{ backgroundColor: "#007AC3", color: "#fff" }}>
                    <Modal.Title>Detalle de Recaudación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {detalleRecaudacion ? (
                        <>
                            <h5>Información de la Rifa</h5>
                            <p>
                                <strong>Nombre:</strong>{" "}
                                {detalleRecaudacion.solicitudTalonario?.talonario?.rifa?.nombreRifa}
                            </p>
                            <p>
                                <strong>Precio del Boleto:</strong> Q
                                {detalleRecaudacion.solicitudTalonario?.talonario?.rifa?.precioBoleto}
                            </p>
                            <p>
                                <strong>Venta Total:</strong> Q
                                {detalleRecaudacion.solicitudTalonario?.talonario?.rifa?.ventaTotal}
                            </p>
                            <h5>Voluntario Encargado</h5>
                            <p>
                                <strong>Nombre:</strong>{" "}
                                {detalleRecaudacion.solicitudTalonario?.voluntario?.persona?.nombre}
                            </p>
                            <p>
                                <strong>Telélefono:</strong>{" "}
                                {detalleRecaudacion.solicitudTalonario?.voluntario?.persona?.telefono}
                            </p>
                            <p>
                                <strong>Correo eléctronico:</strong>{" "}
                                {detalleRecaudacion.solicitudTalonario?.voluntario?.persona?.correo}
                            </p>
                            <h5>Talonario</h5>
                            <p>
                                <strong>Código:</strong>{" "}
                                {detalleRecaudacion.solicitudTalonario?.talonario?.codigoTalonario}
                            </p>
                            <p>
                                <strong>Boletos disponibles:</strong>{" "}
                                {detalleRecaudacion.solicitudTalonario?.talonario?.cantidadBoletos}
                            </p>
                            <p>
                                <strong>Correlativos:</strong>{" "}
                                {detalleRecaudacion.solicitudTalonario?.talonario?.correlativoInicio}{" - "}{detalleRecaudacion.solicitudTalonario?.talonario?.correlativoFinal}
                            </p>
                            <h5>Pagos</h5>
                            {detalleRecaudacion.detalle_pago_recaudacion_rifas.map((pago, idx) => (
                                <div key={idx} style={{ marginBottom: "10px", borderBottom: "1px solid #ddd" }}>
                                    <p><strong>Tipo de Pago:</strong> {pago.tipo_pago?.tipo || "N/A"}</p>
                                    <p><strong>Monto:</strong> Q{pago.pago || "0.00"}</p>
                                    <p><strong>Correlativo:</strong> {pago.correlativo || "N/A"}</p>
                                    {pago.imagenTransferencia && (
                                        <p>
                                            <strong>Comprobante:</strong>
                                            {pago.imagenTransferencia === "efectivo" ? (
                                                "Efectivo"
                                            ) : (
                                                <img
                                                    src={`data:image/png;base64,${pago.imagenTransferencia}`}
                                                    alt="Comprobante de Pago"
                                                    style={{ width: "150px", marginTop: "10px", borderRadius: "8px" }}
                                                />
                                            )}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </>
                    ) : (
                        <p>No se encontraron detalles para esta recaudación.</p>
                    )}
                </Modal.Body>
            </Modal>
            <Modal show={showCreateModal} onHide={() => { resetCreateModalState(); setShowCreateModal(false); }}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Recaudación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Seleccionar Rifa</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedRifa}
                            onChange={(e) => {
                                const selectedIdRifa = e.target.value;
                                setSelectedRifa(selectedIdRifa);
                                setTalonarios([]);
                                fetchTalonarios(selectedIdRifa);

                                const rifaSeleccionada = rifas.find(rifa => rifa.idRifa === parseInt(selectedIdRifa));
                                const precio = parseFloat(rifaSeleccionada?.precioBoleto) || 0; // Convertir a número
                                setPrecioBoleto(precio);
                            }}
                        >
                            <option value="">Seleccione una rifa</option>
                            {rifas.map((rifa) => (
                                <option key={rifa.idRifa} value={rifa.idRifa}>
                                    {rifa.nombreRifa}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Seleccionar Talonario</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedTalonario}
                            onChange={(e) => setSelectedTalonario(e.target.value)}
                        >
                            <option value="">Seleccione un talonario (solo talonarios aceptados)</option>
                            {talonarios.length > 0 ? (
                                talonarios.map((talonario) => (
                                    <option key={talonario.idTalonario} value={talonario.idTalonario}>
                                        {`Código: ${talonario.codigoTalonario} - Boletos disponibles: ${talonario.cantidadBoletos}`}
                                    </option>
                                ))
                            ) : (
                                <option disabled value="">
                                    No hay talonarios aceptados para esta rifa
                                </option>
                            )}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Boletos Vendidos</Form.Label>
                        <Form.Control
                            type="number"
                            min="1"
                            value={boletosVendidos}
                            onChange={(e) => setBoletosVendidos(parseInt(e.target.value) || 0)}
                        />
                    </Form.Group>

                    {/* Resumen de Pago */}
                    <h5>Resumen de Pago</h5>
                    <Table>
                        <tbody>
                            <tr>
                                <td><strong>Precio por Boleto:</strong></td>
                                <td>Q{precioBoleto.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td><strong>Boletos Vendidos:</strong></td>
                                <td>{boletosVendidos}</td>
                            </tr>
                            <tr>
                                <td><strong>Subtotal:</strong></td>
                                <td>Q{(boletosVendidos * precioBoleto).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </Table>

                    <h5>Pagos</h5>
                    <Button onClick={handleAddPago} style={{ marginBottom: "10px" }}>
                        Agregar Pago
                    </Button>
                    {pagos.map((pago, idx) => (
                        <div key={idx} style={{ borderBottom: "1px solid #ccc", marginBottom: "10px" }}>
                            <Form.Group>
                                <Form.Label>Tipo de Pago</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={pago.idTipoPago}
                                    onChange={(e) => handlePagoChange(idx, "idTipoPago", e.target.value)}
                                >
                                    <option value="">Seleccione un tipo de pago</option>
                                    {tiposPagosOptions.map((tipo) => (
                                        <option key={tipo.idTipoPago} value={tipo.idTipoPago}>
                                            {tipo.tipo}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Monto</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={pago.monto}
                                    onChange={(e) => handlePagoChange(idx, "monto", parseFloat(e.target.value))}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Correlativo</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={pago.correlativo}
                                    onChange={(e) => handlePagoChange(idx, "correlativo", e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Comprobante</Form.Label>
                                <Form.Control type="file" onChange={(e) => handleFileUpload(e, idx)} />
                            </Form.Group>

                            <Button variant="danger" onClick={() => handleRemovePago(idx)}>
                                Quitar Pago
                            </Button>
                        </div>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleCreateRecaudacion}>
                        Crear Recaudación
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            resetCreateModalState(); // Restablece el estado del formulario
                            setShowCreateModal(false); // Cierra el modal
                        }}
                    >
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Actualizar */}
            <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Actualizar Recaudación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Seleccionar Rifa</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedRifa}
                            onChange={(e) => {
                                const selectedIdRifa = e.target.value;
                                setSelectedRifa(selectedIdRifa);
                                setTalonarios([]);
                                fetchTalonarios(selectedIdRifa);

                                const rifaSeleccionada = rifas.find(rifa => rifa.idRifa === parseInt(selectedIdRifa));
                                const precio = parseFloat(rifaSeleccionada?.precioBoleto) || 0; // Convertir a número
                                setPrecioBoleto(precio);
                            }}
                        >
                            <option value="">Seleccione una rifa</option>
                            {rifas.map((rifa) => (
                                <option key={rifa.idRifa} value={rifa.idRifa}>
                                    {rifa.nombreRifa}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Seleccionar Talonario</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedTalonario}
                            onChange={(e) => setSelectedTalonario(e.target.value)}
                        >
                            <option value="">Seleccione un talonario</option>
                            {talonarios.map((talonario) => (
                                <option key={talonario.idTalonario} value={talonario.idTalonario}>
                                    {`Código: ${talonario.codigoTalonario} - Boletos disponibles: ${talonario.cantidadBoletos}`}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Boletos Vendidos</Form.Label>
                        <Form.Control
                            type="number"
                            min="1"
                            value={boletosVendidos}
                            onChange={(e) => setBoletosVendidos(parseInt(e.target.value) || 0)}
                        />
                    </Form.Group>

                    {/* Resumen de Pago */}
                    <h5>Resumen de Pago</h5>
                    <Table>
                        <tbody>
                            <tr>
                                <td><strong>Precio por Boleto:</strong></td>
                                <td>Q{precioBoleto.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td><strong>Boletos Vendidos:</strong></td>
                                <td>{boletosVendidos}</td>
                            </tr>
                            <tr>
                                <td><strong>Subtotal:</strong></td>
                                <td>Q{(boletosVendidos * precioBoleto).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </Table>

                    <h5>Pagos</h5>
                    <Button onClick={handleAddPago} style={{ marginBottom: "10px" }}>
                        Agregar Pago
                    </Button>
                    {pagos.map((pago, idx) => (
                        <div key={idx} style={{ borderBottom: "1px solid #ccc", marginBottom: "10px" }}>
                            <Form.Group>
                                <Form.Label>Tipo de Pago</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={pago.idTipoPago}
                                    onChange={(e) => handlePagoChange(idx, "idTipoPago", e.target.value)}
                                >
                                    <option value="">Seleccione un tipo de pago</option>
                                    {tiposPagosOptions.map((tipo) => (
                                        <option key={tipo.idTipoPago} value={tipo.idTipoPago}>
                                            {tipo.tipo}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Monto</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={pago.monto}
                                    onChange={(e) => handlePagoChange(idx, "monto", parseFloat(e.target.value))}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Correlativo</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={pago.correlativo}
                                    onChange={(e) => handlePagoChange(idx, "correlativo", e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Comprobante</Form.Label>
                                <Form.Control type="file" onChange={(e) => handleFileUpload(e, idx)} />
                            </Form.Group>

                            <Button variant="danger" onClick={() => handleRemovePago(idx)}>
                                Quitar Pago
                            </Button>
                        </div>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleUpdateRecaudacion}>
                        Actualizar Recaudación
                    </Button>
                    <Button variant="secondary" onClick={handleCloseUpdateModal}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showPermissionModal} onHide={() => setShowPermissionModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Permiso Denegado</Modal.Title>
                </Modal.Header>
                <Modal.Body>{permissionMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowPermissionModal(false)}>
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Recaudaciones;

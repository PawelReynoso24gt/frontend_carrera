import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Alert, InputGroup, FormControl, Button, Modal, Form } from "react-bootstrap";
import { FaPencilAlt, FaEye, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { getUserDataFromToken } from "../../utils/jwtUtils"; // token
import { format } from "date-fns";
import { parseISO } from "date-fns";

function RecaudacionesEventos() {
    const [recaudaciones, setRecaudaciones] = useState([]);
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredRecaudaciones, setFilteredRecaudaciones] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [detalleRecaudacion, setDetalleRecaudacion] = useState(null);
    const [eventos, setEventos] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [selectedEvento, setSelectedEvento] = useState("");
    const [selectedEmpleado, setSelectedEmpleado] = useState("");
    const [recaudacion, setRecaudacion] = useState(0);
    const [numeroPersonas, setNumeroPersonas] = useState(0);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingRecaudacion, setEditingRecaudacion] = useState(null);
    const [modalAction, setModalAction] = useState("");
    const [newRecaudaciones, setNewRecaudaciones] = useState({
        recaudacion: "",
        numeroPersonas: "",
        fechaRegistro: "",
        idEvento: "",
        idEmpleado: "",
        estado: 1,
    });
    const [Mensaje, setMensaje] = useState("");
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
        response.data.permisos['Ver recaudación de eventos']

      setHasViewPermission(hasPermission);
      setIsPermissionsLoaded(true);
            } catch (error) {
                console.error('Error fetching permissions:', error);
            }
        };

        fetchPermissions();
        fetchEventos();
        fetchEmpleados();
    }, []);

    // Obtener el idPersona desde localStorage
    const idEmpleado = getUserDataFromToken(localStorage.getItem("token"))?.idEmpleado; // ! USO DE LA FUNCIÓN getUserDataFromToken

    const idUsuario = getUserDataFromToken(localStorage.getItem("token"))?.idUsuario; //! usuario del token

     useEffect(() => {
          if (isPermissionsLoaded) {
            if (hasViewPermission) {
                fetchRecaudaciones();
            } else {
              checkPermission('Ver recaudación de eventos', 'No tienes permisos para ver recaudación de eventos');
            }
          }
        }, [isPermissionsLoaded, hasViewPermission]);

    const fetchRecaudaciones = async () => {
        try {
            const response = await axios.get("https://api.voluntariadoayuvi.com/recaudacion_evento");
            setRecaudaciones(response.data);
            setFilteredRecaudaciones(response.data);
        } catch (error) {
            console.error("Error fetching recaudaciones:", error);
        }
    };

    const checkPermission = (permission, message) => {
        if (!permissions[permission]) {
            setPermissionMessage(message);
            setShowPermissionModal(true);
            return false;
        }
        return true;
    };

    const fetchActiveRecaudaciones = async () => {
        try {
            if (hasViewPermission) {
            const response = await axios.get("https://api.voluntariadoayuvi.com/recaudacion_evento/activas");
            setFilteredRecaudaciones(response.data); // Actualiza la lista de recaudaciones filtradas
            //setAlertMessage("Se han cargado las recaudaciones activas.");
            //setShowAlert(true);
        } else {
            checkPermission('Ver recaudación de eventos', 'No tienes permisos para ver recaudación de eventos')
          }
        } catch (error) {
            console.error("Error fetching active recaudaciones:", error);
            setAlertMessage("Error al cargar las recaudaciones activas.");
            setShowAlert(true);
        }
    };

    const fetchInactiveRecaudaciones = async () => {
        try {
            if (hasViewPermission) {
            const response = await axios.get("https://api.voluntariadoayuvi.com/recaudacion_evento/inactivas");
            setFilteredRecaudaciones(response.data); // Actualiza la lista de recaudaciones filtradas
            //setAlertMessage("Se han cargado las recaudaciones inactivas.");
            //setShowAlert(true);
        } else {
            checkPermission('Ver recaudación de eventos', 'No tienes permisos para ver recaudación de eventos')
          }
        } catch (error) {
            console.error("Error fetching inactive recaudaciones:", error);
            setAlertMessage("Error al cargar las recaudaciones inactivas.");
            setShowAlert(true);
        }
    };

    const fetchEventos = async () => {
        try {
            const response = await axios.get("https://api.voluntariadoayuvi.com/eventos");
            setEventos(response.data);
        } catch (error) {
            console.error("Error fetching eventos:", error);
        }
    };

    const fetchEmpleados = async () => {
        try {
            const response = await axios.get("https://api.voluntariadoayuvi.com/empleados");
            setEmpleados(response.data);
        } catch (error) {
            console.error("Error fetching empleados:", error);
        }
    };

    const handleShowModal = (action, recaudacion = null) => {
        setModalAction(action);
        setEditingRecaudacion(recaudacion);

        if (action === "create") {
            setNewRecaudaciones({
                recaudacion: "",
                numeroPersonas: "",
                fechaRegistro: "",
                idEvento: "",
                idEmpleado: idEmpleado,
                estado: 1,
            });
        } else if (action === "update") {
            setNewRecaudaciones({
                recaudacion: recaudacion.recaudacion,
                numeroPersonas: recaudacion.numeroPersonas,
                fechaRegistro: recaudacion.fechaRegistro,
                idEvento: recaudacion.idEvento,
                idEmpleado: recaudacion.idEmpleado,
                estado: recaudacion.estado,
            });
        }
        setEditingRecaudacion(recaudacion);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingRecaudacion(null);
        setNewRecaudaciones(recaudacion || {
            recaudacion: "", numeroPersonas: "",
            fechaRegistro: "",
            idEvento: "",
            idEmpleado: idEmpleado, estado: 1
        });
    };

    const handleCreateRecaudacion = async () => {

        try {
            const recaudacionData = {
                ...newRecaudaciones,
                fechaRegistro: format(new Date(), "yyyy-MM-dd"),
            };

            const response = await axios.post(
                "https://api.voluntariadoayuvi.com/recaudacion_evento/create",
                recaudacionData
            );

            if (response.status === 201) {
                setAlertMessage("Recaudación creada con éxito.");
                setShowAlert(true);
                fetchRecaudaciones();
                handleCloseModal();

                const bitacoraData = {
                    descripcion: "Nueva recaudación de eventos creada",
                    idCategoriaBitacora: 30,
                    idUsuario: idUsuario, // Asegúrate de que idUsuario sea el valor correcto extraído del token
                    fechaHora: new Date()
                };

                await axios.post("https://api.voluntariadoayuvi.com/bitacora/create", bitacoraData);
            }
        } catch (error) {
            console.error("Error creando recaudación:", error);
            alert("Error al crear la recaudación. Revise los datos ingresados.");
        }
    };

    const handleUpdateRecaudacion = async () => {

        try {
            const updatedData = {
                recaudacion: newRecaudaciones.recaudacion,
                numeroPersonas: newRecaudaciones.numeroPersonas,
                fechaRegistro: format(new Date(), "yyyy-MM-dd"), // Formato yyyy-MM-dd
                idEvento: newRecaudaciones.idEvento,
                idEmpleado: newRecaudaciones.idEmpleado,
                estado: newRecaudaciones.estado,
            };

            const response = await axios.put(
                `https://api.voluntariadoayuvi.com/recaudacion_evento/update/${editingRecaudacion.idRecaudacionEvento}`,
                updatedData
            );

            if (response.status === 200) {
                // Crear entrada en la bitácora
                const bitacoraData = {
                    descripcion: "Recaudación de eventos actualizada",
                    idCategoriaBitacora: 16,
                    idUsuario: idUsuario, // Asegúrate de que idUsuario sea el valor correcto extraído del token
                    fechaHora: new Date()
                };

                await axios.post("https://api.voluntariadoayuvi.com/bitacora/create", bitacoraData);
                setAlertMessage("Recaudación actualizada con éxito.");
                setShowAlert(true);
                fetchRecaudaciones();
                handleCloseModal();
            }
        } catch (error) {
            console.error("Error actualizando recaudación:", error);
            alert("Error al actualizar la recaudación. Intente nuevamente.");
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        const filtered = recaudaciones.filter((recaudacion) =>
            recaudacion.evento?.nombreEvento?.toLowerCase().includes(value)
        );
        setFilteredRecaudaciones(filtered);
        setCurrentPage(1);
    };

    const toggleEstado = async (id, estadoActual) => {
        try {
            const nuevoEstado = estadoActual === 1 ? 0 : 1;
            await axios.put(`https://api.voluntariadoayuvi.com/recaudacion_evento/update/${id}`, { estado: nuevoEstado });
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
        <div className="container mt-4" style={{
            maxWidth: "100%",
            margin: "0 auto",
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
        >
        <div className="row justify-content-center" style={{marginBottom: "20px" }}>
        <div className="col-12 text-center">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333", textAlign: "center" }}>
            Gestión de Recaudación de Eventos
          </h3>
        </div>
      </div>

            <InputGroup className="mb-3">
                <FormControl
                    placeholder="Buscar por nombre del evento..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </InputGroup>

            {showAlert && (
                <Alert
                    variant="success"
                    onClose={() => setShowAlert(false)}
                    dismissible
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
                        if (checkPermission('Crear recaudación de evento', 'No tienes permisos para crear recaudación de evento')) {
                            handleShowModal("create");
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
                        <th>ID</th>
                        <th>Evento</th>
                        <th>Registrado por</th>
                        <th>Fecha de Registro</th>
                        <th>Recaudación</th>
                        <th>Asistencia</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRecaudaciones.length > 0 ? (
                        currentRecaudaciones.map((recaudacion) => {
                            return (
                                <tr key={recaudacion.idRecaudacionEvento}>
                                    <td>{recaudacion.idRecaudacionEvento}</td>
                                    <td>{recaudacion.evento?.nombreEvento}</td>
                                    <td>{recaudacion.empleado?.persona?.nombre}</td>
                                    <td>{recaudacion.fechaRegistro ? format(parseISO(recaudacion.fechaRegistro), "dd-MM-yyyy") : "Sin fecha"}</td>
                                    <td>Q. {recaudacion.recaudacion}</td>
                                    <td>{recaudacion.numeroPersonas} personas</td>
                                    <td>{recaudacion.estado === 1 ? "Activo" : "Inactivo"}</td>
                                    <td>
                                        <FaPencilAlt
                                            style={{ cursor: "pointer", marginRight: "10px", fontSize: "20px", color: "#007AC3" }}
                                            title="Editar"
                                            onClick={() => {
                                                if (checkPermission('Editar recaudación de evento', 'No tienes permisos para editar recaudación de evento')) {
                                                    handleShowModal("update", recaudacion);
                                                }
                                            }}
                                        />
                                        {recaudacion.estado === 1 ? (
                                            <FaToggleOn
                                                style={{ color: "#30c10c", cursor: "pointer", fontSize: "20px" }}
                                                title="Inactivar"
                                                onClick={() => {
                                                    if (checkPermission('Desactivar recaudación de evento', 'No tienes permisos para desactivar recaudación de evento')) {
                                                        toggleEstado(recaudacion.idRecaudacionEvento, recaudacion.estado)
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <FaToggleOff
                                                style={{ color: "#e10f0f", cursor: "pointer", fontSize: "20px" }}
                                                title="Activar"
                                                onClick={() => {
                                                    if (checkPermission('Activar recaudación de evento', 'No tienes permisos para activar recaudación de evento')) {
                                                        toggleEstado(recaudacion.idRecaudacionEvento, recaudacion.estado)
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
                <Modal.Header closeButton>
                    <Modal.Title>{modalAction === "create" ? "Agregar Recaudación" : "Editar Recaudación"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Evento</Form.Label>
                        <Form.Control
                            as="select"
                            value={newRecaudaciones.idEvento}
                            onChange={(e) =>
                                setNewRecaudaciones({ ...newRecaudaciones, idEvento: e.target.value })
                            }
                        >
                            <option value="">Seleccione un evento</option>
                            {eventos.map((evento) => (
                                <option key={evento.idEvento} value={evento.idEvento}>
                                    {evento.nombreEvento}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Registrado por</Form.Label>
                        <Form.Control
                            as="select"
                            value={idEmpleado}
                            disabled // Deshabilitado porque se obtiene automáticamente del token
                        >
                            {empleados
                                .filter((empleado) => empleado.idEmpleado === idEmpleado)
                                .map((empleado) => (
                                    <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                                        {empleado.persona?.nombre}
                                    </option>
                                ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Recaudación</Form.Label>
                        <Form.Control
                            type="number"
                            value={newRecaudaciones.recaudacion}
                            onChange={(e) =>
                                setNewRecaudaciones({
                                    ...newRecaudaciones,
                                    recaudacion: parseFloat(e.target.value),
                                })
                            }
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Número de Personas</Form.Label>
                        <Form.Control
                            type="number"
                            value={newRecaudaciones.numeroPersonas}
                            onChange={(e) =>
                                setNewRecaudaciones({
                                    ...newRecaudaciones,
                                    numeroPersonas: parseInt(e.target.value),
                                })
                            }
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        style={{
                            backgroundColor: "#007AC3",
                            fontWeight: "bold",
                            color: "#fff",
                        }}
                        onClick={
                            modalAction === "create"
                                ? handleCreateRecaudacion
                                : handleUpdateRecaudacion
                        }
                    >
                        {modalAction === "create" ? "Crear" : "Actualizar"}
                    </Button>
                    <Button variant="secondary" onClick={handleCloseModal}>
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

export default RecaudacionesEventos;
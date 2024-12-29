import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl } from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff, FaEye } from "react-icons/fa";

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [filteredVentas, setFilteredVentas] = useState([]);
  const [detallesVenta, setDetallesVenta] = useState([]);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState(null);
  const [tiposPagos, setTiposPagos] = useState([]);
  const [tiposPublico, setTiposPublico] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [imagenBase64, setImagenBase64] = useState(null);
  const [imagen, setImagen] = useState(null);
  const [voluntarios, setVoluntarios] = useState([]);
  const [voluntarioVirtual, setVoluntarioVirtual] = useState([]);
  const [totalAPagar, setTotalAPagar] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [tiposPagosOptions, setTiposPagosOptions] = useState([]);
  const [stands, setStands] = useState([]);
  const [standSeleccionado, setStandSeleccionado] = useState(null);
  const [voluntarioStandSeleccionado, setVoluntarioStandSeleccionado] = useState(null);
  const [voluntarioGlobalSeleccionado, setVoluntarioGlobalSeleccionado] = useState(null);
  const [showVoluntariosModal, setShowVoluntariosModal] = useState(false);
  const [ventaEditada, setVentaEditada] = useState({
    venta: null,
    detalles: [],
    pagos: []
  });  
  // temporal
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [newVenta, setNewVenta] = useState({
    totalVenta: 0,
    idTipoPublico: "",
    estado: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchVentas();
    fetchTiposPagos();
    fetchTiposPublico();
    //fetchVoluntariosByStand();
    fetchStands();
    fetchVoluntarios();
    // Calcular el subtotal (sin donación)
    const calculatedSubtotal = detallesVenta.reduce((sum, detalle) => sum + (detalle.subTotal || 0), 0);

    // El total a pagar ya incluye la donación directamente en `newVenta.donacion`
    const total = calculatedSubtotal + (newVenta.donacion || 0);

    setSubtotal(calculatedSubtotal); // Guardar el subtotal
    setTotalAPagar(total); // Guardar el total
    console.log("Voluntarios asignados:", voluntarios);
  }, [detallesVenta, newVenta.donacion, voluntarios]);

  const fetchVentas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/ventas/stands");
      setVentas(response.data);
      setFilteredVentas(response.data);
    } catch (error) {
      console.error("Error fetching ventas:", error);
    }
  };

  // Fetch de los stands
    const fetchStands = async () => {
    try {
      const response = await axios.get("http://localhost:5000/stand");
      console.log("Stands recibidos:", response.data);
      const standsActivos = response.data.filter((stand) => stand.estado === 1);
      console.log("Stands activos recibidos:", standsActivos);
      setStands(standsActivos);
    } catch (error) {
      console.error("Error al cargar los stands:", error);
      alert("Error al cargar los stands.");
    }
  };

  const fetchVoluntariosByStand = async (idStand) => {
    try {
      if (!idStand) {
        console.warn("ID de Stand inválido:", idStand);
        return;
      }
      const response = await axios.get(`http://localhost:5000/stands/voluntarios/${idStand}`);
      if (response.status === 200) {
        setVoluntarios(response.data); // Asignados al stand
        console.log(`Voluntarios asignados al stand ${idStand}:`, response.data);
      } else {
        console.warn(`No se encontraron voluntarios para el stand ${idStand}.`);
        setVoluntarios([]);
      }
    } catch (error) {
      console.error("Error al obtener voluntarios por stand:", error.message);
      setVoluntarios([]);
    }
  };  

  const fetchVoluntarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/voluntarios");
      if (response.status === 200) {
        setVoluntarioVirtual(response.data); // Solo para el stand especial
        console.log("Voluntarios globales cargados:", response.data);
      } else {
        console.warn("No se encontraron voluntarios.");
        setVoluntarioVirtual([]);
      }
    } catch (error) {
      console.error("Error al cargar voluntarios globales:", error.message);
      setVoluntarioVirtual([]);
    }
  };   

  const handleSelectVoluntarioStand = (id) => {
  setVoluntarioStandSeleccionado(id);
};

const handleSelectVoluntarioGlobal = (id) => {
  setVoluntarioGlobalSeleccionado(id);
};

  const handleShowVoluntarios = () => {
    setShowVoluntariosModal(true);
  };

  const handleCloseVoluntarios = () => {
    setShowVoluntariosModal(false);
  };

  const fetchTiposPagos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tipospagos");
      setTiposPagosOptions(response.data); // Ahora esto se usará en el select
    } catch (error) {
      console.error("Error fetching tipos pagos:", error);
    }
  };

  const fetchTiposPublico = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tipo_publicos");
      setTiposPublico(response.data);
    } catch (error) {
      console.error("Error fetching tipos publico:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  
    const filtered = ventas.filter((venta) =>
      venta.fechaVenta.toLowerCase().includes(value)
    );
  
    setFilteredVentas(filtered);
    setCurrentPage(1);
  };  

  const handleViewDetails = async (idVenta) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/detalle_ventas_stands/ventaCompleta/${idVenta}`
        );

        console.log("JSON recibido:", response.data);

        if (response.data && response.data.length > 0) {
            setDetalleSeleccionado(response.data); // Guarda todos los detalles de la venta
            const imagen = response.data[0]?.detalle_pago_ventas_stands[0]?.imagenTransferencia || null;
            setImagenBase64(imagen); // Establecer la imagen Base64
        } else {
            alert("No se encontraron detalles para esta venta.");
            setDetalleSeleccionado(null);
            setImagenBase64(null);
        }

        setShowModal(true);
      } catch (error) {
          console.error("Error fetching detalles de venta:", error);
          alert("Error al cargar los detalles de la venta.");
          setDetalleSeleccionado(null);
          setImagenBase64(null);
          setShowModal(false); // Oculta el modal si no se obtienen datos
      }
  };
  
  const handleCloseModal = () => {
    setDetalleSeleccionado(null);
    setShowModal(false);
  };  

  const fetchActiveVentas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/ventas/stands/activas");
      setFilteredVentas(response.data);
      setCurrentPage(1); // Reinicia la paginación al cargar nuevos datos
    } catch (error) {
      console.error("Error fetching active ventas:", error);
    }
  };

  const fetchInactiveVentas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/ventas/stands/inactivas");
      setFilteredVentas(response.data);
      setCurrentPage(1); // Reinicia la paginación al cargar nuevos datos
    } catch (error) {
      console.error("Error fetching inactive ventas:", error);
    }
  }; 

  const handleAddPago = () => {
    // Filtrar productos con cantidad > 0
  const productosValidos = detallesVenta.filter((detalle) => detalle.cantidad > 0);

  if (productosValidos.length === 0) {
    alert("No hay productos válidos para asociar al pago.");
    return;
  };

  // Crear un nuevo pago
    const nuevoPago = {
      idTipoPago: "", // Campo vacío para que el usuario lo seleccione
      monto: 0.0,
      correlativo: "",
      imagenTransferencia: "",
      estado: 1,
      idProducto: productosValidos[0]?.idProducto || null, // Asociar al primer producto válido
    };
    setTiposPagos((prevPagos) => [...prevPagos, nuevoPago]);
    console.log("Pago agregado:", nuevoPago); // Agrega este log
    console.log("Lista de pagos actualizada:", [...tiposPagos, nuevoPago]); // Agrega este log
  };  
  
  const handlePagoChange = (index, field, value) => {
    const nuevosPagos = [...tiposPagos];
    nuevosPagos[index][field] = value;
    setTiposPagos(nuevosPagos);
    console.log(`Pago actualizado en el índice ${index}:`, nuevosPagos[index]); // Agrega este log
  };
  
  const handleFileUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const nuevosPagos = [...tiposPagos];
        nuevosPagos[index].imagenTransferencia = reader.result.split(",")[1];
        setTiposPagos(nuevosPagos);
      };
      reader.readAsDataURL(file);
    }
  };  

  const handleCreateVenta = async () => {
    try {
        // Validar que se haya seleccionado un voluntario si es requerido
        if (standSeleccionado?.idStand === 1 && standSeleccionado?.idTipoStands === 1 && !standSeleccionado?.voluntarioAsignado) {
            alert("Debe seleccionar un voluntario para este stand.");
            return; // Detener la ejecución si no se ha seleccionado un voluntario
        }

        // Validar y calcular los subtotales de los productos
        const detallesVentaValidos = detallesVenta
        .filter((detalle) => detalle.cantidad > 0 && detalle.estado !== 0)
        .map((detalle) => {
            const subTotal = detalle.cantidad * detalle.precio;
            console.log("Calculando subtotal para:", detalle.nombreProducto, subTotal);
            
            // Agregar un console.log aquí para verificar el voluntario asignado
            console.log("Voluntario seleccionado para el detalle:", detalle.idVoluntario || voluntarioStandSeleccionado || voluntarioGlobalSeleccionado);

            return {
                ...detalle,
                subTotal, // Asegura que el subtotal se incluya correctamente
                donacion: detalle.donacion || newVenta.donacion, // Asignar la donación a cada detalle
                idVoluntario:
                standSeleccionado?.idStand === 1 || voluntarios.length > 0
                    ? voluntarioStandSeleccionado || voluntarioGlobalSeleccionado
                    : null, // Asignar el voluntario o null según corresponda
                idStand: detalle.idStand || selectedStand?.idStand // Asignar idStand del seleccionado
            };
        });

        console.log("Detalles válidos con subtotales y donación:", detallesVentaValidos);

        // Calcular el subtotal de los productos y el total de la venta
        const subtotalVenta = detallesVentaValidos.reduce((sum, detalle) => sum + detalle.subTotal, 0);
        const totalVenta = subtotalVenta + (newVenta.donacion || 0);

        console.log("Subtotal calculado:", subtotalVenta);
        console.log("Donación:", newVenta.donacion);
        console.log("Total calculado (incluyendo donación):", totalVenta);

        // Validar que la suma de los montos de los pagos coincida con el total calculado
        const totalPagado = tiposPagos.reduce((sum, pago) => sum + (parseFloat(pago.monto) || 0), 0);

        console.log("Validando pagos...");
        console.log("Subtotal calculado:", subtotal);
        console.log("Total de la venta (subtotal + donación):", totalAPagar);
        console.log("Total de los pagos:", totalPagado);

        // Verifica si el total pagado coincide con el total calculado (incluyendo la donación ya sumada)
        if (totalPagado !== totalAPagar) {
            alert(
                `La suma de los pagos (Q${totalPagado.toFixed(2)}) no coincide con el total a pagar (Q${totalAPagar.toFixed(2)}).`
            );
            return;
        }

        // Validar que cada pago tenga el formato correcto
        const pagosValidados = tiposPagos.map((pago) => {

            if (tiposPagos.some((pago) => pago.idTipoPago === 5 && !pago.idVoluntario)) {
                alert("El tipo de pago '5' requiere un voluntario asociado.");
                return;
            }
            
            if (!pago.idTipoPago || pago.monto <= 0 || !pago.idProducto) {
                throw new Error("Cada pago debe tener un tipo, monto válido y producto asociado.");
            }

            // Validar pagos que requieren correlativo e imagen
            if ([1, 2, 4].includes(pago.idTipoPago)) { // Depósito, Transferencia, Cheque
                if (!pago.correlativo || !pago.imagenTransferencia) {
                    throw new Error(
                        `El tipo de pago ${pago.idTipoPago} requiere correlativo e imagen.`
                    );
                }
            }

            // Manejo de valores por defecto para tipos de pago
            const correlativo = pago.correlativo || "NA"; // Por defecto "NA"
            const imagenTransferencia = pago.imagenTransferencia || "efectivo"; // Por defecto "efectivo"
            
            return {
                ...pago,
                correlativo,
                imagenTransferencia,
            };
        });

        console.log("Pagos validados:", pagosValidados);

        // Construir los datos de la venta para enviar al backend
        const ventaData = {
            venta: { ...newVenta, totalVenta }, // Incluye la donación y el total
            detalles: detallesVentaValidos, // Incluye los subtotales y donaciones
            pagos: pagosValidados, // Pagos validados con sus requisitos
            idVoluntario: voluntarios.length > 0 
            ? voluntarioStandSeleccionado || voluntarioGlobalSeleccionado
            : null, // Si no hay voluntarios, establecer como null
        };

        console.log("Datos para enviar al backend:", ventaData);

        // Enviar los datos al backend
        const response = await axios.post("http://localhost:5000/ventas/create/stands/completa", ventaData);
        if (response.status === 201) {
            alert("Venta creada con éxito");
            setShowDetailsModal(false); // Cerrar el modal
            fetchVentas(); // Actualizar la lista de ventas
        }
      } catch (error) {
        console.error("Error creando venta:", error.response?.data || error.message);
        alert(`Error al crear la venta: ${error.response?.data || "Revisa los datos ingresados."}`);
    }    
  };

  const handleCreateVentaClick = () => {
    setNewVenta({
      totalVenta: 0,
      idTipoPublico: "",
      estado: 1,
    });
    setDetallesVenta([]); // Limpia los detalles
    setTiposPagos([]); // Limpia los pagos
    setShowDetailsModal(true);
  };  

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/ventas/update/${id}`, { estado: nuevoEstado });
      fetchVentas();
      setAlertMessage(`Venta ${nuevoEstado === 1 ? "activada" : "inactivada"} con éxito`);
      setShowAlert(true);
    } catch (error) {
      console.error("Error toggling estado:", error);
    }
  };

  const handleRemovePago = (index) => {
    // Crear una nueva copia del array sin el elemento en el índice proporcionado
    const nuevosPagos = tiposPagos.filter((_, i) => i !== index);
    setTiposPagos(nuevosPagos); // Actualizar el estado con los pagos restantes
    console.log(`Pago eliminado en el índice ${index}. Lista actualizada:`, nuevosPagos); // Log para depuración
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentVentas = filteredVentas.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredVentas.length / rowsPerPage);

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
        <Form.Control
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
        </Form.Control>
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
    <>
      <div className="row" style={{ textAlign: "center", marginBottom: "20px" }}>
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>Gestión de Ventas de Stands</h3>
        </div>
      </div>
      <div
        className="container mt-4"
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar ventas por fecha..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>
        <Alert
          variant="success"
          show={showAlert}
          onClose={() => setShowAlert(false)}
          dismissible
          style={{ marginTop: "20px", fontWeight: "bold" }}
        >
          {alertMessage}
        </Alert>
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
          onClick={handleCreateVentaClick}
        >
          Crear Venta
        </Button>
        <Button
        onClick={handleShowVoluntarios}
        style={{
          backgroundColor: "#007abf",
          borderColor: "#007AC3",
          padding: "10px",
          margin: "10px",
          fontWeight: "bold",
        }}
      >
        Mostrar Voluntarios
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
            onClick={fetchActiveVentas} // Llama a la función para cargar ventas activas
          >
            Activos
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
            onClick={fetchInactiveVentas} // Llama a la función para cargar ventas inactivas
          >
            Inactivos
          </Button>
        </div>
        <Table striped bordered hover responsive className="mt-3">
            <thead style={{ backgroundColor: "#007AC3", color: "#fff", textAlign: "center" }}>
                <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Tipo de Público</th>
                <th>Estado</th>
                <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {currentVentas.map((venta) => (
                <tr key={venta.idVenta}>
                    <td>{venta.idVenta}</td>
                    <td>{venta.fechaVenta}</td>
                    <td>{venta.totalVenta}</td>
                    <td>{venta.tipo_publico?.nombreTipo || "N/A"}</td>
                    <td>{venta.estado === 1 ? "Activo" : "Inactivo"}</td>
                    <td>
                    <FaEye
                        style={{ cursor: "pointer", marginRight: "10px", color: "#007AC3" }}
                        title="Ver Detalle"
                        onClick={() => handleViewDetails(venta.idVenta)}
                    />
                    {venta.estado ? (
                        <FaToggleOn
                        style={{ cursor: "pointer", color: "#30c10c" }}
                        title="Inactivar"
                        onClick={() => toggleEstado(venta.idVenta, venta.estado)}
                        />
                    ) : (
                        <FaToggleOff
                        style={{ cursor: "pointer", color: "#e10f0f" }}
                        title="Activar"
                        onClick={() => toggleEstado(venta.idVenta, venta.estado)}
                        />
                    )}
                    </td>
                </tr>
                ))}
            </tbody>
            </Table>
        {renderPagination()}
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton style={{ backgroundColor: "#007AC3", color: "#fff" }}>
                <Modal.Title>Detalle de Venta</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {detalleSeleccionado ? (
                detalleSeleccionado.map((detalle, index) => (
                    <div key={index} style={{ marginBottom: "20px" }}>
                    <h5>Detalle #{index + 1}</h5>

                    {/* Detalles del Producto */}
                    <p><strong>ID Producto:</strong> {detalle.producto?.idProducto || "N/A"}</p>
                    <p><strong>Nombre Producto:</strong> {detalle.producto?.nombreProducto || "N/A"}</p>
                    <p><strong>Cantidad:</strong> {detalle.cantidad || "N/A"}</p>
                    <p><strong>Subtotal:</strong> Q{detalle.subTotal || "N/A"}</p>
                    <p><strong>Donación:</strong> Q{detalle.donacion || "N/A"}</p>

                    {/* Pagos Asociados */}
                    <h5>Pagos Asociados</h5>
                    {detalle.detalle_pago_ventas_stands?.length > 0 ? (
                        detalle.detalle_pago_ventas_stands.map((pago, idx) => (
                        <div key={idx} style={{ marginBottom: "10px" }}>
                            <p><strong>Tipo de Pago:</strong> {pago.tipo_pago?.tipo || "N/A"}</p>
                            <p><strong>Monto:</strong> Q{pago.pago || "N/A"}</p>
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
                        ))
                    ) : (
                        <p>No hay pagos asociados.</p>
                    )}

                    {/* Información del Stand */}
                    <h5>Información del Stand</h5>
                    <p><strong>Nombre del Stand:</strong> {detalle.stand?.nombreStand || "N/A"}</p>
                    <p><strong>Dirección:</strong> {detalle.stand?.direccion || "N/A"}</p>
                    <p><strong>Tipo de Stand:</strong> {detalle.stand?.tipo_stand?.tipo || "N/A"}</p>

                    {/* Información del Voluntario */}
                    <h5>Información del Voluntario</h5>
                    {detalle.idVoluntario && detalle.stand?.asignaciones?.length > 0 ? (
                        detalle.stand.asignaciones.map((asignacion, idx) => (
                        <div key={idx}>
                            <p><strong>Nombre:</strong> {asignacion.inscripcionEvento?.voluntario?.persona?.nombre || "N/A"}</p>
                            <p><strong>Teléfono:</strong> {asignacion.inscripcionEvento?.voluntario?.persona?.telefono || "N/A"}</p>
                            <p><strong>Domicilio:</strong> {asignacion.inscripcionEvento?.voluntario?.persona?.domicilio || "N/A"}</p>
                            <p><strong>Código QR:</strong> {asignacion.inscripcionEvento?.voluntario?.codigoQR || "N/A"}</p>
                            <p><strong>Evento:</strong> {asignacion.inscripcionEvento?.evento?.nombreEvento || "N/A"}</p>
                            <p><strong>Descripción del Evento:</strong> {asignacion.inscripcionEvento?.evento?.descripcion || "N/A"}</p>
                        </div>
                        ))
                    ) : (
                        <p>No hay voluntarios asignados.</p>
                    )}
                    <hr />
                    </div>
                ))
                ) : (
                <p>No se encontraron detalles.</p>
                )}
            </Modal.Body>
            </Modal>
            <Modal show={showPreviewModal} onHide={() => setShowPreviewModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Vista Previa de los Datos</Modal.Title>
            </Modal.Header>
                <Modal.Body>
                    <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                    {JSON.stringify(
                        {
                        venta: { ...newVenta, totalVenta: subtotal + (newVenta.donacion || 0) },
                        detalles: detallesVenta
                            .filter((detalle) => detalle.cantidad > 0)
                            .map((detalle) => ({
                            ...detalle,
                            subTotal: detalle.cantidad * detalle.precio,
                            donacion: detalle.donacion || newVenta.donacion,
                            idVoluntario: voluntarioStandSeleccionado || voluntarioGlobalSeleccionado || null,
                            })),
                        pagos: tiposPagos.map((pago) => ({
                            ...pago,
                            correlativo: pago.correlativo || "NA",
                            imagenTransferencia: pago.imagenTransferencia || "efectivo",
                        })),
                        },
                        null,
                        2
                    )}
                    </pre>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShowPreviewModal(false)}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Venta Completa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Selección del tipo de público */}
                    <Form.Group>
                    <Form.Label>Seleccionar Tipo de Público</Form.Label>
                    <Form.Control
                        as="select"
                        value={newVenta.idTipoPublico}
                        onChange={(e) =>
                        setNewVenta({ ...newVenta, idTipoPublico: parseInt(e.target.value) })
                        }
                    >
                        <option value="">Seleccione un tipo de público</option>
                        {tiposPublico.map((tipo) => (
                        <option key={tipo.idTipoPublico} value={tipo.idTipoPublico}>
                            {tipo.nombreTipo}
                        </option>
                        ))}
                    </Form.Control>
                    </Form.Group>

                    {/* Selección del Stand */}
                    <Form.Group>
                    <Form.Label>Seleccionar Stand</Form.Label>
                    <Form.Control
                        as="select"
                        onChange={(e) => {
                        const standSeleccionado = stands.find(
                            (stand) => stand.idStand === parseInt(e.target.value)
                        );
                        if (standSeleccionado) {
                            setStandSeleccionado(standSeleccionado);
                            //fetchVoluntariosByStand(standSeleccionado.idStand);
                            setVoluntarioStandSeleccionado(null);
                            setVoluntarioGlobalSeleccionado(null);
                            const productos = standSeleccionado.detallesStands.map((detalle) => ({
                            idProducto: detalle.idProducto,
                            nombreProducto: detalle.producto.nombreProducto,
                            precio: parseFloat(detalle.producto.precio),
                            cantidad: detalle.cantidad,
                            subTotal: detalle.cantidad * parseFloat(detalle.producto.precio),
                            estado: 1,
                            idStand: standSeleccionado.idStand, // Incluye el idStand seleccionado
                            idVoluntario: null, // Inicialmente null, puede ser editado después
                            }));
                            setStandSeleccionado(standSeleccionado); // Guarda el stand seleccionado
                            
                            setDetallesVenta(productos);
                            // Verificar si el idStand es válido antes de llamar a la API
                            // Verificar si es el stand especial
                            if (standSeleccionado.idStand === 1 && standSeleccionado.idTipoStands === 1) {
                                fetchVoluntarios(); // Carga todos los voluntarios globales
                            } else {
                                fetchVoluntariosByStand(standSeleccionado.idStand); // Carga solo los voluntarios asignados
                            }
                        } else {
                            setStandSeleccionado(null);
                            setDetallesVenta([]);
                            setVoluntarios([]);
                            setVoluntarioVirtual([]);
                            setVoluntarioStandSeleccionado(null);
                            setVoluntarioGlobalSeleccionado(null);
                        }
                        }}
                    >
                        <option value="">Seleccione un Stand</option>
                        {stands.map((stand) => (
                        <option key={stand.idStand} value={stand.idStand}>
                            {stand.nombreStand}
                        </option>
                        ))}
                    </Form.Control>
                    </Form.Group>
                <>
                    {/* Voluntarios Asignados */}
                    <h5>Voluntarios Asignados</h5>
                    {standSeleccionado?.idStand === 1 && standSeleccionado?.idTipoStands === 1 ? (
                        <>
                            <p>Este stand requiere seleccionar un voluntario:</p>
                            <Form.Group>
                            <Form.Label>Seleccionar Voluntario</Form.Label>
                            <Form.Control
                                as="select"
                                onChange={(e) => {
                                const voluntarioSeleccionado = voluntarioVirtual.find(
                                    (voluntario) => voluntario.idVoluntario === parseInt(e.target.value)
                                );
                                console.log("Voluntario seleccionado:", voluntarioSeleccionado);
                                // Actualizar el estado con el ID del voluntario seleccionado
                                setVoluntarioGlobalSeleccionado(voluntarioSeleccionado?.idVoluntario || null);
                                // Aquí puedes guardar el voluntario seleccionado en el estado si es necesario
                                setStandSeleccionado((prev) => ({
                                    ...prev,
                                    voluntarioAsignado: voluntarioSeleccionado,
                                }));
                                }}
                            >
                                <option value="">Seleccione un voluntario</option>
                                {voluntarioVirtual.map((voluntario) => (
                                <option key={voluntario.idVoluntario} value={voluntario.idVoluntario}>
                                    {voluntario.persona?.nombre || "Sin Nombre"}
                                </option>
                                ))}
                            </Form.Control>
                            </Form.Group>
                        </>
                        ) : (
                        <>
                            {voluntarios.length > 0 ? (
                                <Form.Group>
                                <Form.Label>Seleccionar Voluntario</Form.Label>
                                <Form.Control
                                    as="select"
                                    onChange={(e) => {
                                    const voluntarioSeleccionado = voluntarios.find(
                                        (voluntario) => voluntario.inscripcionEvento?.voluntario?.idVoluntario === parseInt(e.target.value)
                                    );
                                    console.log("Voluntario seleccionado:", voluntarioSeleccionado); // Verifica el valor seleccionado aquí.
                                    setVoluntarioStandSeleccionado(voluntarioSeleccionado?.inscripcionEvento?.voluntario?.idVoluntario || null);

                                    setStandSeleccionado((prev) => ({
                                        ...prev,
                                        voluntarioAsignado: voluntarioSeleccionado,
                                    }));
                                    }}
                                >
                                    <option value="">Seleccione un voluntario</option>
                                    {voluntarios.map((voluntario) => (
                                    <option
                                    key={voluntario.inscripcionEvento?.voluntario?.idVoluntario}
                                    value={voluntario.inscripcionEvento?.voluntario?.idVoluntario}
                                    >
                                        {voluntario?.inscripcionEvento?.voluntario?.persona?.nombre || "Sin Nombre"}
                                    </option>
                                    ))}
                                </Form.Control>
                                </Form.Group>
                            ) : (
                                <p>No hay voluntarios asignados a este stand.</p>
                            )}
                            </>
                            )}
                        </>
                    {/* Detalles de los productos */}
                    <h5>Productos Asignados</h5>
                    <Table>
                    <thead>
                        <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {detallesVenta.map((detalle, idx) => (
                        <tr key={detalle.idProducto}>
                            <td>{detalle.nombreProducto}</td>
                            <td>Q{detalle.precio.toFixed(2)}</td>
                            <td>
                            <Form.Control
                                type="number"
                                min="0"
                                max={detalle.cantidad}
                                value={detalle.cantidad}
                                onChange={(e) => {
                                const nuevosDetalles = [...detallesVenta];
                                nuevosDetalles[idx].cantidad = Number(e.target.value);
                                nuevosDetalles[idx].subTotal =
                                    nuevosDetalles[idx].cantidad * nuevosDetalles[idx].precio;
                                setDetallesVenta(nuevosDetalles);
                                }}
                            />
                            </td>
                            <td>Q{detalle.subTotal.toFixed(2)}</td>
                        </tr>
                        ))}
                    </tbody>
                    </Table>

                    {/* Donación */}
                    <Form.Group>
                    <Form.Label>Donación</Form.Label>
                    <Form.Control
                        type="number"
                        min="0"
                        value={newVenta.donacion || 0}
                        onChange={(e) => {
                        const donacion = parseFloat(e.target.value) || 0;
                        setNewVenta({ ...newVenta, donacion });
                        }}
                    />
                    </Form.Group>

                    {/* Pagos */}
                    <h5>Pagos</h5>
                    <Button onClick={handleAddPago} style={{ marginBottom: "10px" }}>
                    Agregar Pago
                    </Button>
                    {tiposPagos.map((pago, idx) => (
                    <div key={idx} style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
                        <Form.Group>
                        <Form.Label>Producto Asociado</Form.Label>
                        <Form.Control
                            as="select"
                            value={pago.idProducto}
                            onChange={(e) =>
                            handlePagoChange(idx, "idProducto", parseInt(e.target.value))
                            }
                        >
                            <option value="">Seleccione un producto</option>
                            {detallesVenta.map((detalle) => (
                            <option key={detalle.idProducto} value={detalle.idProducto}>
                                {detalle.nombreProducto}
                            </option>
                            ))}
                        </Form.Control>
                        </Form.Group>
                        <Form.Group>
                        <Form.Label>Tipo de Pago</Form.Label>
                        <Form.Control
                            as="select"
                            value={pago.idTipoPago}
                            onChange={(e) =>
                            handlePagoChange(idx, "idTipoPago", parseInt(e.target.value))
                            }
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
                        <Form.Label>Imagen</Form.Label>
                        <Form.Control type="file" onChange={(e) => handleFileUpload(e, idx)} />
                        </Form.Group>
                        <Button
                        variant="danger"
                        onClick={() => handleRemovePago(idx)}
                        style={{ marginTop: "10px" }}
                        >
                        Quitar Pago
                        </Button>
                    </div>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleCreateVenta}>Crear Venta</Button>
                    <Button
                    style={{
                        backgroundColor: "#6c757d",
                        borderColor: "#6c757d",
                        color: "#fff",
                    }}
                    onClick={() => setShowPreviewModal(true)}
                    >
                    Ver Datos
                    </Button>
                </Modal.Footer>
                </Modal>
                {/* Modal para mostrar voluntarios en formato JSON */}
      <Modal show={showVoluntariosModal} onHide={handleCloseVoluntarios}>
        <Modal.Header closeButton>
          <Modal.Title>Voluntarios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
            {JSON.stringify(voluntarioVirtual, null, 2)}
          </pre>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseVoluntarios}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
      </div>
    </>
  );
}

export default Ventas;
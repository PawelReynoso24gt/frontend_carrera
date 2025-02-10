import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl } from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff, FaEye } from "react-icons/fa";
import { getUserDataFromToken } from "../../utils/jwtUtils"; // token
import { format } from "date-fns";
import { parseISO } from "date-fns";

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
  const [totalAPagar, setTotalAPagar] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [tiposPagosOptions, setTiposPagosOptions] = useState([]);
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
  const [showPermissionModal, setShowPermissionModal] = useState(false); // Nuevo estado
  const [permissionMessage, setPermissionMessage] = useState('');
  const [permissions, setPermissions] = useState({});
  const [hasViewPermission, setHasViewPermission] = useState(false);
  const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/usuarios/permisos', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Ajusta según dónde guardes el token
          },
        });
        setPermissions(response.data.permisos || {});

        const hasPermission =
        response.data.permisos['Ver ventas voluntarios']

      setHasViewPermission(hasPermission);
      setIsPermissionsLoaded(true);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermissions();
    fetchTiposPagos();
    fetchTiposPublico();
    fetchVoluntarios();
    // Recalcula el subtotal y total a pagar
    const nuevoSubtotal = detallesVenta.reduce(
      (sum, detalle) => sum + parseFloat(detalle.subTotal || 0),
      0
    );

    const nuevaDonacion = parseFloat(newVenta.donacion || 0); // Convierte la donación
    const nuevoTotalAPagar = nuevoSubtotal + nuevaDonacion;

    setSubtotal(nuevoSubtotal.toFixed(2)); // Opcionalmente, formatea a 2 decimales
    setTotalAPagar(nuevoTotalAPagar.toFixed(2));
  }, [detallesVenta, newVenta.donacion]);


  useEffect(() => {
      if (isPermissionsLoaded) {
        if (hasViewPermission) {
          fetchVentas();
        } else {
          checkPermission('Ver ventas voluntarios', 'No tienes permisos para ver ventas voluntarios');
        }
      }
    }, [isPermissionsLoaded, hasViewPermission]);

  const idUsuario = getUserDataFromToken(localStorage.getItem("token"))?.idUsuario; //! usuario del token

  const fetchVentas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/ventas/voluntarios");
      setVentas(response.data);
      setFilteredVentas(response.data);
    } catch (error) {
      console.error("Error fetching ventas:", error);
    }
  };

  const fetchVoluntarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/voluntarios/conProductos");
      setVoluntarios(response.data); // Almacena los voluntarios con productos asignados
    } catch (error) {
      console.error("Error fetching voluntarios con productos asignados:", error);
      alert("Error al cargar los voluntarios con productos asignados.");
    }
  };

  const fetchTiposPagos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tipospagos");
      setTiposPagosOptions(response.data); // Ahora esto se usará en el select
    } catch (error) {
      console.error("Error fetching tipos pagos:", error);
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

  const fetchTiposPublico = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tipo_publicos");
      setTiposPublico(response.data);
    } catch (error) {
      console.error("Error fetching tipos publico:", error);
    }
  };

  const resetForm = () => {
    setVentaEditada({
      venta: null,
      detalles: [],
      pagos: []
    });
    setDetallesVenta([]);
    setTiposPagos([]);
    setNewVenta({
      totalVenta: 0,
      idTipoPublico: "",
      estado: 1,
      donacion: 0, // Asegúrate de incluir la donación aquí
    });
    setIsEditMode(false);
  };

  const handleCloseModal = () => {
    setDetalleSeleccionado(null);
    setShowModal(false);
    resetForm(); // Restablecer el formulario al cerrar el modal
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    resetForm(); // Restablecer el formulario al cerrar el modal
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

  const calculateTotalVenta = () => {
    const subtotal = detallesVenta.reduce(
      (sum, detalle) => sum + detalle.cantidad * detalle.precio,
      0
    );

    const totalDonacion = detallesVenta.reduce(
      (sum, detalle) => sum + (parseFloat(detalle.donacion) || 0),
      0
    );

    const total = subtotal + totalDonacion;
    setSubtotal(subtotal);
    setTotalAPagar(total);
    return total;
  };

  const handleViewDetails = async (idVenta) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/detalle_ventas_voluntarios/ventaCompleta/${idVenta}`
      );

      if (response.data && response.data.length > 0) {
        setDetalleSeleccionado(response.data); // Guarda todos los detalles de la venta
        const imagen = response.data[0]?.detalle_pago_ventas_voluntarios[0]?.imagenTransferencia || null;
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

  const fetchActiveVentas = async () => {
    try {
      if (hasViewPermission) {
      const response = await axios.get("http://localhost:5000/ventas/voluntarios/activas");
      setFilteredVentas(response.data);
      setCurrentPage(1); // Reinicia la paginación al cargar nuevos datos
    } else {
      checkPermission('Ver ventas voluntarios', 'No tienes permisos para ver ventas voluntarios');
    }
    } catch (error) {
      console.error("Error fetching active ventas:", error);
    }
  };

  const fetchInactiveVentas = async () => {
    try {
      if (hasViewPermission) {
      const response = await axios.get("http://localhost:5000/ventas/voluntarios/inactivas");
      setFilteredVentas(response.data);
      setCurrentPage(1); // Reinicia la paginación al cargar nuevos datos
    } else {
      checkPermission('Ver ventas voluntarios', 'No tienes permisos para ver ventas voluntarios');
    }
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
  };

  const handlePagoChange = (index, field, value) => {
    const nuevosPagos = [...tiposPagos];
    nuevosPagos[index][field] = value;
    setTiposPagos(nuevosPagos);
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
      // Validar y calcular los subtotales de los productos
      const detallesVentaValidos = detallesVenta
        .filter((detalle) => detalle.cantidad > 0 && detalle.estado !== 0)
        .map((detalle) => {
          const subTotal = detalle.cantidad * detalle.precio;
          return {
            ...detalle,
            subTotal, // Asegura que el subtotal se incluya correctamente
            donacion: detalle.donacion || newVenta.donacion, // Asignar la donación a cada detalle
          };
        });


      // Calcular el subtotal de los productos y el total de la venta
      const subtotalVenta = detallesVentaValidos.reduce((sum, detalle) => sum + detalle.subTotal, 0);
      const totalVenta = subtotalVenta + (newVenta.donacion || 0);

      // Validar que la suma de los montos de los pagos coincida con el total calculado
      const totalPagado = tiposPagos.reduce((sum, pago) => sum + (parseFloat(pago.monto) || 0), 0);

        // Asegúrate de que totalAPagar es un número
        const totalAPagarNumber = parseFloat(totalAPagar);

        // Verifica si el total pagado coincide con el total calculado (incluyendo la donación ya sumada)
        if (totalPagado !== totalAPagarNumber) {
            alert(
                `La suma de los pagos (Q${totalPagado.toFixed(2)}) no coincide con el total a pagar (Q${totalAPagarNumber.toFixed(2)}).`
            );
            return;
        }

      // Validar que cada pago tenga el formato correcto
      const pagosValidados = tiposPagos.map((pago) => {
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

      // Construir los datos de la venta para enviar al backend
      const ventaData = {
        venta: { ...newVenta, totalVenta }, // Incluye la donación y el total
        detalles: detallesVentaValidos, // Incluye los subtotales y donaciones
        pagos: pagosValidados, // Pagos validados con sus requisitos
      };

      // Enviar los datos al backend
      const response = await axios.post("http://localhost:5000/ventas/create/completa", ventaData);
      if (response.status === 201) {

        const bitacoraData = {
          descripcion: "Nueva venta de voluntario creada",
          idCategoriaBitacora: 19, // ID de categoría para creación
          idUsuario: idUsuario,
          fechaHora: new Date()
        };
        await axios.post("http://localhost:5000/bitacora/create", bitacoraData);
        alert("Venta creada con éxito");
        setShowDetailsModal(false); // Cerrar el modal
        fetchVentas(); // Actualizar la lista de ventas
      }
    } catch (error) {
      console.error("Error creando venta:", error.message || error);
      alert("Error al crear la venta: " + (error.message || "Revisa los datos ingresados."));
    }
  };

  const handleUpdateVenta = async () => {
    try {
    // Calcular el subtotal de los productos
    const subtotal = detallesVenta.reduce(
      (sum, detalle) => sum + (parseFloat(detalle.subTotal) || 0),
      0
    );

    // Tomar la donación directamente de newVenta.donacion
    const totalDonacion = parseFloat(newVenta.donacion) || 0;

    // Calcular el total a pagar
    const totalVenta = subtotal + totalDonacion;

      // Imprimir los cálculos en la consola
    // console.log("Subtotal:", subtotal.toFixed(2));
    // console.log("Total Donación:", totalDonacion.toFixed(2));
    // console.log("Total a Pagar:", totalVenta.toFixed(2));

      // Asegúrate de que totalAPagar es un número
      const totalAPagarNumber = parseFloat(totalAPagar);

       // Filtrar los detalles con cantidad mayor a 0
      const detallesValidos = detallesVenta.filter(detalle => detalle.cantidad > 0);

      // Aplicar la donación solo al primer detalle válido
      if (detallesValidos.length > 0) {
        detallesValidos[0].donacion = totalDonacion;
        // Asegurarse de que los demás detalles no tengan la donación
        for (let i = 1; i < detallesValidos.length; i++) {
          detallesValidos[i].donacion = 0;
        }
      }

      // Construir JSON para enviar
      const ventaData = {
        venta: {
          ...ventaEditada.venta,
          totalVenta: totalVenta.toFixed(2), // Asignar el total como número
        },
        detalles: detallesValidos.map((detalle) => ({
          idProducto: detalle.idProducto,
          cantidad: detalle.cantidad,
          subTotal: detalle.cantidad * detalle.precio,
          donacion: Number(detalle.donacion || 0),
          estado: detalle.estado,
          idVoluntario: detalle.idVoluntario,
        })),
        pagos: tiposPagos.map((pago) => ({
          idTipoPago: pago.idTipoPago,
          monto: Number(pago.monto),
          correlativo: pago.correlativo,
          imagenTransferencia: pago.imagenTransferencia,
          estado: pago.estado,
          idProducto: pago.idProducto,
        })),
      };

    // Imprimir el JSON en la consola
    //console.log("JSON enviado al backend:", JSON.stringify(ventaData, null, 2));

      const response = await axios.put(
        `http://localhost:5000/ventas/update/completa/${ventaEditada.venta.idVenta}`,
        ventaData
      );

      if (response.status === 200) {

        // Crear entrada en la bitácora
        const bitacoraData = {
          descripcion: "Venta de voluntarios actualizada",
          idCategoriaBitacora: 18,
          idUsuario: idUsuario, // Asegúrate de que idUsuario sea el valor correcto extraído del token
          fechaHora: new Date()
        };

        await axios.post("http://localhost:5000/bitacora/create", bitacoraData);

        alert("Venta actualizada con éxito");
        fetchVentas(); // Actualizar la lista de ventas
        setShowDetailsModal(false); // Cerrar el modal
      }
    } catch (error) {
      alert("Error al actualizar la venta.");
    }
  };

  const handleLoadVentaForEdit = async (idVenta) => {
    try {
      const response = await axios.get(`http://localhost:5000/detalle_ventas_voluntarios/ventaCompleta/${idVenta}`);
      if (response.data) {
        // Extraer datos de la venta, detalles y pagos
        const detalles = response.data.map((detalle) => ({
          idDetalleVentaVoluntario: detalle.idDetalleVentaVoluntario,
          idProducto: detalle.producto.idProducto,
          nombreProducto: detalle.producto.nombreProducto,
          cantidad: detalle.cantidad,
          subTotal: detalle.subTotal,
          donacion: parseFloat(detalle.donacion || 0), // Aseguramos que sea un número
          precio: parseFloat(detalle.producto.precio),
          idVoluntario: detalle.idVoluntario,
          estado: detalle.estado,
        }));

        const productosValidos = detalles.filter((detalle) => detalle.cantidad > 0);

        const pagos = response.data
          .flatMap((detalle) => detalle.detalle_pago_ventas_voluntarios)
          .map((pago) => ({
            idDetallePagoVentaVoluntario: pago.idDetallePagoVentaVoluntario,
            idTipoPago: pago.idTipoPago,
            monto: parseFloat(pago.pago), // Aseguramos que sea un número
            correlativo: pago.correlativo,
            imagenTransferencia: pago.imagenTransferencia,
            estado: pago.estado,
            idProducto: productosValidos[0]?.idProducto || null, // Asociar el pago con el producto
          }));

        const venta = {
          idVenta: idVenta,
          totalVenta: parseFloat(response.data[0]?.venta?.totalVenta || 0),
          idTipoPublico: response.data[0]?.venta?.idTipoPublico || "",
          estado: response.data[0]?.venta?.estado || 1,
        };

        // Calcular subtotal y total
        const subtotal = detalles.reduce(
          (sum, detalle) => sum + detalle.cantidad * detalle.precio,
          0
        );
        const totalDonacion = detalles.reduce(
          (sum, detalle) => sum + detalle.donacion,
          0
        );
        const totalVenta = subtotal + totalDonacion;

        // Actualizar estados
        setVentaEditada({
          venta: {
            idVenta: idVenta,
            totalVenta: totalVenta,
            idTipoPublico: response.data[0]?.venta?.idTipoPublico || "",
            estado: response.data[0]?.venta?.estado || 1,
          },
          detalles,
          pagos,
        });
        setDetallesVenta(detalles);
        setTiposPagos(pagos);
        setSubtotal(subtotal);
        setTotalAPagar(totalVenta);

        // Actualizar donación en newVenta
        setNewVenta((prevVenta) => ({
          ...prevVenta,
          donacion: totalDonacion,
        }));
      }
    } catch (error) {
      console.error("Error cargando venta para edición:", error);
      alert("Error al cargar los datos de la venta para edición.");
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
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>Gestión de Ventas de Voluntarios</h3>
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
            onClick={() => {
              if (checkPermission('Crear venta voluntarios', 'No tienes permisos para crear venta voluntarios')) {
                handleCreateVentaClick();
              }
            }}
          >
            Crear Venta
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
        <Table striped bordered hover responsive className="mt-3" style={{
          textAlign: "center", borderRadius: "20px",
          overflow: "hidden",
        }}>
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
            {currentVentas.length > 0 ? (
              currentVentas.map((venta) => {
                return (
                  <tr key={venta.idVenta}>
                    <td>{venta.idVenta}</td>
                    <td>{venta.fechaVenta ? format(parseISO(venta.fechaVenta), "dd-MM-yyyy") : "Sin fecha"}</td>
                    <td>Q. {venta.totalVenta}</td>
                    <td>{tiposPublico.find((tp) => tp.idTipoPublico === venta.idTipoPublico)?.nombreTipo || "N/A"}</td>
                    <td>{venta.estado === 1 ? "Activo" : "Inactivo"}</td>
                    <td>
                      <FaEye
                        style={{ cursor: "pointer", marginRight: "10px", color: "#007AC3", fontSize: "20px" }}
                        title="Ver Detalle"
                        onClick={() => handleViewDetails(venta.idVenta)}
                      />
                      <FaPencilAlt
                        style={{
                          color: "#007AC3",
                          cursor: "pointer",
                          marginRight: "10px",
                          fontSize: "20px",
                        }}
                        title="Editar"
                        onClick={() => {
                          if (checkPermission('Editar venta voluntarios', 'No tienes permisos para editar venta voluntarios')) {
                            handleLoadVentaForEdit(venta.idVenta); // Cargar la venta completa
                            setShowDetailsModal(true); // Mostrar el modal
                          }
                        }}
                      />
                      {venta.estado ? (
                        <FaToggleOn
                          style={{ cursor: "pointer", color: "#30c10c", marginLeft: "10px", fontSize: "20px" }}
                          title="Inactivar"
                          onClick={() => {
                            if (checkPermission('Desactivar venta voluntarios', 'No tienes permisos para desactivar venta voluntarios')) {
                              toggleEstado(venta.idVenta, venta.estado)
                            }
                          }}
                        />
                      ) : (
                        <FaToggleOff
                          style={{ cursor: "pointer", color: "#e10f0f", marginLeft: "10px", fontSize: "20px" }}
                          title="Activar"
                          onClick={() => {
                            if (checkPermission('Activar venta voluntarios', 'No tienes permisos para activar venta voluntarios')) {
                              toggleEstado(venta.idVenta, venta.estado)
                            }
                          }}
                        />
                      )}
                    </td>
                  </tr>
                );
              })) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", fontWeight: "bold" }}>
                  No hay ventas disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {renderPagination()}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton style={{ backgroundColor: "#007AC3", color: "#fff" }}>
            <Modal.Title>Detalle de Venta</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {detalleSeleccionado ? (
              detalleSeleccionado
              .filter(detalle => detalle.cantidad > 0) // Filtrar detalles con cantidad > 0
              .map((detalle, index) => (
                <div key={index}>
                  <h5>Detalle #{index + 1}</h5>
                  <p><strong>ID Producto:</strong> {detalle.producto?.idProducto || "N/A"}</p>
                  <p><strong>Nombre Producto:</strong> {detalle.producto?.nombreProducto || "N/A"}</p>
                  <p><strong>Cantidad:</strong> {detalle.cantidad || "N/A"}</p>
                  <p><strong>Subtotal:</strong> Q{detalle.subTotal || "N/A"}</p>
                  <p><strong>Donación:</strong> Q{detalle.donacion || "N/A"}</p>

                  <h5>Pagos Asociados</h5>
                  {detalle.detalle_pago_ventas_voluntarios && detalle.detalle_pago_ventas_voluntarios.length > 0 ? (
                    detalle.detalle_pago_ventas_voluntarios.map((pago, idx) => (
                      <div key={idx}>
                        <p><strong>Tipo de Pago:</strong> {pago.tipo_pago?.tipo || "N/A"}</p>
                        <p><strong>Monto:</strong> Q{pago.pago || "N/A"}</p>
                        <p><strong>Correlativo:</strong> {pago.correlativo || "N/A"}</p>
                        <p>
                          <strong>Comprobante:</strong>
                          {pago.imagenTransferencia === "efectivo" ? (
                            "Efectivo"
                          ) : (
                            <img
                              src={`data:image/png;base64,${pago.imagenTransferencia}`}
                              alt="Comprobante de Pago"
                              style={{ width: "100%", maxWidth: "150px", marginTop: "10px", borderRadius: "8px" }}
                            />
                          )}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>No hay pagos asociados.</p>
                  )}

                  <h5>Información del Voluntario</h5>
                  <p><strong>Nombre:</strong> {detalle.voluntario?.persona?.nombre || "N/A"}</p>
                  <p><strong>Teléfono:</strong> {detalle.voluntario?.persona?.telefono || "N/A"}</p>
                  <p><strong>Domicilio:</strong> {detalle.voluntario?.persona?.domicilio || "N/A"}</p>
                  <p><strong>Código QR:</strong> {detalle.voluntario?.codigoQR || "N/A"}</p>
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
            <Modal.Title>
              {ventaEditada.venta ? "Editar Venta de Voluntario" : "Crear Venta de Voluntario"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Seleccionar Voluntario</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => {
                  const voluntarioSeleccionado = voluntarios.find(
                    (vol) => vol.idVoluntario === parseInt(e.target.value)
                  );
                  if (voluntarioSeleccionado) {
                    const productos = voluntarioSeleccionado.detalle_productos_voluntarios.map((detalle) => ({
                      idProducto: detalle.idProducto,
                      nombreProducto: detalle.producto.nombreProducto,
                      precio: parseFloat(detalle.producto.precio),
                      cantidad: detalle.cantidad,
                      subTotal: detalle.cantidad * parseFloat(detalle.producto.precio),
                      idVoluntario: voluntarioSeleccionado.idVoluntario,
                      donacion: detalle.donacion || 0, // Incluye el campo donación
                      estado: 1,
                    }));
                    setDetallesVenta(productos); // Carga los productos asignados
                  } else {
                    setDetallesVenta([]); // Limpia los productos si no hay selección
                  }
                }}
              >
                <option value="">Seleccione un voluntario</option>
                {voluntarios.map((vol) => (
                  <option key={vol.idVoluntario} value={vol.idVoluntario}>
                    {vol.persona?.nombre || "Voluntario sin nombre"}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
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
                {detallesVenta.map((producto, idx) => (
                  <tr key={producto.idProducto}>
                    <td>{producto.nombreProducto}</td>
                    <td>{producto.precio}</td>
                    <td>
                      <Form.Control
                        type="number"
                        min="1"
                        value={producto.cantidad}
                        onChange={(e) => {
                          const nuevosDetalles = [...detallesVenta];
                          nuevosDetalles[idx].cantidad = Number(e.target.value);
                          nuevosDetalles[idx].subTotal = nuevosDetalles[idx].cantidad * nuevosDetalles[idx].precio;
                          // Recalcular el subtotal y donación
                          const nuevoSubtotal = nuevosDetalles.reduce((sum, detalle) => sum + detalle.subTotal, 0);
                          const nuevaDonacion = nuevosDetalles.reduce((sum, detalle) => sum + parseFloat(detalle.donacion || 0), 0);
                          const nuevoTotal = nuevoSubtotal + nuevaDonacion;

                          setDetallesVenta(nuevosDetalles);
                          setSubtotal(nuevoSubtotal);
                          setTotalAPagar(nuevoTotal);
                          setNewVenta((prevVenta) => ({ ...prevVenta, donacion: nuevaDonacion }));
                        }}
                      />
                    </td>
                    <td>{producto.cantidad * producto.precio}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Form.Group>
              <Form.Label>Donación</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={newVenta.donacion || 0}
                onChange={(e) => {
                  const nuevaDonacion = parseFloat(e.target.value) || 0;

                  // Actualiza la donación en cada detalle
                  const nuevosDetalles = detallesVenta.map((detalle) => ({
                    ...detalle,
                    donacion: nuevaDonacion, // Aplica la nueva donación a cada producto
                  }));

                  // Recalcula el subtotal y total a pagar
                  const nuevoSubtotal = nuevosDetalles.reduce((sum, detalle) => sum + detalle.subTotal, 0);
                  const nuevoTotalAPagar = nuevoSubtotal + nuevaDonacion;

                  // Actualiza los estados
                  setDetallesVenta(nuevosDetalles);
                  setNewVenta((prevVenta) => ({
                    ...prevVenta,
                    donacion: nuevaDonacion,
                  }));
                  setSubtotal(nuevoSubtotal);
                  setTotalAPagar(nuevoTotalAPagar);
                }}
              />
            </Form.Group>
            <h5>Resumen de Pago</h5>
            <Table>
              <tbody>
                <tr>
                  <td><strong>Subtotal:</strong></td>
                  <td>Q{Number(subtotal).toFixed(2)}</td>
                </tr>
                <tr>
                  <td><strong>Total Donación:</strong></td>
                  <td>Q{Number(newVenta.donacion || 0).toFixed(2)}</td>
                </tr>
                <tr>
                  <td><strong>Total a Pagar:</strong></td>
                  <td>Q{Number(totalAPagar).toFixed(2)}</td>
                </tr>
              </tbody>
            </Table>
            <h5>Pagos</h5>
            {/* Botones para agregar pagos rápidamente */}
            <Button onClick={handleAddPago} style={{ marginRight: "10px" }}>
              Agregar Pago
            </Button>
            {/* Formulario para editar los pagos agregados */}
            {tiposPagos.map((pago, idx) => (
              <div key={idx} style={{ borderBottom: "1px solid #ccc", marginBottom: "10px", paddingBottom: "10px" }}>
                <Form.Group>
                  <Form.Label>Producto Asociado</Form.Label>
                  <Form.Control
                    as="select"
                    value={pago.idProducto}
                    onChange={(e) => handlePagoChange(idx, "idProducto", parseInt(e.target.value))}
                  >
                    <option value="">Seleccione un producto</option>
                    {detallesVenta
                      .filter((detalle) => detalle.cantidad > 0) // Mostrar solo productos válidos
                      .map((detalle) => (
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
                    onChange={(e) => handlePagoChange(idx, "idTipoPago", parseInt(e.target.value))}
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
            <Button onClick={ventaEditada.venta ? handleUpdateVenta : handleCreateVenta}>
              {ventaEditada.venta ? "Actualizar Venta" : "Crear Venta"}
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
    </>
  );
}

export default Ventas;
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
  const [voluntarioVirtual, setVoluntarioVirtual] = useState([]);
  const [totalAPagar, setTotalAPagar] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [tiposPagosOptions, setTiposPagosOptions] = useState([]);
  const [stands, setStands] = useState([]);
  const [standSeleccionado, setStandSeleccionado] = useState(null);
  const [voluntarioStandSeleccionado, setVoluntarioStandSeleccionado] = useState(null);
  const [voluntarioGlobalSeleccionado, setVoluntarioGlobalSeleccionado] = useState(null);
  const [showVoluntariosModal, setShowVoluntariosModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Nuevo estado
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
    donacion: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [resumenPagos, setResumenPagos] = useState({
    subtotal: 0,
    donacion: 0,
    totalVenta: 0,
  });
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
        response.data.permisos['Ver ventas stands']

      setHasViewPermission(hasPermission);
      setIsPermissionsLoaded(true);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermissions();
    fetchTiposPagos();
    fetchTiposPublico();
    fetchStands();
    fetchVoluntarios();
    actualizarTotales();
    
    // Validar si todos los pagos son del tipo solicitado
    const pagosSolicitados = tiposPagos.filter((pago) => pago.idTipoPago === 5);

    // Usar la donación de `ventaEditada` si está en modo edición
    const donacionActual = isEditMode ? ventaEditada.venta?.donacion : newVenta.donacion;

    calcularResumenPagos(detallesVenta, tiposPagos, donacionActual);

  if (pagosSolicitados.length === tiposPagos.length) {
    // Modo de tipo solicitado
    setSubtotal(0);
    setTotalAPagar(0);
  } else {
    // Cálculo estándar
    const calculatedSubtotal = detallesVenta.reduce((sum, detalle) => sum + (detalle.subTotal || 0), 0);
    const total = calculatedSubtotal + (newVenta.donacion || 0);

    setSubtotal(calculatedSubtotal);
    setTotalAPagar(total);
  }
  }, [detallesVenta, newVenta.donacion, voluntarios, ventaEditada.venta?.donacion, tiposPagos]);

  const idUsuario = getUserDataFromToken(localStorage.getItem("token"))?.idUsuario; //! usuario del token

   useEffect(() => {
      if (isPermissionsLoaded) {
        if (hasViewPermission) {
          fetchVentas();
        } else {
          checkPermission('Ver ventas stands', 'No tienes permisos para ver ventas stands');
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

  const resetForm = () => {
    setVentaEditada({
      venta: null,
      detalles: [],
      pagos: []
    });
    setDetallesVenta([]);
    setTiposPagos([]);
    setStandSeleccionado(null);
    setVoluntarioStandSeleccionado(null);
    setVoluntarioGlobalSeleccionado(null);
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

  const calcularResumenPagos = (detallesVenta, pagos, donacion) => {
    let subtotal = 0;
    let totalPagado = 0;
  
    for (const detalle of detallesVenta) {
      subtotal += detalle.subTotal || 0;
    }
  
    // Total de la venta = subtotal + donación (o 0 si no aplica)
    const totalVenta = subtotal + (donacion || 0);
  
    setResumenPagos({ subtotal, donacion: donacion || 0, totalVenta });
  };

  const fetchVentas = async () => {
    try {
      const response = await axios.get("https://api.voluntariadoayuvi.com/ventas/stands");
      setVentas(response.data);
      setFilteredVentas(response.data);
    } catch (error) {
      console.error("Error fetching ventas:", error);
    }
  };

  // Fetch de los stands
  const fetchStands = async () => {
    try {
      const response = await axios.get("https://api.voluntariadoayuvi.com/stand");
      const standsActivos = response.data.filter((stand) => stand.estado === 1);
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
      const response = await axios.get(`https://api.voluntariadoayuvi.com/stands/voluntarios/${idStand}`);
      if (response.status === 200) {
        setVoluntarios(response.data); // Asignados al stand
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
      const response = await axios.get("https://api.voluntariadoayuvi.com/voluntarios");
      if (response.status === 200) {
        setVoluntarioVirtual(response.data); // Solo para el stand especial
      } else {
        console.warn("No se encontraron voluntarios.");
        setVoluntarioVirtual([]);
      }
    } catch (error) {
      console.error("Error al cargar voluntarios globales:", error.message);
      setVoluntarioVirtual([]);
    }
  };   

  const handleEditVenta = async (idVenta) => {
    try {
      const response = await axios.get(
        `https://api.voluntariadoayuvi.com/detalle_ventas_stands/ventaCompleta/${idVenta}`
      );
      const detalles = response.data;
  
      if (!detalles || detalles.length === 0) {
        throw new Error("No se encontraron detalles para esta venta.");
      }
  
      const venta = detalles[0].venta;
  
      // Mapear detalles de la venta
      const detallesMapeados = detalles.map((detalle) => ({
        idDetalleVentaStand: detalle.idDetalleVentaStand,
        idProducto: detalle.producto?.idProducto || null,
        nombreProducto: detalle.producto?.nombreProducto || "Producto no definido",
        cantidad: detalle.cantidad || 0,
        subTotal: parseFloat(detalle.subTotal || 0),
        precio: parseFloat(detalle.producto?.precio || 0),
        donacion: parseFloat(detalle.donacion || 0),
        idStand: detalle.idStand,
        idVoluntario : detalle.idVoluntario || null,
        estado: detalle.estado,
        producto: detalle.producto,
        voluntario: detalle.voluntario,
        stand: detalle.stand,
        pagos: detalle.detalle_pago_ventas_stands,
      }));

      // Sumar todas las donaciones
      const donacionTotal = detallesMapeados.reduce(
        (sum, detalle) => sum + detalle.donacion,
        0
      );
      // Mapear pagos asociados
      const pagosMapeados = detalles.flatMap((detalle) =>
        detalle.detalle_pago_ventas_stands.map((pago) => ({
          idDetallePagoVentaStand: pago.idDetallePagoVentaStand,
          idDetalleVentaStand: detalle.idDetalleVentaStand,
          idTipoPago: pago.idTipoPago,
          monto: parseFloat(pago.pago || 0),
          correlativo: pago.correlativo,
          imagenTransferencia: pago.imagenTransferencia,
          estado: pago.estado,
          idProducto: detalle.idProducto,
        }))
      );

      // Buscar el stand seleccionado
      const standSeleccionado = stands.find((stand) => stand.idStand === detalles[0].stand.idStand);

      // Cargar voluntarios asignados al stand seleccionado
      await fetchVoluntariosByStand(standSeleccionado.idStand);

      // Asignar el voluntario seleccionado a partir de los detalles
      const voluntarioSeleccionado = detalles[0].voluntario?.idVoluntario || null;

      // Asignar el voluntario seleccionado
      if (standSeleccionado.idStand === 1 && standSeleccionado.idTipoStands === 1) {
        setVoluntarioGlobalSeleccionado(voluntarioSeleccionado); // Para el stand especial
      } else {
        setVoluntarioStandSeleccionado(voluntarioSeleccionado); // Para otros stands
      }
  
      setVentaEditada({
        venta: {
          idVenta: venta.idVenta,
          totalVenta: parseFloat(venta.totalVenta || 0),
          idTipoPublico: venta.tipo_publico?.idTipoPublico || null,
          estado: venta.estado,
          donacion: donacionTotal, // Agregar la donación total aquí
        },
        detalles: detallesMapeados,
        pagos: pagosMapeados,
      });
  
      setDetallesVenta(detallesMapeados);
      setTiposPagos(pagosMapeados);
      setStandSeleccionado(standSeleccionado);
      setVoluntarioStandSeleccionado(voluntarioSeleccionado);

      setIsEditMode(true); // Cambia a modo edición
      setShowDetailsModal(true); // Abre el modal
    } catch (error) {
      console.error("Error al cargar los detalles de la venta:", error);
      alert("No se pudo cargar los detalles de la venta.");
    }
  };  

  const actualizarTotales = () => {
    const subtotal = detallesVenta.reduce((sum, detalle) => sum + detalle.subTotal, 0);
    const total = subtotal + (isEditMode ? ventaEditada.venta?.donacion || 0 : newVenta.donacion || 0);
  
    setSubtotal(subtotal);
    setTotalAPagar(total);
  };   

  const handleUpdateVenta = async () => {
    try {
      // Validar que se haya seleccionado un voluntario si es requerido
      if (
        standSeleccionado?.idStand === 1 &&
        standSeleccionado?.idTipoStands === 1 &&
        !voluntarioGlobalSeleccionado
      ) {
        alert("Debe seleccionar un voluntario para este stand.");
        return; // Detener la ejecución si no se ha seleccionado un voluntario
      }

      // Validar que todos los pagos tengan un idProducto válido
      const pagosInvalidos = tiposPagos.filter((pago) => !pago.idProducto);

      if (pagosInvalidos.length > 0) {
        alert("Todos los pagos deben estar asociados a un producto válido.");
        return;
      }
  
      // Filtrar y validar detalles con cantidad mayor que 0
      const detallesVentaValidos = detallesVenta
        .filter((detalle) => detalle.cantidad > 0 && detalle.estado !== 0) // Solo productos válidos
        .map((detalle) => {
          const isDonation = tiposPagos.some(
            (pago) => pago.idProducto === detalle.idProducto && pago.monto === 0 // Verificar si es una donación
          );
  
          // Si es donación, establecer subtotal como 0, de lo contrario calcular normalmente
          const subTotal = isDonation ? 0 : detalle.cantidad * detalle.precio;
  
          return {
            ...detalle,
            subTotal, // Asignar el subtotal calculado
            donacion: 0, // Inicialmente establecer la donación en 0
            idVoluntario:
              standSeleccionado?.idStand === 1 || voluntarios.length > 0
                ? voluntarioStandSeleccionado || voluntarioGlobalSeleccionado
                : null, // Asignar el voluntario si aplica
            idStand: detalle.idStand || standSeleccionado?.idStand, // Asignar el stand seleccionado
            idDetalleVentaStand: detalle.idDetalleVentaStand,  // Asegúrate de incluir este campo
          };
        });
  
      // Asignar la donación global solo al primer detalle
      if (detallesVentaValidos.length > 0) {
        detallesVentaValidos[0].donacion = ventaEditada.venta.donacion;
      }
  
      const totalDonacionActualizado = detallesVentaValidos.reduce((sum, detalle) => sum + detalle.donacion, 0);
  
      // Calcular el subtotal de los productos y el total de la venta
      const subtotal = detallesVentaValidos.reduce((sum, detalle) => sum + detalle.subTotal, 0);
      const totalVenta = subtotal + (ventaEditada.venta.donacion || 0); // Sumar la donación al subtotal
  
      // Construir los datos de la venta para enviar al backend
      const ventaData = {
        venta: { ...ventaEditada.venta, totalVenta: subtotal + (ventaEditada.venta?.donacion || 0) }, // Incluye la donación y el total
        detalles: detallesVentaValidos, // Incluye los subtotales y donaciones
        pagos: ventaEditada.pagos.map((pago) => ({
          idTipoPago: pago.idTipoPago,
          monto: Number(pago.monto),
          correlativo: pago.correlativo || "NA",
          imagenTransferencia: pago.imagenTransferencia || "efectivo",
          estado: pago.estado,
          idProducto: pago.idProducto,
        })), // Pagos validados con sus requisitos
        idVoluntario: standSeleccionado?.idStand === 1 ? voluntarioGlobalSeleccionado : voluntarioStandSeleccionado || null, // Asegurarse de tener un voluntario si el idStand es 1
      };
  
      // Imprimir los cálculos en la consola
      // console.log("Subtotal:", subtotal.toFixed(2));
      // console.log("Total Donación:", totalDonacionActualizado.toFixed(2));
      // console.log("Total de la Venta:", totalVenta.toFixed(2));
  
      // Imprimir el JSON en la consola
      //console.log("JSON enviado al backend:", JSON.stringify(ventaData, null, 2));
  
      // Validaciones después de los logs
      if (totalDonacionActualizado !== ventaEditada.venta.donacion) {
        alert(
          `La donación global (Q${ventaEditada.venta.donacion}) no coincide con el total de las donaciones de los detalles (Q${totalDonacionActualizado}).`
        );
        return;
      }
  
      // Validar que la suma de los montos de los pagos coincida con el total calculado
      const totalPagado = ventaEditada.pagos.reduce((sum, pago) => sum + (pago.monto || 0), 0);
  
      // Verificar si existe algún pago con idTipoPago 5
      const tienePagoSolicitado = ventaEditada.pagos.some((pago) => pago.idTipoPago === 5);
  
      if (!tienePagoSolicitado && totalPagado !== totalVenta) {
        alert(
          `La suma de los pagos (Q${totalPagado.toFixed(
            2
          )}) no coincide con el total de la venta (Q${totalVenta.toFixed(2)}).`
        );
        return;
      }
  
      // Enviar los datos al backend
      const response = await axios.put(
        `https://api.voluntariadoayuvi.com/ventas/update/stands/completa/${ventaEditada.venta.idVenta}`,
        ventaData
      );
  
      if (response.status === 200) {
        const bitacoraData = {
          descripcion: "Venta de stands actualizada",
          idCategoriaBitacora: 18, // ID de categoría para creación
          idUsuario: idUsuario,
          fechaHora: new Date()
        };
        await axios.post("https://api.voluntariadoayuvi.com/bitacora/create", bitacoraData);
  
        alert("Venta actualizada con éxito");
        setShowDetailsModal(false); // Cerrar el modal
        fetchVentas(); // Refrescar lista de ventas
      }
    } catch (error) {
      console.error("Error al actualizar la venta:", error.response?.data || error.message);
      alert(`Error al actualizar la venta: ${error.response?.data || "Revisa los datos ingresados."}`);
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
      const response = await axios.get("https://api.voluntariadoayuvi.com/tipospagos");
      setTiposPagosOptions(response.data); // Ahora esto se usará en el select
    } catch (error) {
      console.error("Error fetching tipos pagos:", error);
    }
  };

  const fetchTiposPublico = async () => {
    try {
      const response = await axios.get("https://api.voluntariadoayuvi.com/tipo_publicos");
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
            `https://api.voluntariadoayuvi.com/detalle_ventas_stands/ventaCompleta/${idVenta}`
        );

      if (response.data && response.data.length > 0) {
        setDetalleSeleccionado(response.data); // Guarda todos los detalles de la venta
        //console.log("Detalles de la venta:", JSON.stringify(response.data, null, 2)); // Imprimir en consola
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

  const fetchActiveVentas = async () => {
    try {
      if (hasViewPermission) {
      const response = await axios.get("https://api.voluntariadoayuvi.com/ventas/stands/activas");
      setFilteredVentas(response.data);
      setCurrentPage(1); // Reinicia la paginación al cargar nuevos datos
    } else {
      checkPermission('Ver ventas stands', 'No tienes permisos para ver ventas stands')
    }
    } catch (error) {
      console.error("Error fetching active ventas:", error);
    }
  };

  const fetchInactiveVentas = async () => {
    try {
      if (hasViewPermission) {
      const response = await axios.get("https://api.voluntariadoayuvi.com/ventas/stands/inactivas");
      setFilteredVentas(response.data);
      setCurrentPage(1); // Reinicia la paginación al cargar nuevos datos
    } else {
      checkPermission('Ver ventas stands', 'No tienes permisos para ver ventas stands')
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
  
    // Seleccionar el primer producto válido
    const primerProductoValido = productosValidos[0];
  
    // Crear un nuevo pago asociado al primer producto válido
    const nuevoPago = {
      idTipoPago: "", // Campo vacío para que el usuario lo seleccione
      monto: 0.0,
      correlativo: "",
      imagenTransferencia: "",
      estado: 1,
      idProducto: primerProductoValido.idProducto, // Asociar al primer producto válido
    };
  
    // Agregar el pago a la lista de pagos
    setTiposPagos((prevPagos) => [...prevPagos, nuevoPago]);
  };
  
  const handlePagoChange = (index, field, value) => {
    const nuevosPagos = [...tiposPagos];

    if (field === "idProducto") {
      // Si se cambia el producto, asegúrate de que el idProducto se actualice
      nuevosPagos[index].idProducto = value;
    }
  
    if (field === "idTipoPago" && parseInt(value) === 5) {
      // Si el tipo de pago es "solicitado", asignar valores predeterminados
      nuevosPagos[index].imagenTransferencia = "solicitado";
      nuevosPagos[index].correlativo = "NA";
    }
  
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

  const calcularTotales = (detallesVenta, pagos, donacion) => {
    let subtotal = 0;
    let totalPagado = 0;

    for (const detalle of detallesVenta) {
      subtotal += detalle.subTotal || 0;
    }

    for (const pago of pagos) {
      totalPagado += pago.monto || 0;
    }

    // Total de la venta = subtotal + donación (o 0 si no aplica)
    const totalVenta = subtotal + (donacion || 0);

    return { subtotal, totalPagado, totalVenta };
  };

  const handleCreateVenta = async () => {
    try {
      // Validar que se haya seleccionado un voluntario si es requerido
      if (standSeleccionado?.idStand === 1 && standSeleccionado?.idTipoStands === 1 && !standSeleccionado?.voluntarioAsignado) {
        alert("Debe seleccionar un voluntario para este stand.");
        return; // Detener la ejecución si no se ha seleccionado un voluntario
      }

      if (standSeleccionado?.idTipoStands === 2 && !standSeleccionado?.voluntarioAsignado) {
        alert("Debe seleccionar un voluntario para este stand.");
        return; // Detener la ejecución si no se ha seleccionado un voluntario
      }
  
      // Validar y calcular los subtotales de los productos
      const detallesVentaValidos = detallesVenta
        .filter((detalle) => detalle.cantidad > 0 && detalle.estado !== 0) // Solo productos válidos
        .map((detalle) => {
          const isDonation = tiposPagos.some(
            (pago) => pago.idProducto === detalle.idProducto && pago.monto === 0 // Verificar si es una donación
          );

          // Si es donación, establecer subtotal como 0, de lo contrario calcular normalmente
          const subTotal = isDonation ? 0 : detalle.cantidad * detalle.precio;

          return {
            ...detalle,
            subTotal, // Asignar el subtotal calculado
            donacion: detalle.donacion || newVenta.donacion, // Asignar la donación
            idVoluntario:
              standSeleccionado?.idStand === 1 || voluntarios.length > 0
                ? voluntarioStandSeleccionado || voluntarioGlobalSeleccionado
                : null, // Asignar el voluntario si aplica
            idStand: detalle.idStand || standSeleccionado?.idStand, // Asignar el stand seleccionado
          };
        });
  
      // Calcular el subtotal de los productos y el total de la venta
      const subtotal = detallesVentaValidos.reduce((sum, detalle) => sum + detalle.subTotal, 0);
      const totalVenta = subtotal + (newVenta.donacion || 0); // Sumar la donación al subtotal
  
      // Actualizar newVenta con el total calculado
      setNewVenta({ ...newVenta, totalVenta });
  
     // Validar que la suma de los montos de los pagos coincida con el total calculado
    const totalPagado = tiposPagos.reduce((sum, pago) => sum + (pago.monto || 0), 0);
    if (totalPagado !== totalVenta) {
      alert(
        `La suma de los pagos (Q${totalPagado.toFixed(
          2
        )}) no coincide con el total de la venta (Q${totalVenta.toFixed(2)}).`
      );
      return;
    }
  
       // Validar los pagos
      const pagosValidados = tiposPagos.map((pago) => {
        if (!pago.idTipoPago || pago.monto < 0 || !pago.idProducto) {
          throw new Error("Cada pago debe tener un tipo, monto válido y producto asociado.");
        }

        // Validar lógica específica para el tipo de pago
        if ([1, 2, 4].includes(pago.idTipoPago)) {
          // Validar correlativo e imagen para estos tipos de pago
          if (!pago.correlativo || !pago.imagenTransferencia) {
            throw new Error(
              `El tipo de pago ${pago.idTipoPago} requiere correlativo e imagen.`
            );
          }
          return {
            ...pago,
            correlativo: pago.correlativo,
            imagenTransferencia: pago.imagenTransferencia,
          };
        } else if (pago.idTipoPago === 5) {
          // Manejar tipo de pago solicitado
          return {
            ...pago,
            correlativo: "NA",
            imagenTransferencia: "solicitado",
          };
        } else if (pago.idTipoPago === 3) {
          // Manejar tipo de pago en efectivo
          return {
            ...pago,
            correlativo: "NA",
            imagenTransferencia: "efectivo",
          };
        }

        return {
          ...pago,
          correlativo: pago.correlativo || "NA", // Valores por defecto
          imagenTransferencia: pago.imagenTransferencia || "efectivo", // Valores por defecto
        };
      });
  
      // Construir los datos de la venta para enviar al backend
      const ventaData = {
        venta: { ...newVenta, totalVenta, idTipoPublico: newVenta.idTipoPublico ? parseInt(newVenta.idTipoPublico) : null }, // Incluye la donación y el total
        detalles: detallesVentaValidos, // Incluye los subtotales y donaciones
        pagos: pagosValidados, // Pagos validados con sus requisitos
        idVoluntario: standSeleccionado?.idStand === 1 ? (voluntarioStandSeleccionado || voluntarioGlobalSeleccionado) : null, // Asegurarse de tener un voluntario si el idStand es 1
      };
  
      // Enviar los datos al backend
      const response = await axios.post("https://api.voluntariadoayuvi.com/ventas/create/stands/completa", ventaData);
      if (response.status === 201) {
        const bitacoraData = {
          descripcion: "Nueva venta de stands creada",
          idCategoriaBitacora: 19, // ID de categoría para creación
          idUsuario: idUsuario,
          fechaHora: new Date()
      };
      await axios.post("https://api.voluntariadoayuvi.com/bitacora/create", bitacoraData);
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
      donacion: 0,
    });
    setDetallesVenta([]); // Limpia los detalles
    setTiposPagos([]); // Limpia los pagos
    setIsEditMode(false); // Cambia a modo creación
    setShowDetailsModal(true);
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`https://api.voluntariadoayuvi.com/ventas/update/${id}`, { estado: nuevoEstado });
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
          onClick={() => {
            if (checkPermission('Crear venta stand', 'No tienes permisos para crear venta stand')) {
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
        <Table striped bordered hover responsive className="mt-3" style={{textAlign: "center", borderRadius: "20px",
            overflow: "hidden",}} >
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
                    <td>{venta.tipo_publico?.nombreTipo || "N/A"}</td>
                    <td>{venta.estado === 1 ? "Activo" : "Inactivo"}</td>
                    <td>
                      <FaEye
                        style={{
                          color: "#007AC3",
                          cursor: "pointer",
                          marginRight: "10px",
                          fontSize: "20px",
                        }}
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
                      title="Editar Venta"
                      onClick={() => {
                        if (checkPermission('Editar venta stand', 'No tienes permisos para editar venta stand')) {
                          //console.log("Datos de la venta a editar:", JSON.stringify(venta, null, 2));
                          handleEditVenta(venta.idVenta);
                        }
                      }}
                    />
                    {venta.estado ? (
                        <FaToggleOn
                          style={{
                            color: "#30c10c",
                            cursor: "pointer",
                            marginLeft: "10px",
                            fontSize: "20px",
                          }}
                          title="Inactivar"
                          onClick={() => {
                            if (checkPermission('Desactivar venta stand', 'No tienes permisos para desactivar venta stand')) {
                              toggleEstado(venta.idVenta, venta.estado)
                            }
                          }}
                        />
                      ) : (
                        <FaToggleOff
                          style={{
                            color: "#e10f0f",
                            cursor: "pointer",
                            marginLeft: "10px",
                            fontSize: "20px",
                          }}
                          title="Activar"
                          onClick={() => {
                            if (checkPermission('Activar venta stand', 'No tienes permisos para activar venta stand')) {
                              toggleEstado(venta.idVenta, venta.estado)
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
                      {detalle.voluntario ? (
                        <div>
                          <p><strong>Nombre:</strong> {detalle.voluntario.persona?.nombre || "N/A"}</p>
                          <p><strong>Teléfono:</strong> {detalle.voluntario.persona?.telefono || "N/A"}</p>
                          <p><strong>Domicilio:</strong> {detalle.voluntario.persona?.domicilio || "N/A"}</p>
                          <p><strong>Código QR:</strong> {detalle.voluntario.codigoQR || "N/A"}</p>
                        </div>
                      ) : (
                        <p>No hay información del voluntario.</p>
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
            <Modal show={showDetailsModal} onHide={handleCloseDetailsModal}>
                <Modal.Header closeButton>
                  <Modal.Title>{isEditMode ? "Editar Venta" : "Crear Venta"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Selección del tipo de público */}
                    <Form.Group>
                    <Form.Label>Seleccionar Tipo de Público</Form.Label>
                    <Form.Control
                        as="select"
                        value={isEditMode ? ventaEditada.venta?.idTipoPublico || "" : newVenta.idTipoPublico || ""}
                        onChange={(e) => {
                          const idTipoPublico = e.target.value ? parseInt(e.target.value) : "";
                          if (isEditMode) {
                            setVentaEditada((prev) => ({
                              ...prev,
                              venta: { ...prev.venta, idTipoPublico },
                            }));
                          } else {
                            setNewVenta((prev) => ({
                              ...prev,
                              idTipoPublico,
                            }));
                          }
                        }}
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
                        value={standSeleccionado?.idStand || ""}
                        onChange={(e) => {
                        const standSeleccionado = stands.find(
                            (stand) => stand.idStand === parseInt(e.target.value)
                        );
                        if (standSeleccionado) {
                            setStandSeleccionado(standSeleccionado);
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
                            value={voluntarioGlobalSeleccionado || ""}
                            onChange={(e) => {
                              const voluntarioSeleccionado = voluntarioVirtual.find(
                                (voluntario) => voluntario.idVoluntario === parseInt(e.target.value)
                              );
                              setVoluntarioGlobalSeleccionado(voluntarioSeleccionado?.idVoluntario || null);
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
                              value={voluntarioStandSeleccionado || ""}
                              onChange={(e) => {
                                const voluntarioSeleccionado = voluntarios.find(
                                  (voluntario) => voluntario.inscripcionEvento?.voluntario?.idVoluntario === parseInt(e.target.value)
                                );
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
                        value={isEditMode ? ventaEditada.venta?.donacion || 0 : newVenta.donacion || 0}
                        onChange={(e) => {
                          const nuevaDonacion = parseFloat(e.target.value) || 0;

                          if (isEditMode) {
                            setVentaEditada((prev) => ({
                              ...prev,
                              venta: { ...prev.venta, donacion: nuevaDonacion },
                            }));

                            // Actualizar los detalles para reflejar la nueva donación
                            setDetallesVenta((prevDetalles) =>
                              prevDetalles.map((detalle) => ({
                                ...detalle,
                                donacion: nuevaDonacion,
                              }))
                            );
                          } else {
                            setNewVenta((prev) => ({ ...prev, donacion: nuevaDonacion }));
                          }
                          actualizarTotales();
                        }}
                      />
                    </Form.Group>
                    {/* Resumen de pagos */}
                    <h5>Resumen de Pagos</h5>
                      <Table>
                        <tbody>
                          <tr>
                            <td><strong>Subtotal:</strong></td>
                            <td>Q{resumenPagos.subtotal.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td><strong>Donación:</strong></td>
                            <td>Q{resumenPagos.donacion.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td><strong>Total de la Venta:</strong></td>
                            <td>Q{resumenPagos.totalVenta.toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </Table>
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
                            value={pago.idProducto || detallesVenta.find((d) => d.cantidad > 0)?.idProducto || ""}
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
                            {/* <Form.Text muted>
                            {tiposPagos.some((pago) => pago.idTipoPago === 5)
                                ? "Los valores pueden ser 0 si es un pago solicitado."
                                : "Todos los valores deben coincidir con el total de la venta."}
                            </Form.Text> */}
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
                <Button
                    onClick={isEditMode ? handleUpdateVenta : handleCreateVenta}
                  >
                    {isEditMode ? "Actualizar Venta" : "Crear Venta"}
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
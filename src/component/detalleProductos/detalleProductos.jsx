import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl } from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { getUserDataFromToken } from '../../utils/jwtUtils';

function DetalleProductosComponent() {
  const [detalles, setDetalles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productos, setProductos] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [editingDetalle, setEditingDetalle] = useState(null);
  const [newDetalle, setNewDetalle] = useState({ nombreProducto: "", cantidad: "", nombreSede: "", estado: 1, descripcion: "" });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDetalles, setFilteredDetalles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showPermissionModal, setShowPermissionModal] = useState(false); // Nuevo estado
  const [permissionMessage, setPermissionMessage] = useState('');
  const [permissions, setPermissions] = useState({});
  const [hasViewPermission, setHasViewPermission] = useState(false);
  const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);

  const sedeId = getUserDataFromToken(localStorage.getItem("token"))?.idSede;

  const idUsuario = getUserDataFromToken(localStorage.getItem("token"))?.idUsuario;


  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/usuarios/permisos', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPermissions(response.data.permisos || {});

        const hasPermission =
          response.data.permisos['Ver detalles de productos']

        setHasViewPermission(hasPermission);
        setIsPermissionsLoaded(true);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermissions();
  }, []);

  useEffect(() => {
    if (isPermissionsLoaded) {
      if (hasViewPermission) {
        fetchDetalles();
        fetchProductos();
        fetchSedes();
      } else {
        checkPermission('Ver detalles de productos', 'No tienes permisos para ver detalles de productos');
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

  const fetchDetalles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/detalle_productos");
      setDetalles(response.data || []);
      setFilteredDetalles(response.data || []);
    } catch (error) {
      console.error("Error fetching detalles:", error);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/productos");
      setProductos(response.data || []);
    } catch (error) {
      console.error("Error fetching productos:", error);
    }
  };

  const fetchSedes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/sedes");
      setSedes(response.data || []);
    } catch (error) {
      console.error("Error fetching sedes:", error);
    }
  };


  const fetchActiveDetalleProductos = async () => {
    try {
      if (hasViewPermission) {
        const response = await axios.get("http://localhost:5000/detalle_productos/activos");
        setDetalles(response.data || []); // Aquí se usa setDetalles
        setFilteredDetalles(response.data || []); // Aquí se usa setFilteredDetalles
      } else {
        checkPermission('Ver detalles de productos', 'No tienes permisos para ver detalles de productos')
      }
    } catch (error) {
      console.error("Error fetching active productos:", error);
    }
  };

  const fetchInactiveDetalleProductos = async () => {
    try {
      if (hasViewPermission) {
        const response = await axios.get("http://localhost:5000/detalle_productos/inactivos");
        setDetalles(response.data || []); // Aquí se usa setDetalles
        setFilteredDetalles(response.data || []); // Aquí se usa setFilteredDetalles
      } else {
        checkPermission('Ver detalles de productos', 'No tienes permisos para ver detalles de productos')
      }
    } catch (error) {
      console.error("Error fetching inactive productos:", error);
    }
  };


  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = detalles.filter((detalle) => {
      const nombreProducto = detalle.producto?.nombreProducto?.toLowerCase() || "";
      const nombreSede = detalle.sede?.nombreSede?.toLowerCase() || "";

      // Busca en el nombre del producto o de la sede
      return (
        nombreProducto.includes(value) ||
        nombreSede.includes(value)
      );
    });

    setFilteredDetalles(filtered);
    setCurrentPage(1); // Reinicia a la primera página
  };

  const handleShowModal = (detalle = null) => {
    setEditingDetalle(detalle);
    setNewDetalle(detalle || { nombreProducto: "", cantidad: "", idSede: sedeId || "", estado: 1, descripcion: "" });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDetalle(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDetalle({ ...newDetalle, [name]: value });
  };

  const logBitacora = async (descripcion, idCategoriaBitacora) => {
    const bitacoraData = {
      descripcion,
      idCategoriaBitacora,
      idUsuario,
      fechaHora: new Date()
    };

    try {
      await axios.post("http://localhost:5000/bitacora/create", bitacoraData);
    } catch (error) {
      console.error("Error logging bitacora:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("▶ Iniciando creación/actualización de detalle de producto...");
    console.log("newDetalle recibido:", newDetalle);

    // Convertir idProducto a número para la búsqueda
    const idProductoNumber = Number(newDetalle.idProducto);
    console.log("🔍 ID del producto convertido:", idProductoNumber);


    let nombreProducto = "Producto desconocido"; // Valor por defecto

    // Buscar el producto por ID
    console.log("📦 Lista de productos disponibles:", productos);
    const productoEncontrado = productos.find(p => p.idProducto == idProductoNumber);
    if (productoEncontrado) {
      nombreProducto = productoEncontrado.nombreProducto;
    }

    console.log("🔍 Producto encontrado:", productoEncontrado);
    console.log("📌 Nombre del Producto asignado:", nombreProducto);

    try {
      if (editingDetalle) {

        console.log("✏ Actualizando detalle existente...");

        // Obtener la cantidad actual antes de la actualización
        const cantidadAnterior = editingDetalle.cantidad;
        const cantidadNueva = Number(newDetalle.cantidad);
        const diferenciaCantidad = cantidadNueva - cantidadAnterior;

        console.log(`🔢 Cantidad anterior: ${cantidadAnterior}, Nueva cantidad: ${cantidadNueva}, Diferencia: ${diferenciaCantidad}`);

        const descripcionBitacora = `Detalle de producto "${nombreProducto}" (ID de Registro: ${editingDetalle.idDetalleProductos}) actualizado. 
        - Cantidad anterior: ${cantidadAnterior}, Nueva cantidad: ${cantidadNueva} (Cambio: ${diferenciaCantidad > 0 ? '+' : ''}${diferenciaCantidad}) 
        - Razón: ${newDetalle.descripcion}`;

        console.log("📜 Descripción de bitácora:", descripcionBitacora);

        console.log("JSON enviado para UPDATE:", JSON.stringify(newDetalle, null, 2));

        await axios.put(`http://localhost:5000/detalle_productos/update/${editingDetalle.idDetalleProductos}`, newDetalle);
        setAlertMessage("Detalle actualizado con éxito");
        logBitacora(descripcionBitacora, 3);
      } else {

        console.log("➕ Creando nuevo detalle de producto...");
        console.log("JSON enviado para POST:", JSON.stringify(newDetalle, null, 2));

        await axios.post("http://localhost:5000/detalle_productos/create", newDetalle);
        setAlertMessage("Detalle creado con éxito");
        logBitacora(`Se ha creado un nuevo detalle de producto: "${nombreProducto}"`, 40);
      }
      fetchDetalles();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting detalle:", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/detalle_productos/update/${id}`, { estado: nuevoEstado });
      setAlertMessage(`Detalle ${nuevoEstado === 1 ? "activado" : "inactivado"} con éxito`);
      setShowAlert(true);
      fetchDetalles();
    } catch (error) {
      console.error("Error toggling estado:", error);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentDetalles = filteredDetalles.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredDetalles.length / rowsPerPage);

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
          style={{
            width: "100px",
            height: "40px",
          }}
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
    <div className="container mt-4">
      <h3 className="text-center mb-4" style={{ fontWeight: "bold", color: "#333" }}>
        Gestión de Detalles de Productos
      </h3>

      <InputGroup className="mb-3">
        <FormControl
          placeholder="Buscar por producto o sede..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </InputGroup>

      <div className="d-flex justify-content-start align-items-center mb-3">
        <Button
          style={{
            backgroundColor: "#007abf",
            borderColor: "#007AC3",
            padding: "5px 10px",
            width: "180px",
            marginRight: "10px",
            fontWeight: "bold",
            color: "#fff",
          }}
          onClick={() => {
            if (checkPermission('Crear detalle de producto', 'No tienes permisos para crear detalle de producto')) {
              handleShowModal();
            }
          }}
        >
          Agregar Detalle
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
          onClick={fetchActiveDetalleProductos}
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
          onClick={fetchInactiveDetalleProductos}
        >
          Inactivos
        </Button>
      </div>

      <Alert variant="success" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
        {alertMessage}
      </Alert>

      <Table sstriped
        bordered
        hover
        responsive
        className="mt-3"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          overflow: "hidden",
          marginTop: "20px",
        }}>
        <thead style={{ backgroundColor: "#007AC3", color: "#fff", textAlign: "center" }}>
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Sede</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {currentDetalles.map((detalle) => (
            <tr key={detalle.idDetalleProductos}>
              <td>{detalle.idDetalleProductos}</td>
              <td>{detalle.producto?.nombreProducto}</td>
              <td>{detalle.cantidad}</td>
              <td>{detalle.sede?.nombreSede}</td>
              <td>{detalle.estado ? "Activo" : "Inactivo"}</td>
              <td>
                <FaPencilAlt
                  style={{ cursor: "pointer", color: "#007AC3", marginRight: "10px" }}
                  onClick={() => {
                    if (checkPermission('Editar detalle de producto', 'No tienes permisos para editar detalle de producto')) {
                      handleShowModal(detalle);
                    }
                  }}
                  title="Editar"
                />
                {detalle.estado ? (
                  <FaToggleOn
                    style={{ cursor: "pointer", color: "#30c10c" }}
                    onClick={() => {
                      if (checkPermission('Desactivar detalle de producto', 'No tienes permisos para desactivar detalle de producto')) {
                        toggleEstado(detalle.idDetalleProductos, detalle.estado);
                      }
                    }}
                    title="Inactivar"
                  />
                ) : (
                  <FaToggleOff
                    style={{ cursor: "pointer", color: "#e10f0f" }}
                    onClick={() => {
                      if (checkPermission('Activar detalle de producto', 'No tienes permisos para activar detalle de producto')) {
                        toggleEstado(detalle.idDetalleProductos, detalle.estado);
                      }
                    }}
                    title="Activar"
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>



      {renderPagination()}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingDetalle ? "Editar Detalle" : "Agregar Detalle"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Producto</Form.Label>
              <Form.Control
                as="select"
                name="idProducto"
                value={newDetalle.idProducto}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un producto</option>
                {productos.map((producto) => (
                  <option key={producto.idProducto} value={producto.idProducto}>
                    {producto.nombreProducto}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                name="cantidad"
                value={newDetalle.cantidad}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Sede</Form.Label>
              <Form.Control
                as="select"
                name="idSede"
                value={newDetalle.idSede}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una sede</option>
                {sedes.map((sede) => (
                  <option key={sede.idSede} value={sede.idSede}>
                    {sede.nombreSede}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            {editingDetalle && (
              <Form.Group controlId="descripcion">
                <Form.Label>Razón del Cambio</Form.Label>
                <Form.Control
                  as="textarea"
                  name="descripcion"
                  value={newDetalle.descripcion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            )}
            <Form.Group>
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                name="estado"
                value={newDetalle.estado}
                onChange={handleChange}
              >
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
              </Form.Control>
            </Form.Group>
            <Button type="submit" style={{ backgroundColor: "#007abf", color: "#fff", marginTop: "10px" }}>
              {editingDetalle ? "Actualizar" : "Crear"}
            </Button>
          </Form>
        </Modal.Body>
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

export default DetalleProductosComponent;

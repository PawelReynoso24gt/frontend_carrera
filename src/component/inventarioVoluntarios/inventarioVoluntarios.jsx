import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, InputGroup, FormControl } from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff, FaEye } from "react-icons/fa";

function DetalleStandsVoluntarios() {
  const [detalleStands, setDetalleStands] = useState([]);
  const [filteredDetalleStands, setFilteredDetalleStands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingDetalleStand, setEditingDetalleStand] = useState(null);
  const [newDetalleStand, setNewDetalleStand] = useState({
    cantidad: "",
    estado: 1,
    idProducto: "",
    idStand: "",
  });
  const [productos, setProductos] = useState([]);
  const [stands, setStands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState("");
  const [isProductSearched, setIsProductSearched] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
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
          response.data.permisos['Ver inventario de voluntarios']

        setHasViewPermission(hasPermission);
        setIsPermissionsLoaded(true);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }


    };


    fetchPermissions();
    fetchProductos();
    fetchStands();
  }, []);

  useEffect(() => {
    if (isPermissionsLoaded) {
      if (hasViewPermission) {
        fetchDetalleStands();
      } else {
        //console.log(hasViewPermission)
        //Ver permisos de voluntarios
        checkPermission('Ver inventario de voluntarios', 'No tienes permisos para ver inventario de voluntarios');
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

  const fetchDetalleStands = async () => {
    try {
      // Obtén los detalles de stands
      const response = await axios.get("http://localhost:5000/detalle_stands");
      const allDetalleStands = response.data;

      // Obtén los stands
      const standsResponse = await axios.get("http://localhost:5000/stand");
      const allStands = standsResponse.data;

      // Filtrar los stands que cumplen con la condición
      const filteredStands = allStands.filter(
        (stand) => stand.nombreStand === "Virtual" && stand.idStand === 1
      );

      // Filtrar los detalles que correspondan al stand filtrado
      const filteredDetalleStands = allDetalleStands.filter((detalle) =>
        filteredStands.some((stand) => stand.idStand === detalle.idStand)
      );

      setDetalleStands(filteredDetalleStands);
      setFilteredDetalleStands(filteredDetalleStands);
    } catch (error) {
      console.error("Error fetching detalle stands:", error);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/productos");
      setProductos(response.data);
    } catch (error) {
      console.error("Error fetching productos:", error);
    }
  };

  const fetchStands = async () => {
    try {
      const response = await axios.get("http://localhost:5000/stand");

      // Filtramos los stands que cumplen con las condiciones
      const filteredStands = response.data.filter(
        (stand) => stand.nombreStand === "Virtual" && stand.idStand === 1
      );

      setStands(filteredStands);
    } catch (error) {
      console.error("Error fetching stands:", error);
    }
  };

  const fetchActiveDetalleStands = async () => {
    try {
      let allActiveDetalleStands = [];
      if (hasViewPermission) {
        const response = await axios.get("http://localhost:5000/detalle_stands/activos");
        allActiveDetalleStands = response.data;
      } else {
        checkPermission('Ver inventario de voluntarios', 'No tienes permisos para ver inventario de voluntarios');
      }
      // Obtener los stands
      const standsResponse = await axios.get("http://localhost:5000/stand");
      const allStands = standsResponse.data;

      // Filtrar los stands que cumplen con la condición
      const filteredStands = allStands.filter(
        (stand) => stand.nombreStand === "Virtual" && stand.idStand === 1
      );

      // Filtrar los detalles que corresponden al stand filtrado
      const filteredDetalleStands = allActiveDetalleStands.filter((detalle) =>
        filteredStands.some((stand) => stand.idStand === detalle.idStand)
      );

      setDetalleStands(filteredDetalleStands);
      setFilteredDetalleStands(filteredDetalleStands);
    } catch (error) {
      console.error("Error fetching active detalle stands:", error);
    }
  };

  const fetchInactiveDetalleStands = async () => {
    try {
      let allInactiveDetalleStands = [];
      if (hasViewPermission) {
        const response = await axios.get("http://localhost:5000/detalle_stands/inactivos");
        allInactiveDetalleStands = response.data;
      } else {
        checkPermission('Ver inventario de voluntarios', 'No tienes permisos para ver inventario de voluntarios');
      }
      // Obtener los stands
      const standsResponse = await axios.get("http://localhost:5000/stand");
      const allStands = standsResponse.data;

      // Filtrar los stands que cumplen con la condición
      const filteredStands = allStands.filter(
        (stand) => stand.nombreStand === "Virtual" && stand.idStand === 1
      );

      // Filtrar los detalles que corresponden al stand filtrado
      const filteredDetalleStands = allInactiveDetalleStands.filter((detalle) =>
        filteredStands.some((stand) => stand.idStand === detalle.idStand)
      );

      setDetalleStands(filteredDetalleStands);
      setFilteredDetalleStands(filteredDetalleStands);
    } catch (error) {
      console.error("Error fetching inactive detalle stands:", error);
    }
  };


  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = detalleStands.filter((detalle) => {
      const producto = productos.find((p) => p.idProducto === detalle.idProducto);
      const stand = stands.find((s) => s.idStand === detalle.idStand);

      const productoNombre = producto ? producto.nombreProducto.toLowerCase() : "";
      const standNombre = stand ? stand.nombreStand.toLowerCase() : "";

      return (
        detalle.cantidad.toString().includes(value) ||
        productoNombre.includes(value) ||
        standNombre.includes(value)
      );
    });

    setFilteredDetalleStands(filtered);
    setCurrentPage(1);

    // Verificar si se encuentra un producto y habilitar el botón
    const matchingProducts = productos.filter((producto) =>
      producto.nombreProducto.toLowerCase().includes(value)
    );

    if (matchingProducts.length > 0) {
      setSelectedProduct(matchingProducts[0]); // Seleccionar el primer producto relevante
      setIsProductSearched(true); // Habilitar el botón
    } else {
      setSelectedProduct(null); // No hay producto seleccionado
      setIsProductSearched(false); // Deshabilitar el botón
    }
  };

  const handleShowProductModal = async (idProducto) => {
    if (!idProducto) return;

    try {
      const response = await axios.get(`http://localhost:5000/productos/${idProducto}`);
      setSelectedProduct(response.data); // Actualizar con datos completos
      setShowProductModal(true); // Mostrar el modal
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };


  const handleShowModal = (detalleStand = null) => {
    setEditingDetalleStand(detalleStand);
    setNewDetalleStand(
      detalleStand
        ? {
          ...detalleStand,
          idStand: "1", // Siempre establece idStand como 1 al editar
        }
        : {
          cantidad: "",
          estado: 1,
          idProducto: "",
          idStand: "1", // Siempre establece idStand como 1 al agregar
        }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDetalleStand(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDetalleStand({ ...newDetalleStand, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedProduct = productos.find(
        (producto) => producto.idProducto === parseInt(newDetalleStand.idProducto)
      );

      if (selectedProduct && newDetalleStand.cantidad > selectedProduct.cantidad) {
        setMessageModalContent(`Stock insuficiente. Solo quedan ${selectedProduct.cantidad} unidades.`);
        setShowMessageModal(true);
        return;
      }

      // Siempre asegura que idStand sea 1
      const standData = { ...newDetalleStand, idStand: "1" };

      if (editingDetalleStand) {
        await axios.put(
          `http://localhost:5000/detalle_stands/update/${editingDetalleStand.idDetalleStands}`,
          standData
        );
        setMessageModalContent("Información actualizada con éxito");
      } else {
        await axios.post("http://localhost:5000/detalle_stands/create", standData);
        setMessageModalContent("Producto creado con éxito");
      }

      fetchDetalleStands();
      setShowMessageModal(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting detalle stand:", error);

      if (error.response && error.response.data && error.response.data.message) {
        setMessageModalContent(error.response.data.message);
      } else {
        setMessageModalContent("Ocurrió un error al procesar la solicitud.");
      }
      setShowMessageModal(true);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/detalle_stands/update/${id}`, { estado: nuevoEstado });
      fetchDetalleStands();
      setMessageModalContent(
        `Producto ${nuevoEstado === 1 ? "activado" : "inactivado"} con éxito`
      );
      setShowMessageModal(true);
    } catch (error) {
      console.error("Error toggling estado:", error);
      setMessageModalContent("Error al intentar cambiar el estado.");
      setShowMessageModal(true);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentDetalleStands = filteredDetalleStands.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredDetalleStands.length / rowsPerPage);

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
    <>
      {/* Modal para mostrar mensajes */}
      <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Información</Modal.Title>
        </Modal.Header>
        <Modal.Body>{messageModalContent}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowMessageModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para ver resultados de la busqueda del producto */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct ? (
            <div>
              <p><strong>Nombre:</strong> {selectedProduct.nombreProducto}</p>
              <p><strong>Descripción:</strong> {selectedProduct.descripcion}</p>
              <p><strong>Precio:</strong> Q{selectedProduct.precio}</p>
              <p><strong>Categoría:</strong> {selectedProduct.categoria?.nombreCategoria}</p>
              <p><strong>Detalles de Stands:</strong></p>
              <ul>
                {selectedProduct.detallesStands.map((stand) => (
                  <li key={stand.idDetalleStands}>
                    {stand.cantidad} unidades en {stand.stand?.nombreStand}
                  </li>
                ))}
              </ul>
              <p><strong>Detalles de Sedes:</strong></p>
              <ul>
                {selectedProduct.detalle_productos.map((detalle) => (
                  <li key={detalle.idDetalleProductos}>
                    {detalle.cantidad} unidades en {detalle.sede?.nombreSede}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No hay información disponible.</p>
          )}
        </Modal.Body>
      </Modal>

      {/* Resto del contenido */}
      <div className="row justify-content-center" style={{marginBottom: "20px" }}>
        <div className="col-12 text-center">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333", textAlign: "center" }}>
            Inventario de voluntarios
          </h3>
        </div>
      </div>


      <div
        className="container mt-4"
        style={{
          maxWidth: "100%",
          margin: "0 auto",
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >

        <div className="d-flex align-items-center mb-3">
          <InputGroup style={{ flex: 1, marginRight: "10px" }}>
            <FormControl
              placeholder="Buscar por cantidad, producto o stand..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>

        </div>

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
              if (checkPermission('Crear inventario voluntarios', 'No tienes permisos para crear inventario voluntarios')) {
                handleShowModal();
              }
            }}
          >
            Agregar
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
            onClick={fetchActiveDetalleStands}
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
            onClick={fetchInactiveDetalleStands}
          >
            Inactivos
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
            borderRadius: "8px",
            marginTop: "20px",
          }}
        >
          <thead style={{ backgroundColor: "#007AC3", color: "#fff", textAlign: "center" }}>
            <tr>
              <th style={{ textAlign: "center" }}>ID</th>
              <th style={{ textAlign: "center" }}>Cantidad</th>
              <th style={{ textAlign: "center" }}>Producto</th>
              <th style={{ textAlign: "center" }}>Stand</th>
              <th style={{ textAlign: "center" }}>Estado</th>
              <th style={{ textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentDetalleStands.map((detalle) => (
              <tr key={detalle.idDetalleStands}>
                <td style={{ textAlign: "center" }}>{detalle.idDetalleStands}</td>
                <td style={{ textAlign: "center" }}>{detalle.cantidad}</td>
                <td style={{ textAlign: "center" }}>
                  {productos.find((producto) => producto.idProducto === detalle.idProducto)?.nombreProducto ||
                    "Desconocido"}
                </td>
                <td style={{ textAlign: "center" }}>
                  {stands.find((stand) => stand.idStand === detalle.idStand)?.nombreStand || "Desconocido"}
                </td>
                <td style={{ textAlign: "center" }}>
                  {detalle.estado === 1 ? "Activo" : "Inactivo"}
                </td>
                <td style={{ textAlign: "center" }}>
                  <FaPencilAlt
                    style={{
                      color: "#007AC3",
                      cursor: "pointer",
                      marginRight: "10px",
                      fontSize: "20px",
                    }}
                    title="Editar"
                    onClick={() => {
                      if (checkPermission('Editar inventario voluntarios', 'No tienes permisos para editar inventario voluntarios')) {
                        handleShowModal(detalle);
                      }
                    }}
                  />
                  {detalle.estado ? (
                    <FaToggleOn
                      style={{
                        color: "#30c10c",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Inactivar"
                      onClick={() => {
                        if (checkPermission('Desactivar inventario voluntarios', 'No tienes permisos para desactivar inventario voluntarios')) {
                          toggleEstado(detalle.idDetalleStands, detalle.estado);
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
                        if (checkPermission('Activar inventario voluntarios', 'No tienes permisos para activar inventario voluntarios')) {
                          toggleEstado(detalle.idDetalleStands, detalle.estado);
                        }
                      }}
                    />
                  )}
                  <FaEye
                    style={{
                      color: "#007AC3",
                      cursor: "pointer",
                      marginLeft: "10px",
                      fontSize: "20px",
                    }}
                    title="Ver detalles"
                    onClick={() => handleShowProductModal(detalle.idProducto)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {renderPagination()}
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#007AC3", color: "#fff" }}
        >
          <Modal.Title>
            {editingDetalleStand ? "Editar Detalle Stand" : "Agregar Detalle Stand"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="cantidad">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                name="cantidad"
                value={newDetalleStand.cantidad}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="idProducto">
              <Form.Label>Producto</Form.Label>
              <Form.Control
                as="select"
                name="idProducto"
                value={newDetalleStand.idProducto}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar Producto</option>
                {productos.map((producto) => (
                  <option key={producto.idProducto} value={producto.idProducto}>
                    {producto.nombreProducto}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            {/* Campo oculto para idStand */}
            <Form.Control type="hidden" name="idStand" value="1" onChange={handleChange} />
            <Form.Group controlId="estado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                name="estado"
                value={newDetalleStand.estado}
                onChange={handleChange}
              >
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
              </Form.Control>
            </Form.Group>
            <Button
              style={{
                backgroundColor: "#007AC3",
                borderColor: "#007AC3",
                padding: "5px 10px",
                width: "100%",
                fontWeight: "bold",
                color: "#fff",
              }}
              type="submit"
            >
              {editingDetalleStand ? "Actualizar" : "Crear"}
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
    </>
  );
}

export default DetalleStandsVoluntarios;

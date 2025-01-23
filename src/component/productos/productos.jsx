import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl } from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { getUserDataFromToken } from "../../utils/jwtUtils"; // token

function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [newProducto, setNewProducto] = useState({
    talla: "",
    precio: "",
    nombreProducto: "",
    descripcion: "",
    foto: "",
    cantidadMinima: "",
    cantidadMaxima: "",
    idCategoria: "",
    estado: 1,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showValidationError, setShowValidationError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
      const [showPermissionModal, setShowPermissionModal] = useState(false); // Nuevo estado
      const [permissionMessage, setPermissionMessage] = useState('');
      const [permissions, setPermissions] = useState({});

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
    fetchProductos();
    fetchCategorias();
  }, []);

  const idUsuario = getUserDataFromToken(localStorage.getItem("token"))?.idUsuario; //! usuario del token

  const checkPermission = (permission, message) => {
    if (!permissions[permission]) {
      setPermissionMessage(message);
      setShowPermissionModal(true);
      return false;
    }
    return true;
  };

  const fetchProductos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/productos");
      setProductos(response.data);
      setFilteredProductos(response.data);
    } catch (error) {
      console.error("Error fetching productos:", error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get("http://localhost:5000/categorias");
      setCategorias(response.data);
    } catch (error) {
      console.error("Error fetching categorias:", error);
    }
  };

  const fetchActiveProductos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/productos/activos");
      setProductos(response.data);
      setFilteredProductos(response.data);
    } catch (error) {
      console.error("Error fetching active productos:", error);
    }
  };

  const fetchInactiveProductos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/productos/inactivos");
      setProductos(response.data);
      setFilteredProductos(response.data);
    } catch (error) {
      console.error("Error fetching inactive productos:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = productos.filter((producto) =>
      producto.nombreProducto.toLowerCase().includes(value)
    );

    setFilteredProductos(filtered);
    setCurrentPage(1);
  };

  const handleShowModal = (producto = null) => {
    setEditingProducto(producto);
    setNewProducto(
      producto || {
        talla: "NA", // Valor por defecto
        precio: "",
        nombreProducto: "",
        descripcion: "",
        cantidadMinima: "",
        cantidadMaxima: "",
        idCategoria: "",
        estado: 1,
      }
    );
    setShowValidationError(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProducto(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProducto({ ...newProducto, foto: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "talla") {
      const regexTalla = /^(?:\d+|S|M|L|XL|XXL|XXXL|NA)$/;
      if (!regexTalla.test(value)) {
        setShowValidationError(true);
      } else {
        setShowValidationError(false);
      }
    }

    setNewProducto({ ...newProducto, [name]: value });
  };

  const handleKeyPressOnlyLetters = (e) => {
    const regex = /^[A-Za-záéíóúÁÉÍÓÚÑñ\s]*$/;

    if (!regex.test(e.key)) {
      e.preventDefault();
      setShowValidationError(true);
    } else {
      setShowValidationError(false);
    }
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

    // Establecer valor por defecto de "NA" para talla si está vacío
    const talla = newProducto.talla.trim() === "" ? "NA" : newProducto.talla;

    try {
      const formData = new FormData();
      formData.append("talla", talla);
      formData.append("precio", parseFloat(newProducto.precio));
      formData.append("nombreProducto", newProducto.nombreProducto);
      formData.append("descripcion", newProducto.descripcion);
      formData.append("cantidadMinima", parseInt(newProducto.cantidadMinima, 10));
      formData.append("cantidadMaxima", parseInt(newProducto.cantidadMaxima, 10));
      formData.append("idCategoria", parseInt(newProducto.idCategoria, 10));
      formData.append("estado", parseInt(newProducto.estado, 10));
      
      if (newProducto.foto && typeof newProducto.foto !== "string") {
        formData.append("foto", newProducto.foto);
      }      
  
      if (editingProducto) {
        await axios.put(`http://localhost:5000/productos/${editingProducto.idProducto}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setAlertMessage("Producto actualizado con éxito");
        await logBitacora(`Producto ${newProducto.nombreProducto} actualizado`, 12);
      } else {
        await axios.post("http://localhost:5000/productos", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setAlertMessage("Producto creado con éxito");
        await logBitacora(`Producto ${newProducto.nombreProducto} creado`, 4);
      }
      fetchProductos();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting producto:", error.response?.data || error);
    }
  };
  

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/productos/estado/${id}`, { estado: nuevoEstado });
      fetchProductos();
      setAlertMessage(
        `Producto ${nuevoEstado === 1 ? "activado" : "inactivado"} con éxito`
      );
      setShowAlert(true);
    } catch (error) {
      console.error("Error toggling estado:", error);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentProductos = filteredProductos.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredProductos.length / rowsPerPage);

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
 <div className="row justify-content-center" style={{marginBottom: "20px" }}>
        <div className="col-12 text-center">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333", textAlign: "center" }}>
            Gestión de Productos
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
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar producto por nombre..."
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
              if (checkPermission('Crear producto', 'No tienes permisos para crear producto')) {
                handleShowModal();
              }
            }}
          >
            Agregar Producto
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
            onClick={fetchActiveProductos}
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
            onClick={fetchInactiveProductos}
          >
            Inactivos
          </Button>
        </div>

        <Alert
          variant="success"
          show={showAlert}
          onClose={() => setShowAlert(false)}
          dismissible
          style={{ marginTop: "20px", fontWeight: "bold" }}
        >
          {alertMessage}
        </Alert>

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
            marginTop: "20px",
          }}
        >
          <thead style={{ backgroundColor: "#007AC3", color: "#fff", textAlign: "center" }}>
            <tr>
              <th>ID</th>
              <th>Nombre Producto</th>
              <th>Talla</th>
              <th>Precio</th>
              <th>Descripción</th>
              <th>Foto</th>
              <th>Cantidad Mínima</th>
              <th>Cantidad Máxima</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center" }}>
            {currentProductos.map((producto) => (
              <tr key={producto.idProducto}>
                <td>{producto.idProducto}</td>
                <td>{producto.nombreProducto}</td>
                <td>{producto.talla}</td>
                <td>Q. {producto.precio}</td>
                <td>{producto.descripcion}</td>
                <td>
                  <img
                    src={`http://localhost:5000/${producto.foto}`}
                    alt={producto.nombreProducto}
                    style={{ width: "100px", height: "auto", objectFit: "cover", borderRadius: "8px" }}
                  />
                </td>
                <td>{producto.cantidadMinima}</td>
                <td>{producto.cantidadMaxima}</td>
                <td>
                  {
                    categorias.find((categoria) => categoria.idCategoria === producto.idCategoria)
                      ?.nombreCategoria || "Sin categoría"
                  }
                </td>
                <td>{producto.estado ? "Activo" : "Inactivo"}</td>
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
                      if (checkPermission('Editar producto', 'No tienes permisos para editar producto')) {
                        handleShowModal(producto);
                      }
                    }}
                  />
                  {producto.estado ? (
                    <FaToggleOn
                      style={{
                        color: "#30c10c",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Inactivar"
                      onClick={() => {
                        if (checkPermission('Desactivar producto', 'No tienes permisos para desactivar producto')) {
                          toggleEstado(producto.idProducto, producto.estado);
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
                        if (checkPermission('Activar producto', 'No tienes permisos para activar producto')) {
                          toggleEstado(producto.idProducto, producto.estado);
                        }
                      }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {renderPagination()}

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header
            closeButton
            style={{ backgroundColor: "#007AC3", color: "#fff" }}
          >
            <Modal.Title>
              {editingProducto ? "Editar Producto" : "Agregar Producto"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nombreProducto">
                <Form.Label>Nombre Producto</Form.Label>
                <Form.Control
                  type="text"
                  name="nombreProducto"
                  value={newProducto.nombreProducto}
                  onChange={handleChange}
                  onKeyPress={handleKeyPressOnlyLetters} // Validación de solo letras
                  required
                />
                {showValidationError && (
                  <Alert variant="danger" style={{ marginTop: "10px", fontWeight: "bold" }}>
                    Solamente letras
                  </Alert>
                )}
              </Form.Group>
              <Form.Group controlId="talla">
                <Form.Label>Talla</Form.Label>
                <Form.Control
                  type="text"
                  name="talla"
                  value={newProducto.talla}
                  onChange={handleChange}
                  required
                />
                {showValidationError && (
                  <Alert variant="danger" style={{ marginTop: "10px", fontWeight: "bold" }}>
                    Solamente números o las tallas: S, M, L, XL, XXL, XXXL, NA
                  </Alert>
                )}
              </Form.Group>
              <Form.Group controlId="precio">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  type="number"
                  name="precio"
                  value={newProducto.precio}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="descripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  name="descripcion"
                  value={newProducto.descripcion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group>
              <Form.Label>Foto</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
              {previewImage && (
                <div style={{ marginTop: "10px", textAlign: "center" }}>
                  <img
                    src={previewImage}
                    alt="Vista previa"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
              )}
            </Form.Group>
              <Form.Group controlId="cantidadMinima">
                <Form.Label>Cantidad Mínima</Form.Label>
                <Form.Control
                  type="number"
                  name="cantidadMinima"
                  value={newProducto.cantidadMinima}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="cantidadMaxima">
                <Form.Label>Cantidad Máxima</Form.Label>
                <Form.Control
                  type="number"
                  name="cantidadMaxima"
                  value={newProducto.cantidadMaxima}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idCategoria">
                <Form.Label>Categoría</Form.Label>
                <Form.Control
                  as="select"
                  name="idCategoria"
                  value={newProducto.idCategoria}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar Categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.idCategoria} value={categoria.idCategoria}>
                      {categoria.nombreCategoria}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newProducto.estado}
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
                {editingProducto ? "Actualizar" : "Crear"}
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
    </>
  );
}

export default Productos;

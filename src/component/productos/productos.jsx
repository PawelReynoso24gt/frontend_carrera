import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl } from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";

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

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

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
        talla: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("talla", newProducto.talla);
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
      } else {
        await axios.post("http://localhost:5000/productos", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setAlertMessage("Producto creado con éxito");
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
      await axios.put(`http://localhost:5000/productos/${id}`, { estado: nuevoEstado });
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
      <div className="row" style={{ textAlign: "center", marginBottom: "20px" }}>
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
            Gestión de Productos
          </h3>
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
            onClick={() => handleShowModal()}
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
                <td>{producto.precio}</td>
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
                    onClick={() => handleShowModal(producto)}
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
                      onClick={() => toggleEstado(producto.idProducto, producto.estado)}
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
                      onClick={() => toggleEstado(producto.idProducto, producto.estado)}
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
      </div>
    </>
  );
}

export default Productos;

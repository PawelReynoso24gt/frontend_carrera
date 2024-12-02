import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, InputGroup, FormControl } from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";

function DetalleStands() {
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

  useEffect(() => {
    fetchDetalleStands();
    fetchProductos();
    fetchStands();
  }, []);

  const fetchDetalleStands = async () => {
    try {
      const response = await axios.get("http://localhost:5000/detalle_stands");
      setDetalleStands(response.data);
      setFilteredDetalleStands(response.data);
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
      setStands(response.data);
    } catch (error) {
      console.error("Error fetching stands:", error);
    }
  };

  const fetchActiveDetalleStands = async () => {
    try {
      const response = await axios.get("http://localhost:5000/detalle_stands/activos");
      setDetalleStands(response.data);
      setFilteredDetalleStands(response.data);
    } catch (error) {
      console.error("Error fetching active detalle stands:", error);
    }
  };

  const fetchInactiveDetalleStands = async () => {
    try {
      const response = await axios.get("http://localhost:5000/detalle_stands/inactivos");
      setDetalleStands(response.data);
      setFilteredDetalleStands(response.data);
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
  };

  const handleShowModal = (detalleStand = null) => {
    setEditingDetalleStand(detalleStand);
    setNewDetalleStand(
      detalleStand || {
        cantidad: "",
        estado: 1,
        idProducto: "",
        idStand: "",
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

      if (editingDetalleStand) {
        await axios.put(
          `http://localhost:5000/detalle_stands/update/${editingDetalleStand.idDetalleStands}`,
          newDetalleStand
        );
        setMessageModalContent("Detalle Stand actualizado con éxito");
      } else {
        await axios.post("http://localhost:5000/detalle_stands/create", newDetalleStand);
        setMessageModalContent("Detalle Stand creado con éxito");
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
        `Detalle Stand ${nuevoEstado === 1 ? "activado" : "inactivado"} con éxito`
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

      {/* Resto del contenido */}
      <div className="row" style={{ textAlign: "center", marginBottom: "20px" }}>
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
            Gestión de Detalle Stands
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
            placeholder="Buscar por cantidad, producto o stand..."
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
              width: "130px",
              marginRight: "10px",
              fontWeight: "bold",
              color: "#fff",
            }}
            onClick={() => handleShowModal()}
          >
            Agregar Detalle Stand
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
                    onClick={() => handleShowModal(detalle)}
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
                      onClick={() => toggleEstado(detalle.idDetalleStands, detalle.estado)}
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
                      onClick={() => toggleEstado(detalle.idDetalleStands, detalle.estado)}
                    />
                  )}
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
            <Form.Group controlId="idStand">
              <Form.Label>Stand</Form.Label>
              <Form.Control
                as="select"
                name="idStand"
                value={newDetalleStand.idStand}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar Stand</option>
                {stands.map((stand) => (
                  <option key={stand.idStand} value={stand.idStand}>
                    {stand.nombreStand}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
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
    </>
  );
}

export default DetalleStands;

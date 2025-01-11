import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl } from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";

function DetalleProductoVoluntario() {
  const [detalles, setDetalles] = useState([]);
  const [productos, setProductos] = useState([]);
  const [voluntarios, setVoluntarios] = useState([]);
  const [filteredDetalles, setFilteredDetalles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingDetalle, setEditingDetalle] = useState(null);
  const [newDetalle, setNewDetalle] = useState({
    idProducto: "",
    idVoluntario: "",
    cantidad: "",
    estado: 1,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchDetalles();
    fetchProductos();
    fetchVoluntarios();
  }, []);

  const fetchDetalles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/detalle_productos_voluntarios");
      const data = Array.isArray(response.data) ? response.data : []; // Asegurarse de que sea un array
      setDetalles(data);
      setFilteredDetalles(data);
    } catch (error) {
      console.error("Error fetching detalles:", error);
      setDetalles([]);
      setFilteredDetalles([]);
    }
  };

  const fetchActiveProductosVol = async () => {
    try {
      const response = await axios.get("http://localhost:5000/detalle_productos_voluntarios/activos");
      setDetalles(response.data);
      setFilteredDetalles(response.data);
    } catch (error) {
      console.error("Error fetching active productos:", error);
    }
  };

  const fetchInactiveProductosVol = async () => {
    try {
      const response = await axios.get("http://localhost:5000/detalle_productos_voluntarios/inactivos");
      setDetalles(response.data);
      setFilteredDetalles(response.data);
    } catch (error) {
      console.error("Error fetching inactive productos:", error);
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

  const fetchVoluntarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/voluntarios"); // Ajusta tu endpoint si es necesario
      // Aseguramos que cada voluntario tenga acceso a su nombre desde la tabla de personas
      const data = response.data.map((voluntario) => ({
        ...voluntario,
        nombre: voluntario.persona?.nombre || "Sin nombre", // Suponiendo que la relación con la tabla persona se llama 'persona'
      }));
      setVoluntarios(data);
    } catch (error) {
      console.error("Error fetching voluntarios:", error);
      setVoluntarios([]);
    }
  };


  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (!Array.isArray(detalles)) return;

    const filtered = detalles.filter(
      (detalle) =>
        productos.find((producto) => producto.idProducto === detalle.idProducto)?.nombreProducto.toLowerCase().includes(value) ||
        voluntarios.find((voluntario) => voluntario.idVoluntario === detalle.idVoluntario)?.nombre.toLowerCase().includes(value)
    );

    setFilteredDetalles(filtered);
    setCurrentPage(1);
  };


  const handleShowModal = (detalle = null) => {
    setEditingDetalle(detalle);
    setNewDetalle(
      detalle || {
        idProducto: "",
        idVoluntario: "",
        cantidad: "",
        estado: 1,
      }
    );
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDetalle) {
        await axios.put(
          `http://localhost:5000/detalle_productos_voluntarios/update/${editingDetalle.idDetalleProductoVoluntario}`,
          newDetalle
        );
        setAlertMessage("Detalle actualizado con éxito");
      } else {
        console.log(newDetalle);
        await axios.post("http://localhost:5000/detalle_productos_voluntarios/create", newDetalle);
        setAlertMessage("Detalle creado con éxito");
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
      await axios.put(`http://localhost:5000/detalle_productos_voluntarios/update/${id}`, { estado: nuevoEstado });
      fetchDetalles();
      setAlertMessage(
        `Detalle ${nuevoEstado === 1 ? "activado" : "inactivado"} con éxito`
      );
      setShowAlert(true);
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
    <>
      <div className="row" style={{ textAlign: "center", marginBottom: "20px" }}>
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
            Gestión de Detalles de Producto Voluntario
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
            placeholder="Buscar detalle por producto o voluntario..."
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
              marginBottom: "1px",
              marginRight: "10px",
              fontWeight: "bold",
              color: "#fff",
            }}
            onClick={() => handleShowModal()}
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
            onClick={fetchActiveProductosVol}
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
            onClick={fetchInactiveProductosVol}
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
              <th>Producto</th>
              <th>Voluntario</th>
              <th>Cantidad</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center" }}>
            {currentDetalles.map((detalle) => (
              <tr key={detalle.idDetalleProductoVoluntario}>
                <td>{detalle.idDetalleProductoVoluntario}</td>
                <td>
                  {
                    productos.find((producto) => producto.idProducto === detalle.idProducto)
                      ?.nombreProducto || "Producto no encontrado"
                  }
                </td>
                <td>
                  {
                    voluntarios.find((voluntario) => voluntario.idVoluntario === detalle.idVoluntario)
                      ?.nombre || "Voluntario no encontrado"
                  }
                </td>
                <td>{detalle.cantidad}</td>
                <td>{detalle.estado ? "Activo" : "Inactivo"}</td>
                <td>
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
                      onClick={() => toggleEstado(detalle.idDetalleProductoVoluntario, detalle.estado)}
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
                      onClick={() => toggleEstado(detalle.idDetalleProductoVoluntario, detalle.estado)}
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
              {editingDetalle ? "Editar Detalle" : "Agregar Detalle"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="idProducto">
                <Form.Label>Producto</Form.Label>
                <Form.Control
                  as="select"
                  name="idProducto"
                  value={newDetalle.idProducto}
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
              <Form.Group controlId="idVoluntario">
                <Form.Label>Voluntario</Form.Label>
                <Form.Control
                  as="select"
                  name="idVoluntario"
                  value={newDetalle.idVoluntario}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar Voluntario</option>
                  {voluntarios.map((voluntario) => (
                    <option key={voluntario.idVoluntario} value={voluntario.idVoluntario}>
                      {voluntario.nombre}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="cantidad">
                <Form.Label>Cantidad</Form.Label>
                <Form.Control
                  type="number"
                  name="cantidad"
                  value={newDetalle.cantidad}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="estado">
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
                {editingDetalle ? "Actualizar" : "Crear"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default DetalleProductoVoluntario;

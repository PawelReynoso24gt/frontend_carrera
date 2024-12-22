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
  const [editingVenta, setEditingVenta] = useState(null);
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
  }, []);

  const fetchVentas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/ventas");
      setVentas(response.data);
      setFilteredVentas(response.data);
    } catch (error) {
      console.error("Error fetching ventas:", error);
    }
  };

  const fetchTiposPagos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tipospagos");
      setTiposPagos(response.data);
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
        `http://localhost:5000/detalle_ventas_voluntarios/${idVenta}`
      );
  
      console.log("JSON recibido:", response.data);
  
      // Asegurarse de que `detalleSeleccionado` sea un objeto, no un arreglo
      if (response.data && response.data.length > 0) {
        setDetalleSeleccionado(response.data[0]); // Extrae el primer elemento del arreglo
      } else {
        setDetalleSeleccionado(null);
      }
  
      setShowModal(true); // Muestra el modal después de establecer los datos
    } catch (error) {
      console.error("Error fetching detalles de venta:", error);
      setDetalleSeleccionado(null); // Asegúrate de manejar errores estableciendo nulo
      setShowModal(false); // Oculta el modal si no se obtienen datos
    }
  };  
  
  const handleCloseModal = () => {
    setDetalleSeleccionado(null);
    setShowModal(false);
  };  

  const fetchActiveVentas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/ventas/activas");
      setFilteredVentas(response.data);
      setCurrentPage(1); // Reinicia la paginación al cargar nuevos datos
    } catch (error) {
      console.error("Error fetching active ventas:", error);
    }
  };
  
  const fetchInactiveVentas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/ventas/inactivas");
      setFilteredVentas(response.data);
      setCurrentPage(1); // Reinicia la paginación al cargar nuevos datos
    } catch (error) {
      console.error("Error fetching inactive ventas:", error);
    }
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
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>Gestión de Ventas</h3>
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
                <td>{tiposPublico.find((tp) => tp.idTipoPublico === venta.idTipoPublico)?.nombreTipo || "N/A"}</td>
                <td>{venta.estado === 1 ? "Activo" : "Inactivo"}</td>
                <td>
                <FaEye
                    style={{ cursor: "pointer", marginRight: "10px", color: "#007AC3" }}
                    title="Ver Detalle"
                    onClick={() => handleViewDetails(venta.idVenta)}
                  />
                  <FaPencilAlt style={{ cursor: "pointer", marginRight: "10px" }} title="Editar" />
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
              <div>
                <h5>Información del Detalle</h5>
                <p><strong>ID Detalle:</strong> {detalleSeleccionado.idDetalleVentaVoluntario || "N/A"}</p>
                <p><strong>Cantidad:</strong> {detalleSeleccionado.cantidad || "N/A"}</p>
                <p><strong>Subtotal:</strong> Q{detalleSeleccionado.subTotal || "N/A"}</p>
                <p><strong>Donación:</strong> Q{detalleSeleccionado.donacion || "N/A"}</p>

                <h5>Información de la Venta</h5>
                <p><strong>ID Venta:</strong> {detalleSeleccionado.venta?.idVenta || "N/A"}</p>
                <p><strong>Total Venta:</strong> Q{detalleSeleccionado.venta?.totalVenta || "N/A"}</p>
                <p><strong>Fecha Venta:</strong> {detalleSeleccionado.venta?.fechaVenta || "N/A"}</p>

                <h5>Información del Producto</h5>
                <p><strong>ID Producto:</strong> {detalleSeleccionado.producto?.idProducto || "N/A"}</p>
                <p><strong>Nombre Producto:</strong> {detalleSeleccionado.producto?.nombreProducto || "N/A"}</p>
                <p><strong>Precio:</strong> Q{detalleSeleccionado.producto?.precio || "N/A"}</p>

                <h5>Información del Voluntario</h5>
                <p><strong>Nombre:</strong> {detalleSeleccionado.voluntario?.persona?.nombre || "N/A"}</p>
                <p><strong>Teléfono:</strong> {detalleSeleccionado.voluntario?.persona?.telefono || "N/A"}</p>
                <p><strong>Domicilio:</strong> {detalleSeleccionado.voluntario?.persona?.domicilio || "N/A"}</p>
                <p><strong>Código QR:</strong> {detalleSeleccionado.voluntario?.codigoQR || "N/A"}</p>

                <h5>Productos Asociados al Voluntario</h5>
                {detalleSeleccionado.voluntario?.detalle_productos_voluntarios?.map((producto, index) => (
                  <div key={index}>
                    <p><strong>ID Producto:</strong> {producto.idProducto || "N/A"}</p>
                    <p><strong>Cantidad:</strong> {producto.cantidad || "N/A"}</p>
                  </div>
                )) || <p>No hay productos asociados.</p>}
              </div>
            ) : (
              <p>No se encontraron detalles.</p>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Ventas;

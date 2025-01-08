import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl, Pagination } from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";

function Comisiones() {
  const [comisiones, setComisiones] = useState([]);
  const [filteredComisiones, setFilteredComisiones] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventos, setEventos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingComision, setEditingComision] = useState(null);
  const [detallesHorarios, setDetallesHorarios] = useState([]); // para horarios
  const [newComision, setNewComision] = useState({
    comision: "",
    descripcion: "",
    estado: 1,
    idEvento: "",
    idDetalleHorario: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchComisiones();
    fetchEventos();
    fetchDetallesHorarios();
  }, []);

  const fetchComisiones = async () => {
    try {
      const response = await axios.get("http://localhost:5000/comisiones");
      setComisiones(response.data);
      setFilteredComisiones(response.data);
    } catch (error) {
      console.error("Error fetching comisiones:", error);
    }
  };

  const fetchDetallesHorarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/detalle_horarios/comisiones"); // Endpoint para obtener todos los detalles
      setDetallesHorarios(response.data);
    } catch (error) {
      console.error("Error fetching detalle horarios:", error);
    }
  };

  const fetchEventos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/eventos");
      setEventos(response.data);
    } catch (error) {
      console.error("Error fetching eventos:", error);
    }
  };

  const fetchActiveComisiones = async () => {
    try {
      const response = await axios.get("http://localhost:5000/comisiones/activos");
      setFilteredComisiones(response.data);
    } catch (error) {
      console.error("Error fetching active comisiones:", error);
    }
  };

  const fetchInactiveComisiones = async () => {
    try {
      const response = await axios.get("http://localhost:5000/comisiones/inactivos");
      setFilteredComisiones(response.data);
    } catch (error) {
      console.error("Error fetching inactive comisiones:", error);
    }
  };

  const validateForm = () => {
    if (!newComision.comision || !newComision.descripcion || !newComision.idEvento) {
      setAlertMessage("Por favor, completa todos los campos requeridos.");
      setShowAlert(true);
      return false;
    }
    return true;
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = comisiones.filter((comision) =>
      comision.comision.toLowerCase().includes(value)
    );
    setFilteredComisiones(filtered);
    setCurrentPage(1);
  };

  const handleShowModal = (comision = null) => {
    setEditingComision(comision);
    setNewComision(
      comision || {
        comision: "",
        descripcion: "",
        estado: 1,
        idEvento: "",
        idDetalleHorario: "",
      }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingComision(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewComision({ ...newComision, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      if (editingComision) {
        await axios.put(
          `http://localhost:5000/comisiones/update/${editingComision.idComision}`,
          newComision
        );
        setAlertMessage("Comisión actualizada con éxito");
      } else {
        await axios.post("http://localhost:5000/comisiones/create", newComision);
        setAlertMessage("Comisión creada con éxito");
      }
      fetchComisiones();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting comision:", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/comisiones/update/${id}`, { estado: nuevoEstado });
      fetchComisiones();
      setAlertMessage(`Comisión ${nuevoEstado === 1 ? "activada" : "inactivada"} con éxito`);
      setShowAlert(true);
    } catch (error) {
      console.error("Error toggling estado:", error);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentComisiones = filteredComisiones.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredComisiones.length / rowsPerPage);

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
            Gestión de Comisiones
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
            placeholder="Buscar comisión por nombre..."
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
            Agregar Comisión
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
            onClick={fetchActiveComisiones}
          >
            Activas
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
            onClick={fetchInactiveComisiones}
          >
            Inactivas
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
              <th>Comisión</th>
              <th>Descripción</th>
              <th>Evento</th>
              <th>Detalle Horario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center" }}>
            {currentComisiones.map((comision) => (
              <tr key={comision.idComision}>
                <td>{comision.idComision}</td>
                <td>{comision.comision}</td>
                <td>{comision.descripcion}</td>
                <td>{eventos.find((evento) => evento.idEvento === comision.idEvento)?.nombreEvento || "No asignado"}</td>
                <td>
                  {comision.detalleHorario ? (
                    <>
                      <div>{comision.detalleHorario.cantidadPersonas} personas</div>
                        <div>
                          {comision.detalleHorario.horario
                            ? `${new Date(`1970-01-01T${comision.detalleHorario.horario.horarioInicio}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} - ${new Date(`1970-01-01T${comision.detalleHorario.horario.horarioFinal}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`
                            : "Sin horario"}
                        </div>
                      </>
                    ) : (
                      "No asignado"
                    )}
                  </td>
                <td>{comision.estado === 1 ? "Activo" : "Inactivo"}</td>
                <td>
                  <FaPencilAlt
                    style={{
                      color: "#007AC3",
                      cursor: "pointer",
                      marginRight: "10px",
                      fontSize: "20px",
                    }}
                    title="Editar"
                    onClick={() => handleShowModal(comision)}
                  />
                  {comision.estado ? (
                    <FaToggleOn
                      style={{
                        color: "#30c10c",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Inactivar"
                      onClick={() => toggleEstado(comision.idComision, comision.estado)}
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
                      onClick={() => toggleEstado(comision.idComision, comision.estado)}
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
              {editingComision ? "Editar Comisión" : "Agregar Comisión"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="comision">
                <Form.Label>Comisión</Form.Label>
                <Form.Control
                  type="text"
                  name="comision"
                  value={newComision.comision}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="descripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  name="descripcion"
                  value={newComision.descripcion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idEvento">
                <Form.Label>Evento</Form.Label>
                <Form.Control
                  as="select"
                  name="idEvento"
                  value={newComision.idEvento}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar Evento</option>
                  {eventos.map((evento) => (
                    <option key={evento.idEvento} value={evento.idEvento}>
                      {evento.nombreEvento}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="idDetalleHorario">
                  <Form.Label>Detalle Horario</Form.Label>
                  <Form.Control
                    as="select"
                    name="idDetalleHorario"
                    value={newComision.idDetalleHorario}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar Detalle Horario</option>
                    {detallesHorarios.map((detalle) => (
                      <option key={detalle.idDetalleHorario} value={detalle.idDetalleHorario}>
                        {`${detalle.cantidadPersonas} personas - ${new Date(`1970-01-01T${detalle.horario?.horarioInicio}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} - ${new Date(`1970-01-01T${detalle.horario?.horarioFinal}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                {/* Campo: Estado */}
                <Form.Group controlId="estado">
                  <Form.Label>Estado</Form.Label>
                  <Form.Control
                    as="select"
                    name="estado"
                    value={newComision.estado}
                    onChange={handleChange}
                    required
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
                {editingComision ? "Actualizar" : "Crear"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Comisiones;

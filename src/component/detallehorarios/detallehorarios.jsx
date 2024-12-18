import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl } from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";

function DetalleHorariosComponent() {
  const [detalles, setDetalles] = useState([]);
  const [filteredDetalles, setFilteredDetalles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingDetalle, setEditingDetalle] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [categoriasHorarios, setCategoriasHorarios] = useState([]);
  const [newDetalle, setNewDetalle] = useState({
    cantidadPersonas: "",
    idHorario: "",
    idCategoriaHorario: "",
    estado: 1,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchAllDetalles();
    fetchHorarios();            // Obtener horarios activos
    fetchCategoriasHorarios();  // Obtener categorías activas
  }, []);

  // Obtener todos los detalles de horarios
  const fetchAllDetalles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/detalle_horarios");
      setDetalles(response.data);
      setFilteredDetalles(response.data);
    } catch (error) {
      console.error("Error fetching detalles:", error);
    }
  };

  // Filtrar por estado activo
  const fetchActiveDetalles = () => {
    const activos = detalles.filter((detalle) => detalle.estado === 1);
    setFilteredDetalles(activos);
  };

  // Filtrar por estado inactivo
  const fetchInactiveDetalles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/detalle_horarios/inactivos");
      setDetalles(response.data); // Actualiza el estado con los inactivos
      setFilteredDetalles(response.data); // Aplica el filtro a la tabla
    } catch (error) {
      console.error("Error fetching inactive detalles:", error);
    }
  };

  // Obtener horarios activos
  const fetchHorarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/horarios/activos");
      setHorarios(response.data);
    } catch (error) {
      console.error("Error fetching horarios:", error);
    }
  };

  // Obtener categorías de horarios activas
  const fetchCategoriasHorarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/categoriaHorarios/activas");
      setCategoriasHorarios(response.data);
    } catch (error) {
      console.error("Error fetching categorias horarios:", error);
    }
  };

  const formatTime = (timeString) => {
    const date = new Date(`1970-01-01T${timeString}Z`);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };  

  // Buscar por cantidad de personas o categoría
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = detalles.filter(
      (detalle) =>
        detalle.cantidadPersonas.toString().includes(value) ||
        detalle.categoriaHorario?.categoria?.toLowerCase().includes(value)
    );
    setFilteredDetalles(filtered);
  };

  const handleShowModal = (detalle = null) => {
    setEditingDetalle(detalle);
    setNewDetalle(
      detalle || {
        cantidadPersonas: "",
        idHorario: "",
        idCategoriaHorario: "",
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
          `http://localhost:5000/detalle_horarios/${editingDetalle.idDetalleHorario}`,
          newDetalle
        );
        setAlertMessage("Detalle de horario actualizado con éxito");
      } else {
        await axios.post("http://localhost:5000/detalle_horarios", newDetalle);
        setAlertMessage("Detalle de horario creado con éxito");
      }
      fetchAllDetalles();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting detalle:", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const newEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/detalle_horarios/${id}`, { estado: newEstado });
      setAlertMessage(`Detalle ${newEstado === 1 ? "activado" : "desactivado"} con éxito`);
      fetchAllDetalles();
      setShowAlert(true);
    } catch (error) {
      console.error("Error toggling estado:", error);
    }
  };

  return (
    <>
      <div className="container mt-4">
        <h3 style={{ textAlign: "center", marginBottom: "20px", fontWeight: "bold", color: "#333" }}>
          Gestión de Detalles de Horarios
        </h3>

        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar por cantidad de personas o categoría..."
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
            onClick={fetchActiveDetalles}
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
            onClick={fetchInactiveDetalles}
          >
            Inactivos
          </Button>
        </div>

        <Alert show={showAlert} variant="success" onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>

        <Table striped bordered hover responsive>
          <thead style={{ backgroundColor: "#007AC3", color: "white", textAlign: "center" }}>
            <tr>
              <th>ID</th>
              <th>Cantidad de Personas</th>
              <th>Horario</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredDetalles.map((detalle) => (
              <tr key={detalle.idDetalleHorario}>
                <td>{detalle.idDetalleHorario}</td>
                <td>{detalle.cantidadPersonas}</td>
                <td>
                  {detalle.horario
                    ? `${formatTime(detalle.horario.horarioInicio)} - ${formatTime(detalle.horario.horarioFinal)}`
                    : "Sin horario"}
                </td>
                <td>{detalle.categoriaHorario?.categoria || "Sin categoría"}</td>
                <td>{detalle.estado === 1 ? "Activo" : "Inactivo"}</td>
                <td>
                  <FaPencilAlt
                    style={{ color: "#007AC3", cursor: "pointer", marginRight: "10px" }}
                    onClick={() => handleShowModal(detalle)}
                  />
                  {detalle.estado === 1 ? (
                    <FaToggleOn
                      style={{ color: "green", cursor: "pointer" }}
                      onClick={() => toggleEstado(detalle.idDetalleHorario, detalle.estado)}
                    />
                  ) : (
                    <FaToggleOff
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={() => toggleEstado(detalle.idDetalleHorario, detalle.estado)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingDetalle ? "Editar Detalle de Horario" : "Agregar Detalle de Horario"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              {/* Cantidad de Personas */}
              <Form.Group>
                <Form.Label>Cantidad de Personas</Form.Label>
                <Form.Control
                  type="number"
                  name="cantidadPersonas"
                  value={newDetalle.cantidadPersonas}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* Select de Horarios */}
              <Form.Group>
                <Form.Label>Horario</Form.Label>
                <Form.Control
                  as="select"
                  name="idHorario"
                  value={newDetalle.idHorario}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar Horario</option>
                  {horarios.map((horario) => (
                    <option key={horario.idHorario} value={horario.idHorario}>
                      {`${horario.horarioInicio} - ${horario.horarioFinal}`}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              {/* Select de Categorías */}
              <Form.Group>
                <Form.Label>Categoría</Form.Label>
                <Form.Control
                  as="select"
                  name="idCategoriaHorario"
                  value={newDetalle.idCategoriaHorario}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar Categoría</option>
                  {categoriasHorarios.map((categoria) => (
                    <option key={categoria.idCategoriaHorario} value={categoria.idCategoriaHorario}>
                      {categoria.categoria}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              {/* Estado */}
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

              {/* Botón de Enviar */}
              <Button type="submit" variant="primary" className="w-100 mt-3">
                {editingDetalle ? "Actualizar" : "Crear"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default DetalleHorariosComponent;

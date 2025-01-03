import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Form,
  Table,
  Modal,
  Alert,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";

function Traslados() {
  const [traslados, setTraslados] = useState([]);
  const [filteredTraslados, setFilteredTraslados] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTraslado, setEditingTraslado] = useState(null);
  const [newTraslado, setNewTraslado] = useState({
    fecha: "",
    descripcion: "",
    estado: 1,
    idTipoTraslado: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [tipoTraslados, setTipoTraslados] = useState([]);

  useEffect(() => {
    fetchTraslados();
    fetchTipoTraslados();
  }, []);

  const fetchTraslados = async () => {
    try {
      const response = await axios.get("http://localhost:5000/traslados");
      setTraslados(response.data);
      setFilteredTraslados(response.data);
    } catch (error) {
      console.error("Error fetching traslados:", error);
    }
  };

  const fetchActiveTraslados = async () => {
    try {
      const response = await axios.get("http://localhost:5000/traslados/activas");
      setTraslados(response.data);
      setFilteredTraslados(response.data);
    } catch (error) {
      console.error("Error fetching active traslados:", error);
    }
  };

  const fetchInactiveTraslados = async () => {
    try {
      const response = await axios.get("http://localhost:5000/traslados/inactivas");
      setTraslados(response.data);
      setFilteredTraslados(response.data);
    } catch (error) {
      console.error("Error fetching inactive traslados:", error);
    }
  };

  const fetchTipoTraslados = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tipoTraslados");
      setTipoTraslados(response.data);
    } catch (error) {
      console.error("Error fetching tipo traslados:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = traslados.filter(
      (traslado) =>
        traslado.descripcion.toLowerCase().includes(value) ||
        tipoTraslados
          .find((tipo) => tipo.idTipoTraslado === traslado.idTipoTraslado)
          ?.tipo.toLowerCase()
          .includes(value)
    );

    setFilteredTraslados(filtered);
  };

  const handleShowModal = (traslado = null) => {
    setEditingTraslado(traslado);

    setNewTraslado(
      traslado
        ? {
            ...traslado,
            fecha: traslado.fecha ? traslado.fecha.split("T")[0] : "",
          }
        : { fecha: "", descripcion: "", estado: 1, idTipoTraslado: "" }
    );

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTraslado(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTraslado({ ...newTraslado, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const regexDescripcion = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,-]+$/;
    if (!regexDescripcion.test(newTraslado.descripcion)) {
      setAlertMessage(
        "La descripción solo debe contener letras, números, espacios y los signos permitidos (.,-)."
      );
      setShowAlert(true);
      return;
    }

    try {
      if (editingTraslado) {
        await axios.put(
          `http://localhost:5000/traslados/${editingTraslado.idTraslado}`,
          newTraslado
        );
        setAlertMessage("Traslado actualizado con éxito");
      } else {
        await axios.post("http://localhost:5000/traslados", newTraslado);
        setAlertMessage("Traslado creado con éxito");
      }
      fetchTraslados();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting traslado:", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/traslados/${id}`, { estado: nuevoEstado });
      fetchTraslados();
      setAlertMessage(
        `Traslado ${nuevoEstado === 1 ? "activado" : "inactivado"} con éxito`
      );
      setShowAlert(true);
    } catch (error) {
      console.error("Error toggling estado:", error);
    }
  };

  return (
    <>
      <div className="row" style={{ textAlign: "center", marginBottom: "20px" }}>
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
            Gestión de Traslados
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
            placeholder="Buscar por descripción o tipo de traslado..."
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
            Agregar Traslado
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
            onClick={fetchActiveTraslados}
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
            onClick={fetchInactiveTraslados}
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
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Tipo de Traslado</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredTraslados.map((traslado) => (
              <tr key={traslado.idTraslado}>
                <td>{traslado.idTraslado}</td>
                <td>{traslado.fecha}</td>
                <td>{traslado.descripcion}</td>
                <td>
                  {tipoTraslados.find(
                    (tipo) => tipo.idTipoTraslado === traslado.idTipoTraslado
                  )?.tipo || "Sin asignar"}
                </td>
                <td>{traslado.estado === 1 ? "Activo" : "Inactivo"}</td>
                <td>
                  <FaPencilAlt
                    style={{
                      color: "#007AC3",
                      cursor: "pointer",
                      marginRight: "10px",
                      fontSize: "20px",
                    }}
                    title="Editar"
                    onClick={() => handleShowModal(traslado)}
                  />
                  {traslado.estado ? (
                    <FaToggleOn
                      style={{
                        color: "#30c10c",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Inactivar"
                      onClick={() => toggleEstado(traslado.idTraslado, traslado.estado)}
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
                      onClick={() => toggleEstado(traslado.idTraslado, traslado.estado)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header
            closeButton
            style={{ backgroundColor: "#007AC3", color: "#fff" }}
          >
            <Modal.Title>
              {editingTraslado ? "Editar Traslado" : "Agregar Traslado"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="fecha">
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha"
                  value={newTraslado.fecha}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="descripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  name="descripcion"
                  value={newTraslado.descripcion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idTipoTraslado">
                <Form.Label>Tipo de Traslado</Form.Label>
                <Form.Control
                  as="select"
                  name="idTipoTraslado"
                  value={newTraslado.idTipoTraslado}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar</option>
                  {tipoTraslados.map((tipo) => (
                    <option key={tipo.idTipoTraslado} value={tipo.idTipoTraslado}>
                      {tipo.tipo}
                    </option>
                  ))}
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
                  marginTop: "10px",
                }}
                type="submit"
              >
                {editingTraslado ? "Actualizar" : "Crear"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Traslados;

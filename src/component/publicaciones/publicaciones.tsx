import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl } from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";

function Publicaciones() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [filteredPublicaciones, setFilteredPublicaciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sedes, setSedes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPublicacion, setEditingPublicacion] = useState(null);
  const [newPublicacion, setNewPublicacion] = useState({
    nombrePublicacion: "",
    descripcion: "",
    fechaPublicacion: new Date().toISOString().split("T")[0],
    estado: 1,
    idSede: "",
    tipoPublicacion: "general", // Tipo de publicación (general, evento, rifa)
  });
  const [files, setFiles] = useState([]); // Para manejar las fotos
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchPublicaciones();
    fetchSedes();
  }, []);

  const fetchPublicaciones = async () => {
    try {
      const response = await axios.get("http://localhost:5000/publicaciones");
      setPublicaciones(response.data);
      setFilteredPublicaciones(response.data);
    } catch (error) {
      console.error("Error fetching publicaciones:", error);
    }
  };

  const fetchSedes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/sedes");
      setSedes(response.data);
    } catch (error) {
      console.error("Error fetching sedes:", error);
    }
  };

  const fetchActivePublicaciones = async () => {
    try {
      const response = await axios.get("http://localhost:5000/publicaciones/activos");
      setFilteredPublicaciones(response.data);
    } catch (error) {
      console.error("Error fetching active publicaciones:", error);
    }
  };

  const fetchInactivePublicaciones = async () => {
    try {
      const response = await axios.get("http://localhost:5000/publicaciones/inactivos");
      setFilteredPublicaciones(response.data);
    } catch (error) {
      console.error("Error fetching inactive publicaciones:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = publicaciones.filter((publicacion) =>
      publicacion.nombrePublicacion.toLowerCase().includes(value)
    );
    setFilteredPublicaciones(filtered);
  };

  const handleShowModal = (publicacion = null) => {
    setEditingPublicacion(publicacion);
    setNewPublicacion(
      publicacion || {
        nombrePublicacion: "",
        descripcion: "",
        fechaPublicacion: new Date().toISOString().split("T")[0],
        estado: 1,
        idSede: "",
        tipoPublicacion: "general",
      }
    );
    setFiles([]);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPublicacion(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPublicacion({ ...newPublicacion, [name]: value });
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(newPublicacion).forEach(([key, value]) => {
      formData.append(key, value);
    });
    files.forEach((file) => formData.append("files", file));

    try {
      const endpoint = editingPublicacion
        ? `http://localhost:5000/publicaciones/update/${editingPublicacion.idPublicacion}`
        : "http://localhost:5000/publicaciones/create";

      const method = editingPublicacion ? "put" : "post";
      await axios({ method, url: endpoint, data: formData });
      setAlertMessage(
        editingPublicacion ? "Publicación actualizada con éxito" : "Publicación creada con éxito"
      );
      fetchPublicaciones();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting publicacion:", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/publicaciones/update/${id}`, { estado: nuevoEstado });
      fetchPublicaciones();
      setAlertMessage(`Publicación ${nuevoEstado === 1 ? "activada" : "inactivada"} con éxito`);
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
            Gestión de Publicaciones
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
            placeholder="Buscar publicación por nombre..."
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
            Agregar Publicación
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
            onClick={fetchActivePublicaciones}
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
            onClick={fetchInactivePublicaciones}
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
            borderRadius: "8px",
            marginTop: "20px",
          }}
        >
          <thead style={{ backgroundColor: "#007AC3", color: "#fff", textAlign: "center" }}>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Sede</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPublicaciones.map((publicacion) => (
              <tr key={publicacion.idPublicacion}>
                <td>{publicacion.idPublicacion}</td>
                <td>{publicacion.nombrePublicacion}</td>
                <td>{publicacion.fechaPublicacion.split("T")[0]}</td>
                <td>{publicacion.descripcion}</td>     
                <td>{publicacion.estado === 1 ? "Activo" : "Inactivo"}</td>   
                <td>{publicacion.sede?.nombreSede || "No asignada"}</td>               
                <td>
                  <FaPencilAlt
                    style={{
                      color: "#007AC3",
                      cursor: "pointer",
                      marginRight: "10px",
                      fontSize: "20px",
                    }}
                    title="Editar"
                    onClick={() => handleShowModal(publicacion)}
                  />
                  {publicacion.estado ? (
                    <FaToggleOn
                      style={{
                        color: "#30c10c",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Inactivar"
                      onClick={() => toggleEstado(publicacion.idPublicacion, publicacion.estado)}
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
                      onClick={() => toggleEstado(publicacion.idPublicacion, publicacion.estado)}
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
              {editingPublicacion ? "Editar Publicación" : "Agregar Publicación"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nombrePublicacion">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Nombre
                </Form.Label>
                <Form.Control
                  type="text"
                  name="nombrePublicacion"
                  value={newPublicacion.nombrePublicacion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="descripcion">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Descripción
                </Form.Label>
                <Form.Control
                  type="text"
                  name="descripcion"
                  value={newPublicacion.descripcion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="fechaPublicacion">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Fecha de Publicación
                </Form.Label>
                <Form.Control
                  type="date"
                  name="fechaPublicacion"
                  value={newPublicacion.fechaPublicacion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idSede">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Sede
                </Form.Label>
                <Form.Control
                  as="select"
                  name="idSede"
                  value={newPublicacion.idSede}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar sede</option>
                  {sedes.map((sede) => (
                    <option key={sede.idSede} value={sede.idSede}>
                      {sede.nombreSede}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="tipoPublicacion">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Tipo de Publicación
                </Form.Label>
                <Form.Control
                  as="select"
                  name="tipoPublicacion"
                  value={newPublicacion.tipoPublicacion}
                  onChange={handleChange}
                  required
                >
                  <option value="general">General</option>
                  <option value="evento">Evento</option>
                  <option value="rifa">Rifa</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="foto">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Fotos
                </Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
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
                {editingPublicacion ? "Actualizar" : "Crear"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Publicaciones;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl } from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";

function Personas() {
  const [personas, setPersonas] = useState([]);
  const [municipios, setMunicipios] = useState([]); // Estado para almacenar los municipios
  const [filteredPersonas, setFilteredPersonas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPersona, setEditingPersona] = useState(null);
  const [newPersona, setNewPersona] = useState({
    nombre: "",
    fechaNacimiento: "",
    telefono: "",
    domicilio: "",
    CUI: "",
    correo: "",
    idMunicipio: "",
    estado: 1,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showValidationError, setShowValidationError] = useState(null); // Nuevo estado para validaciones

  useEffect(() => {
    fetchPersonas();
    fetchMunicipios();
  }, []);

  const fetchPersonas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/personas");
      setPersonas(response.data);
      setFilteredPersonas(response.data);
    } catch (error) {
      console.error("Error fetching personas:", error);
    }
  };

  const fetchMunicipios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/municipios");
      setMunicipios(response.data);
    } catch (error) {
      console.error("Error fetching municipios:", error);
    }
  };

  const fetchActivePersonas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/personas/activos");
      setFilteredPersonas(response.data);
    } catch (error) {
      console.error("Error fetching active personas:", error);
    }
  };

  const fetchInactivePersonas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/personas/inactivos");
      setFilteredPersonas(response.data);
    } catch (error) {
      console.error("Error fetching inactive personas:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = personas.filter((persona) =>
      persona.nombre.toLowerCase().includes(value) ||
      persona.CUI.toLowerCase().includes(value)
    );

    setFilteredPersonas(filtered);
    setCurrentPage(1);
  };

  const handleShowModal = (persona = null) => {
    setEditingPersona(persona);
    setNewPersona(
      persona || {
        nombre: "",
        fechaNacimiento: "",
        telefono: "",
        domicilio: "",
        CUI: "",
        correo: "",
        idMunicipio: "",
        estado: 1,
      }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPersona(null);
    setShowValidationError(null); // Reiniciar el mensaje de validación
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validaciones
    const regexNombre = /^[A-Za-záéíóúÁÉÍÓÚÑñ\s]+$/;
    const regexTelefono = /^\d{8}$/;
    const regexDomicilio = /^[A-Za-záéíóúÁÉÍÓÚÑñ0-9\s\.\-]+$/;
    const regexCUI = /^\d{13}$/;
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name === "nombre" && !regexNombre.test(value)) {
      setShowValidationError("El nombre solo puede contener letras y espacios.");
    } else if (name === "telefono" && !regexTelefono.test(value)) {
      setShowValidationError("El teléfono debe contener exactamente 8 dígitos.");
    } else if (name === "domicilio" && !regexDomicilio.test(value)) {
      setShowValidationError("El domicilio solo puede contener letras, dígitos, espacios, puntos y guiones.");
    } else if (name === "CUI" && !regexCUI.test(value)) {
      setShowValidationError("El CUI debe contener exactamente 13 dígitos.");
    } else if (name === "correo" && !regexCorreo.test(value)) {
      setShowValidationError("El correo electrónico no es válido.");
    } else {
      setShowValidationError(null);
    }

    setNewPersona({ ...newPersona, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPersona) {
        await axios.put(
          `http://localhost:5000/personas/update/${editingPersona.idPersona}`,
          newPersona
        );
        setAlertMessage("Persona actualizada con éxito");
      } else {
        await axios.post("http://localhost:5000/personas/create", newPersona);
        setAlertMessage("Persona creada con éxito");
      }
      fetchPersonas();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting persona:", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/personas/update/${id}`, { estado: nuevoEstado });
      fetchPersonas();
      setAlertMessage(
        `Persona ${nuevoEstado === 1 ? "activada" : "inactivada"} con éxito`
      );
      setShowAlert(true);
    } catch (error) {
      console.error("Error toggling estado:", error);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentPersonas = filteredPersonas.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredPersonas.length / rowsPerPage);

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
            Gestión de Personas
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
            placeholder="Buscar persona por nombre o CUI..."
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
            Agregar Persona
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
            onClick={fetchActivePersonas}
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
            onClick={fetchInactivePersonas}
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
              <th>Fecha de Nacimiento</th>
              <th>Teléfono</th>
              <th>Domicilio</th>
              <th>CUI</th>
              <th>Correo</th>
              <th>Municipio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentPersonas.map((persona) => (
              <tr key={persona.idPersona}>
                <td>{persona.idPersona}</td>
                <td>{persona.nombre}</td>
                <td>{new Date(persona.fechaNacimiento).toLocaleDateString()}</td>
                <td>{persona.telefono}</td>
                <td>{persona.domicilio}</td>
                <td>{persona.CUI}</td>
                <td>{persona.correo}</td>
                <td>{persona.municipio ? persona.municipio.municipio : "Sin municipio"}</td>
                <td>{persona.estado === 1 ? "Activo" : "Inactivo"}</td>
                <td>
                  <FaPencilAlt
                    style={{
                      color: "#007AC3",
                      cursor: "pointer",
                      marginRight: "10px",
                      fontSize: "20px",
                    }}
                    title="Editar"
                    onClick={() => handleShowModal(persona)}
                  />
                  {persona.estado ? (
                    <FaToggleOn
                      style={{
                        color: "#30c10c",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Inactivar"
                      onClick={() => toggleEstado(persona.idPersona, persona.estado)}
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
                      onClick={() => toggleEstado(persona.idPersona, persona.estado)}
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
              {editingPersona ? "Editar Persona" : "Agregar Persona"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={newPersona.nombre}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="fechaNacimiento">
                <Form.Label>Fecha de Nacimiento</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaNacimiento"
                  value={newPersona.fechaNacimiento}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="telefono">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  value={newPersona.telefono}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="domicilio">
                <Form.Label>Domicilio</Form.Label>
                <Form.Control
                  type="text"
                  name="domicilio"
                  value={newPersona.domicilio}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="CUI">
                <Form.Label>CUI</Form.Label>
                <Form.Control
                  type="text"
                  name="CUI"
                  value={newPersona.CUI}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="correo">
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  type="email"
                  name="correo"
                  value={newPersona.correo}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idMunicipio">
                <Form.Label>Municipio</Form.Label>
                <Form.Control
                  as="select"
                  name="idMunicipio"
                  value={newPersona.idMunicipio}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar Municipio</option>
                  {municipios.map((municipio) => (
                    <option key={municipio.idMunicipio} value={municipio.idMunicipio}>
                      {municipio.municipio}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newPersona.estado}
                  onChange={handleChange}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </Form.Control>
              </Form.Group>
              {showValidationError && (
                <Alert variant="danger" style={{ marginTop: "10px", fontWeight: "bold" }}>
                  {showValidationError}
                </Alert>
              )}
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
                {editingPersona ? "Actualizar" : "Crear"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Personas;

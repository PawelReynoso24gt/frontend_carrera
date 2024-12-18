import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl  } from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";


function Municipio() {
  const [municipios, setMunicipios] = useState([]);
  const [filteredMunicipios, setFilteredMunicipios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingMunicipio, setEditingMunicipio] = useState(null);
  const [newMunicipio, setNewMunicipio] = useState({
    municipio: "",
    estado: 1,
    idDepartamento: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [departamentos, setDepartamentos] = useState([]);

  useEffect(() => {
    fetchMunicipios();
    fetchDepartamentos();
  }, []);

  const fetchMunicipios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/municipios");
      setMunicipios(response.data);
    } catch (error) {
      console.error("Error fetching municipios:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = municipios.filter((municipio) =>
      municipio.includes(value)
    );
    setFilteredMunicipios(filtered);
  };

  const fetchDepartamentos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/departamentos");
      setDepartamentos(response.data);
    } catch (error) {
      console.error("Error fetching departamentos:", error);
    }
  };

  const fetchActiveMunicipios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/municipios/activos");
      setMunicipios(response.data);
    } catch (error) {
      console.error("Error fetching active municipios:", error);
    }
  };

  const fetchInactiveMunicipios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/municipios/inactivos");
      setMunicipios(response.data);
    } catch (error) {
      console.error("Error fetching inactive municipios:", error);
    }
  };

  const handleShowModal = (municipio = null) => {
    setEditingMunicipio(municipio);
    setNewMunicipio(
      municipio || {
        municipio: "",
        estado: 1,
        idDepartamento: "",
      }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMunicipio(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMunicipio({ ...newMunicipio, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMunicipio) {
        await axios.put(
          `http://localhost:5000/municipios/update/${editingMunicipio.idMunicipio}`,
          newMunicipio
        );
        setAlertMessage("Municipio actualizado con éxito");
      } else {
        await axios.post("http://localhost:5000/municipios/create", newMunicipio);
        setAlertMessage("Municipio creado con éxito");
      }
      fetchMunicipios();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting municipio:", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/municipios/update/${id}`, {
        estado: nuevoEstado,
      });
      fetchMunicipios();
      setAlertMessage(
        `Municipio ${nuevoEstado === 1 ? "activado" : "inactivado"} con éxito`
      );
      setShowAlert(true);
    } catch (error) {
      console.error("Error toggling estado:", error);
    }
  };

  // Paginación
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentMunicipios = municipios.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(municipios.length / rowsPerPage);

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
      {/* Encabezado y botones */}
      <div className="row" style={{ textAlign: "center", marginBottom: "20px" }}>
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
            Gestión de Municipios
          </h3>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Buscar municipio..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </InputGroup>
      {/* Contenedor principal */}
      <div
        className="container mt-4"
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
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
            Agregar Municipio
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
            onClick={fetchActiveMunicipios}
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
            onClick={fetchInactiveMunicipios}
          >
            Inactivos
          </Button>
        </div>

        {/* Alertas */}
        <Alert
          variant="success"
          show={showAlert}
          onClose={() => setShowAlert(false)}
          dismissible
          style={{ marginTop: "20px", fontWeight: "bold" }}
        >
          {alertMessage}
        </Alert>

        {/* Tabla */}
        <Table
          striped
          bordered
          hover
          responsive
          className="mt-3"
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            overflow: "hidden",
            marginTop: "20px",
          }}
        >
          <thead style={{ backgroundColor: "#007AC3", color: "#fff", textAlign: "center" }}>
            <tr>
              <th>ID</th>
              <th>Municipio</th>
              <th>Departamento</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
              {currentMunicipios.map((municipio) => (
                <tr key={municipio.idMunicipio}>
                  <td style={{ textAlign: "center" }}>{municipio.idMunicipio}</td>
                  <td style={{ textAlign: "center" }}>{municipio.municipio}</td>
                  <td style={{ textAlign: "center" }}>
                    {departamentos.find(
                      (d) => d.idDepartamento === municipio.idDepartamento
                    )?.departamento || "Desconocido"}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {municipio.estado === 1 ? "Activo" : "Inactivo"}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {/* Botón de Editar */}
                    <FaPencilAlt
                      style={{
                        color: "#007AC3",
                        cursor: "pointer",
                        marginRight: "10px",
                        fontSize: "20px",
                      }}
                      title="Editar"
                      onClick={() => handleShowModal(municipio)}
                    />

                    {/* Botón de Activar/Inactivar */}
                    {municipio.estado ? (
                      <FaToggleOn
                        style={{
                          color: "#30c10c",
                          cursor: "pointer",
                          marginLeft: "10px",
                          fontSize: "20px",
                        }}
                        title="Inactivar"
                        onClick={() => toggleEstado(municipio.idMunicipio, municipio.estado)}
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
                        onClick={() => toggleEstado(municipio.idMunicipio, municipio.estado)}
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
              {editingMunicipio ? "Editar Municipio" : "Agregar Municipio"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="municipio">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Municipio
                </Form.Label>
                <Form.Control
                  type="text"
                  name="municipio"
                  value={newMunicipio.municipio}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Estado
                </Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newMunicipio.estado}
                  onChange={handleChange}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="idDepartamento">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Departamento
                </Form.Label>
                <Form.Control
                  as="select"
                  name="idDepartamento"
                  value={newMunicipio.idDepartamento}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar Departamento</option>
                  {departamentos.map((departamento) => (
                    <option
                      key={departamento.idDepartamento}
                      value={departamento.idDepartamento}
                    >
                      {departamento.departamento}
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
                }}
                type="submit"
              >
                {editingMunicipio ? "Actualizar" : "Crear"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Municipio;

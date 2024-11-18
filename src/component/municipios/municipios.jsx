import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert } from "react-bootstrap";

function Municipio() {
  const [municipios, setMunicipios] = useState([]);
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
      const response = await axios.get("http://localhost:5000/municipios/activas");
      setMunicipios(response.data);
    } catch (error) {
      console.error("Error fetching active municipios:", error);
    }
  };

  const fetchInactiveMunicipios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/municipios/inactivas");
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

  return (
    <>
      <div className="row" style={{ textAlign: "center", marginBottom: "20px" }}>
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
            Gestión de Municipios
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
        <Button
          style={{
            backgroundColor: "#743D90",
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
            backgroundColor: "#007AC3",
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
            backgroundColor: "#009B85",
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
          <thead style={{ backgroundColor: "#007AC3", color: "#fff" }}>
            <tr>
              <th>ID</th>
              <th>Municipio</th>
              <th>Departamento</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {municipios.map((municipio) => (
              <tr key={municipio.idMunicipio}>
                <td>{municipio.idMunicipio}</td>
                <td>{municipio.municipio}</td>
                <td>
                  {
                    departamentos.find(
                      (d) => d.idDepartamento === municipio.idDepartamento
                    )?.departamento || "Desconocido"
                  }
                </td>
                <td>{municipio.estado ? "Activo" : "Inactivo"}</td>
                <td>
                  <Button
                    style={{
                      backgroundColor: "#007AC3",
                      borderColor: "#007AC3",
                      padding: "5px 10px",
                      width: "100px",
                      marginRight: "5px",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                    onClick={() => handleShowModal(municipio)}
                  >
                    Editar
                  </Button>
                  <Button
                    style={{
                      backgroundColor: municipio.estado ? "#6c757d" : "#28a745",
                      borderColor: municipio.estado ? "#6c757d" : "#28a745",
                      padding: "5px 10px",
                      width: "100px",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                    onClick={() =>
                      toggleEstado(municipio.idMunicipio, municipio.estado)
                    }
                  >
                    {municipio.estado ? "Inactivar" : "Activar"}
                  </Button>
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

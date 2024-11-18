import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl } from "react-bootstrap";

function Talonarios() {
  const [talonarios, setTalonarios] = useState([]);
  const [filteredTalonarios, setFilteredTalonarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTalonario, setEditingTalonario] = useState(null);
  const [newTalonario, setNewTalonario] = useState({
    codigoTalonario: "",
    cantidadBoletos: "",
    correlativoInicio: "",
    correlativoFinal: "",
    estado: 1,
    idRifa: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [rifas, setRifas] = useState([]);

  useEffect(() => {
    fetchTalonarios();
    fetchRifas();
  }, []);

  const fetchTalonarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/talonarios");
      setTalonarios(response.data);
      setFilteredTalonarios(response.data);
    } catch (error) {
      console.error("Error fetching talonarios:", error);
    }
  };

  const fetchRifas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/rifas");
      setRifas(response.data);
    } catch (error) {
      console.error("Error fetching rifas:", error);
    }
  };

  const fetchActiveTalonarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/talonarios/activos");
      setTalonarios(response.data);
      setFilteredTalonarios(response.data);
    } catch (error) {
      console.error("Error fetching active talonarios:", error);
    }
  };

  const fetchInactiveTalonarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/talonarios/inactivos");
      setTalonarios(response.data);
      setFilteredTalonarios(response.data);
    } catch (error) {
      console.error("Error fetching inactive talonarios:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = talonarios.filter((talonario) =>
      talonario.codigoTalonario.toString().includes(value)
    );
    setFilteredTalonarios(filtered);
  };

  const handleShowModal = (talonario = null) => {
    setEditingTalonario(talonario);
    setNewTalonario(
      talonario || {
        codigoTalonario: "",
        cantidadBoletos: "",
        correlativoInicio: "",
        correlativoFinal: "",
        estado: 1,
        idRifa: "",
      }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTalonario(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validación para aceptar solo números en los campos específicos
    if (
      ["codigoTalonario", "cantidadBoletos", "correlativoInicio", "correlativoFinal"].includes(
        name
      )
    ) {
      const regex = /^[0-9]*$/; // Solo números
      if (!regex.test(value)) {
        return; // Si no cumple con la validación, no actualiza el estado
      }
    }

    setNewTalonario({ ...newTalonario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTalonario) {
        await axios.put(
          `http://localhost:5000/talonarios/update/${editingTalonario.idTalonario}`,
          newTalonario
        );
        setAlertMessage("Talonario actualizado con éxito");
      } else {
        await axios.post("http://localhost:5000/talonarios/create", newTalonario);
        setAlertMessage("Talonario creado con éxito");
      }
      fetchTalonarios();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting talonario:", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/talonarios/update/${id}`, { estado: nuevoEstado });
      fetchTalonarios();
      setAlertMessage(
        `Talonario ${nuevoEstado === 1 ? "activado" : "inactivado"} con éxito`
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
            Gestión de Talonarios
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
            placeholder="Buscar talonario por código..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>

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
          Agregar Talonario
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
          onClick={fetchActiveTalonarios}
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
          onClick={fetchInactiveTalonarios}
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
              <th>Código</th>
              <th>Cantidad</th>
              <th>Inicio</th>
              <th>Final</th>
              <th>Rifa</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredTalonarios.map((talonario) => (
              <tr key={talonario.idTalonario}>
                <td>{talonario.idTalonario}</td>
                <td>{talonario.codigoTalonario}</td>
                <td>{talonario.cantidadBoletos}</td>
                <td>{talonario.correlativoInicio}</td>
                <td>{talonario.correlativoFinal}</td>
                <td>
                  {
                    rifas.find((rifa) => rifa.idRifa === talonario.idRifa)
                      ?.nombreRifa || "Desconocido"
                  }
                </td>
                <td>{talonario.estado === 1 ? "Activo" : "Inactivo"}</td>
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
                    onClick={() => handleShowModal(talonario)}
                  >
                    Editar
                  </Button>
                  <Button
                    style={{
                      backgroundColor: talonario.estado ? "#6c757d" : "#28a745",
                      borderColor: talonario.estado ? "#6c757d" : "#28a745",
                      padding: "5px 10px",
                      width: "100px",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                    onClick={() => toggleEstado(talonario.idTalonario, talonario.estado)}
                  >
                    {talonario.estado ? "Inactivar" : "Activar"}
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
              {editingTalonario ? "Editar Talonario" : "Agregar Talonario"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="codigoTalonario">
                <Form.Label>Código Talonario</Form.Label>
                <Form.Control
                  type="text"
                  name="codigoTalonario"
                  value={newTalonario.codigoTalonario}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="cantidadBoletos">
                <Form.Label>Cantidad de Boletos</Form.Label>
                <Form.Control
                  type="text"
                  name="cantidadBoletos"
                  value={newTalonario.cantidadBoletos}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="correlativoInicio">
                <Form.Label>Correlativo Inicio</Form.Label>
                <Form.Control
                  type="text"
                  name="correlativoInicio"
                  value={newTalonario.correlativoInicio}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="correlativoFinal">
                <Form.Label>Correlativo Final</Form.Label>
                <Form.Control
                  type="text"
                  name="correlativoFinal"
                  value={newTalonario.correlativoFinal}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idRifa">
                <Form.Label>Rifa</Form.Label>
                <Form.Control
                  as="select"
                  name="idRifa"
                  value={newTalonario.idRifa}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar Rifa</option>
                  {rifas.map((rifa) => (
                    <option key={rifa.idRifa} value={rifa.idRifa}>
                      {rifa.nombreRifa}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newTalonario.estado}
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
                {editingTalonario ? "Actualizar" : "Crear"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Talonarios;

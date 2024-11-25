import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert } from "react-bootstrap";

function TipoPago() {
  const [tiposPago, setTiposPago] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTipoPago, setEditingTipoPago] = useState(null);
  const [newTipoPago, setNewTipoPago] = useState({ tipo: "", estado: 1 });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchTiposPago();
  }, []);

  const fetchTiposPago = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tipospagos");
      setTiposPago(response.data);
    } catch (error) {
      console.error("Error fetching tipos de pago:", error);
    }
  };

  const fetchActiveTiposPago = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tipopago/activas");
      setTiposPago(response.data);
    } catch (error) {
      console.error("Error fetching active tipos de pago:", error);
    }
  };

  const fetchInactiveTiposPago = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tipopago/inactivas");
      setTiposPago(response.data);
    } catch (error) {
      console.error("Error fetching inactive tipos de pago:", error);
    }
  };

  const handleShowModal = (tipoPago = null) => {
    setEditingTipoPago(tipoPago);
    setNewTipoPago(tipoPago || { tipo: "", estado: 1 });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTipoPago(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTipoPago({ ...newTipoPago, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTipoPago) {
        await axios.put(
          `http://localhost:5000/tipopagos/${editingTipoPago.idTipoPago}`,
          newTipoPago
        );
        setAlertMessage("Tipo de pago actualizado con éxito");
      } else {
        await axios.post("http://localhost:5000/tipopagos/create", newTipoPago);
        setAlertMessage("Tipo de pago creado con éxito");
      }
      fetchTiposPago();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting tipo de pago:", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/tipopagos/${id}`, {
        estado: nuevoEstado,
      });
      fetchTiposPago();
      setAlertMessage(
        `Tipo de pago ${nuevoEstado === 1 ? "activado" : "inactivado"} con éxito`
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
            Gestión de Tipos de Pago
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
          Agregar Tipo de Pago
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
          onClick={fetchActiveTiposPago}
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
          onClick={fetchInactiveTiposPago}
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
              <th>Tipo de Pago</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tiposPago.map((tipoPago) => (
              <tr key={tipoPago.idTipoPago}>
                <td>{tipoPago.idTipoPago}</td>
                <td>{tipoPago.tipo}</td>
                <td>{tipoPago.estado ? "Activo" : "Inactivo"}</td>
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
                    onClick={() => handleShowModal(tipoPago)}
                  >
                    Editar
                  </Button>
                  <Button
                    style={{
                      backgroundColor: tipoPago.estado ? "#6c757d" : "#28a745",
                      borderColor: tipoPago.estado ? "#6c757d" : "#28a745",
                      padding: "5px 10px",
                      width: "100px",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                    onClick={() =>
                      toggleEstado(tipoPago.idTipoPago, tipoPago.estado)
                    }
                  >
                    {tipoPago.estado ? "Inactivar" : "Activar"}
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
              {editingTipoPago
                ? "Editar Tipo de Pago"
                : "Agregar Tipo de Pago"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="tipo">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Tipo de Pago
                </Form.Label>
                <Form.Control
                  type="text"
                  name="tipo"
                  value={newTipoPago.tipo}
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
                  value={newTipoPago.estado}
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
                {editingTipoPago ? "Actualizar" : "Crear"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default TipoPago;

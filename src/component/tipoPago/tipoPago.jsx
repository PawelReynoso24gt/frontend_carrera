import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl } from "react-bootstrap"; // Asegúrate de importar InputGroup y FormControl
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";


function TipoPago() {
  const [tiposPago, setTiposPago] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTipoPago, setEditingTipoPago] = useState(null);
  const [newTipoPago, setNewTipoPago] = useState({ tipo: "", estado: 1 });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showPermissionModal, setShowPermissionModal] = useState(false); // Nuevo estado
  const [permissionMessage, setPermissionMessage] = useState('');
  const [permissions, setPermissions] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredTiposPago, setFilteredTiposPago] = useState([]);
  const [hasViewPermission, setHasViewPermission] = useState(false);
  const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get('https://api.voluntariadoayuvi.com/usuarios/permisos', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Ajusta según dónde guardes el token
          },
        });
        setPermissions(response.data.permisos || {});

        const hasPermission =
        response.data.permisos['Ver tipo pagos']

      setHasViewPermission(hasPermission);
      setIsPermissionsLoaded(true);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermissions();

  }, []);

   useEffect(() => {
      if (isPermissionsLoaded) {
        if (hasViewPermission) {
          fetchTiposPago();
        } else {
          checkPermission('Ver tipo pagos', 'No tienes permisos para ver tipo pagos');
        }
      }
    }, [isPermissionsLoaded, hasViewPermission]);

  const checkPermission = (permission, message) => {
    if (!permissions[permission]) {
      setPermissionMessage(message);
      setShowPermissionModal(true);
      return false;
    }
    return true;
  };

  const fetchTiposPago = async () => {
    try {
      const response = await axios.get("https://api.voluntariadoayuvi.com/tipospagos");
      setTiposPago(response.data);
      setFilteredTiposPago(response.data); // Inicializa filteredTiposPago
    } catch (error) {
      console.error("Error fetching tipos de pago:", error);
    }
  };

  const fetchActiveTiposPago = async () => {
    try {
      if (hasViewPermission) {
      const response = await axios.get("https://api.voluntariadoayuvi.com/tipopago/activas");
      setTiposPago(response.data);
      setFilteredTiposPago(response.data);
    } else {
      checkPermission('Ver tipo pagos', 'No tienes permisos para ver tipo pagos')
    }
    } catch (error) {
      console.error("Error fetching active tipos de pago:", error);
    }
  };

  const fetchInactiveTiposPago = async () => {
    try {
      if (hasViewPermission) {
      const response = await axios.get("https://api.voluntariadoayuvi.com/tipopago/inactivas");
      setTiposPago(response.data);
      setFilteredTiposPago(response.data);
    } else {
      checkPermission('Ver tipo pagos', 'No tienes permisos para ver tipo pagos')
    }
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
          `https://api.voluntariadoayuvi.com/tipopagos/${editingTipoPago.idTipoPago}`,
          newTipoPago
        );
        setAlertMessage("Tipo de pago actualizado con éxito");
      } else {
        await axios.post("https://api.voluntariadoayuvi.com/tipopagos/create", newTipoPago);
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
      await axios.put(`https://api.voluntariadoayuvi.com/tipopagos/${id}`, {
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

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = tiposPago.filter((tipoPago) =>
      tipoPago.tipo.toLowerCase().includes(value)
    );
    setFilteredTiposPago(filtered);
    setCurrentPage(1);
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentTiposPago = filteredTiposPago.slice(indexOfFirstRow, indexOfFirstRow + rowsPerPage);

  const totalPages = Math.ceil(filteredTiposPago.length / rowsPerPage);

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
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar tipo de pago..."
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
              marginRight: "10px",
              fontWeight: "bold",
              color: "#fff",
              width: "180px",
            }}
            onClick={() => {
              if (checkPermission('Crear tipo pago', 'No tienes permisos para crear tipo pago')) {
                handleShowModal();
              }
            }}
          >
            Agregar Tipo de Pago
          </Button>
          <Button
            style={{
              backgroundColor: "#009B85",
              borderColor: "#007AC3",
              padding: "5px 10px",
              marginRight: "10px",
              fontWeight: "bold",
              color: "#fff",
              width: "100px",
            }}
           onClick={fetchActiveTiposPago}
          >
            Activos
          </Button>
          <Button
            style={{
              backgroundColor: "#bf2200",
              borderColor: "#007AC3",
              padding: "5px 10px",
              fontWeight: "bold",
              color: "#fff",
              width: "100px",
            }}
            onClick={fetchInactiveTiposPago}
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
          <thead
            style={{
              backgroundColor: "#007AC3",
              color: "#fff",
              textAlign: "center",
            }}
          >
            <tr>
              <th>ID</th>
              <th>Tipo de Pago</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center" }}>
            {currentTiposPago.map((tipoPago) => (
              <tr key={tipoPago.idTipoPago}>
                <td>{tipoPago.idTipoPago}</td>
                <td>{tipoPago.tipo}</td>
                <td>{tipoPago.estado ? "Activo" : "Inactivo"}</td>
                <td>
                  <FaPencilAlt
                    style={{
                      color: "#007AC3",
                      cursor: "pointer",
                      marginRight: "10px",
                      fontSize: "20px",
                    }}
                    title="Editar"
                    onClick={() => {
                      if (checkPermission('Editar tipo pago', 'No tienes permisos para editar tipo pago')) {
                        handleShowModal(tipoPago);
                      }
                    }}
                  />
                  {tipoPago.estado ? (
                    <FaToggleOn
                      style={{
                        color: "#30c10c",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Inactivar"
                      onClick={() => {
                        if (checkPermission('Desactivar tipo pago', 'No tienes permisos para desactivar tipo pago')) {
                          toggleEstado(tipoPago.idTipoPago, tipoPago.estado);
                        }
                      }}
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
                      onClick={() => {
                        if (checkPermission('Activar tipo pago', 'No tienes permisos para activar tipo pago')) {
                          toggleEstado(tipoPago.idTipoPago, tipoPago.estado);
                        }
                      }}
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
        <Modal show={showPermissionModal} onHide={() => setShowPermissionModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Permiso Denegado</Modal.Title>
          </Modal.Header>
          <Modal.Body>{permissionMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setShowPermissionModal(false)}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default TipoPago;
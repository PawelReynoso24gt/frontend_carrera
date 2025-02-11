import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl } from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showPermissionModal, setShowPermissionModal] = useState(false); // Nuevo estado
  const [permissionMessage, setPermissionMessage] = useState('');
  const [permissions, setPermissions] = useState({});
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
        response.data.permisos['Ver talonarios']

      setHasViewPermission(hasPermission);
      setIsPermissionsLoaded(true);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermissions();
    fetchRifas();
  }, []);

  useEffect(() => {
      if (isPermissionsLoaded) {
        if (hasViewPermission) {
          fetchTalonarios();
        } else {
          checkPermission('Ver talonarios', 'No tienes permisos para ver talonarios');
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

  const fetchTalonarios = async () => {
    try {
      const response = await axios.get("https://api.voluntariadoayuvi.com/talonarios");
      setTalonarios(response.data);
      setFilteredTalonarios(response.data);
    } catch (error) {
      console.error("Error fetching talonarios:", error);
    }
  };

  const fetchRifas = async () => {
    try {
      const response = await axios.get("https://api.voluntariadoayuvi.com/rifas");
      setRifas(response.data);
    } catch (error) {
      console.error("Error fetching rifas:", error);
    }
  };

  const fetchActiveTalonarios = async () => {
    try {
      if (hasViewPermission) {
      const response = await axios.get("https://api.voluntariadoayuvi.com/talonarios/activos");
      setTalonarios(response.data);
      setFilteredTalonarios(response.data);
    } else {
      checkPermission('Ver talonarios', 'No tienes permisos para ver talonarios')
    }
    } catch (error) {
      console.error("Error fetching active talonarios:", error);
    }
  };

  const fetchInactiveTalonarios = async () => {
    try {
      if (hasViewPermission) {
      const response = await axios.get("https://api.voluntariadoayuvi.com/talonarios/inactivos");
      setTalonarios(response.data);
      setFilteredTalonarios(response.data);
    } else {
      checkPermission('Ver talonarios', 'No tienes permisos para ver talonarios')
    }
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
    // console.log("Editing talonario:", talonario);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTalonario(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      ["codigoTalonario", "cantidadBoletos", "correlativoInicio", "correlativoFinal"].includes(
        name
      )
    ) {
      const regex = /^[0-9]*$/;
      if (!regex.test(value)) {
        return;
      }
    }
    // console.log(`Updating field ${name} to value ${value}`);
    setNewTalonario({ ...newTalonario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convertir idRifa a número
    const updatedTalonario = {
      ...newTalonario,
      idRifa: Number(newTalonario.idRifa),
    };
    
    try {
      // console.log("Submitting talonario:", updatedTalonario);
      if (editingTalonario) {
        // console.log(`Updating talonario with ID ${editingTalonario.idTalonario}`);
        // console.log("Data to update:", updatedTalonario);
        await axios.put(
          `https://api.voluntariadoayuvi.com/talonarios/update/${editingTalonario.idTalonario}`,
          updatedTalonario
        );
        setAlertMessage("Talonario actualizado con éxito");
      } else {
        // console.log("Creating new talonario");
        // console.log("Data to create:", updatedTalonario);
        await axios.post("https://api.voluntariadoayuvi.com/talonarios/create", updatedTalonario);
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
      await axios.put(`https://api.voluntariadoayuvi.com/talonarios/update/${id}`, { estado: nuevoEstado });
      fetchTalonarios();
      setAlertMessage(
        `Talonario ${nuevoEstado === 1 ? "activado" : "inactivado"} con éxito`
      );
      setShowAlert(true);
    } catch (error) {
      console.error("Error toggling estado:", error);
    }
  };

  // Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentTalonarios = filteredTalonarios.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredTalonarios.length / rowsPerPage);

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
            backgroundColor: "#007abf",
            borderColor: "#007AC3",
            padding: "5px 10px",
            width: "180px",
            marginRight: "10px",
            fontWeight: "bold",
            color: "#fff",
          }}
          onClick={() => {
            if (checkPermission('Crear talonario', 'No tienes permisos para crear talonario')) {
              handleShowModal();
            }
          }}
        >
          Agregar Talonario
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
          onClick={fetchActiveTalonarios}
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
            borderRadius: "20px",
            overflow: "hidden",
            marginTop: "20px",
          }}
        >
          <thead style={{ backgroundColor: "#007AC3", color: "#fff", textAlign: "center" }}>
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
          <tbody style={{ textAlign: "center" }}>
            {currentTalonarios.map((talonario) => (
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
                  <FaPencilAlt
                    style={{
                      color: "#007AC3",
                      cursor: "pointer",
                      marginRight: "10px",
                      fontSize: "20px",
                    }}
                    title="Editar"
                    onClick={() => {
                      if (checkPermission('Editar talonario', 'No tienes permisos para editar talonario')) {
                        handleShowModal(talonario);
                      }
                    }}
                  />
                  {talonario.estado ? (
                    <FaToggleOn
                      style={{
                        color: "#30c10c",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Inactivar"
                      onClick={() => {
                        if (checkPermission('Desactivar talonario', 'No tienes permisos para desactivar talonario')) {
                          toggleEstado(talonario.idTalonario, talonario.estado);
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
                        if (checkPermission('Activar talonario', 'No tienes permisos para activar talonario')) {
                          toggleEstado(talonario.idTalonario, talonario.estado);
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

export default Talonarios;

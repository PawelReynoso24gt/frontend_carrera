import React, { useEffect, useState } from "react";
import { getUserDataFromToken } from "../../utils/jwtUtils"; // token
import axios from "axios";
import {
  Button,
  Form,
  Table,
  Modal,
  Alert,
  InputGroup,
  FormControl,
  Pagination,
} from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";

function Sedes() {
  const [sedes, setSedes] = useState([]);
  const [filteredSedes, setFilteredSedes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSede, setEditingSede] = useState(null);
  const [newSede, setNewSede] = useState({
    nombreSede: "",
    informacion: "",
    estado: 1,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
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
        response.data.permisos['Ver sedes']

      setHasViewPermission(hasPermission);
      setIsPermissionsLoaded(true);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermissions();
  }, []);

  const idUsuario = getUserDataFromToken(localStorage.getItem("token"))?.idUsuario; //! usuario del token

  useEffect(() => {
        if (isPermissionsLoaded) {
          if (hasViewPermission) {
            fetchSedes();
          } else {
            checkPermission('Ver sedes', 'No tienes permisos para ver sede');
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

  const fetchSedes = async () => {
    try {
      const response = await axios.get("https://api.voluntariadoayuvi.com/sedes");
      setSedes(response.data);
      setFilteredSedes(response.data);
    } catch (error) {
      console.error("Error fetching sedes:", error);
    }
  };

  const fetchActiveSedes = async () => {
    try {
      if (hasViewPermission) {
      const response = await axios.get("https://api.voluntariadoayuvi.com/sedes/activas");
      setFilteredSedes(response.data);
    } else {
      checkPermission('Ver sedes', 'No tienes permisos para ver sedes')
    }
    } catch (error) {
      console.error("Error fetching active sedes:", error);
    }
  };

  const fetchInactiveSedes = async () => {
    try {
      if (hasViewPermission) {
      const response = await axios.get("https://api.voluntariadoayuvi.com/sedes/inactivas");
      setFilteredSedes(response.data);
    } else {
      checkPermission('Ver sedes', 'No tienes permisos para ver sedes')
    }
    } catch (error) {
      console.error("Error fetching inactive sedes:", error);
    }
  };

  const handleShowModal = (sede = null) => {
    setEditingSede(sede);
    setNewSede(sede || { nombreSede: "", informacion: "", estado: 1 });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSede(null);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = sedes.filter((sede) =>
      sede.nombreSede.toLowerCase().includes(value)
    );

    setFilteredSedes(filtered);
    setCurrentPage(1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSede({ ...newSede, [name]: value });
  };

  const logBitacora = async (descripcion, idCategoriaBitacora) => {
    const bitacoraData = {
      descripcion,
      idCategoriaBitacora,
      idUsuario,
      fechaHora: new Date()
    };

    try {
      await axios.post("https://api.voluntariadoayuvi.com/bitacora/create", bitacoraData);
    } catch (error) {
      console.error("Error logging bitacora:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!regex.test(newSede.nombreSede)) {
      setAlertMessage("El nombre de la sede solo debe contener letras y espacios.");
      setShowAlert(true);
      return;
    }

    try {
      if (editingSede) {
        await axios.put(`https://api.voluntariadoayuvi.com/sedes/${editingSede.idSede}`, newSede);
        setAlertMessage("Sede actualizada con éxito");
        // Log the update action in the bitacora
        await logBitacora(`Sede ${newSede.nombreSede} actualizada`, 35);
      } else {
        await axios.post("https://api.voluntariadoayuvi.com/sedes", newSede);
        setAlertMessage("Sede creada con éxito");

        // Log the create action in the bitacora
        await logBitacora(`Sede ${newSede.nombreSede} creada`, 34);
      }
      fetchSedes();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting sede:", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`https://api.voluntariadoayuvi.com/sedes/${id}`, { estado: nuevoEstado });
      fetchSedes();
      setAlertMessage(
        `Sede ${nuevoEstado === 1 ? "activada" : "inactivada"} con éxito`
      );
      setShowAlert(true);
    } catch (error) {
      console.error("Error toggling estado:", error);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentSedes = filteredSedes.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredSedes.length / rowsPerPage);

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
            Gestión de Sedes
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
            placeholder="Buscar sede por nombre..."
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
            onClick={() => {
              if (checkPermission('Crear sede', 'No tienes permisos para crear sede')) {
                handleShowModal();
              }
            }}
          >
            Agregar Sede
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
            onClick={fetchActiveSedes}
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
            onClick={fetchInactiveSedes}
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
            borderRadius: "20px",
            overflow: "hidden",
            marginTop: "20px",
          }}
        >
          <thead
            style={{ backgroundColor: "#007AC3", color: "#fff", textAlign: "center" }}
          >
            <tr>
              <th style={{ textAlign: "center" }}>ID</th>
              <th style={{ textAlign: "center" }}>Sede</th>
              <th style={{ textAlign: "center" }}>Información</th>
              <th style={{ textAlign: "center" }}>Estado</th>
              <th style={{ textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentSedes.map((sede) => (
              <tr key={sede.idSede}>
                <td style={{ textAlign: "center" }}>{sede.idSede}</td>
                <td style={{ textAlign: "center" }}>{sede.nombreSede}</td>
                <td style={{ textAlign: "center" }}>{sede.informacion}</td>
                <td style={{ textAlign: "center" }}>
                  {sede.estado === 1 ? "Activo" : "Inactivo"}
                </td>
                <td style={{ textAlign: "center" }}>
                  <FaPencilAlt
                    style={{
                      color: "#007AC3",
                      cursor: "pointer",
                      marginRight: "10px",
                      fontSize: "20px",
                    }}
                    title="Editar"
                    onClick={() => {
                      if (checkPermission('Editar sede', 'No tienes permisos para editar sede')) {
                        handleShowModal(sede);
                      }
                    }}
                  />
                  {sede.estado === 1 ? (
                    <FaToggleOn
                      style={{
                        color: "#30c10c",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Inactivar"
                      onClick={() => {
                        if (checkPermission('Desactivar sede', 'No tienes permisos para desactivar sede')) {
                          toggleEstado(sede.idSede, sede.estado);
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
                        if (checkPermission('Activar sede', 'No tienes permisos para activar sede')) {
                          toggleEstado(sede.idSede, sede.estado);
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
              {editingSede ? "Editar Sede" : "Agregar Sede"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nombreSede">
                <Form.Label>Nombre Sede</Form.Label>
                <Form.Control
                  type="text"
                  name="nombreSede"
                  value={newSede.nombreSede}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="informacion">
                <Form.Label>Información</Form.Label>
                <Form.Control
                  as="textarea"
                  name="informacion"
                  value={newSede.informacion}
                  onChange={handleChange}
                  required
                  style={{
                    height: "150px", // Establece una altura fija
                    overflowY: "scroll", // Habilita el scroll vertical
                  }} // Deshabilitar redimensionamiento manualnp
                />
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newSede.estado}
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
                {editingSede ? "Actualizar" : "Crear"}
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

export default Sedes;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl } from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { format } from "date-fns";
import { parseISO } from "date-fns";

const formatDate = (date) => {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return date ? new Date(date).toLocaleDateString("es-ES", options) : "N/A";
};

function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [filteredEmpleados, setFilteredEmpleados] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState(null);
  const [newEmpleado, setNewEmpleado] = useState({
    fechaRegistro: "",
    fechaSalida: "",
    estado: 1,
    idPersona: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [personas, setPersonas] = useState([]);
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
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPermissions(response.data.permisos || {});

        const hasPermission =
          response.data.permisos['Ver empleados']

        setHasViewPermission(hasPermission);
        setIsPermissionsLoaded(true);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermissions();
    fetchPersonas();
  }, []);

  useEffect(() => {
    if (isPermissionsLoaded) {
      if (hasViewPermission) {
        fetchEmpleados();
      } else {
        //console.log(hasViewPermission)
        checkPermission('Ver empleados', 'No tienes permisos para ver empleados');
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

  const fetchEmpleados = async () => {
    try {
      const response = await axios.get("https://api.voluntariadoayuvi.com/empleados");
      setEmpleados(response.data);
      setFilteredEmpleados(response.data);
    } catch (error) {
      console.error("Error fetching empleados:", error);
    }
  };

  const fetchPersonas = async () => {
    try {
      const response = await axios.get("https://api.voluntariadoayuvi.com/personas");
      setPersonas(response.data);
    } catch (error) {
      console.error("Error fetching personas:", error);
    }
  };

  const fetchActiveEmpleados = async () => {
    try {
      if (hasViewPermission) {
        const response = await axios.get("https://api.voluntariadoayuvi.com/empleados/activos");
        setEmpleados(response.data);
        setFilteredEmpleados(response.data);
      } else {
        checkPermission('Ver empleados', 'No tienes permisos para ver empleados')
      }
    } catch (error) {
      console.error("Error fetching active empleados:", error);
    }
  };

  const fetchInactiveEmpleados = async () => {
    try {
      if (hasViewPermission) {
        const response = await axios.get("https://api.voluntariadoayuvi.com/empleados/inactivos");
        setEmpleados(response.data);
        setFilteredEmpleados(response.data);
      } else {
        checkPermission('Ver empleados', 'No tienes permisos para ver empleados')
      }
    } catch (error) {
      console.error("Error fetching inactive empleados:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = empleados.filter((empleado) => {
      const persona = empleado.persona || {};
      return (
        empleado.fechaRegistro.toLowerCase().includes(value) ||
        persona.nombre?.toLowerCase().includes(value)
      );
    });

    setFilteredEmpleados(filtered);
    setCurrentPage(1); // Reinicia a la primera página tras la búsqueda
  };

  const handleShowModal = (empleado = null) => {
    setEditingEmpleado(empleado);
    setNewEmpleado(
      empleado || {
        fechaRegistro: "",
        fechaSalida: "",
        estado: 1,
        idPersona: "",
      }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEmpleado(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmpleado({ ...newEmpleado, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmpleado) {
        await axios.put(
          `https://api.voluntariadoayuvi.com/empleados/update/${editingEmpleado.idEmpleado}`,
          newEmpleado
        );
        setAlertMessage("Empleado actualizado con éxito");
      } else {
        await axios.post("https://api.voluntariadoayuvi.com/empleados/create", newEmpleado);
        setAlertMessage("Empleado creado con éxito");
      }
      fetchEmpleados();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting empleado:", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`https://api.voluntariadoayuvi.com/empleados/update/${id}`, { estado: nuevoEstado });
      fetchEmpleados();
      setAlertMessage(
        `Empleado ${nuevoEstado === 1 ? "activado" : "inactivado"} con éxito`
      );
      setShowAlert(true);
    } catch (error) {
      console.error("Error toggling estado:", error);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentEmpleados = filteredEmpleados.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredEmpleados.length / rowsPerPage);

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
            Gestión de Empleados
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
            placeholder="Buscar por fecha de registro o nombre..."
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
            onClick={() => {
              if (checkPermission('Crear empleado', 'No tienes permisos para crear empleado')) {
                handleShowModal();
              }
            }}
          >
            Agregar Empleado
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
            onClick={fetchActiveEmpleados}
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
            onClick={fetchInactiveEmpleados}
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
            textAlign: "center",
          }}
        >
          <thead style={{ backgroundColor: "#007AC3", color: "#fff", textAlign: "center" }}>
            <tr>
              <th>ID</th>
              <th>Fecha Registro</th>
              <th>Fecha Salida</th>
              <th>Persona</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentEmpleados.map((empleado) => (
              <tr key={empleado.idEmpleado}>
                <td>{empleado.idEmpleado}</td>
                <td>{empleado.fechaRegistro ? format(parseISO(empleado.fechaRegistro), "dd-MM-yyyy") : "Sin fecha"}</td>
                <td>{empleado.fechaSalida ? format(parseISO(empleado.fechaSalida), "dd-MM-yyyy") : "Sin fecha"}</td>
                <td>{empleado.persona?.nombre || "Desconocido"}</td>
                <td>{empleado.estado === 1 ? "Activo" : "Inactivo"}</td>
                <td>
                  <FaPencilAlt
                    style={{ color: "#007AC3", cursor: "pointer", marginRight: "10px" }}
                    onClick={() => {
                      if (checkPermission('Editar empleado', 'No tienes permisos para editar empleado')) {
                        handleShowModal(empleado);
                      }
                    }}
                  />
                  {empleado.estado ? (
                    <FaToggleOn
                      style={{ color: "#30c10c", cursor: "pointer", marginLeft: "10px" }}
                      onClick={() => {
                        if (checkPermission('Desactivar empleado', 'No tienes permisos para desactivar empleado')) {
                          toggleEstado(empleado.idEmpleado, empleado.estado);
                        }
                      }}
                    />
                  ) : (
                    <FaToggleOff
                      style={{ color: "#e10f0f", cursor: "pointer", marginLeft: "10px" }}
                      onClick={() => {
                        if (checkPermission('Activar empleado', 'No tienes permisos para activar empleado')) {
                          toggleEstado(empleado.idEmpleado, empleado.estado);
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
          <Modal.Header closeButton>
            <Modal.Title>
              {editingEmpleado ? "Editar Empleado" : "Agregar Empleado"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="fechaRegistro">
                <Form.Label>Fecha Registro</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaRegistro"
                  value={newEmpleado.fechaRegistro}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="fechaSalida">
                <Form.Label>Fecha Salida</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaSalida"
                  value={newEmpleado.fechaSalida}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="idPersona">
                <Form.Label>Persona</Form.Label>
                <Form.Control
                  as="select"
                  name="idPersona"
                  value={newEmpleado.idPersona}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar Persona</option>
                  {personas.map((persona) => (
                    <option key={persona.idPersona} value={persona.idPersona}>
                      {persona.nombre}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newEmpleado.estado}
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

                {editingEmpleado ? "Actualizar" : "Crear"}
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

export default Empleados;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl } from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { getUserDataFromToken } from "../../utils/jwtUtils"; // token
import { format } from "date-fns";
import { parseISO } from "date-fns";

function Rifas() {
  const [rifas, setRifas] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [filteredRifas, setFilteredRifas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRifa, setEditingRifa] = useState(null);
  const [newRifa, setNewRifa] = useState({
    nombreRifa: "",
    descripcion: "",
    precioBoleto: "",
    fechaInicio: "",
    fechaFin: "",
    ventaTotal: "",
    idSede: "",
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


  // extraer el dato para idSede
  const sedeId = localStorage.getItem("sedeId");

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
        response.data.permisos['Ver rifas']

      setHasViewPermission(hasPermission);
      setIsPermissionsLoaded(true);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermissions();
    fetchSedes();
  }, []);

   useEffect(() => {
      if (isPermissionsLoaded) {
        if (hasViewPermission) {
          fetchRifas();
        } else {
          checkPermission('Ver rifas', 'No tienes permisos para ver rifas');
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

  // Obtener el idPersona desde localStorage
  const idSede = getUserDataFromToken(localStorage.getItem("token"))?.idSede; // ! USO DE LA FUNCIÓN getUserDataFromToken

  const idUsuario = getUserDataFromToken(localStorage.getItem("token"))?.idUsuario; // ! USO DE LA FUNCIÓN getUserDataFromToken

  const fetchRifas = async () => {
    try {
      const response = await axios.get("https://api.voluntariadoayuvi.com/rifas");
      setRifas(response.data);
      setFilteredRifas(response.data);
    } catch (error) {
      console.error("Error fetching rifas:", error);
    }
  };

  const fetchSedes = async () => {
    try {
      const response = await axios.get("https://api.voluntariadoayuvi.com/sedes");
      setSedes(response.data);
    } catch (error) {
      console.error("Error fetching sedes:", error);
    }
  };

  const fetchActiveRifas = async () => {
    try {
      if (hasViewPermission) {
      const response = await axios.get("https://api.voluntariadoayuvi.com/rifas/activos");
      setFilteredRifas(response.data);
    } else {
      checkPermission('Ver rifas', 'No tienes permisos para ver rifas')
    }
    } catch (error) {
      console.error("Error fetching active rifas:", error);
    }
  };

  const fetchInactiveRifas = async () => {
    try {
      if (hasViewPermission) {
      const response = await axios.get("https://api.voluntariadoayuvi.com/rifas/inactivos");
      setFilteredRifas(response.data);
    } else {
      checkPermission('Ver rifas', 'No tienes permisos para ver rifas')
    }
    } catch (error) {
      console.error("Error fetching inactive rifas:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = rifas.filter((rifa) =>
      rifa.nombreRifa.toLowerCase().includes(value) ||
      rifa.descripcion.toLowerCase().includes(value)
    );

    setFilteredRifas(filtered);
    setCurrentPage(1);
  };

  const handleShowModal = (rifa = null) => {
    setEditingRifa(rifa);
    setNewRifa(
      rifa
        ? {
          ...rifa,
          fechaInicio: rifa.fechaInicio
            ? format(parseISO(rifa.fechaInicio), "yyyy-MM-dd")
            : "",
          fechaFin: rifa.fechaFin
            ? format(parseISO(rifa.fechaFin), "yyyy-MM-dd")
            : "",
        }
        : {
          nombreRifa: "",
          descripcion: "",
          precioBoleto: "",
          fechaInicio: "",
          fechaFin: "",
          ventaTotal: "",
          idSede: idSede || "",
          estado: 1,
        }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRifa(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRifa({ ...newRifa, [name]: value });
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

    // Validar las fechas
    if (newRifa.fechaInicio && newRifa.fechaFin && new Date(newRifa.fechaInicio) > new Date(newRifa.fechaFin)) {
      setAlertMessage("La fecha de inicio no puede ser mayor que la fecha de fin.");
      setShowAlert(true);
      return;
    }

    try {
      const data = {
        ...newRifa,
        estado: parseInt(newRifa.estado, 10),
        idSede: idSede || parseInt(newRifa.idSede, 10),
      };

      if (editingRifa) {
        await axios.put(`https://api.voluntariadoayuvi.com/rifas/${editingRifa.idRifa}`, data);
        setAlertMessage("Rifa actualizada con éxito");
        // bitacora
        await logBitacora(`Rifa actualizada: ${editingRifa.nombreRifa}`, 28);
      } else {
        await axios.post("https://api.voluntariadoayuvi.com/rifas", data);
        setAlertMessage("Rifa creada con éxito");
        // bitacora
        await logBitacora(`Rifa creada: ${newRifa.nombreRifa}`, 24);
      }
      fetchRifas();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting rifa:", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`https://api.voluntariadoayuvi.com/rifas/${id}`, { estado: nuevoEstado });
      fetchRifas();
      setAlertMessage(
        `Rifa ${nuevoEstado === 1 ? "activada" : "inactivada"} con éxito`
      );
      setShowAlert(true);
    } catch (error) {
      console.error("Error toggling estado:", error);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRifas = filteredRifas.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredRifas.length / rowsPerPage);

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
            Gestión de Rifas
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
            placeholder="Buscar rifa por nombre o descripción..."
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
              if (checkPermission('Crear rifa', 'No tienes permisos para crear rifa')) {
                handleShowModal();
              }
            }}
          >
            Agregar Rifa
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
            onClick={fetchActiveRifas}
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
            onClick={fetchInactiveRifas}
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
            textAlign: "center",
          }}
        >
          <thead style={{ backgroundColor: "#007AC3", color: "#fff", textAlign: "center" }}>
            <tr>
              <th>ID</th>
              <th>Nombre Rifa</th>
              <th>Descripción</th>
              <th>Precio del boleto</th>
              <th>Fecha de inicio</th>
              <th>Fecha de fin</th>
              <th>Venta total</th>
              <th>Sede</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center" }}>
            {currentRifas.map((rifa) => (
              <tr key={rifa.idRifa}>
                <td>{rifa.idRifa}</td>
                <td>{rifa.nombreRifa}</td>
                <td>{rifa.descripcion}</td>
                <td>Q. {rifa.precioBoleto}</td>
                <td>{rifa.fechaInicio ? format(parseISO(rifa.fechaInicio), "dd-MM-yyyy") : "Sin fecha"}</td>
                <td>{rifa.fechaFin ? format(parseISO(rifa.fechaFin), "dd-MM-yyyy") : "Sin fecha"}</td>
                <td>Q. {rifa.ventaTotal}</td>
                <td>
                  {
                    sedes.find((sede) => sede.idSede === rifa.idSede)?.nombreSede || "Sin sede"
                  }
                </td>
                <td>{rifa.estado === 1 ? "Activo" : "Inactivo"}</td>
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
                      if (checkPermission('Editar rifa', 'No tienes permisos para editar rifa')) {
                        handleShowModal(rifa);
                      }
                    }}
                  />
                  {rifa.estado ? (
                    <FaToggleOn
                      style={{
                        color: "#30c10c",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Inactivar"
                      onClick={() => {
                        if (checkPermission('Desactivar rifa', 'No tienes permisos para desactivar rifa')) {
                          toggleEstado(rifa.idRifa, rifa.estado);
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
                        if (checkPermission('Activar rifa', 'No tienes permisos para activar rifa')) {
                          toggleEstado(rifa.idRifa, rifa.estado);
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
              {editingRifa ? "Editar Rifa" : "Agregar Rifa"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nombreRifa">
                <Form.Label>Nombre de la Rifa</Form.Label>
                <Form.Control
                  type="text"
                  name="nombreRifa"
                  value={newRifa.nombreRifa}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="descripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  name="descripcion"
                  value={newRifa.descripcion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="fechaInicio">
                <Form.Label>Fecha de Inicio</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaInicio"
                  value={newRifa.fechaInicio}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="fechaFin">
                <Form.Label>Fecha de Fin</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaFin"
                  value={newRifa.fechaFin}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="precioBoleto">
                <Form.Label>Precio del Boleto</Form.Label>
                <Form.Control
                  type="number"
                  name="precioBoleto"
                  value={newRifa.precioBoleto}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idSede">
                <Form.Label>Sede</Form.Label>
                <Form.Control
                  as="select"
                  name="idSede"
                  value={newRifa.idSede}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar Sede</option>
                  {sedes.map((sede) => (
                    <option key={sede.idSede} value={sede.idSede}>
                      {sede.nombreSede}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newRifa.estado}
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
                {editingRifa ? "Actualizar" : "Crear"}
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

export default Rifas;

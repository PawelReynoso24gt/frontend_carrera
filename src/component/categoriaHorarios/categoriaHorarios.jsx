import React, { useEffect, useState } from "react";
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
  Breadcrumb
} from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";

function CategoriasHorarios() {
  const [categoriasHorarios, setCategoriasHorarios] = useState([]);
  const [filteredCategoriasHorarios, setFilteredCategoriasHorarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategoriaHorario, setEditingCategoriaHorario] = useState(null);
  const [newCategoriaHorario, setNewCategoriaHorario] = useState({
    categoria: "",
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
        response.data.permisos['Ver categoria horarios']

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
          fetchCategoriasHorarios();
        } else {
          checkPermission('Ver categoria horarios', 'No tienes permisos para ver categoria horarios');
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

  const fetchCategoriasHorarios = async () => {
    try {
      const response = await axios.get("https://api.voluntariadoayuvi.com/categoriaHorarios");
      setCategoriasHorarios(response.data);
      setFilteredCategoriasHorarios(response.data);
    } catch (error) {
      console.error("Error fetching categorías de horarios:", error);
    }
  };

  const fetchActiveCategoriasHorarios = async () => {
    try {
      if (hasViewPermission) {
      const response = await axios.get(
        "https://api.voluntariadoayuvi.com/categoriaHorarios/activas"
      );
      setCategoriasHorarios(response.data);
      setFilteredCategoriasHorarios(response.data);
    } else {
      checkPermission('Ver categoria horarios', 'No tienes permisos para ver categoria horarios')
    }
    } catch (error) {
      console.error("Error fetching active categorías de horarios:", error);
    }
  };

  const fetchInactiveCategoriasHorarios = async () => {
    try {
      if (hasViewPermission) {
      const response = await axios.get(
        "https://api.voluntariadoayuvi.com/categoriaHorarios/inactivas"
      );
      setCategoriasHorarios(response.data);
      setFilteredCategoriasHorarios(response.data);
    } else {
      checkPermission('Ver categoria horarios', 'No tienes permisos para ver categoria horarios')
    }
    } catch (error) {
      console.error("Error fetching inactive categorías de horarios:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = categoriasHorarios.filter((categoria) =>
      categoria.categoria.toLowerCase().includes(value)
    );

    setFilteredCategoriasHorarios(filtered);
    setCurrentPage(1);
  };

  const handleShowModal = (categoriaHorario = null) => {
    setEditingCategoriaHorario(categoriaHorario);
    setNewCategoriaHorario(categoriaHorario || { categoria: "", estado: 1 });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategoriaHorario(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategoriaHorario({ ...newCategoriaHorario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!regex.test(newCategoriaHorario.categoria)) {
      setAlertMessage("La categoría solo debe contener letras y espacios.");
      setShowAlert(true);
      return;
    }

    try {
      if (editingCategoriaHorario) {
        await axios.put(
          `https://api.voluntariadoayuvi.com/categoriaHorarios/${editingCategoriaHorario.idCategoriaHorario}`,
          newCategoriaHorario
        );
        setAlertMessage("Categoría de horario actualizada con éxito");
      } else {
        await axios.post("https://api.voluntariadoayuvi.com/categoriaHorarios", newCategoriaHorario);
        setAlertMessage("Categoría de horario creada con éxito");
      }
      fetchCategoriasHorarios();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting categoría de horario:", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;

      // Realiza la solicitud para cambiar el estado
      await axios.put(`https://api.voluntariadoayuvi.com/categoriaHorarios/${id}`, {
        estado: nuevoEstado,
      });

      // Actualiza la lista de categorías global
      const updatedCategorias = categoriasHorarios.map((categoria) =>
        categoria.idCategoriaHorario === id
          ? { ...categoria, estado: nuevoEstado }
          : categoria
      );
      setCategoriasHorarios(updatedCategorias);

      // Filtra nuevamente las categorías para actualizar la vista actual
      const updatedFilteredCategorias = updatedCategorias.filter(
        (categoria) => categoria.estado === (estadoActual === 1 ? 1 : 0)
      );
      setFilteredCategoriasHorarios(
        filteredCategoriasHorarios.filter((categoria) => categoria.idCategoriaHorario !== id)
      );

      setAlertMessage(
        `Categoría de horario ${nuevoEstado === 1 ? "activada" : "inactivada"
        } con éxito`
      );
      setShowAlert(true);
    } catch (error) {
      console.error("Error toggling estado:", error.response?.data || error);
    }
  };


  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentCategorias = filteredCategoriasHorarios.slice(
    indexOfFirstRow,
    indexOfLastRow
  );

  const totalPages = Math.ceil(filteredCategoriasHorarios.length / rowsPerPage);

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


    <div className="container mt-4" style={{ maxWidth: "100%", margin: "0 auto"}}>

      {/* Contenedor Principal */}
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
        <div className="row justify-content-center" style={{marginBottom: "20px" }}>
        <div className="col-12 text-center">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333", textAlign: "center" }}>
            Categoría de Horarios
          </h3>
        </div>
      </div>


        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar por nombre..."
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
              if (checkPermission('Crear categoria horario', 'No tienes permisos para crear categoria horario')) {
                handleShowModal();
              }
            }}
          >
            Agregar Categoría
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
            onClick={fetchActiveCategoriasHorarios}
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
            onClick={fetchInactiveCategoriasHorarios}
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
              <th style={{ textAlign: "center" }}>Categoría</th>
              <th style={{ textAlign: "center" }}>Estado</th>
              <th style={{ textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentCategorias.map((categoria) => (
              <tr key={categoria.idCategoriaHorario}>
                <td style={{ textAlign: "center" }}>{categoria.idCategoriaHorario}</td>
                <td style={{ textAlign: "center" }}>{categoria.categoria}</td>
                <td style={{ textAlign: "center" }}>
                  {categoria.estado === 1 ? "Activo" : "Inactivo"}
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
                      if (checkPermission('Editar categoria horario', 'No tienes permisos para editar categoria horario')) {
                        handleShowModal(categoria);
                      }
                    }}
                  />
                  {categoria.estado === 1 ? (
                    <FaToggleOn
                      style={{
                        color: "#30c10c",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Inactivar"
                      onClick={() => {
                        if (checkPermission('Desactivar categoria horario', 'No tienes permisos para desactivar categoria horario')) {
                          toggleEstado(categoria.idCategoriaHorario, categoria.estado);
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
                        if (checkPermission('Activar categoria horario', 'No tienes permisos para activar categoria horario')) {
                          toggleEstado(categoria.idCategoriaHorario, categoria.estado);
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
              {editingCategoriaHorario
                ? "Editar Categoría de Horario"
                : "Agregar Categoría de Horario"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="categoria">
                <Form.Label>Nombre Categoría</Form.Label>
                <Form.Control
                  type="text"
                  name="categoria"
                  value={newCategoriaHorario.categoria}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newCategoriaHorario.estado}
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
                {editingCategoriaHorario ? "Actualizar" : "Crear"}
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
    </div>

  );
}

export default CategoriasHorarios;
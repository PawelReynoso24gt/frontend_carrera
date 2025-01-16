import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl } from 'react-bootstrap';
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";

function DetalleHorariosComponent() {
  const [detalles, setDetalles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDetalle, setEditingDetalle] = useState(null);
  const [newDetalle, setNewDetalle] = useState({ cantidadPersonas: '', idHorario: '', idCategoriaHorario: '', estado: 1 });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [filter, setFilter] = useState('activos');
  const [categorias, setCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDetalleHorarios, setFilteredDetalleHorarios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showPermissionModal, setShowPermissionModal] = useState(false); // Nuevo estado
  const [permissionMessage, setPermissionMessage] = useState('');
  const [permissions, setPermissions] = useState({});
  const [horarios, setHorarios] = useState([]);


  const fetchCategorias = async () => {
    try {
      const response = await axios.get('http://localhost:5000/categoriaHorarios');
      const data = Array.isArray(response.data) ? response.data : Object.values(response.data); // Si es objeto, convierte en array
      setCategorias(data);
    } catch (error) {
      console.error('Error fetching categorias:', error);
      setCategorias([]); // Manejo de errores: asegura un array vacío
    }
  };

  // Cargar los horarios
  const fetchHorarios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/horarios'); // Cambiar al endpoint real
      setHorarios(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching horarios:', error);
      setHorarios([]);
    }
  };

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/usuarios/permisos', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Ajusta según dónde guardes el token
          },
        });
        setPermissions(response.data.permisos || {});
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };
  
    1,
      fetchCategorias();
      fetchHorarios(); 
    fetchActiveDetalles();
    fetchPermissions();
  }, []);


  const checkPermission = (permission, message) => {
    if (!permissions[permission]) {
      setPermissionMessage(message);
      setShowPermissionModal(true);
      return false;
    }
    return true;
  };
  
 const fetchDetalleHorarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/detalle_horarios");
      setDetalles(response.data);
      setFilter(response.data);
    } catch (error) {
      console.error("Error fetching detalle de horarios:", error);
    }
  };

  const fetchActiveDetalles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/detalle_horarios/activos');
      setDetalles(response.data);
      setFilteredDetalleHorarios(response.data);
    } catch (error) {
      console.error('Error fetching active detalles:', error);
    }
  };

  const fetchInactiveDetalles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/detalle_horarios/inactivos', {
        params: { estado: 0 }
      });
      setDetalles(response.data.filter(detalle => detalle.estado === 0));
      setFilteredDetalleHorarios(response.data);
    } catch (error) {
      console.error('Error fetching active detalles:', error);
    }
  };

  const handleShowModal = (detalle = null) => {
    setEditingDetalle(detalle);
    setNewDetalle(detalle || { cantidadPersonas: '', idHorario: '', idCategoriaHorario: '', estado: 1 });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDetalle(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDetalle({ ...newDetalle, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDetalle) {
        await axios.put(`http://localhost:5000/detalle_horarios/${editingDetalle.idDetalleHorario}`, newDetalle);
        setAlertMessage('Detalle de horario actualizado con éxito');
      } else {
        await axios.post('http://localhost:5000/detalle_horarios', newDetalle);
        setAlertMessage('Detalle de horario creado con éxito');
      }
      filter === 'activos' ? fetchActiveDetalles() : fetchInactiveDetalles();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting detalle de horario:', error);
    }
  };

  const toggleDetalleEstado = async (id, currentEstado) => {
    try {
      const newEstado = currentEstado === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/detalle_horarios/${id}`, { estado: newEstado });
      setAlertMessage(`Detalle de horario ${newEstado === 1 ? 'activado' : 'desactivado'} con éxito`);
      setShowAlert(true);
      filter === 'activos' ? fetchActiveDetalles() : fetchInactiveDetalles();
    } catch (error) {
      console.error('Error toggling estado of detalle de horario:', error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    // Filtrar los datos por cantidadPersonas
    const filtered = detalles.filter((detalle) => {
      const cantidadPersonas = detalle.cantidadPersonas?.toString().toLowerCase() || "";
      return cantidadPersonas.includes(value);
    });

    setFilteredDetalleHorarios(filtered);
    setCurrentPage(1);
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentDetalleHorarios = filteredDetalleHorarios.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredDetalleHorarios.length / rowsPerPage);

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
            Gestión de Detalles de Horarios
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
            placeholder="Buscar detalle por categoria..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>

        <Button
          style={{
            backgroundColor: "#007abf",
            borderColor: "#007AC3",
            padding: "5px 10px",
            width: "220px",
            marginRight: "10px",
            fontWeight: "bold",
            color: "#fff",
          }}
          onClick={() => {
            if (checkPermission('Crear detalle horario', 'No tienes permisos para crear detalle horario')) {
              handleShowModal();
            }
          }}
        >
          Agregar Detalle de Horario
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
          onClick={fetchActiveDetalles}
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
          onClick={fetchInactiveDetalles}
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
              <th>Cantidad de Personas</th>
              <th>ID Horario</th>
              <th>ID Categoría Horario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center" }}>
            {currentDetalleHorarios.map((detalle) => (
              <tr key={detalle.idDetalleHorario}>
                <td>{detalle.idDetalleHorario}</td>
                <td>{detalle.cantidadPersonas}</td>
                <td>{detalle.idHorario}</td>
                <td>{detalle.categoriaHorario?.categoria || 'Sin categoría'}</td> {/* Mostrar nombre */}
                <td>{detalle.estado ? "Activo" : "Inactivo"}</td>
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
                      if (checkPermission('Editar detalle horario', 'No tienes permisos para editar detalle horario')) {
                        handleShowModal(detalle);
                      }
                    }}
                  />
                  {detalle.estado ? (
                    <FaToggleOn
                      style={{
                        color: "#30c10c",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Inactivar"
                      onClick={() => toggleDetalleEstado(detalle.idDetalleHorario, detalle.estado)}
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
                      const actionPermission = detalle.estado ? 'Desactivar detalle horario' : 'Activar detalle horario';
                      const actionMessage = detalle.estado
                        ? 'No tienes permisos para desactivar detalle horario'
                        : 'No tienes permisos para activar detalle horario';
  
                      if (checkPermission(actionPermission, actionMessage)) {
                        toggleDetalleEstado(detalle.idDetalleHorario, detalle.estado);
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
              {editingDetalle ? "Editar Detalle de Horario" : "Agregar Detalle de Horario"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="cantidadPersonas">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Cantidad de Personas
                </Form.Label>
                <Form.Control
                  type="number"
                  name="cantidadPersonas"
                  value={newDetalle.cantidadPersonas}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idHorario">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  ID Horario
                </Form.Label>
                <Form.Control
                  type="number"
                  name="idHorario"
                  value={newDetalle.idHorario}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un horario</option>
                  {horarios.map((horario) => (
                    <option key={horario.idHorario} value={horario.idHorario}>
                      {horario.nombreHorario || `Horario ${horario.idHorario}`}
                    </option>
                    ))}
                 </Form.Control>
              </Form.Group>
              <Form.Group controlId="idCategoriaHorario">
                <Form.Label>Categoría Horario</Form.Label>
                <Form.Control
                  as="select"
                  name="idCategoriaHorario"
                  value={newDetalle.idCategoriaHorario}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  {Array.isArray(categorias) &&
                    categorias.map((categoria) => (
                      <option key={categoria.idCategoriaHorario} value={categoria.idCategoriaHorario}>
                        {categoria.categoria}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Estado
                </Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newDetalle.estado}
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
                {editingDetalle ? "Actualizar" : "Crear"}
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

export default DetalleHorariosComponent;
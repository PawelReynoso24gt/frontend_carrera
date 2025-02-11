import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert } from 'react-bootstrap';
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";

function TipoStandsComponent() {
  const [tipoStands, setTipoStands] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTipoStand, setEditingTipoStand] = useState(null);
  const [newTipoStand, setNewTipoStand] = useState({ tipo: '', descripcion: '', estado: 1 });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [filter, setFilter] = useState('activos');
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
          response.data.permisos['Ver tipo stands']

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
        fetchActiveTipoStands();
      } else {
        checkPermission('Ver tipo stands', 'No tienes permisos para ver tipo stands');
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


  const fetchActiveTipoStands = async () => {
    try {
      if (hasViewPermission) {
        const response = await axios.get('https://api.voluntariadoayuvi.com/tipo_stands/activos');
        setTipoStands(response.data);
        setFilter('activos');
      } else {
        checkPermission('Ver tipo stands', 'No tienes permisos para ver tipo stands')
      }
    } catch (error) {
      console.error('Error fetching active tipoStands:', error);
    }
  };

  const fetchInactiveTipoStands = async () => {
    try {
      if (hasViewPermission) {
        const response = await axios.get('https://api.voluntariadoayuvi.com/tipo_stands', {
          params: { estado: 0 }
        });
        setTipoStands(response.data.filter(tipoStand => tipoStand.estado === 0));
        setFilter('inactivos');
      } else {
        checkPermission('Ver tipo stands', 'No tienes permisos para ver tipo stands')
      }
    } catch (error) {
      console.error('Error fetching inactive tipoStands:', error);
    }
  };

  const handleShowModal = (tipoStand = null) => {
    setEditingTipoStand(tipoStand);
    setNewTipoStand(tipoStand || { tipo: '', descripcion: '', estado: 1 });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTipoStand(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTipoStand({ ...newTipoStand, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTipoStand) {
        await axios.put(`https://api.voluntariadoayuvi.com/tipo_stands/${editingTipoStand.idTipoStands}`, newTipoStand);
        setAlertMessage('Tipo de stand actualizado con éxito');
      } else {
        await axios.post('https://api.voluntariadoayuvi.com/tipo_stands', newTipoStand);
        setAlertMessage('Tipo de stand creado con éxito');
      }
      filter === 'activos' ? fetchActiveTipoStands() : fetchInactiveTipoStands();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting tipo de stand:', error);
    }
  };

  const toggleTipoStandEstado = async (id, currentEstado) => {
    try {
      const newEstado = currentEstado === 1 ? 0 : 1;
      await axios.put(`https://api.voluntariadoayuvi.com/tipo_stands/${id}`, { estado: newEstado });
      setAlertMessage(`Tipo de stand ${newEstado === 1 ? 'activado' : 'desactivado'} con éxito`);
      setShowAlert(true);
      filter === 'activos' ? fetchActiveTipoStands() : fetchInactiveTipoStands();
    } catch (error) {
      console.error('Error toggling estado of tipo de stand:', error);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentTipoStands = tipoStands.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(tipoStands.length / rowsPerPage);

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
            Gestión de Tipos de Stands
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
          maxWidth: "100%",
          margin: "0 auto",
        }}
      >
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
            if (checkPermission('Crear tipo stand', 'No tienes permisos para crear tipo stand')) {
              handleShowModal();
            }
          }}
        >
          Agregar Tipo de Stand
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
          onClick={fetchActiveTipoStands}
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
          onClick={fetchInactiveTipoStands}
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
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center" }}>
            {currentTipoStands.map((tipoStand) => (
              <tr key={tipoStand.idTipoStands}>
                <td>{tipoStand.idTipoStands}</td>
                <td>{tipoStand.tipo}</td>
                <td>{tipoStand.descripcion}</td>
                <td>{tipoStand.estado ? "Activo" : "Inactivo"}</td>
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
                      if (checkPermission('Editar tipo stand', 'No tienes permisos para editar tipo stand')) {
                        handleShowModal(tipoStand);
                      }
                    }}
                  />
                  {tipoStand.estado === 1 ? (
                    <FaToggleOn
                      style={{
                        color: "#30c10c",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Inactivar"
                      onClick={() => {
                        if (checkPermission('Desactivar tipo stand', 'No tienes permisos para desactivar tipo stand')) {
                          toggleTipoStandEstado(tipoStand.idTipoStands, tipoStand.estado);
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
                        if (checkPermission('Activar tipo stand', 'No tienes permisos para activar tipo stand')) {
                          toggleTipoStandEstado(tipoStand.idTipoStands, tipoStand.estado);
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
              {editingTipoStand ? "Editar Tipo de Stand" : "Agregar Tipo de Stand"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="tipo">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Tipo
                </Form.Label>
                <Form.Control
                  type="text"
                  name="tipo"
                  value={newTipoStand.tipo}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="descripcion">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Descripción
                </Form.Label>
                <Form.Control
                  type="text"
                  name="descripcion"
                  value={newTipoStand.descripcion}
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
                  value={newTipoStand.estado}
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
                {editingTipoStand ? "Actualizar" : "Crear"}
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

export default TipoStandsComponent;
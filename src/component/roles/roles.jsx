import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl } from "react-bootstrap";

function Roles() {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [newRole, setNewRole] = useState({
    roles: "",
    estado: 1,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
    const [showPermissionModal, setShowPermissionModal] = useState(false); // Nuevo estado
    const [permissionMessage, setPermissionMessage] = useState('');
    const [permissions, setPermissions] = useState({});

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
  
    fetchPermissions();
    fetchRoles();
  }, []);

  const checkPermission = (permission, message) => {
    if (!permissions[permission]) {
      setPermissionMessage(message);
      setShowPermissionModal(true);
      return false;
    }
    return true;
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/roles");
      setRoles(response.data);
      setFilteredRoles(response.data); 
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchActiveRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/roles/activos");
      setRoles(response.data);
      setFilteredRoles(response.data);
    } catch (error) {
      console.error("Error fetching active roles:", error);
    }
  };

  const fetchInactiveRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/roles/inactivos");
      setRoles(response.data);
      setFilteredRoles(response.data);
    } catch (error) {
      console.error("Error fetching inactive roles:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = roles.filter((role) =>
      role.roles.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRoles(filtered);
  };

  const handleShowModal = (role = null) => {
    setEditingRole(role);
    setNewRole(role || { roles: "", estado: 1 });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRole(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "roles") {
      const regex = /^[a-zA-Z\s]*$/; 
      if (!regex.test(value)) {
        return; 
      }
    }

    setNewRole({ ...newRole, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRole) {
        await axios.put(
          `http://localhost:5000/roles/update/${editingRole.idRol}`,
          newRole
        );
        setAlertMessage("Rol actualizado con éxito");
      } else {
        await axios.post("http://localhost:5000/roles/create", newRole);
        setAlertMessage("Rol creado con éxito");
      }
      fetchRoles();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting role:", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/roles/update/${id}`, {
        estado: nuevoEstado,
      });
      fetchRoles();
      setAlertMessage(
        `Rol ${nuevoEstado === 1 ? "activado" : "inactivado"} con éxito`
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
            Gestión de Roles
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
        {/* Barra de Búsqueda */}
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar rol por nombre..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>

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
            if (checkPermission('Crear rol', 'No tienes permisos para crear rol')) {
              handleShowModal();
            }
          }}
        >
          Agregar Rol
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
          onClick={fetchActiveRoles}
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
          onClick={fetchInactiveRoles}
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
          <thead style={{ backgroundColor: "#007AC3", color: "#fff" }}>
            <tr>
              <th>ID</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map((role) => (
              <tr key={role.idRol}>
                <td>{role.idRol}</td>
                <td>{role.roles}</td>
                <td>{role.estado === 1 ? "Activo" : "Inactivo"}</td>
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
                    onClick={() => {
                      if (checkPermission('Editar rol', 'No tienes permisos para editar rol')) {
                        handleShowModal(role);
                      }
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                  style={{
                    backgroundColor: role.estado ? "#6c757d" : "#28a745",
                    borderColor: role.estado ? "#6c757d" : "#28a745",
                    padding: "5px 10px",
                    width: "100px",
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                  onClick={() => {
                    const actionPermission = role.estado ? 'Desactivar rol' : 'Activar rol';
                    const actionMessage = role.estado
                      ? 'No tienes permisos para desactivar roles'
                      : 'No tienes permisos para activar roles';

                    if (checkPermission(actionPermission, actionMessage)) {
                      toggleEstado(role.idRol, role.estado);
                    }
                  }}
                >
                  {role.estado ? "Inactivar" : "Activar"}
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
              {editingRole ? "Editar Rol" : "Agregar Rol"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="roles">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Nombre del Rol
                </Form.Label>
                <Form.Control
                  type="text"
                  name="roles"
                  value={newRole.roles}
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
                  value={newRole.estado}
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
                {editingRole ? "Actualizar" : "Crear"}
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

export default Roles;

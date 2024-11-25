import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";

function PermisosComponent() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/usuarios");
      setUsuarios(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching usuarios:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/roles");
      setRoles(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleShowModal = (usuario) => {
    setSelectedUser(usuario);
    setSelectedRole(usuario.idRol);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setSelectedRole("");
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleUpdateRole = async () => {
    if (!selectedRole) {
      setAlertMessage("Debe seleccionar un rol válido.");
      setShowAlert(true);
      return;
    }

    try {
      await axios.put(`http://localhost:5000/usuarios/${selectedUser.idUsuario}`, {
        idRol: selectedRole,
      });
      setAlertMessage("Rol actualizado con éxito.");
      setShowAlert(true);
      fetchUsuarios();
      handleCloseModal();
    } catch (error) {
      console.error("Error updating role:", error);
      setAlertMessage("Ocurrió un error al actualizar el rol.");
      setShowAlert(true);
    }
  };

  return (
    <>
      <div className="row" style={{ textAlign: "center", marginBottom: "20px" }}>
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
            Gestión de Usuarios y Roles
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
              <th>Usuario</th>
              <th>Estado</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
             <tr key={usuario.idUsuario}>
             <td>{usuario.idUsuario}</td>
             <td>{usuario.usuario}</td>
             <td>{usuario.estado === 1 ? "Activo" : "Inactivo"}</td>
             <td>{usuario.role ? usuario.role.roles : "Sin rol"}</td>
             <td>
               <Button variant="warning" onClick={() => handleShowModal(usuario)}>
                 Editar Rol
               </Button>
             </td>
           </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal para editar rol */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Rol de Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="rol">
              <Form.Label>Seleccionar Nuevo Rol</Form.Label>
              <Form.Control
                as="select"
                value={selectedRole}
                onChange={handleRoleChange}
              >
                <option value="">Seleccione un rol</option>
                {roles.map((roles) => (
                  <option key={roles.idRol} value={roles.idRol}>
                    {roles.roles}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseModal}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateRole}
            style={{ backgroundColor: "#743D90" }}
          >
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PermisosComponent;

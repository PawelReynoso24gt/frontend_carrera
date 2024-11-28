import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";

function PermisosRolesComponent() {
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [assignedPermisos, setAssignedPermisos] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchRoles();
    fetchPermisos();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/roles");
      setRoles(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchPermisos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/permisos");
      setPermisos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching permisos:", error);
    }
  };

  const fetchAssignedPermisos = async (roleId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/asignacionPermisos?roleId=${roleId}`
      );
  
      // Almacena el estado original y el estado actual
      setAssignedPermisos(
        response.data.map((assignment) => ({
          idPermiso: assignment.idPermiso,
          estado: assignment.estado, // Estado actual (1 o 0)
          originalEstado: assignment.estado, // Guarda el estado original
        }))
      );
    } catch (error) {
      console.error("Error fetching assigned permisos:", error);
    }
  };

  const handleShowModal = (role) => {
    setAssignedPermisos([]); // Limpia el estado de los permisos
    setSelectedRole(role); // Cambia al nuevo rol seleccionado
    fetchAssignedPermisos(role.idRol); // Carga los permisos del nuevo rol
    setShowModal(true); // Muestra el modal
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRole(null);
    setAssignedPermisos([]);
  };

  const handleCheckboxChange = (permisoId) => {
    const permisoIndex = assignedPermisos.findIndex((p) => p.idPermiso === permisoId);
  
    if (permisoIndex >= 0) {
      // Cambia el estado actual del permiso
      const updatedPermisos = [...assignedPermisos];
      updatedPermisos[permisoIndex].estado =
        updatedPermisos[permisoIndex].estado === 1 ? 0 : 1; // Alternar estado
      setAssignedPermisos(updatedPermisos);
    } else {
      // Si no está en la lista, agregarlo como activado
      setAssignedPermisos([
        ...assignedPermisos,
        { idPermiso: permisoId, estado: 1, originalEstado: 0 }, // Asignación nueva
      ]);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const permisosToSend = assignedPermisos.filter(
        (permiso) => permiso.estado !== permiso.originalEstado // Solo los permisos que cambiaron
      );
  
      await axios.post(`http://localhost:5000/asignacionPermisos/update`, {
        roleId: selectedRole.idRol,
        permisos: permisosToSend,
      });
  
      // Refrescar permisos después de guardar cambios
      await fetchAssignedPermisos(selectedRole.idRol);
  
      setAlertMessage("Permisos actualizados con éxito.");
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error saving changes:", error);
      setAlertMessage("Ocurrió un error al actualizar los permisos.");
      setShowAlert(true);
    }
  };

  return (
    <>
      <div
        className="container mt-4"
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 className="text-center" style={{ fontWeight: "bold", color: "#333" }}>
          Gestión de Roles y Permisos
        </h3>

        <Alert
          variant="success"
          show={showAlert}
          onClose={() => setShowAlert(false)}
          dismissible
          style={{ marginTop: "20px", fontWeight: "bold" }}
        >
          {alertMessage}
        </Alert>

        <Table striped bordered hover responsive className="mt-3">
          <thead style={{ backgroundColor: "#007AC3", color: "#fff" }}>
            <tr>
              <th>ID</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.idRol}>
                <td>{role.idRol}</td>
                <td>{role.roles}</td>
                <td>
                  <Button
                    variant="info"
                    onClick={() => handleShowModal(role)}
                  >
                    Gestionar Permisos
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal para gestionar permisos */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Permisos para el Rol: {selectedRole?.roles}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
  {permisos.map((permiso) => {
    const assigned = assignedPermisos.find((p) => p.idPermiso === permiso.idPermiso);
    return (
      <Form.Check
        key={permiso.idPermiso}
        type="checkbox"
        label={permiso.nombrePermiso}
        checked={assigned ? assigned.estado === 1 : false}
        onChange={() => handleCheckboxChange(permiso.idPermiso)}
      />
    );
  })}
</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PermisosRolesComponent;

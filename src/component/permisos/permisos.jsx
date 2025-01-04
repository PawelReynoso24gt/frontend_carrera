import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Alert, InputGroup, FormControl } from "react-bootstrap";
import { FaPencilAlt } from "react-icons/fa";

function PermisosRolesComponent() {
  const [roles, setRoles] = useState([]); // Lista de roles
  const [permisos, setPermisos] = useState([]); // Todos los permisos disponibles
  const [showModal, setShowModal] = useState(false); // Estado del modal
  const [selectedRole, setSelectedRole] = useState(null); // Rol seleccionado
  const [assignedPermisos, setAssignedPermisos] = useState([]); // Permisos asignados al rol seleccionado
  const [showAlert, setShowAlert] = useState(false); // Estado de alerta
  const [alertMessage, setAlertMessage] = useState(""); // Mensaje de alerta
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [rowsPerPage, setRowsPerPage] = useState(5); // Filas por página
  const [modulos, setModulos] = useState([]); // Lista de módulos


  useEffect(() => {
    fetchRoles(); // Obtener lista de roles
    fetchPermisos(); // Obtener todos los permisos
  }, []);

  // Obtener módulos desde el backend
  const fetchModulos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/modulos");
      setModulos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching modulos:", error);
    }
  };


  // Obtener roles desde el backend
  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/roles");
      setRoles(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  // Obtener todos los permisos disponibles desde el backend
  const fetchPermisos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/permisos");
      setPermisos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching permisos:", error);
    }
  };

  // Obtener permisos asignados al rol seleccionado
  const fetchAssignedPermisos = async (roleId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/asignacionPermisos?roleId=${roleId}`
      );
  
      const permisosDelRol = response.data.filter(
        (assignment) => assignment.idRol === roleId
      );
  
      const mappedPermisos = permisos.map((permiso) => {
        const assigned = permisosDelRol.find(
          (assignment) => assignment.idPermiso === permiso.idPermiso
        );
        return {
          idPermiso: permiso.idPermiso,
          nombrePermiso: permiso.nombrePermiso,
          estado: assigned ? assigned.estado : 0,
          originalEstado: assigned ? assigned.estado : 0,
          idModulo: permiso.idModulo, // Asociar permiso con módulo
        };
      });
  
      setAssignedPermisos(mappedPermisos);
    } catch (error) {
      console.error("Error fetching assigned permisos:", error);
    }
  };
  
  useEffect(() => {
    fetchRoles(); // Obtener lista de roles
    fetchPermisos(); // Obtener todos los permisos
    fetchModulos(); // Obtener módulos
  }, []);

  
  // Abrir modal y cargar permisos asignados al rol seleccionado
  const handleShowModal = (role) => {
    setSelectedRole(role);
    fetchAssignedPermisos(role.idRol);
    setShowModal(true);
  };
  

  // Cerrar modal y limpiar estado
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRole(null);
    setAssignedPermisos([]); // Limpia permisos asignados
  };

  // Alternar estado de un permiso en el modal
  const handleCheckboxChange = (permisoId) => {
    const permisoIndex = assignedPermisos.findIndex((p) => p.idPermiso === permisoId);

    if (permisoIndex >= 0) {
      // Cambiar el estado del permiso
      const updatedPermisos = [...assignedPermisos];
      updatedPermisos[permisoIndex].estado =
        updatedPermisos[permisoIndex].estado === 1 ? 0 : 1; // Alternar estado
      setAssignedPermisos(updatedPermisos);
    } else {
      // Si no está en la lista, agregar como activado
      setAssignedPermisos([
        ...assignedPermisos,
        { idPermiso: permisoId, estado: 1, originalEstado: 0 },
      ]);
    }
  };

  // Guardar cambios en permisos
  const handleSaveChanges = async () => {
    try {
      const permisosToSend = assignedPermisos.filter(
        (permiso) => permiso.estado !== permiso.originalEstado // Solo enviar los que cambiaron
      );

      await axios.post("http://localhost:5000/asignacionPermisos/update", {
        roleId: selectedRole.idRol,
        permisos: permisosToSend,
      });

      setAlertMessage("Permisos actualizados con éxito.");
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error saving changes:", error);
      setAlertMessage("Ocurrió un error al actualizar los permisos.");
      setShowAlert(true);
    }
  };

  // Paginación
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRoles = roles.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(roles.length / rowsPerPage);

  // Renderizar permisos agrupados por módulo
const renderPermisosPorModulo = () => {
  return modulos.map((modulo) => (
    <div
      key={modulo.idModulo}
      style={{
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        padding: "10px",
        marginBottom: "15px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h5 style={{ fontWeight: "bold", textAlign: "center" }}>{modulo.nombreModulo}</h5>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {assignedPermisos
          .filter((permiso) => permiso.idModulo === modulo.idModulo)
          .map((permiso) => (
            <Form.Check
              key={permiso.idPermiso}
              type="checkbox"
              label={permiso.nombrePermiso}
              checked={permiso.estado === 1}
              onChange={() => handleCheckboxChange(permiso.idPermiso)}
              style={{ flex: "0 1 calc(33.333% - 10px)", textAlign: "center" }}
            />
          ))}
      </div>
    </div>
  ));
};

  const renderPagination = () => (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <Button
        variant="outline-primary"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => prev - 1)}
      >
        Anterior
      </Button>
      <div>Página {currentPage} de {totalPages}</div>
      <Button
        variant="outline-primary"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => prev + 1)}
      >
        Siguiente
      </Button>
    </div>
  );

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

        <Table striped bordered hover responsive className="mt-3 "   style={{
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            overflow: "hidden",
            marginTop: "20px",
          }}>
          <thead style={{ backgroundColor: "#007AC3", color: "#fff", textAlign: "center",  }}>
            <tr>
              <th>ID</th>
              <th>Rol</th>
              <th>Asignar Permisos</th>
            </tr>
          </thead>
          <tbody>
            {currentRoles.map((role) => (
              <tr key={role.idRol}>
                <td>{role.idRol}</td>
                <td>{role.roles}</td>
                <td style={{ textAlign: "center" }}>
                  <FaPencilAlt
                    style={{
                      color: "#007AC3",
                      cursor: "pointer",
                      fontSize: "20px",
                    }}
                    title="Gestionar Permisos"
                    onClick={() => handleShowModal(role)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {renderPagination()}
      </div>

      {/* Modal para gestionar permisos */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Permisos para el Rol: {selectedRole?.roles}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{renderPermisosPorModulo()}</Modal.Body>
              <Modal.Footer style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
        <Button
          variant="secondary"
          onClick={handleCloseModal}
          style={{
            fontSize: "15px", 
            padding: "4px 8px", 
            width: "100px", // Ajustar el ancho
            height: "50px", // Ajustar la altura
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleSaveChanges}
          style={{
            fontSize: "15px", 
            padding: "4px 8px", // Espaciado reducido
            width: "100px", // Ajustar el ancho
            height: "50px", // Ajustar la altura
          }}
        >
          Guardar Cambios
        </Button>
      </Modal.Footer>
      </Modal>
    </>
  );
}

export default PermisosRolesComponent;

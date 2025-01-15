import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl } from 'react-bootstrap';
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";


function MaterialesComponent() {
  const [materiales, setMateriales] = useState([]);
  const [filteredMateriales, setFilteredMateriales] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [newMaterial, setNewMaterial] = useState({ material: '', cantidad: '', descripcion: '', estado: 1, idComision: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState('activos');
  const [searchTerm, setSearchTerm] = useState('');
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
    fetchActiveMateriales();
  }, []);

  const checkPermission = (permission, message) => {
    if (!permissions[permission]) {
      setPermissionMessage(message);
      setShowPermissionModal(true);
      return false;
    }
    return true;
  };

  const fetchActiveMateriales = async () => {
    try {
      const response = await axios.get('http://localhost:5000/materiales/all');
      const activeMateriales = response.data.filter(material => material.estado === 1);
      setMateriales(activeMateriales);
      setFilteredMateriales(activeMateriales);
      setFilter('activos');
    } catch (error) {
      console.error('Error fetching active materiales:', error);
    }
  };

  const fetchInactiveMateriales = async () => {
    try {
      const response = await axios.get('http://localhost:5000/materiales/all');
      const inactiveMateriales = response.data.filter(material => material.estado === 0);
      setMateriales(inactiveMateriales);
      setFilteredMateriales(inactiveMateriales);
      setFilter('inactivos');
    } catch (error) {
      console.error('Error fetching inactive materiales:', error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = materiales.filter((material) =>
      material.material.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredMateriales(filtered);
  };

  const handleShowModal = (material = null) => {
    setEditingMaterial(material);
    setNewMaterial(material || { material: '', cantidad: '', descripcion: '', estado: 1, idComision: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMaterial(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMaterial({ ...newMaterial, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMaterial) {
        await axios.put(`http://localhost:5000/materiales/${editingMaterial.idMaterial}`, newMaterial);
        setAlertMessage('Material actualizado con éxito');
      } else {
        await axios.post('http://localhost:5000/materiales', newMaterial);
        setAlertMessage('Material creado con éxito');
      }
      filter === 'activos' ? fetchActiveMateriales() : fetchInactiveMateriales();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting material:', error);
    }
  };

  const toggleMaterialEstado = async (id, currentEstado) => {
    try {
      const newEstado = currentEstado === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/materiales/${id}`, { estado: newEstado });
      setAlertMessage(`Material ${newEstado === 1 ? 'activado' : 'desactivado'} con éxito`);
      setShowAlert(true);
      filter === 'activos' ? fetchActiveMateriales() : fetchInactiveMateriales();
    } catch (error) {
      console.error('Error toggling estado of material:', error);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentMateriales = filteredMateriales.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredMateriales.length / rowsPerPage);

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
            Gestión de Materiales
          </h3>
        </div>
      </div>

      <InputGroup className="mt-3">
        <FormControl
          placeholder="Buscar por nombre"
          aria-label="Buscar por nombre"
          aria-describedby="basic-addon2"
          value={searchTerm}
          onChange={handleSearch}
        />
      </InputGroup>

      <div
        className="container mt-4"
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
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
            if (checkPermission('Crear material', 'No tienes permisos para crear material')) {
              handleShowModal();
            }
          }}
        >
          Agregar Material
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
          onClick={fetchActiveMateriales}
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
          onClick={fetchInactiveMateriales}
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
              <th>Material</th>
              <th>Cantidad</th>
              <th>Descripción</th>
              <th>Comisión</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center" }}>
            {currentMateriales.map((material) => (
              <tr key={material.idMaterial}>
                <td>{material.idMaterial}</td>
                <td>{material.material}</td>
                <td>{material.cantidad}</td>
                <td>{material.descripcion}</td>
                <td>{material.comisione?.comision}</td>
                <td>{material.estado ? "Activo" : "Inactivo"}</td>
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
                      if (checkPermission('Editar material', 'No tienes permisos para editar material')) {
                        handleShowModal(material);
                      }
                    }}
                  />
                  {material.estado ? (
                    <FaToggleOn
                      style={{
                        color: "#30c10c",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Inactivar"
                      onClick={() => {
                        if (checkPermission('Desactivar material', 'No tienes permisos para desactivar material')) {
                          toggleMaterialEstado(material.idMaterial, material.estado)
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
                        if (checkPermission('Activar material', 'No tienes permisos para activar material')) {
                          toggleMaterialEstado(material.idMaterial, material.estado)
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
              {editingMaterial ? "Editar Material" : "Agregar Material"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="material">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Material
                </Form.Label>
                <Form.Control
                  type="text"
                  name="material"
                  value={newMaterial.material}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="cantidad">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Cantidad
                </Form.Label>
                <Form.Control
                  type="number"
                  name="cantidad"
                  value={newMaterial.cantidad}
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
                  value={newMaterial.descripcion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idComision">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  ID Comisión
                </Form.Label>
                <Form.Control
                  type="number"
                  name="idComision"
                  value={newMaterial.idComision}
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
                  value={newMaterial.estado}
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
                {editingMaterial ? "Actualizar" : "Crear"}
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

export default MaterialesComponent;
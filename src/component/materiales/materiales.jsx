import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl } from 'react-bootstrap';

function MaterialesComponent() {
  const [materiales, setMateriales] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [newMaterial, setNewMaterial] = useState({ material: '', cantidad: '', descripcion: '', estado: 1, idComision: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [filter, setFilter] = useState('activos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchActiveMateriales();
  }, []);

  const fetchActiveMateriales = async () => {
    try {
      const response = await axios.get('http://localhost:5000/materiales/all');
      setMateriales(response.data.filter(material => material.estado === 1));
      setFilter('activos');
    } catch (error) {
      console.error('Error fetching active materiales:', error);
    }
  };

  const fetchInactiveMateriales = async () => {
    try {
      const response = await axios.get('http://localhost:5000/materiales/all');
      setMateriales(response.data.filter(material => material.estado === 0));
      setFilter('inactivos');
    } catch (error) {
      console.error('Error fetching inactive materiales:', error);
    }
  };

  const fetchMaterialesByName = async () => {
    try {
      const response = await axios.get('http://localhost:5000/materialesByName', {
        params: { nombre: searchTerm }
      });
      setMateriales(response.data);
    } catch (error) {
      console.error('Error fetching materiales by name:', error);
    }
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

  const validateData = (datos) => {
    if (datos.material !== undefined) {
      const materialPattern = /^[a-zA-Z0-9À-ÿ\s]+$/;
      if (!materialPattern.test(datos.material)) {
        setAlertMessage('El campo material solo debe contener letras, números y espacios.');
        setShowAlert(true);
        return false;
      }
    }
    if (datos.cantidad !== undefined) {
      if (isNaN(datos.cantidad) || datos.cantidad < 0) {
        setAlertMessage('El campo cantidad debe ser un número válido y mayor o igual a 0.');
        setShowAlert(true);
        return false;
      }
    }
    if (datos.estado !== undefined) {
      if (datos.estado !== 0 && datos.estado !== 1) {
        setAlertMessage('El campo estado debe ser 0 o 1.');
        setShowAlert(true);
        return false;
      }
    }
    if (datos.idComision !== undefined) {
      if (isNaN(datos.idComision) || datos.idComision < 1) {
        setAlertMessage('El campo idComision debe ser un número válido.');
        setShowAlert(true);
        return false;
      }
    }
    return true;
  };

  return (
    <>
      <div className="row" style={{ textAlign: "center", marginBottom: "20px" }}>
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
            Gestión de Materiales
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
        <Button
          style={{
            backgroundColor: "#743D90",
            borderColor: "#007AC3",
            padding: "5px 10px",
            width: "180px",
            marginRight: "10px",
            fontWeight: "bold",
            color: "#fff",
          }}
          onClick={() => handleShowModal()}
        >
          Agregar Material
        </Button>
        <Button
          style={{
            backgroundColor: "#007AC3",
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
            backgroundColor: "#009B85",
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

        <InputGroup className="mt-3">
          <FormControl
            placeholder="Buscar por nombre"
            aria-label="Buscar por nombre"
            aria-describedby="basic-addon2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="outline-secondary"
            style={{
              backgroundColor: "#007AC3",
              borderColor: "#007AC3",
              color: "#fff",
              fontWeight: "bold",
            }}
            onClick={fetchMaterialesByName}
          >
            Buscar
          </Button>
        </InputGroup>

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
              <th>Material</th>
              <th>Cantidad</th>
              <th>Descripción</th>
              <th>Comisión</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {materiales.map((material) => (
              <tr key={material.idMaterial}>
                <td>{material.idMaterial}</td>
                <td>{material.material}</td>
                <td>{material.cantidad}</td>
                <td>{material.descripcion}</td>
                <td>{material.comisione?.comision}</td>
                <td>{material.estado ? "Activo" : "Inactivo"}</td>
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
                    onClick={() => handleShowModal(material)}
                  >
                    Editar
                  </Button>
                  <Button
                    style={{
                      backgroundColor: material.estado ? "#6c757d" : "#28a745",
                      borderColor: material.estado ? "#6c757d" : "#28a745",
                      padding: "5px 10px",
                      width: "100px",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                    onClick={() => toggleMaterialEstado(material.idMaterial, material.estado)}
                  >
                    {material.estado ? "Desactivar" : "Activar"}
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
      </div>
    </>
  );
}

export default MaterialesComponent;
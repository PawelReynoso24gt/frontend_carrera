import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert } from 'react-bootstrap';

function FotosSedesComponent() {
  const [fotos, setFotos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingFoto, setEditingFoto] = useState(null);
  const [newFoto, setNewFoto] = useState({ foto: '', idSede: '', estado: 1 });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [filter, setFilter] = useState('activos');

  useEffect(() => {
    fetchActiveFotos();
  }, []);

  const fetchFotos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/fotos_sedes');
      setFotos(response.data);
    } catch (error) {
      console.error('Error fetching fotos:', error);
    }
  };

  const fetchActiveFotos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/fotos_sedes/activos');
      setFotos(response.data.filter(foto => foto.estado === 1));
      setFilter('activos');
    } catch (error) {
      console.error('Error fetching active fotos:', error);
    }
  };

  const fetchInactiveFotos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/fotos_sedes', {
        params: { estado: 0 }
      });
      setFotos(response.data.filter(foto => foto.estado === 0));
      setFilter('inactivos');
    } catch (error) {
      console.error('Error fetching inactive fotos:', error);
    }
  };

  const handleShowModal = (foto = null) => {
    setEditingFoto(foto);
    setNewFoto(foto || { foto: '', idSede: '', estado: 1 });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFoto(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFoto({ ...newFoto, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewFoto({ ...newFoto, foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFoto) {
        // Actualizar foto de sede
        await axios.put(`http://localhost:5000/fotos_sedes/${editingFoto.idFotoSede}`, newFoto);
        setAlertMessage('Foto de sede actualizada con éxito');
      } else {
        // Crear nueva foto de sede
        await axios.post('http://localhost:5000/fotos_sedes', newFoto);
        setAlertMessage('Foto de sede creada con éxito');
      }
      filter === 'activos' ? fetchActiveFotos() : fetchInactiveFotos();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting foto de sede:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);  // Muestra detalles del error desde el backend
      }
    }
  };

  const toggleFotoEstado = async (id, currentEstado) => {
    try {
      const newEstado = currentEstado === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/fotos_sedes/${id}`, {
        estado: newEstado
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setAlertMessage(`Foto de sede ${newEstado === 1 ? 'activada' : 'desactivada'} con éxito`);
      setShowAlert(true);
      filter === 'activos' ? fetchActiveFotos() : fetchInactiveFotos();
    } catch (error) {
      console.error('Error toggling estado of foto de sede:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <div className="crancy-section-title mg-btm-10">
            <h3 className="crancy-section__title">FOTOS SEDES</h3>
            <p className="crancy-section__text">
              Aquí puedes gestionar las fotos de las sedes.
            </p>
          </div>
        </div>
      </div>

      {/* Botones para Filtrar Fotos de Sedes */}
      <div className="container mt-4">
        <Button variant="primary" onClick={() => handleShowModal()}>Agregar Foto de Sede</Button>
        <Button variant="success" className="ml-2" onClick={fetchActiveFotos}>Activos</Button>
        <Button variant="secondary" className="ml-2" onClick={fetchInactiveFotos}>Inactivos</Button>

        <Alert variant="success" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Foto</th>
              <th>ID Sede</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {fotos.filter(foto => filter === 'activos' ? foto.estado === 1 : foto.estado === 0).map((foto) => (
              <tr key={foto.idFotoSede}>
                <td>{foto.idFotoSede}</td>
                <td><img src={foto.foto} alt="Foto de Sede" style={{ width: '100px' }} /></td>
                <td>{foto.idSede}</td>
                <td>{foto.estado ? 'Activo' : 'Inactivo'}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShowModal(foto)}>Editar</Button>
                  <Button
                    variant={foto.estado ? "danger" : "success"}
                    className="ml-2"
                    onClick={() => toggleFotoEstado(foto.idFotoSede, foto.estado)}
                  >
                    {foto.estado ? "Desactivar" : "Activar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal para crear y editar fotos de sedes */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editingFoto ? 'Editar Foto de Sede' : 'Agregar Foto de Sede'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="foto">
                <Form.Label>Foto</Form.Label>
                <Form.Control
                  type="file"
                  name="foto"
                  onChange={handleFileChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idSede">
                <Form.Label>ID Sede</Form.Label>
                <Form.Control
                  type="number"
                  name="idSede"
                  value={newFoto.idSede}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newFoto.estado}
                  onChange={handleChange}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit">
                {editingFoto ? 'Actualizar' : 'Crear'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default FotosSedesComponent;

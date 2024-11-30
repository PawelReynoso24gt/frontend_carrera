import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl } from 'react-bootstrap';
import { FaPencilAlt, FaToggleOn, FaToggleOff , FaKey} from "react-icons/fa";

function UsuariosAdminComponent() {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [newUsuario, setNewUsuario] = useState({ usuario: '', estado: 1, idRol: 1, idSede: '', idPersona: '', contrasenia: '' });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [filter, setFilter] = useState('activos');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);

  useEffect(() => {
    fetchActiveUsuarios();
  }, []);

  const fetchActiveUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/usuarios/activos');
      const usuariosActivos = response.data.filter(usuario => usuario.estado === 1);
      setUsuarios(usuariosActivos);
      setFilteredUsuarios(usuariosActivos);
      setFilter('activos');
    } catch (error) {
      console.error('Error fetching active usuarios:', error);
    }
  };

  const fetchInactiveUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/usuarios', {
        params: { estado: 0 }
      });
      const usuariosInactivos = response.data.filter(usuario => usuario.idRol === 1 && usuario.estado === 0);
      setUsuarios(usuariosInactivos);
      setFilteredUsuarios(usuariosInactivos);
      setFilter('inactivos');
    } catch (error) {
      console.error('Error fetching inactive usuarios:', error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = usuarios.filter((usuario) =>
      usuario.usuario.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsuarios(filtered);
  };

  const handleShowModal = (usuario = null) => {
    setEditingUsuario(usuario);
    setNewUsuario(usuario || { usuario: '', estado: 1, idRol: 1, idSede: '', idPersona: '', contrasenia: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUsuario(null);
  };

  const handleShowPasswordModal = (usuario) => {
    setEditingUsuario(usuario);
    setShowPasswordModal(true);
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setEditingUsuario(null);
    setCurrentPassword('');
    setNewPassword('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUsuario({ ...newUsuario, [name]: value });
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUsuario) {
        await axios.put(`http://localhost:5000/usuarios/${editingUsuario.idUsuario}`, newUsuario);
        setAlertMessage('Usuario actualizado con éxito');
      } else {
        await axios.post('http://localhost:5000/usuarios', newUsuario);
        setAlertMessage('Usuario creado con éxito');
      }
      filter === 'activos' ? fetchActiveUsuarios() : fetchInactiveUsuarios();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting usuario:', error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/usuarios/${editingUsuario.idUsuario}/reset`, {
        newPassword,
      });
      setAlertMessage('Contraseña reseteada con éxito');
      setShowAlert(true);
      handleClosePasswordModal();
    } catch (error) {
      console.error("Error al resetear la contraseña:", error);
      setAlertMessage('Error al resetear la contraseña');
      setShowAlert(true);
    }
  };  

  const toggleUsuarioEstado = async (id, currentEstado) => {
    try {
      const newEstado = currentEstado === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/usuarios/${id}`, { estado: newEstado });
      setAlertMessage(`Usuario ${newEstado === 1 ? 'activado' : 'desactivado'} con éxito`);
      setShowAlert(true);
      filter === 'activos' ? fetchActiveUsuarios() : fetchInactiveUsuarios();
    } catch (error) {
      console.error('Error toggling estado of usuario:', error);
    }
  };

  return (
    <>
      <div className="row" style={{ textAlign: "center", marginBottom: "20px" }}>
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
            Gestión de Usuarios
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
          Agregar Usuario
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
          onClick={fetchActiveUsuarios}
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
          onClick={fetchInactiveUsuarios}
        >
          Inactivos
        </Button>

        {/* Barra de Búsqueda */}
        <InputGroup className="mb-3 mt-3">
          <FormControl
            placeholder="Buscar usuario por nombre..."
            value={searchTerm}
            onChange={handleSearch}
          />
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
              <th style={{textAlign : "center"}}>ID</th>
              <th style={{textAlign : "center"}}>Usuario</th>
              <th style={{textAlign : "center"}}>Estado</th>
              <th style={{textAlign : "center"}}>Rol</th>
              <th style={{textAlign : "center"}}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.map((usuario) => (
              <tr key={usuario.idUsuario}>
                <td style={{textAlign : "center"}}>{usuario.idUsuario}</td>
                <td style={{textAlign : "center"}}>{usuario.usuario}</td>
                <td style={{textAlign : "center"}}>{usuario.estado ? "Activo" : "Inactivo"}</td>
                <td style={{textAlign : "center"}}>{usuario.role?.roles}</td>
                <td style={{ textAlign: "center" }}>
                  <FaPencilAlt
                    style={{
                      color: "#007AC3",
                      cursor: "pointer",
                      marginRight: "10px",
                      fontSize: "20px",
                    }}
                    title="Editar"
                    onClick={() => handleShowModal(usuario)}
                  />
                  <FaKey
                    style={{
                      color: "#ffcc00",
                      cursor: "pointer",
                      marginRight: "10px",
                      fontSize: "20px",
                    }}
                    title="Cambiar Contraseña"
                    onClick={() => handleShowPasswordModal(usuario)}
                  />
                  {usuario.estado ? (
                    <FaToggleOn
                      style={{
                        color: "#30c10c",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Inactivar"
                      onClick={() => toggleUsuarioEstado(usuario.idUsuario, usuario.estado)}
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
                      onClick={() => toggleUsuarioEstado(usuario.idUsuario, usuario.estado)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal para agregar o editar un administrador */}
<Modal show={showModal} onHide={handleCloseModal}>
  <Modal.Header
    closeButton
    style={{ backgroundColor: "#007AC3", color: "#fff" }}
  >
    <Modal.Title>
      {editingUsuario ? "Editar Administrador" : "Agregar Administrador"}
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="usuario">
        <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
          Usuario
        </Form.Label>
        <Form.Control
          type="text"
          name="usuario"
          value={newUsuario.usuario}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* Nuevo Campo para la Contraseña */}
            {!editingUsuario && ( // Mostrar solo cuando se está agregando un usuario
              <Form.Group controlId="contrasenia">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Contraseña
                </Form.Label>
                <Form.Control
                  type="password"
                  name="contrasenia"
                  value={newUsuario.contrasenia || ""} // Manejar el caso si está vacío
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            )}

            <Form.Group controlId="idSede">
              <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                ID Sede
              </Form.Label>
              <Form.Control
                type="number"
                name="idSede"
                value={newUsuario.idSede}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="idPersona">
              <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                ID Persona
              </Form.Label>
              <Form.Control
                type="number"
                name="idPersona"
                value={newUsuario.idPersona}
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
                value={newUsuario.estado}
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
              {editingUsuario ? "Actualizar" : "Crear"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

        {/* Modal para cambiar la contraseña */}
        <Modal show={showPasswordModal} onHide={handleClosePasswordModal}>
          <Modal.Header
            closeButton
            style={{ backgroundColor: "#007AC3", color: "#fff" }}
          >
            <Modal.Title>Resetear Contraseña</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handlePasswordSubmit}>
              <Form.Group controlId="newPassword">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Nueva Contraseña
                </Form.Label>
                <Form.Control
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  required
                />
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
                Resetear Contraseña
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default UsuariosAdminComponent;
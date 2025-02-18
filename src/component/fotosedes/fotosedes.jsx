import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Form, Table, Modal, Alert } from 'react-bootstrap';
import { FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { getUserDataFromToken } from '../../utils/jwtUtils';

function FotosSedesComponent() {
  const [fotos, setFotos] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingFoto, setEditingFoto] = useState(null);
  const [newFoto, setNewFoto] = useState({ foto: '', idSede: '', estado: 1 });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showPermissionModal, setShowPermissionModal] = useState(false); // Nuevo estado
  const [permissionMessage, setPermissionMessage] = useState('');
  const [permissions, setPermissions] = useState({});
  const [hasViewPermission, setHasViewPermission] = useState(false);
  const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);
  

  const idUsuario = getUserDataFromToken(localStorage.getItem("token"))?.idUsuario;

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
        response.data.permisos['Ver fotos sedes']

      setHasViewPermission(hasPermission);
      setIsPermissionsLoaded(true);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };
  
    fetchPermissions();
    fetchSedes();
  }, []);

   useEffect(() => {
        if (isPermissionsLoaded) {
          if (hasViewPermission) {
            fetchActiveFotos();
          } else {
            checkPermission('Ver fotos sedes', 'No tienes permisos para ver fotos sedes');
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

  const fetchActiveFotos = async () => {
    try {
      if (hasViewPermission) {
      const response = await axios.get('https://api.voluntariadoayuvi.com/fotos_sedes/activos');
      const fotosWithFullPath = response.data.map(foto => ({
        ...foto,
        foto: foto.foto !== "sin foto" ? `https://api.voluntariadoayuvi.com/${foto.foto.replace(/\\/g, '/')}` : 'path/to/default/image.png'
      }));
      setFotos(fotosWithFullPath);
    } else {
      checkPermission('Ver fotos sedes', 'No tienes permisos para ver fotos sedes')
    }
    } catch (error) {
      console.error('Error fetching active fotos:', error);
    }
  };

  const fetchInactiveFotos = async () => {
    try {
      if (hasViewPermission) {
      const response = await axios.get('https://api.voluntariadoayuvi.com/fotos_sedes', {
        params: { estado: 0 }
      });
      const inactiveFotos = response.data.filter(foto => foto.estado === 0).map(foto => ({
        ...foto,
        foto: foto.foto !== "sin foto" ? `https://api.voluntariadoayuvi.com/${foto.foto.replace(/\\/g, '/')}` : 'path/to/default/image.png'
      }));
      setFotos(inactiveFotos);
    } else {
      checkPermission('Ver fotos sedes', 'No tienes permisos para ver fotos sedes')
    }
    } catch (error) {
      console.error('Error fetching inactive fotos:', error);
    }
  };

  const fetchSedes = async () => {
    try {
      const response = await axios.get('https://api.voluntariadoayuvi.com/sedes');
      setSedes(response.data);
    } catch (error) {
      console.error('Error fetching sedes:', error);
    }
  };

  const handleShowModal = (foto = null) => {
    setEditingFoto(foto);
    setNewFoto(foto || { foto: '', idSede: sedes.length > 0 ? sedes[0].idSede : '', estado: 1 });
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
    setNewFoto({ ...newFoto, foto: file });
  };

  const logBitacora = async (descripcion, idCategoriaBitacora) => {
    const bitacoraData = {
      descripcion,
      idCategoriaBitacora,
      idUsuario,
      fechaHora: new Date()
    };
  
    try {
      await axios.post("https://api.voluntariadoayuvi.com/bitacora/create", bitacoraData);
    } catch (error) {
      console.error("Error logging bitacora:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('foto', newFoto.foto);
    formData.append('idSede', Number(newFoto.idSede)); // Convertir idSede a número
    formData.append('estado', Number(newFoto.estado)); // Convertir estado a número

    /*console.log("Datos enviados al backend:", {
      foto: newFoto.foto,
      idSede: Number(newFoto.idSede),
      estado: Number(newFoto.estado)
    });*/

    try {
      if (editingFoto) {
        await axios.put(`https://api.voluntariadoayuvi.com/fotos_sedes/${editingFoto.idFotoSede}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setAlertMessage('Foto de sede actualizada con éxito');
        await logBitacora(`Foto de sede ${editingFoto.idFotoSede} actualizada`, 37);
      } else {
        await axios.post('https://api.voluntariadoayuvi.com/fotos_sedes', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setAlertMessage('Foto de sede creada con éxito');
        await logBitacora('Nueva foto de sede creada', 36);
      }
      fetchActiveFotos();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting foto de sede:', error);
    }
  };

  const toggleFotoEstado = async (id, currentEstado) => {
    try {
      const newEstado = currentEstado === 1 ? 0 : 1;
      await axios.put(`https://api.voluntariadoayuvi.com/fotos_sedes/${id}`, { estado: newEstado });
      setAlertMessage(`Foto de sede ${newEstado === 1 ? 'activada' : 'desactivada'} con éxito`);
      setShowAlert(true);
      fetchActiveFotos();
    } catch (error) {
      console.error('Error toggling estado of foto de sede:', error);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentFotos = fotos.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(fotos.length / rowsPerPage);

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
 <div className="row justify-content-center" style={{marginBottom: "20px" }}>
        <div className="col-12 text-center">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333", textAlign: "center" }}>
            Gestión de Fotos de Sedes
          </h3>
        </div>
      </div>


      <div
        className="container mt-4"
        style={{
          maxWidth: "100%",
          margin: "0 auto",
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
            if (checkPermission('Crear foto sede', 'No tienes permisos para crear foto sede')) {
              handleShowModal();
            }
          }}
        >
          Agregar Foto de Sede
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
          onClick={fetchActiveFotos}
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
          onClick={fetchInactiveFotos}
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
              <th>Foto</th>
              <th>Nombre de la Sede</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center" }}>
            {currentFotos.map((foto) => (
              <tr key={foto.idFotoSede}>
                <td>{foto.idFotoSede}</td>
                <td>
                  <img
                    src={foto.foto}
                    alt="Foto de Sede"
                    style={{ width: '100px' }}
                  />
                </td>
                <td>{sedes.find(sede => sede.idSede === foto.idSede)?.nombreSede || 'N/A'}</td>
                <td>{foto.estado ? "Activo" : "Inactivo"}</td>
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
                      if (checkPermission('Editar foto sede', 'No tienes permisos para editar foto sede')) {
                        handleShowModal(foto);
                      }
                    }}
                  />
                  {foto.estado === 1 ? (
                    <FaToggleOn
                      style={{
                        color: "#30c10c",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Inactivar"
                      onClick={() => {
                        if (checkPermission('Desactivar foto sede', 'No tienes permisos para desactivar voluntario')) {
                          toggleFotoEstado(foto.idFotoSede, foto.estado);
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
                        if (checkPermission('Activar foto sede', 'No tienes permisos para activar voluntario')) {
                          toggleFotoEstado(foto.idFotoSede, foto.estado);
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
              {editingFoto ? "Editar Foto de Sede" : "Agregar Foto de Sede"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="foto">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Foto
                </Form.Label>
                <Form.Control
                  type="file"
                  name="foto"
                  onChange={handleFileChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="idSede">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Nombre de la Sede
                </Form.Label>
                <Form.Control
                  as="select"
                  name="idSede"
                  value={newFoto.idSede}
                  onChange={handleChange}
                  required
                >
                  {sedes.map((sede) => (
                    <option key={sede.idSede} value={sede.idSede}>
                      {sede.nombreSede}
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
                  value={newFoto.estado}
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
                {editingFoto ? "Actualizar" : "Crear"}
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

export default FotosSedesComponent;

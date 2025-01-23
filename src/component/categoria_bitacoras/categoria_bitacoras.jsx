import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl } from "react-bootstrap";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";

function CategoriaBitacoras() {
  const [categorias, setCategorias] = useState([]);
  const [filteredCategorias, setFilteredCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [newCategoria, setNewCategoria] = useState({ categoria: "" });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
    fetchCategorias();
  }, []);

  const checkPermission = (permission, message) => {
    if (!permissions[permission]) {
      setPermissionMessage(message);
      setShowPermissionModal(true);
      return false;
    }
    return true;
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get("http://localhost:5000/categoria_bitacoras");
      setCategorias(response.data);
      setFilteredCategorias(response.data);
    } catch (error) {
      console.error("Error fetching categorias:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = categorias.filter((categoria) =>
      categoria.categoria.toLowerCase().includes(value)
    );

    setFilteredCategorias(filtered);
    setCurrentPage(1); // Reiniciar a la primera página tras la búsqueda
  };

  const handleShowModal = (categoria = null) => {
    setEditingCategoria(categoria);
    setNewCategoria(categoria || { categoria: "" });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategoria(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategoria({ ...newCategoria, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategoria) {
        await axios.put(
          `http://localhost:5000/categoria_bitacoras/update/${editingCategoria.idCategoriaBitacora}`,
          newCategoria
        );
        setAlertMessage("Categoría de bitácora actualizada con éxito");
      } else {
        await axios.post("http://localhost:5000/categoria_bitacoras/create", newCategoria);
        setAlertMessage("Categoría de bitácora creada con éxito");
      }
      fetchCategorias();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting categoria:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/categoria_bitacoras/delete/${id}`);
      fetchCategorias();
      setAlertMessage("Categoría de bitácora eliminada correctamente");
      setShowAlert(true);
    } catch (error) {
      console.error("Error deleting categoria:", error);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentCategorias = filteredCategorias.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredCategorias.length / rowsPerPage);

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
            Gestión de Categorías de Bitácoras
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
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar categoría por nombre..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>

        <Button
          style={{
            backgroundColor: "#007abf",
            borderColor: "#007AC3",
            padding: "5px 10px",
            width: "180px",
            fontWeight: "bold",
            color: "#fff",
          }}
          onClick={() => {
            if (checkPermission('Crear categoria bitacora', 'No tienes permisos para crear categoria bitacora')) {
              handleShowModal();
            }
          }}
        >
          Agregar Categoría
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
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center" }}>
            {currentCategorias.map((categoria) => (
              <tr key={categoria.idCategoriaBitacora}>
                <td>{categoria.idCategoriaBitacora}</td>
                <td>{categoria.categoria}</td>
                <td style={{ textAlign: "center" }}>
                  <FaPencilAlt
                    style={{
                      color: "#007AC3",
                      cursor: "pointer",
                      marginRight: "10px",
                      fontSize: "20px",
                    }}
                    title="Editar"
                    onClick={() => {
                      if (checkPermission('Editar categoria bitacora', 'No tienes permisos para editar categoria bitacora')) {
                        handleShowModal(categoria);
                      }
                    }}
                  />
                  <FaTrashAlt
                    style={{
                      color: "#e10f0f",
                      cursor: "pointer",
                      fontSize: "20px",
                    }}
                    title="Eliminar"
                    onClick={() => {
                      if (checkPermission('Eliminar categoria bitacora', 'No tienes permisos para eliminar categoria bitacora')) {
                        handleDelete(categoria.idCategoriaBitacora);
                      }
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {renderPagination()}

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton style={{ backgroundColor: "#007AC3", color: "#fff" }}>
            <Modal.Title>
              {editingCategoria ? "Editar Categoría" : "Agregar Categoría"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="categoria">
                <Form.Label>Categoría</Form.Label>
                <Form.Control
                  type="text"
                  name="categoria"
                  value={newCategoria.categoria}
                  onChange={handleChange}
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
                {editingCategoria ? "Actualizar" : "Crear"}
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

export default CategoriaBitacoras;

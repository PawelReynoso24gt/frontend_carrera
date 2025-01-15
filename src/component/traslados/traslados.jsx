import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Form,
  Table,
  Modal,
  Alert,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff, FaEye } from "react-icons/fa";
import { format } from "date-fns";
import { parseISO } from "date-fns";

function Traslados() {
  const [traslados, setTraslados] = useState([]);
  const [filteredTraslados, setFilteredTraslados] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTraslado, setEditingTraslado] = useState(null);
  const [newTraslado, setNewTraslado] = useState({
    fecha: "",
    descripcion: "",
    estado: 1,
    idTipoTraslado: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [tipoTraslados, setTipoTraslados] = useState([]);
  const [showPermissionModal, setShowPermissionModal] = useState(false); // Nuevo estado
  const [permissionMessage, setPermissionMessage] = useState('');
  const [permissions, setPermissions] = useState({});
  const [detalleTraslado, setDetalleTraslado] = useState(null);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [detallesProductos, setDetallesProductos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [modalAlertMessage, setModalAlertMessage] = useState("");

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
    fetchTraslados();
    fetchTipoTraslados();
    fetchProductos(); 
  }, []);

  const fetchProductos = async () => {
    try {
        const response = await axios.get("http://localhost:5000/productos");
        setProductos(response.data);
    } catch (error) {
        console.error("Error fetching productos:", error);
    }
};


  const checkPermission = (permission, message) => {
    if (!permissions[permission]) {
      setPermissionMessage(message);
      setShowPermissionModal(true);
      return false;
    }
    return true;
  };

  const fetchTraslados = async () => {
    try {
      const response = await axios.get("http://localhost:5000/traslados");
      setTraslados(response.data);
      setFilteredTraslados(response.data);
    } catch (error) {
      console.error("Error fetching traslados:", error);
    }
  };

  const fetchActiveTraslados = async () => {
    try {
      const response = await axios.get("http://localhost:5000/traslados/activas");
      setTraslados(response.data);
      setFilteredTraslados(response.data);
    } catch (error) {
      console.error("Error fetching active traslados:", error);
    }
  };

  const fetchInactiveTraslados = async () => {
    try {
      const response = await axios.get("http://localhost:5000/traslados/inactivas");
      setTraslados(response.data);
      setFilteredTraslados(response.data);
    } catch (error) {
      console.error("Error fetching inactive traslados:", error);
    }
  };

  const fetchTipoTraslados = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tipoTraslados");
      setTipoTraslados(response.data);
    } catch (error) {
      console.error("Error fetching tipo traslados:", error);
    }
  };

  const fetchDetalleTraslado = async (idTraslado) => {
    try {
      const response = await axios.get(`http://localhost:5000/trasladosCompletos/${idTraslado}`);
      setDetalleTraslado(response.data.traslado);
      setShowDetalleModal(true);
    } catch (error) {
      console.error("Error fetching detalle traslado:", error);
    }
  };

 const handleAddDetalle = () => {
    setDetallesProductos([
        ...detallesProductos,
        { idProducto: "", cantidad: "" },
    ]);
};

const handleDetalleChange = (index, field, value) => {
    const nuevosDetalles = [...detallesProductos];
    nuevosDetalles[index][field] = value;
    setDetallesProductos(nuevosDetalles);
};

const handleRemoveDetalle = (index) => {
    const nuevosDetalles = detallesProductos.filter((_, i) => i !== index);
    setDetallesProductos(nuevosDetalles);
};

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = traslados.filter(
      (traslado) =>
        traslado.descripcion.toLowerCase().includes(value) ||
        tipoTraslados
          .find((tipo) => tipo.idTipoTraslado === traslado.idTipoTraslado)
          ?.tipo.toLowerCase()
          .includes(value)
    );

    setFilteredTraslados(filtered);
  };

  const handleShowModal = async (traslado = null) => {
    if (traslado) {
        try {
            // Cargar detalles del traslado desde el backend
            const response = await axios.get(`http://localhost:5000/trasladosCompletos/${traslado.idTraslado}`);
            const detalles = response.data.traslado.detalle_traslados || [];

            setNewTraslado({
                ...traslado,
                fecha: traslado.fecha ? traslado.fecha.split("T")[0] : "",
            });

            setDetallesProductos(
                detalles.map((detalle) => ({
                    idProducto: detalle.idProducto,
                    cantidad: detalle.cantidad,
                }))
            );
        } catch (error) {
            console.error("Error fetching traslado details:", error);
        }
    } else {
        // Si es un nuevo traslado, inicializar los valores vacíos
        setNewTraslado({ fecha: "", descripcion: "", estado: 1, idTipoTraslado: "" });
        setDetallesProductos([]);
    }

    setEditingTraslado(traslado);
    setShowModal(true);
};


  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTraslado(null);
    setModalAlertMessage(""); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTraslado({ ...newTraslado, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const regexDescripcion = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,-]+$/;
    if (!regexDescripcion.test(newTraslado.descripcion)) {
      setModalAlertMessage(
        "La descripción solo debe contener letras, números, espacios y los signos permitidos (.,-)."
      );
      return;
    }
  
    try {
      const trasladoConDetalle = {
        ...newTraslado,
        detalles: detallesProductos.map((detalle) => ({
          idProducto: detalle.idProducto,
          cantidad: detalle.cantidad,
        })),
      };
  
      if (editingTraslado) {
        await axios.put(
          `http://localhost:5000/trasladosCompletos/${editingTraslado.idTraslado}`,
          trasladoConDetalle
        );
        setAlertMessage("Traslado actualizado con éxito");
      } else {
        await axios.post("http://localhost:5000/trasladosCompletos", trasladoConDetalle);
        setAlertMessage("Traslado creado con éxito");
      }
  
      fetchTraslados();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting traslado:", error);
  
      // Mostrar el error específico de inventario insuficiente en el modal
      if (
        error.response &&
        error.response.data &&
        error.response.data.message.includes("Inventario insuficiente")
      ) {
        const regex = /ID (\d+)/;
        const match = error.response.data.message.match(regex);
        
        if (match) {
          const idProducto = parseInt(match[1], 10);
          const producto = productos.find((p) => p.idProducto === idProducto);
          const nombreProducto = producto ? producto.nombreProducto : `ID ${idProducto}`;
          setModalAlertMessage(`Inventario insuficiente para el producto "${nombreProducto}".`);
        } else {
          setModalAlertMessage(error.response.data.message);
        }
      } else {
        setModalAlertMessage("Error al crear o actualizar el traslado. Inténtalo nuevamente.");
      }
    }
  };


  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`http://localhost:5000/traslados/${id}`, { estado: nuevoEstado });
      fetchTraslados();
      setAlertMessage(
        `Traslado ${nuevoEstado === 1 ? "activado" : "inactivado"} con éxito`
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
            Gestión de Traslados
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
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar por descripción o tipo de traslado..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>

        <div className="d-flex justify-content-start align-items-center mb-3">
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
              if (checkPermission('Crear traslado', 'No tienes permisos para crear traslado')) {
                handleShowModal();
              }
            }}
          >
            Agregar Traslado
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
            onClick={fetchActiveTraslados}
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
            onClick={fetchInactiveTraslados}
          >
            Inactivos
          </Button>
        </div>

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
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Tipo de Traslado</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredTraslados.map((traslado) => (
              <tr key={traslado.idTraslado}>
                <td>{traslado.idTraslado}</td>
                <td>{traslado.fecha ? format(parseISO(traslado.fecha), "dd-MM-yyyy") : "Sin fecha"}</td>
                <td>{traslado.descripcion}</td>
                <td>
                  {tipoTraslados.find(
                    (tipo) => tipo.idTipoTraslado === traslado.idTipoTraslado
                  )?.tipo || "Sin asignar"}
                </td>
                <td>{traslado.estado === 1 ? "Activo" : "Inactivo"}</td>
                <td>
                  <FaEye
                    style={{
                      color: "#007AC3",
                      cursor: "pointer",
                      marginRight: "10px",
                      fontSize: "20px",
                    }}
                    title="Ver Detalles"
                    onClick={() => fetchDetalleTraslado(traslado.idTraslado)}
                  />
                  <FaPencilAlt
                    style={{
                      color: "#007AC3",
                      cursor: "pointer",
                      marginRight: "10px",
                      fontSize: "20px",
                    }}
                    title="Editar"
                    onClick={() => {
                      if (checkPermission('Editar traslado', 'No tienes permisos para editar traslado')) {
                        handleShowModal(traslado);
                      }
                    }}
                  />
                  {traslado.estado ? (
                    <FaToggleOn
                      style={{
                        color: "#30c10c",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Inactivar"
                      onClick={() => {
                        if (checkPermission('Desactivar traslado', 'No tienes permisos para desactivar traslado')) {
                          toggleEstado(traslado.idTraslado, traslado.estado);
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
                        if (checkPermission('Activar traslado', 'No tienes permisos para activar traslado')) {
                          toggleEstado(traslado.idTraslado, traslado.estado);
                        }
                      }}

                    />
                  )}
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
            {editingTraslado ? "Editar Traslado" : "Agregar Traslado"}
        </Modal.Title>
    </Modal.Header>
    <Modal.Body>
    {modalAlertMessage && (
          <Alert variant="danger" onClose={() => setModalAlertMessage("")} dismissible>
            {modalAlertMessage}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="fecha">
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                    type="date"
                    name="fecha"
                    value={newTraslado.fecha}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group controlId="descripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                    type="text"
                    name="descripcion"
                    value={newTraslado.descripcion}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group controlId="idTipoTraslado">
                <Form.Label>Tipo de Traslado</Form.Label>
                <Form.Control
                    as="select"
                    name="idTipoTraslado"
                    value={newTraslado.idTipoTraslado}
                    onChange={handleChange}
                    required
                >
                    <option value="">Seleccionar</option>
                    {tipoTraslados.map((tipo) => (
                        <option key={tipo.idTipoTraslado} value={tipo.idTipoTraslado}>
                            {tipo.tipo}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>

            <hr />
            <h5>Detalles de Productos</h5>
            {detallesProductos.map((detalle, index) => (
                <div key={index} className="mb-3">
                    <Form.Group controlId={`idProducto-${index}`}>
                        <Form.Label>Producto</Form.Label>
                      {productos.length > 0 ? (
                      <Form.Control
                          as="select"
                          value={detalle.idProducto}
                          onChange={(e) =>
                              handleDetalleChange(index, "idProducto", e.target.value)
                          }
                          required
                      >
                          <option value="">Seleccionar Producto</option>
                          {productos.map((producto) => (
                              <option key={producto.idProducto} value={producto.idProducto}>
                                  {producto.nombreProducto}
                              </option>
                          ))}
                      </Form.Control>
                  ) : (
                      <p>Cargando productos...</p>
                  )}
                    </Form.Group>
                    <Form.Group controlId={`cantidad-${index}`}>
                        <Form.Label>Cantidad</Form.Label>
                        <Form.Control
                            type="number"
                            min="1"
                            value={detalle.cantidad}
                            onChange={(e) =>
                                handleDetalleChange(index, "cantidad", e.target.value)
                            }
                            required
                        />
                    </Form.Group>
                    <Button
                        variant="danger"
                        onClick={() => handleRemoveDetalle(index)}
                        className="mt-2"
                    >
                        Eliminar Detalle
                    </Button>
                    <hr />
                </div>
            ))}

            <Button variant="secondary" onClick={handleAddDetalle} className="mb-3">
                Agregar Detalle
            </Button>

            <Button
                style={{
                    backgroundColor: "#007AC3",
                    borderColor: "#007AC3",
                    padding: "5px 10px",
                    width: "100%",
                    fontWeight: "bold",
                    color: "#fff",
                    marginTop: "10px",
                }}
                type="submit"
            >
                {editingTraslado ? "Actualizar" : "Crear"}
            </Button>
        </Form>
    </Modal.Body>
</Modal>

        <Modal show={showDetalleModal} onHide={() => setShowDetalleModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Detalle de Traslado</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {detalleTraslado ? (
              <div>
                <p><strong>Fecha:</strong> {detalleTraslado.fecha ? format(parseISO(detalleTraslado.fecha), "dd-MM-yyyy") : "Sin fecha"}</p>
                <p><strong>Descripción:</strong> {detalleTraslado.descripcion}</p>
                <p><strong>Tipo de Traslado:</strong> {detalleTraslado.tipoTraslado.tipo}</p>
                <p><strong>Detalles de Productos:</strong></p>
                {detalleTraslado.detalle_traslados && detalleTraslado.detalle_traslados.length > 0 ? (
                  <ul>
                    {detalleTraslado.detalle_traslados.map((detalle) => (
                      <li key={detalle.idDetalleTraslado}>
                        Producto: {detalle.producto.nombreProducto} | Cantidad: {detalle.cantidad}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay detalles disponibles.</p>
                )}
              </div>
            ) : (
              <p>Cargando detalles...</p>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetalleModal(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
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

export default Traslados;

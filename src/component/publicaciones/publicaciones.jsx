import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, Alert, InputGroup, FormControl } from "react-bootstrap";
import { FaPencilAlt, FaToggleOn, FaToggleOff, FaEye } from "react-icons/fa";
import { getUserDataFromToken } from "../../utils/jwtUtils";
import { format } from "date-fns";
import { parseISO } from "date-fns";
import imageCompression from 'browser-image-compression';

function Publicaciones() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [filteredPublicaciones, setFilteredPublicaciones] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false); // modal para detalles
  const [searchTerm, setSearchTerm] = useState("");
  const [sedes, setSedes] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [rifas, setRifas] = useState([]);
  const [photoToConfirm, setPhotoToConfirm] = useState(null);
  const [editingPublicacion, setEditingPublicacion] = useState(null);
  const [selectedPublicacion, setSelectedPublicacion] = useState(null); // Publicación seleccionada
  const [detallesPublicacion, setDetallesPublicacion] = useState(null); // Detalles de la publicación seleccionada
  const [photosToKeep, setPhotosToKeep] = useState([]); // Fotos que el usuario desea mantener
  const [photosToRemove, setPhotosToRemove] = useState([]); // Fotos que el usuario desea eliminar
  const [newPublicacion, setNewPublicacion] = useState({
    nombrePublicacion: "",
    descripcion: "",
    fechaPublicacion: "",
    estado: 1,
    idSede: "",
    tipo: "",
    idEvento: "",
    idRifa: "",
  });
  const [files, setFiles] = useState([]); // Para manejar las fotos
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showPermissionModal, setShowPermissionModal] = useState(false); // Nuevo estado
  const [permissionMessage, setPermissionMessage] = useState('');
  const [permissions, setPermissions] = useState({});
  const [hasViewPermission, setHasViewPermission] = useState(false);
  const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);

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
        response.data.permisos['Ver publicaciones']

      setHasViewPermission(hasPermission);
      setIsPermissionsLoaded(true);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermissions();
    fetchSedes();
    fetchEventos(); // Cargar eventos
    fetchRifas(); // Cargar rifas
  }, [photoToConfirm]);

   useEffect(() => {
        if (isPermissionsLoaded) {
          if (hasViewPermission) {
            fetchPublicaciones();
          } else {
            checkPermission('Ver publicaciones', 'No tienes permisos para ver publicaciones');
          }
        }
      }, [isPermissionsLoaded, hasViewPermission]);
  

  // Obtener el idPersona desde localStorage
  const idSede = getUserDataFromToken(localStorage.getItem("token"))?.idSede; // ! USO DE LA FUNCIÓN getUserDataFromToken
  // usuario
  const idUsuario = getUserDataFromToken(localStorage.getItem("token"))?.idUsuario; // ! USO DE LA FUNCIÓN getUserDataFromToken

  const checkPermission = (permission, message) => {
    if (!permissions[permission]) {
      setPermissionMessage(message);
      setShowPermissionModal(true);
      return false;
    }
    return true;
  };

  const fetchPublicaciones = async () => {
    try {
      const response = await axios.get("https://api.voluntariadoayuvi.com/publicaciones/completas");

      // Ordenar las publicaciones de más reciente a más antigua
      const publicacionesOrdenadas = response.data.sort(
        (a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion)
      );
      setPublicaciones(publicacionesOrdenadas);
      setFilteredPublicaciones(publicacionesOrdenadas);
    } catch (error) {
      console.error("Error fetching publicaciones:", error);
    }
  };

  const handleTogglePhoto = (photoId) => {
    if (photosToKeep.includes(photoId)) {
      // setPhotosToKeep(photosToKeep.filter((id) => id !== photoId));
      // setPhotosToRemove([...photosToRemove, photoId]);
      setPhotoToConfirm(photoId); // Establece el ID de la foto que se quiere eliminar
      setShowConfirmModal(true); // Abre el modal de confirmación
    } else {
      setPhotosToRemove(photosToRemove.filter((id) => id !== photoId));
      setPhotosToKeep([...photosToKeep, photoId]);
    }
  };

  const handleRemovePhotoWithConfirmation = (photoId) => {
    setPhotoToConfirm(photoId);
    setShowConfirmModal(true);
  };

  const confirmRemovePhoto = () => {
    if (photoToConfirm) {
      setPhotosToRemove((prev) => [...prev, photoToConfirm]); // Añadir la foto a la lista de eliminación
      setPhotosToKeep((prev) => prev.filter((id) => id !== photoToConfirm)); // Remover la foto de la lista a mantener
      setExistingPhotos((prev) => prev.filter((foto) => foto.id !== photoToConfirm)); // Actualizar las fotos visibles
      setPhotoToConfirm(null);
      setShowConfirmModal(false);
    }
  };

  const cancelRemovePhoto = () => {
    setPhotoToConfirm(null);
    setShowConfirmModal(false);
  };

  const fetchDetallesPublicacion = async (id) => {
    try {
      const response = await axios.get(`https://api.voluntariadoayuvi.com/publicaciones/detalles/${id}`);
      setDetallesPublicacion(response.data);
      //console.log("Detalles de la publicación:", response.data);
    } catch (error) {
      console.error("Error al cargar los detalles de la publicación:", error);
    }
  };

  const handleRemovePhoto = (photoId) => {
    setRemovedPhotos((prev) => [...prev, photoId]);
  };

  const fetchSedes = async () => {
    try {
      const response = await axios.get("https://api.voluntariadoayuvi.com/sedes");
      setSedes(response.data);
    } catch (error) {
      console.error("Error fetching sedes:", error);
    }
  };

  const fetchActivePublicaciones = async () => {
    try {
      if (hasViewPermission) {
      const response = await axios.get("https://api.voluntariadoayuvi.com/publicaciones/activos");

      console.log("📘 Publicaciones Activas:", response.data); // 🔍 Aquí lo imprime

      const publicacionesConTipo = response.data.map((pub) => ({
        ...pub,
        tipoPublicacion: pub.publicacionesGenerales?.length > 0
          ? "generales"
          : pub.publicacionesEventos?.length > 0
          ? "eventos"
          : pub.publicacionesRifas?.length > 0
          ? "rifas"
          : "",
      }));

      // Ordenar de más reciente a más antigua
      const publicacionesOrdenadas = publicacionesConTipo.sort(
        (a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion)
      );

      setFilteredPublicaciones(publicacionesOrdenadas);
    } else {
      checkPermission('Ver publicaciones', 'No tienes permisos para ver publicaciones')
    }
    } catch (error) {
      console.error("Error fetching active publicaciones:", error);
    }
  };

  const fetchInactivePublicaciones = async () => {
    try {
      if (hasViewPermission) {
      const response = await axios.get("https://api.voluntariadoayuvi.com/publicaciones/inactivos");

      console.log("📕 Publicaciones Inactivas:", response.data); // 🔍 Aquí lo imprime

      const publicacionesConTipo = response.data.map((pub) => ({
        ...pub,
        tipoPublicacion: pub.publicacionesGenerales?.length > 0
          ? "generales"
          : pub.publicacionesEventos?.length > 0
          ? "eventos"
          : pub.publicacionesRifas?.length > 0
          ? "rifas"
          : "",
      }));

      // Ordenar de más reciente a más antigua
      const publicacionesOrdenadas = publicacionesConTipo.sort(
        (a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion)
      );

      setFilteredPublicaciones(publicacionesOrdenadas);
    } else {
      checkPermission('Ver publicaciones', 'No tienes permisos para ver publicaciones')
    }
    } catch (error) {
      console.error("Error fetching inactive publicaciones:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = publicaciones.filter((publicacion) =>
      publicacion.nombrePublicacion.toLowerCase().includes(value)
    );
    setFilteredPublicaciones(filtered);
    setCurrentPage(1);
  };

  const handleSelectPublicacion = async (id) => {
    try {
      await fetchDetallesPublicacion(id); // Carga los detalles de la publicación seleccionada
      setShowDetailsModal(true); // Abre el modal de detalles
    } catch (error) {
      console.error("Error al seleccionar la publicación:", error);
    }
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
  };

  const handleShowModal = (publicacion = null) => {
    const currentDate = new Date(); // Fecha y hora actual
    const formattedDate = format(currentDate, "yyyy-MM-dd'T'HH:mm"); // Formato para datetime-local
    setEditingPublicacion(publicacion);
    if (publicacion) {

      // Determinar el tipo de publicación basado en los arrays
      let tipo = "";
      let idEvento = "";
      let idRifa = "";
      if (publicacion.publicacionesGenerales && publicacion.publicacionesGenerales.length > 0) {
        tipo = "generales";
      } else if (publicacion.publicacionesEventos && publicacion.publicacionesEventos.length > 0) {
        tipo = "eventos";
        idEvento = publicacion.publicacionesEventos[0]?.idEvento || ""; // Asume que todas las publicaciones de eventos tienen el mismo idEvento
      } else if (publicacion.publicacionesRifas && publicacion.publicacionesRifas.length > 0) {
        tipo = "rifas";
        idRifa = publicacion.publicacionesRifas[0]?.idRifa || ""; // Asume que todas las publicaciones de rifas tienen el mismo idRifa
      }

      // Cargar fotos existentes según el tipo de publicación
      const fotosExistentes = [
        ...(publicacion.publicacionesGenerales || []),
        ...(publicacion.publicacionesEventos || []),
        ...(publicacion.publicacionesRifas || []),
      ].map((foto) => ({
        id: foto.idPublicacionGeneral || foto.idPublicacionEvento || foto.idPublicacionRifa,
        ruta: foto.foto,
      }));

      setNewPublicacion({
        nombrePublicacion: publicacion.nombrePublicacion,
        descripcion: publicacion.descripcion,
        fechaPublicacion: format(parseISO(publicacion.fechaPublicacion), "yyyy-MM-dd'T'HH:mm"),
        estado: publicacion.estado,
        idSede: publicacion.idSede,
        tipo: tipo,
        idEvento: idEvento || "", // ID del evento (si aplica)
        idRifa: idRifa || "", // ID de la rifa (si aplica)
      });
      // Configurar las fotos existentes
      setExistingPhotos(fotosExistentes);
      setPhotosToKeep(fotosExistentes.map((foto) => foto.id));
      setPhotosToRemove([]);
      setFiles([]); // Reiniciar archivos seleccionados
    } else {
      setNewPublicacion({
        nombrePublicacion: "",
        descripcion: "",
        fechaPublicacion: formattedDate,
        estado: 1,
        idSede: idSede || "",
        tipo: "",
        idEvento: "",
        idRifa: "",
      });
      setExistingPhotos([]);
      setPhotosToKeep([]);
      setPhotosToRemove([]);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPublicacion(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPublicacion((prevNewPublicacion) => ({
      ...prevNewPublicacion,
      [name]: value,
    }));
  };

  const handleDescriptionChange = (e) => {
    const { name, value } = e.target;
    setNewPublicacion((prevNewPublicacion) => ({
      ...prevNewPublicacion,
      [name]: value,
    }));
  
    // Ajustar la altura del textarea automáticamente
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    const compressedFiles = [];
  
    setUploadMessage("Subiendo y comprimiendo fotos...");
  
    for (let file of selectedFiles) {
      try {
        const options = {
          maxSizeMB: 0.1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };
  
        const compressedFile = await imageCompression(file, options);
        console.log(`Original: ${(file.size / 1024).toFixed(2)} KB`);
        console.log(`Comprimido: ${(compressedFile.size / 1024).toFixed(2)} KB`);
        compressedFiles.push(compressedFile);
      } catch (error) {
        console.error("Error al comprimir imagen:", error);
      }
    }
  
    setFiles(compressedFiles);
    setUploadMessage("✅ Fotos listas para subir!");
  };    

  const fetchEventos = async () => {
    try {
      const response = await axios.get("https://api.voluntariadoayuvi.com/eventos");
      setEventos(response.data);
    } catch (error) {
      console.error("Error fetching eventos:", error);
    }
  };

  const fetchRifas = async () => {
    try {
      const response = await axios.get("https://api.voluntariadoayuvi.com/rifas");
      setRifas(response.data);
    } catch (error) {
      console.error("Error fetching rifas:", error);
    }
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formattedFechaPublicacion = newPublicacion.fechaPublicacion
        ? format(new Date(newPublicacion.fechaPublicacion), "yyyy-MM-dd HH:mm:ss")
        : null;

      const formData = new FormData();
      formData.append("nombrePublicacion", newPublicacion.nombrePublicacion);
      formData.append("descripcion", newPublicacion.descripcion);
      formData.append("fechaPublicacion", formattedFechaPublicacion); // Formato correcto
      formData.append("estado", newPublicacion.estado);
      formData.append("idSede", newPublicacion.idSede);
      formData.append("tipo", newPublicacion.tipo);

      // Añadir idEvento o idRifa según el tipo
      if (newPublicacion.tipo === "eventos") {
        if (!newPublicacion.idEvento) {
          return alert("Por favor, ingresa un ID de Evento válido."); // Validación para eventos
        }
        formData.append("idEvento", newPublicacion.idEvento);
      } else if (newPublicacion.tipo === "rifas") {
        if (!newPublicacion.idRifa) {
          return alert("Por favor, ingresa un ID de Rifa válido."); // Validación para rifas
        }
        formData.append("idRifa", newPublicacion.idRifa);
      }

      // Fotos a mover de una tabla a otra
      const photosToMove = existingPhotos
        .filter((foto) => photosToKeep.includes(foto.id)) // Solo las fotos que se quieren mantener
        .map((foto) => ({
          id: foto.id,
          currentType: foto.type, // Tipo actual (generales, eventos, rifas)
          newType: newPublicacion.tipo, // Nuevo tipo
        }));

      // Adjuntar IDs de fotos para eliminar
      formData.append("photosToRemove", JSON.stringify(photosToRemove));

      // Adjuntar nuevas fotos
      files.forEach((file) => formData.append("fotos", file));

      // Log para inspeccionar los datos que se están enviando
    for (let pair of formData.entries()) {
      //console.log(`${pair[0]}: ${pair[1]}`);
    }

      const endpoint = editingPublicacion
        ? `https://api.voluntariadoayuvi.com/publicaciones/completa/update/${editingPublicacion.idPublicacion}`
        : "https://api.voluntariadoayuvi.com/publicaciones/completa/create";

      const method = editingPublicacion ? "put" : "post";

      await axios({
        method,
        url: endpoint,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Creación de la bitácora después de crear o actualizar la publicación
      const bitacoraData = {
        descripcion: editingPublicacion ? "Publicación actualizada" : "Nueva publicación creada",
        idCategoriaBitacora: editingPublicacion ? 29 : 25,
        idUsuario: idUsuario,
        fechaHora: new Date()
      };

      await axios.post("https://api.voluntariadoayuvi.com/bitacora/create", bitacoraData);

      setAlertMessage(
        editingPublicacion
          ? "Publicación actualizada con éxito"
          : "Publicación creada con éxito"
      );
      fetchPublicaciones();
      setShowAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error enviando la publicación:", error.response?.data || error.message);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 1 ? 0 : 1;
      await axios.put(`https://api.voluntariadoayuvi.com/publicaciones/completa/update/${id}`, { estado: nuevoEstado });
      fetchPublicaciones();
      setAlertMessage(`Publicación ${nuevoEstado === 1 ? "activada" : "inactivada"} con éxito`);
      setShowAlert(true);
    } catch (error) {
      console.error("Error toggling estado:", error);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentPublicacion = filteredPublicaciones.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredPublicaciones.length / rowsPerPage);

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
            Gestión de Publicaciones
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
            placeholder="Buscar publicación por nombre..."
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
              width: "130px",
              marginRight: "10px",
              fontWeight: "bold",
              color: "#fff",
            }}
            onClick={() => {
              if (checkPermission('Crear publicación', 'No tienes permisos para crear publicación')) {
                handleShowModal();
              }
            }}
          >
            Agregar Publicación
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
            onClick={fetchActivePublicaciones}
          >
            Activas
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
            onClick={fetchInactivePublicaciones}
          >
            Inactivas
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
            marginTop: "20px",
            overflow: "hidden",
            textAlign: "center"
          }}
        >
          <thead style={{ backgroundColor: "#007AC3", color: "#fff", textAlign: "center" }}>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Tipo de Publicación</th> {/* Nueva columna */}
              <th>Sede</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentPublicacion.map((publicacion) => (
              <tr key={publicacion.idPublicacion}>
                <td>{publicacion.idPublicacion}</td>
                <td>{publicacion.nombrePublicacion}</td>
                <td>{publicacion.descripcion}</td>
                <td>{publicacion.fechaPublicacion ? format(parseISO(publicacion.fechaPublicacion), "dd-MM-yyyy hh:mm a") : "Sin fecha"}</td>
                <td>
                  {publicacion.tipoPublicacion === "rifas" && "Rifas"}
                  {publicacion.tipoPublicacion === "eventos" && "Eventos"}
                  {publicacion.tipoPublicacion === "generales" && "Generales"}
                </td>
                <td>{publicacion.sede?.nombreSede || "No asignada"}</td>
                <td>{publicacion.estado === 1 ? "Activo" : "Inactivo"}</td>
                <td>
                  <FaEye
                    style={{ cursor: "pointer", marginRight: "10px", color: "#007AC3" }}
                    title="Ver Detalle"
                    onClick={() => handleSelectPublicacion(publicacion.idPublicacion)}
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
                      if (checkPermission('Editar publicación', 'No tienes permisos para editar publicación')) {
                        handleShowModal(publicacion);
                      }
                    }}
                  />
                  {publicacion.estado ? (
                    <FaToggleOn
                      style={{
                        color: "#30c10c",
                        cursor: "pointer",
                        marginLeft: "10px",
                        fontSize: "20px",
                      }}
                      title="Inactivar"
                      onClick={() => {
                        if (checkPermission('Desactivar publicación', 'No tienes permisos para desactivar publicación')) {
                          toggleEstado(publicacion.idPublicacion, publicacion.estado);
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
                        if (checkPermission('Activar publicación', 'No tienes permisos para activar publicación')) {
                          toggleEstado(publicacion.idPublicacion, publicacion.estado);
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
        {showDetailsModal && (
          <Modal
            show={showDetailsModal}
            onHide={handleCloseDetailsModal}
            size="lg" // Aumenta el tamaño del modal para que sea horizontal
            style={{ textAlign: "center" }}
          >
            <Modal.Header closeButton style={{ backgroundColor: "#007AC3", color: "#fff" }}>
              <Modal.Title>Detalles de la Publicación</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ overflowX: "auto" }}>
              {detallesPublicacion ? (
                <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
                  <div style={{ flex: 1 }}>
                    <h5>Información General</h5>
                    <p><strong>Nombre:</strong> {detallesPublicacion.nombrePublicacion}</p>
                    <p><strong>Descripción:</strong> {detallesPublicacion.descripcion}</p>
                    <p><strong>Sede:</strong> {detallesPublicacion.sede?.nombreSede || "No asignada"}</p>
                    <p><strong>Fecha de Publicación:</strong>{" "}
                      {detallesPublicacion.fechaPublicacion
                        ? format(parseISO(detallesPublicacion.fechaPublicacion), "dd-MM-yyyy hh:mm a")
                        : "Sin fecha"}
                    </p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h5>Fotos</h5>
                    <h6>Generales</h6>
                    {detallesPublicacion.publicacionesGenerales.length > 0 ? (
                      detallesPublicacion.publicacionesGenerales.map((foto) => (
                        <img
                          key={foto.idPublicacionGeneral}
                          src={`https://api.voluntariadoayuvi.com/${foto.foto}`}
                          alt="Foto general"
                          style={{
                            width: "200px", // Ajusta el ancho
                            height: "auto", // Mantiene la proporción
                            margin: "10px", // Espaciado entre imágenes
                            borderRadius: "8px", // Opcional: esquinas redondeadas
                          }}
                        />
                      ))
                    ) : (
                      <p>No hay fotos generales.</p>
                    )}
                    <h6>Eventos</h6>
                    {detallesPublicacion.publicacionesEventos.length > 0 ? (
                      detallesPublicacion.publicacionesEventos.map((foto) => (
                        <img
                          key={foto.idPublicacionEvento}
                          src={`https://api.voluntariadoayuvi.com/${foto.foto}`}
                          alt="Foto de evento"
                          style={{
                            width: "200px", // Ajusta el ancho
                            height: "auto", // Mantiene la proporción
                            margin: "10px", // Espaciado entre imágenes
                            borderRadius: "8px", // Opcional: esquinas redondeadas
                          }}
                        />
                      ))
                    ) : (
                      <p>No hay fotos de eventos.</p>
                    )}
                    <h6>Rifas</h6>
                    {detallesPublicacion.publicacionesRifas.length > 0 ? (
                      detallesPublicacion.publicacionesRifas.map((foto) => (
                        <img
                          key={foto.idPublicacionRifa}
                          src={`https://api.voluntariadoayuvi.com/${foto.foto}`}
                          alt="Foto de rifa"
                          style={{
                            width: "200px", // Ajusta el ancho
                            height: "auto", // Mantiene la proporción
                            margin: "10px", // Espaciado entre imágenes
                            borderRadius: "8px", // Opcional: esquinas redondeadas
                          }}
                        />
                      ))
                    ) : (
                      <p>No hay fotos de rifas.</p>
                    )}
                  </div>
                </div>
              ) : (
                <p>Cargando detalles...</p>
              )}
            </Modal.Body>
          </Modal>
        )}
        <Modal
          show={showModal}
          onHide={handleCloseModal}
          style={{
            height: "80vh", // Altura fija en porcentaje de la ventana
            maxHeight: "90vh", // Máxima altura permitida
          }}
        >
          <Modal.Header
            closeButton
            style={{ backgroundColor: "#007AC3", color: "#fff" }}
          >
            <Modal.Title>
              {editingPublicacion ? "Editar Publicación" : "Agregar Publicación"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              maxHeight: "75vh", // Altura máxima del contenido
              overflowY: "auto", // Habilitar scroll si el contenido supera la altura
            }}
          >
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nombrePublicacion">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Nombre
                </Form.Label>
                <Form.Control
                  type="text"
                  name="nombrePublicacion"
                  value={newPublicacion.nombrePublicacion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="descripcion">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Descripción
                </Form.Label>
                <Form.Control
                  as="textarea"
                  name="descripcion"
                  value={newPublicacion.descripcion}
                  onChange={handleDescriptionChange}
                  required
                  style={{
                    height: "150px", // Establece una altura fija
                    overflowY: "scroll", // Habilita el scroll vertical
                  }} // Deshabilitar redimensionamiento manual
                />
              </Form.Group>
              <Form.Group controlId="fechaPublicacion">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Fecha y Hora de Publicación
                </Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="fechaPublicacion"
                  value={
                    newPublicacion.fechaPublicacion
                      ? format(new Date(newPublicacion.fechaPublicacion), "yyyy-MM-dd'T'HH:mm")
                      : ""
                  }
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              {/* TIPOPARA MANDAR A A TABLA CORRECTA */}
              <Form.Group controlId="tipo">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Tipo de Publicación
                </Form.Label>
                <Form.Control
                  as="select"
                  name="tipo"
                  value={newPublicacion.tipo || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="generales">Generales</option>
                  <option value="eventos">Eventos</option>
                  <option value="rifas">Rifas</option>
                </Form.Control>
              </Form.Group>
              {/* Campo condicional para idEvento */}
              {newPublicacion.tipo === "eventos" && (
                <Form.Group controlId="idEvento">
                  <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                    ID del Evento
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="idEvento"
                    value={newPublicacion.idEvento || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar Evento</option>
                    {eventos.map((evento) => (
                      <option key={evento.idEvento} value={evento.idEvento}>
                        {evento.nombreEvento}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              )}

              {/* Campo condicional para idRifa */}
              {newPublicacion.tipo === "rifas" && (
                <Form.Group controlId="idRifa">
                  <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                    ID de la Rifa
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="idRifa"
                    value={newPublicacion.idRifa || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar Rifa</option>
                    {rifas.map((rifa) => (
                      <option key={rifa.idRifa} value={rifa.idRifa}>
                        {rifa.nombreRifa}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              )}
              <Form.Group controlId="idSede">
                <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
                  Sede
                </Form.Label>
                <Form.Control
                  as="select"
                  name="idSede"
                  value={newPublicacion.idSede}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar sede</option>
                  {sedes.map((sede) => (
                    <option key={sede.idSede} value={sede.idSede}>
                      {sede.nombreSede}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              {/* Mostrar fotos actuales si está editando */}
              {editingPublicacion && detallesPublicacion && detallesPublicacion.fotos && (
                <div>
                  <h6>Fotos actuales:</h6>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {detallesPublicacion?.fotos?.map((foto) => (
                      <div key={foto.id} style={{ position: "relative", margin: "10px" }}>
                        <img
                          src={`https://api.voluntariadoayuvi.com/${foto.ruta}`}
                          alt="Foto actual"
                          style={{
                            width: "100px",
                            height: "100px",
                            border: photosToKeep.includes(foto.id) ? "2px solid green" : "2px solid red",
                            borderRadius: "8px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleRemovePhotoWithConfirmation(foto.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Pa ver fotos */}
              <Form.Group controlId="fotosExistentes">
                <Form.Label>Fotos Existentes</Form.Label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {existingPhotos.map((foto) => (
                    <img
                      key={foto.id}
                      src={`https://api.voluntariadoayuvi.com/${foto.ruta}`}
                      alt="Foto existente"
                      style={{
                        width: "100px",
                        height: "100px",
                        border: photosToKeep.includes(foto.id) ? "2px solid green" : "2px solid red",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleTogglePhoto(foto.id)}
                    />
                  ))}
                </div>
              </Form.Group>
              {/* Nuevas fotos */}
              <Form.Group controlId="fotos">
                <Form.Label>Nuevas Fotos</Form.Label>
                {uploadMessage && (
                  <Alert variant="info" style={{ fontWeight: "bold" }}>
                    {uploadMessage}
                  </Alert>
                )}
                <Form.Control type="file" multiple onChange={handleFileChange} />
              </Form.Group>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={newPublicacion.estado}
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
                {editingPublicacion ? "Actualizar" : "Crear"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
        <Modal
          show={showConfirmModal}
          onHide={cancelRemovePhoto}
          style={{
            marginTop: "400px", // Espacio desde la parte superior
            marginLeft: "650px",
            marginRight: "auto",
            width: "400px", // Ancho del modal
            height: "600px", // Altura del modal
            borderRadius: "15px",
            textAlign: "center",
          }}
          centered={false} // Desactiva el centrado automático
        >
          <Modal.Header
            closeButton
            style={{
              borderBottom: "none", // Quita la línea entre el header y body
            }}
          >
            <Modal.Title
              style={{
                width: "100%",
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              Confirmar eliminación
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              padding: "20px",
              fontSize: "16px",
              color: "#555",
            }}
          >
            {photoToConfirm ? (
              <p style={{ fontSize: "17px" }}>
                ¿Estás seguro de deseas eliminar esta foto?
              </p>
            ) : (
              <p>Cargando información de la foto...</p>
            )}
          </Modal.Body>
          <Modal.Footer
            style={{
              borderTop: "none", // Quita la línea entre el body y footer
              display: "flex",
              justifyContent: "center",
              gap: "20px", // Espacio entre botones
            }}
          >
            <Button
              variant="danger"
              onClick={confirmRemovePhoto}
              style={{
                padding: "10px 20px",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              Eliminar
            </Button>
            <Button
              variant="secondary"
              onClick={cancelRemovePhoto}
              style={{
                padding: "10px 20px",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              Cancelar
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

export default Publicaciones;

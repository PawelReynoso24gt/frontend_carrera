import React, { useState, useEffect } from "react";
import axios from "axios";
import profileImg from "../../assets/img/withoutProfilePicture.png";
import socialImg from "../../assets/img/social-1.png";
import socialImg2 from "../../assets/img/social-2.png";
import socialImg3 from "../../assets/img/social-3.png";
import socialImg4 from "../../assets/img/social-4.png";
import socialImg5 from "../../assets/img/social-5.png";
import { getUserDataFromToken } from "../../utils/jwtUtils";
import './SidebarProfile.css';

function SidebarProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(profileImg);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const idUsuario = getUserDataFromToken(localStorage.getItem("token"))?.idUsuario;
        if (!idUsuario) {
          setError("No se ha iniciado sesión correctamente.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/usuarios/activos`);
        const loggedUser = response.data.find((user) => user.idUsuario === idUsuario);

        if (loggedUser) {
          setUserData(loggedUser);
          setPreview(loggedUser.foto || profileImg);
        } else {
          setError("Usuario no encontrado.");
        }
      } catch (err) {
        console.error("Error al obtener los datos del usuario:", err);
        setError("Error al cargar los datos del usuario.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg")) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      alert("Solo se permiten archivos JPG, JPEG y PNG.");
    }
  };

  const handleSaveChanges = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('foto', selectedFile);

      try {
        const response = await axios.put(`http://localhost:5000/personasFoto/${userData.idPersona}/foto`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log("Foto actualizada:", response.data);
        setSuccessMessage("Se han guardado los cambios correctamente.");
        setSelectedFile(null);
      } catch (err) {
        console.error("Error al actualizar la foto:", err);
      }
    }
  };

  const handleDiscardChanges = () => {
    setSelectedFile(null);
    setPreview(userData.foto || profileImg);
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!userData) {
    return <p>Usuario no encontrado.</p>;
  }

  return (
    <div className="col-lg-4 col-12 crancy-upinner__column1">
      <div className="crancy-upcard mg-top-30">
        <div className="crancy-upcard__thumb">
          <img src={preview} alt="Profile" />
          <input
            type="file"
            accept="image/jpeg, image/png, image/jpg"
            style={{ display: "none" }}
            id="fileInput"
            onChange={handleFileChange}
          />
          <button className="update-photo-btn" onClick={() => document.getElementById('fileInput').click()}>
            Actualizar mi foto
          </button>
          {selectedFile && (
            <>
              <button className="save-photo-btn" onClick={handleSaveChanges}>
                Guardar cambios
              </button>
              <button className="discard-photo-btn" onClick={handleDiscardChanges}>
                Descartar cambios
              </button>
            </>
          )}
          {successMessage && <p>{successMessage}</p>}
        </div>
        <div className="crancy-upcard__heading">
          <h3 className="crancy-upcard__title">{userData.persona.nombre}</h3>
          <div className="crancy-upcard__location">
            <p className="crancy-upcard__text crancy-pcolor">
              {userData.persona.domicilio || "Dirección no disponible"}
            </p>
          </div>
        </div>
        <ul className="crancy-upcard__list">
          <li>
            <b>Usuario:</b> <span>{userData.usuario}</span>
          </li>
          <li>
            <b>Teléfono:</b> <span>{userData.persona.telefono}</span>
          </li>
          <li>
            <b>Email:</b> <span>{userData.persona.correo}</span>
          </li>
          <li>
            <b>Fecha de registro:</b>{" "}
            <span className="crancy-pcolor crancy-upcard__list--label">
              {new Date(userData.persona.createdAt).toLocaleDateString()}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SidebarProfile;
import React, { useState, useEffect } from "react";
import axios from "axios";
import profileImg from "../../assets/img/profile-single-thumb.png";
import socialImg from "../../assets/img/social-1.png";
import socialImg2 from "../../assets/img/social-2.png";
import socialImg3 from "../../assets/img/social-3.png";
import socialImg4 from "../../assets/img/social-4.png";
import socialImg5 from "../../assets/img/social-5.png";

function SidebarProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Obtener el userId desde el localStorage
        const userId = Number(localStorage.getItem("userId"));
        if (!userId) {
          setError("No se ha iniciado sesión correctamente.");
          setLoading(false);
          return;
        }

        // Hacer la petición al backend
        const response = await axios.get(`http://localhost:5000/usuarios/activos`);

        console.log("Usuarios activos desde la API:", response.data); // Debug
        // Buscar el usuario logueado en los datos retornados
        const loggedUser = response.data.find((user) => user.idUsuario === userId);

        if (loggedUser) {
          setUserData(loggedUser);
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
  }, []); // Solo se ejecuta una vez al montar el componente

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
      {/* Profile Card */}
      <div className="crancy-upcard mg-top-30">
        <div className="crancy-upcard__thumb">
          <img src={profileImg} alt="Profile" />
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
        {/*<ul className="crancy-upcard__social">
          <li>
            <a href="#">
              <img src={socialImg} alt="Social 1" />
            </a>
          </li>
          <li>
            <a href="#">
              <img src={socialImg2} alt="Social 2" />
            </a>
          </li>
          <li>
            <a href="#">
              <img src={socialImg3} alt="Social 3" />
            </a>
          </li>
          <li>
            <a href="#">
              <img src={socialImg4} alt="Social 4" />
            </a>
          </li>
          <li>
            <a href="#">
              <img src={socialImg5} alt="Social 5" />
            </a>
          </li>
        </ul>*/}
      </div>
      {/* End Profile Card */}
    </div>
  );
}

export default SidebarProfile;

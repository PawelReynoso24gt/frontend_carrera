import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import profileImg from '../../assets/img/profile-pic.png';
import { getUserDataFromToken } from '../../utils/jwtUtils';

function Author({ subNav, setSubNav, title }) {
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(profileImg);

  useEffect(() => {
    const fetchUserProfilePicture = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = getUserDataFromToken(token);

        if (!userData) {
          return;
        }

        const response = await axios.get(`https://api.voluntariadoayuvi.com/usuarios/activos`);
        const loggedUser = response.data.find((user) => user.idUsuario === userData.idUsuario);

        if (loggedUser) {
          const photoPath = loggedUser.persona.foto !== "sin foto" ? `https://api.voluntariadoayuvi.com/${loggedUser.persona.foto.replace(/\\/g, '/')}` : profileImg;
          setProfilePicture(photoPath);
        }
      } catch (err) {
        console.error("Error al obtener la foto del usuario:", err);
      }
    };

    fetchUserProfilePicture();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = getUserDataFromToken(token);

      if (token) {
        const idUsuario = userData ? userData.idUsuario : null;

        await axios.put(`https://api.voluntariadoayuvi.com/usuarios/logout/${idUsuario}`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        localStorage.clear();
      }

      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Error al cerrar sesión. Intenta de nuevo.');
    }
  };

  return (
    <div className="crancy-header__author" onMouseOver={() => setSubNav(title)}>
      <Link to="/profile-overview">
        <div className="crancy-header__author-img">
          <img src={profilePicture} alt="Profile" />
        </div>
      </Link>
      <div
        className="crancy-balance crancy-profile__hover fm-hover-animation"
        style={{ display: subNav === title ? 'block' : 'none' }}
      >
        <h3 className="crancy-balance__title">Mi perfil</h3>
        <ul className="crancy-balance_list">
          <li>
            <div className="crancy-balance-info">
              <div className="crancy-balance__img crancy-sbcolor">
                <svg
                  width="14"
                  height="20"
                  viewBox="0 0 14 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.1446 11.7104H3.85544C2.8333 11.7117 1.85337 12.1161 1.1306 12.8351C0.407829 13.5541 0.00123498 14.5288 0 15.5456V19.4473H14V15.5456C13.9988 14.5288 13.5922 13.5541 12.8694 12.8351C12.1466 12.1161 11.1667 11.7117 10.1446 11.7104V11.7104Z"
                    fill="white"
                  />
                  <path
                    d="M7.00041 9.86824C9.64556 9.86824 11.7899 7.80639 11.7899 5.26298C11.7899 2.71956 9.64556 0.657715 7.00041 0.657715C4.35526 0.657715 2.21094 2.71956 2.21094 5.26298C2.21094 7.80639 4.35526 9.86824 7.00041 9.86824Z"
                    fill="white"
                  />
                </svg>
              </div>
              <h4 className="crancy-balance-name">
                <Link to="/profile-overview">Mi perfil</Link>
              </h4>
            </div>
          </li>
          <li onClick={handleLogout}>
            <div className="crancy-balance-info">
              <div className="crancy-balance__img crancy-color4__bg">
                <svg
                  width="19"
                  height="18"
                  viewBox="0 0 19 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* SVG PATHS */}
                </svg>
              </div>
              <h4 className="crancy-balance-name">
                <a href="#">Cerrar sesión</a>
              </h4>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Author;
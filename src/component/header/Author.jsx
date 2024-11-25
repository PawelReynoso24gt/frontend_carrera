import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import profile from '../../assets/img/profile-pic.png';
import axios from 'axios';

function Author({ subNav, setSubNav, title }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Obtener el id del usuario decodificando el token (siempre que el id esté incluido en el payload)
        const userId = parseJwt(token).idUsuario;

        // Llamar al endpoint de logout para eliminar el token de la base de datos
        await axios.put(`http://localhost:5000/usuarios/logout/${userId}`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Eliminar el token del localStorage
        localStorage.removeItem('token');
      }

      // Navegar a la página de login
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Error al cerrar sesión. Intenta de nuevo.');
    }
  };

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="crancy-header__author" onMouseOver={() => setSubNav(title)}>
      <Link to="/profile-overview">
        <div className="crancy-header__author-img">
          <img src={profile} alt="#" />
        </div>
      </Link>
      {/* crancy Profile Hover */}
      <div
        className="crancy-balance crancy-profile__hover fm-hover-animation"
        style={{ display: subNav === title ? 'block' : 'none' }}
      >
        <h3 className="crancy-balance__title">My Profile</h3>
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
                <Link to="/profile-overview">My Profile</Link>
              </h4>
            </div>
          </li>
          {/* Logout Button */}
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
                <a href="#">Log Out</a>
              </h4>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Author;
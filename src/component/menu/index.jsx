import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
// import logo from "../../assets/img/logo-dark.png";
import logoWhite from "../../assets/img/logo-white.png";
import logo from "../../assets/img/LogoAYUVI_FullAzul.png";
import logoIcon from "../../assets/img/LogoAYUVIicon.png";
import arrowIcon from "../../assets/img/arrow-icon.svg";
import inboxEdit from "../../assets/img/inbox-edit.svg";
import inboxAuthor from "../../assets/img/inbox-author.png";
import signInIcon from "../../assets/img/support-sign-icon.svg";
import Dropdown from "./Dropdown";
import bg from "../../assets/img/support-bg.png";

function Menu({ toggleMenu, menu }) {
  const [dropdown, setDropdown] = useState(false);
  const location = useLocation();
  const handleDropdown = (name) => {
    setDropdown(name === dropdown ? "" : name);
  };
  return (
    <div className={`crancy-smenu ${menu && "crancy-close"}`} id="CrancyMenu">
      {/* <!-- Admin Menu --> */}
      <div className={`admin-menu ${dropdown ? "no-overflow" : ""}`}>
        {/* <!-- Logo --> */}
        <div className="logo crancy-sidebar-padding pd-right-0">
          <Link className="crancy-logo" to="/">
            {/* <!-- Logo for Default --> */}
            <img className="crancy-logo__main" src={logo} alt="#"  style={{ width: "250px", height: "auto" }} />
            <img className="crancy-logo__main--dark" src={logoWhite} alt="#" />
            {/* <!-- Logo for Dark Version --> */}
            <img className="crancy-logo__main--small" src={logoIcon} alt="#" />
            <img
              className="crancy-logo__main--small--dark"
              src={logoIcon}
              alt="#"
            />
          </Link>
          <div
            id="crancy__sicon"
            className="crancy__sicon close-icon"
            onClick={toggleMenu}
          >
            <img src={arrowIcon} />
          </div>
        </div>

        {/* <!-- Main Menu --> */}
        <div className="admin-menu__one crancy-sidebar-padding mg-top-20">
          <h4 className="admin-menu__title">Menu</h4>
          {/* <!-- Nav Menu --> */}
          <div className="menu-bar">
            <ul id="CrancyMenu" className="menu-bar__one crancy-dashboard-menu">
              <Dropdown
                name="Estadísticas"
                dropdown={dropdown}
                setDropdown={handleDropdown}
                options={[
                 
                  { link: "dashboard-sass", title: "General" },
                ]}
                img={
                  <svg
                    className="crancy-svg-icon"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 4C2 2.89543 2.89543 2 4 2H8C9.10457 2 10 2.89543 10 4V8C10 9.10457 9.10457 10 8 10H4C2.89543 10 2 9.10457 2 8V4Z"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M22 6C22 8.20914 20.2091 10 18 10C15.7909 10 14 8.20914 14 6C14 3.79086 15.7909 2 18 2C20.2091 2 22 3.79086 22 6Z"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M10 18C10 20.2091 8.20914 22 6 22C3.79086 22 2 20.2091 2 18C2 15.7909 3.79086 14 6 14C8.20914 14 10 15.7909 10 18Z"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M14 16C14 14.8954 14.8954 14 16 14H20C21.1046 14 22 14.8954 22 16V20C22 21.1046 21.1046 22 20 22H16C14.8954 22 14 21.1046 14 20V16Z"
                      strokeWidth="1.5"
                    />
                  </svg>
                }
              />
   
{/*statistics*/}            
  {[
        { link: "sedes", title: "Gestión Sedes" },
        { link: "publicaciones", title: "Gestión Publicaciones" },
        { link: "asistencia_eventos", title: "Asistencias a Eventos" },
        { link: "roles", title: "Gestión Roles" },
        { link: "Departamentos", title: "Gestión Departamentos" },
        { link: "comisiones", title: "Gestión Comisiones" },
        { link: "actividades", title: "Gestión Actividades" },
        { link: "TipoPago", title: "Gestión Tipo Pago" },
        { link: "tipoStands", title: "Gestión Tipo Stands" },
        { link: "horarios", title: "Gestión Horarios" },
        { link: "detallehorarios", title: "Gestión Asignacion de horarios" },
        { link: "fotosedes", title: "Gestión Ingreso de fotos" },
        { link: "tipo_publicos", title: "Gestión Tipo Público" },
        { link: "categoria_bitacoras", title: "Gestión Categoría Bitácora" },
        { link: "rifas", title: "Gestión Rifas" },
        { link: "productos", title: "Gestión Productos" },
        { link: "personas", title: "Gestión Personas" },
        { link: "Stands", title: "Gestión Stands" },
        { link: "Municipios", title: "Gestión Municipios" },
        { link: "talonarios", title: "Gestión Talonarios" },
        { link: "voluntarios", title: "Gestión Voluntarios" },
        { link: "Materiales", title: "Gestión Materiales" },
        { link: "Administradores", title: "Gestión Administradores" },
        { link: "mercanciaVoluntarios", title: "Mercancía voluntarios" },
        { link: "inventarioMventas", title: "Inventario de mercancía para ventas" },
        { link: "autorizacionSolicitud", title: "Autorización de solicitudes" },
      ].map((item) => (
        <li
          key={item.link}
          className={location.pathname === `/${item.link}` ? "active" : ""}
        >
            <Link to={`/${item.link}`}>
            <span className="menu-bar__text">
              <span className="menu-bar__name">{item.title}</span>
            </span>
          </Link>
          </li>
         ))}

            </ul>
          </div>
          {/* <!-- End Nav Menu --> */}
        </div>

        <div className="crancy-sidebar-padding pd-btm-40">
       
          {/*  Nav Menu --> */}
          <div className="menu-bar">
            <ul className="menu-bar__one crancy-dashboard-menu" id="CrancyMenu">

          {/*dropdown*/ }



            </ul>
          </div>
          {/* <!-- End Nav Menu --> */}
          {/* <!-- Support Card --> */}

          {/* <!-- End Support Card --> */}
        </div>
      </div>
    </div>
  );
}

export default Menu;

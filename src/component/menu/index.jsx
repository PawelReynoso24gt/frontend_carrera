import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
// import logo from "../../assets/img/logo-dark.png";
import logoWhite from "../../assets/img/logo-white.png";
import logo from "../../assets/img/logo.png";
import logoIcon from "../../assets/img/logo-icon.png";
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
            <img className="crancy-logo__main" src={logo} alt="#" />
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
                name="Dashboards"
                dropdown={dropdown}
                setDropdown={handleDropdown}
                options={[
                  { link: "", title: "Dashboard Sells" },
                  { link: "home-analytics", title: "Dashboard Analytics" },
                  { link: "dashboard-sass", title: "Dashboard Sass" },
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
              <li
                className={location.pathname === "/statistics" ? "active" : ""}
              >
                <Link className="collapsed" to="/statistics">
                  <span className="menu-bar__text">
                    <span className="crancy-menu-icon crancy-svg-icon__v1">
                      <svg
                        className="crancy-svg-icon"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21.8025 10.0128C21.0104 6.08419 17.9158 2.98956 13.9872 2.19745C12.9045 1.97914 12 2.89543 12 4V10C12 11.1046 12.8954 12 14 12H20C21.1046 12 22.0209 11.0955 21.8025 10.0128Z"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9 4.22314C4.99202 5.1326 2 8.71695 2 13.0001C2 17.9707 6.02944 22.0001 11 22.0001C15.2832 22.0001 18.8675 19.0081 19.777 15.0001"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <span className="menu-bar__name">Statistics</span>
                  </span>
                </Link>
              </li>
              <li className={location.pathname === "/inbox" ? "active" : ""}>
                <Link className="collapsed" to="/inbox">
                  <span className="menu-bar__text">
                    <span className="crancy-menu-icon crancy-svg-icon__v1">
                      <svg
                        className="crancy-svg-icon"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 14H16M8 10H12M21.9664 11.2166C21.9886 11.4748 22 11.7361 22 12C22 16.9706 17.9706 21 13 21H6C3.79086 21 2 19.2091 2 17V12C2 7.02944 6.02944 3 11 3H13C13.2639 3 13.5252 3.01136 13.7834 3.03362M22 6C22 7.65685 20.6569 9 19 9C17.3431 9 16 7.65685 16 6C16 4.34315 17.3431 3 19 3C20.6569 3 22 4.34315 22 6Z"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <span className="menu-bar__name">Inbox</span>
                  </span>
                  <div className="crancy-menu-group">
                    <span href="#">
                      <img src={inboxEdit} />
                    </span>
                    <span href="#">
                      <img src={inboxAuthor} />
                    </span>
                    <span className="menu-bar__count  crancy-color1__bg">
                      5
                    </span>
                  </div>
                </Link>
              </li>
              <Dropdown
                name="CRUD"
                dropdown={dropdown}
                setDropdown={handleDropdown}
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
                      d="M2 8L22 8M8 8V22M22 6V18C22 20.2091 20.2091 22 18 22H6C3.79086 22 2 20.2091 2 18L2 6C2 3.79086 3.79086 2 6 2L18 2C20.2091 2 22 3.79086 22 6Z"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                options={[
                  { link: "sedes", title: "Sedes" },
                  { link: "publicaciones", title: "Publicaciones" },
                  { link: "roles", title: "Roles" },
                  { link: "Departamentos", title: "Departamentos" },
                  { link: "comisiones", title: "Comisiones" },
                  { link: "actividades", title: "Actividades" },
                  { link: "TipoPago", title: "Tipo Pago" },
                  { link: "tipoStands", title: "Tipo Stands" },
                  { link: "horarios", title: "Horarios" },
                  { link: "detallehorarios", title: "Asignacion de horarios" },
                  { link: "fotosedes", title: "Ingreso de fotos" },
                  { link: "tipo_publicos", title: "Tipo Público" },
                  { link: "categoria_bitacoras", title: "Categoría Bitácora"},
                  { link: "rifas", title: "Rifas"},
                  { link: "productos", title: "Productos"},
                  { link: "personas", title: "Personas"},
                  { link: "Stands", title: "Stands" },
                  { link: "Municipios", title: "Municipios" },
                  { link: "Categorias", title: "Categorias" },
                  { link: "Traslados", title: "Traslados" },
                  { link: "Eventos", title: "Eventos" },
                  { link: "tipoTraslado", title: "Tipo Traslado" },
                  { link: "pedidos", title: "Pedidos" },
                  { link: "categoriaHorarios", title: "Categoria Horarios" },
                ]}
              />
               <Dropdown
                name="Permisos"
                dropdown={dropdown}
                setDropdown={handleDropdown}
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
                      d="M2 8L22 8M8 8V22M22 6V18C22 20.2091 20.2091 22 18 22H6C3.79086 22 2 20.2091 2 18L2 6C2 3.79086 3.79086 2 6 2L18 2C20.2091 2 22 3.79086 22 6Z"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                options={[
                  { link: "permisos", title: "Asignación de permisos" }
                ]}
              />
              <Dropdown
                name="Apps"
                dropdown={dropdown}
                setDropdown={handleDropdown}
                img={
                  <svg
                    className="crancy-svg-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 18 24"
                    fill="none"
                  >
                    <path
                      d="M14.2 15.3H7.6V6.5H14.2M14.2 15.3C15.415 15.3 16.4 14.315 16.4 13.1V8.7C16.4 7.48497 15.415 6.5 14.2 6.5M14.2 15.3V20.8C14.2 22.015 13.215 23 12 23H3.2C1.98497 23 1 22.015 1 20.8V3.2C1 1.98497 1.98497 1 3.2 1H12C13.215 1 14.2 1.98497 14.2 3.2V6.5"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.7 19.7001C8.7 20.3076 8.20751 20.8001 7.6 20.8001C6.99249 20.8001 6.5 20.3076 6.5 19.7001C6.5 19.0926 6.99249 18.6001 7.6 18.6001C8.20751 18.6001 8.7 19.0926 8.7 19.7001Z"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.4004 9.80005L7.60039 9.80005"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                options={[
                  { link: "email", title: "Email" },
                  { link: "to-dolist", title: "To do-list" },
                  { link: "integrations", title: "Integrations" },
                ]}
              />
              <Dropdown
                name="Pages"
                dropdown={dropdown}
                setDropdown={handleDropdown}
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
                      d="M2 8L22 8M8 8V22M22 6V18C22 20.2091 20.2091 22 18 22H6C3.79086 22 2 20.2091 2 18L2 6C2 3.79086 3.79086 2 6 2L18 2C20.2091 2 22 3.79086 22 6Z"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                options={[
                  { link: "pricing", title: "Pricing" },
                  { link: "teams", title: "Teams" },
                  { link: "gallery", title: "Gallery" },
                  { link: "faq", title: "Faq" },
                  { link: "calendar", title: "Calendar" },
                  { link: "error-page", title: "Error Page" },
                ]}
              />
              <Dropdown
                name="Author Pages"
                dropdown={dropdown}
                setDropdown={handleDropdown}
                img={
                  <svg
                    className="crancy-svg-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path d="M18.6 10.35C19.0142 10.35 19.35 10.0142 19.35 9.6C19.35 9.18579 19.0142 8.85 18.6 8.85V10.35ZM15.3 8.85C14.8858 8.85 14.55 9.18579 14.55 9.6C14.55 10.0142 14.8858 10.35 15.3 10.35V8.85ZM18.6 14.75C19.0142 14.75 19.35 14.4142 19.35 14C19.35 13.5858 19.0142 13.25 18.6 13.25V14.75ZM15.3 13.25C14.8858 13.25 14.55 13.5858 14.55 14C14.55 14.4142 14.8858 14.75 15.3 14.75V13.25ZM4.3 3.75H19.7V2.25H4.3V3.75ZM22.25 6.3V17.3H23.75V6.3H22.25ZM19.7 19.85H4.3V21.35H19.7V19.85ZM1.75 17.3V6.3H0.25V17.3H1.75ZM4.3 19.85C2.89167 19.85 1.75 18.7083 1.75 17.3H0.25C0.25 19.5368 2.06325 21.35 4.3 21.35V19.85ZM22.25 17.3C22.25 18.7083 21.1083 19.85 19.7 19.85V21.35C21.9368 21.35 23.75 19.5368 23.75 17.3H22.25ZM19.7 3.75C21.1083 3.75 22.25 4.89167 22.25 6.3H23.75C23.75 4.06325 21.9368 2.25 19.7 2.25V3.75ZM4.3 2.25C2.06325 2.25 0.25 4.06325 0.25 6.3H1.75C1.75 4.89167 2.89167 3.75 4.3 3.75V2.25ZM10.9 15.45H6.5V16.95H10.9V15.45ZM6.5 15.45C6.3067 15.45 6.15 15.2933 6.15 15.1H4.65C4.65 16.1217 5.47827 16.95 6.5 16.95V15.45ZM11.25 15.1C11.25 15.2933 11.0933 15.45 10.9 15.45V16.95C11.9217 16.95 12.75 16.1217 12.75 15.1H11.25ZM8.7 12.55C10.1083 12.55 11.25 13.6917 11.25 15.1H12.75C12.75 12.8632 10.9368 11.05 8.7 11.05V12.55ZM8.7 11.05C6.46325 11.05 4.65 12.8632 4.65 15.1H6.15C6.15 13.6917 7.29167 12.55 8.7 12.55V11.05ZM14.2 2.25H9.8V3.75H14.2V2.25ZM18.6 8.85L15.3 8.85V10.35L18.6 10.35V8.85ZM18.6 13.25L15.3 13.25V14.75L18.6 14.75V13.25ZM10.15 9.6C10.15 10.4008 9.50081 11.05 8.7 11.05V12.55C10.3292 12.55 11.65 11.2292 11.65 9.6H10.15ZM8.7 11.05C7.89919 11.05 7.25 10.4008 7.25 9.6H5.75C5.75 11.2292 7.07076 12.55 8.7 12.55V11.05ZM7.25 9.6C7.25 8.79919 7.89919 8.15 8.7 8.15V6.65C7.07076 6.65 5.75 7.97076 5.75 9.6H7.25ZM8.7 8.15C9.50081 8.15 10.15 8.79919 10.15 9.6H11.65C11.65 7.97076 10.3292 6.65 8.7 6.65V8.15Z" />
                  </svg>
                }
                options={[
                  { link: "login", title: "Sign in" },
                  { link: "create-account", title: "Sign up" },
                  { link: "forget-password", title: "Forget Password" },
                  { link: "confirm-password", title: "Confirm Password" },
                  { link: "verificaiton", title: "OTP Verificaiton" },
                  { link: "password-success", title: "Success" },
                ]}
              />
              <li
                className={location.pathname === "/transaction" ? "active" : ""}
              >
                <Link className="collapsed" to="/transaction">
                  <span className="menu-bar__text">
                    <span className="crancy-menu-icon crancy-svg-icon__v1">
                      <svg
                        className="crancy-svg-icon"
                        width="20"
                        height="22"
                        viewBox="0 0 20 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 9H14M6 13H14M6 17H10M6 3C6 4.10457 6.89543 5 8 5H12C13.1046 5 14 4.10457 14 3M6 3C6 1.89543 6.89543 1 8 1H12C13.1046 1 14 1.89543 14 3M6 3H5C2.79086 3 1 4.79086 1 7V17C1 19.2091 2.79086 21 5 21H15C17.2091 21 19 19.2091 19 17V7C19 4.79086 17.2091 3 15 3H14"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <span className="menu-bar__name">Transaction</span>
                  </span>
                </Link>
              </li>
              <li
                className={
                  location.pathname === "/notifications" ? "active" : ""
                }
              >
                <Link className="collapsed" to="/notifications">
                  <span className="menu-bar__text">
                    <span className="crancy-menu-icon crancy-svg-icon__v1">
                      <svg
                        className="crancy-svg-icon"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.0717 4.06949C8.26334 4.49348 6.01734 6.81294 5.67964 9.79403L5.33476 12.8385C5.24906 13.595 4.94246 14.3069 4.45549 14.88C3.42209 16.0964 4.26081 18 5.83014 18H18.1699C19.7392 18 20.5779 16.0964 19.5445 14.88C19.0575 14.3069 18.7509 13.595 18.6652 12.8385L18.4373 10.8267M15 20C14.5633 21.1652 13.385 22 12 22C10.615 22 9.43668 21.1652 9 20M20 5C20 6.65685 18.6569 8 17 8C15.3431 8 14 6.65685 14 5C14 3.34315 15.3431 2 17 2C18.6569 2 20 3.34315 20 5Z"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <span className="menu-bar__name">Notifications</span>
                  </span>
                  <span className="menu-bar__count  crancy-color1__bg">7</span>
                </Link>
              </li>
              <li className={location.pathname === "/user" ? "active" : ""}>
                <Link className="collapsed" to="/user">
                  <span className="menu-bar__text">
                    <span className="crancy-menu-icon crancy-svg-icon__v1">
                      <svg
                        className="crancy-svg-icon"
                        width="18"
                        height="22"
                        viewBox="0 0 18 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <ellipse
                          cx="8.77778"
                          cy="17.1111"
                          rx="7.77778"
                          ry="3.88889"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="8.77843"
                          cy="5.44444"
                          r="4.44444"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="menu-bar__name">User</span>
                  </span>
                </Link>
              </li>
              <li className={location.pathname === "/history" ? "active" : ""}>
                <Link className="collapsed" to="/history">
                  <span className="menu-bar__text">
                    <span className="crancy-menu-icon crancy-svg-icon__v1">
                      <svg
                        className="crancy-svg-icon"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20.5 13.5C20.5 18.1944 16.6944 22 12 22C7.30558 22 3.5 18.1944 3.5 13.5C3.5 8.80558 7.30558 5 12 5C16.6944 5 20.5 8.80558 20.5 13.5Z"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M15 2.41406C14.0463 2.14433 13.04 2 12 2C10.96 2 9.95366 2.14433 9 2.41406"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M13.5 14C13.5 14.8284 12.8284 15.5 12 15.5C11.1716 15.5 10.5 14.8284 10.5 14C10.5 13.1716 11.1716 12.5 12 12.5C12.8284 12.5 13.5 13.1716 13.5 14Z"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M12 12V9"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="menu-bar__name">History</span>
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          {/* <!-- End Nav Menu --> */}
        </div>

        <div className="crancy-sidebar-padding pd-btm-40">
          <h4 className="admin-menu__title">Help</h4>
          {/* <!-- Nav Menu --> */}
          <div className="menu-bar">
            <ul className="menu-bar__one crancy-dashboard-menu" id="CrancyMenu">
              <li
                className={
                  location.pathname === "/profile-overview" ? "active" : ""
                }
              >
                <Link to="/profile-overview" className="collapsed">
                  <span className="menu-bar__text">
                    <span className="crancy-menu-icon crancy-svg-icon__v1">
                      <svg
                        className="crancy-svg-icon"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7 7V5C7 3.89543 7.89543 3 9 3H20C21.1046 3 22 3.89543 22 5V14C22 15.1046 21.1046 16 20 16H15M11 7.5H18M14 11.5H18M5.58579 16.5858C6.36683 17.3668 7.63317 17.3668 8.41421 16.5858C8.78929 16.2107 9.29799 16 9.82843 16H10C11.1046 16 12 16.8954 12 18V19C12 20.1046 11.1046 21 10 21H4C2.89543 21 2 20.1046 2 19V18C2 16.8954 2.89543 16 4 16H4.17157C4.70201 16 5.21071 16.2107 5.58579 16.5858ZM9 12C9 13.1046 8.10457 14 7 14C5.89543 14 5 13.1046 5 12C5 10.8954 5.89543 10 7 10C8.10457 10 9 10.8954 9 12Z"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <span className="menu-bar__name">My Profile</span>
                  </span>
                </Link>
              </li>
              <li className={location.pathname === "/settings" ? "active" : ""}>
                <Link to="/settings" className="collapsed">
                  <span className="menu-bar__text">
                    <span className="crancy-menu-icon crancy-svg-icon__v1">
                      <svg
                        className="crancy-svg-icon"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.9892 4.66663H13.0094C11.916 4.66663 11.0296 5.50236 11.0296 6.53329C11.0296 7.71304 9.76736 8.46308 8.73119 7.89904L8.62595 7.84175C7.67902 7.32628 6.46819 7.63218 5.92149 8.525L4.93158 10.1416C4.38487 11.0344 4.70932 12.176 5.65624 12.6915C6.69291 13.2558 6.69291 14.7441 5.65624 15.3084C4.70931 15.8239 4.38487 16.9655 4.93158 17.8583L5.92148 19.4749C6.46819 20.3677 7.67902 20.6736 8.62595 20.1582L8.73119 20.1009C9.76736 19.5368 11.0296 20.2869 11.0296 21.4666C11.0296 22.4976 11.916 23.3333 13.0094 23.3333H14.9892C16.0827 23.3333 16.969 22.4976 16.969 21.4666C16.969 20.2869 18.2313 19.5368 19.2675 20.1009L19.3727 20.1582C20.3197 20.6736 21.5305 20.3677 22.0772 19.4749L23.0671 17.8583C23.6138 16.9655 23.2894 15.8239 22.3424 15.3084C21.3058 14.7441 21.3058 13.2558 22.3424 12.6915C23.2894 12.176 23.6138 11.0344 23.0671 10.1416L22.0772 8.52501C21.5305 7.6322 20.3197 7.3263 19.3727 7.84176L19.2675 7.89905C18.2313 8.4631 16.969 7.71305 16.969 6.53329C16.969 5.50236 16.0827 4.66663 14.9892 4.66663Z"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        ></path>
                        <circle
                          cx="14"
                          cy="14"
                          r="3.5"
                          strokeWidth="1.5"
                        ></circle>
                      </svg>
                    </span>
                    <span className="menu-bar__name">Settings</span>
                  </span>
                </Link>
              </li>
              <li
                className={
                  location.pathname === "/support-ticket" ? "active" : ""
                }
              >
                <Link to="/support-ticket" className="collapsed">
                  <span className="menu-bar__text">
                    <span className="crancy-menu-icon crancy-svg-icon__v1">
                      <svg
                        className="crancy-svg-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="22"
                        viewBox="0 0 24 22"
                        fill="none"
                      >
                        <path
                          d="M1 20.8C1.55 19.8 3.64 17.8 7.6 17.8C11.56 17.8 13.65 15.4 14.2 14.2M7.6 6.5V3.2C7.6 1.98497 8.58497 1 9.8 1H20.8C22.015 1 23 1.98497 23 3.2V12C23 13.215 22.015 14.2 20.8 14.2H17.2137M12 5.4H18.6M9.8 12C9.8 13.215 8.81503 14.2 7.6 14.2C6.38497 14.2 5.4 13.215 5.4 12C5.4 10.785 6.38497 9.8 7.6 9.8C8.81503 9.8 9.8 10.785 9.8 12Z"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M15.2998 9.80005H18.5998"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <span className="menu-bar__name">Support</span>
                  </span>
                </Link>
              </li>
              <li
                className={location.pathname === "/error-page" ? "active" : ""}
              >
                <Link to="/error-page" className="collapsed">
                  <span className="menu-bar__text">
                    <span className="crancy-menu-icon crancy-svg-icon__v1">
                      <svg
                        className="crancy-svg-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle cx="12" cy="7" r="1" fill="#28303F" />
                        <path
                          d="M11 10H12V17M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                          stroke="#28303F"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="menu-bar__name">404</span>
                  </span>
                </Link>
              </li>
              <li className={location.pathname === "/login" ? "active" : ""}>
                <Link to="/login" className="collapsed">
                  <span className="menu-bar__text">
                    <span className="crancy-menu-icon crancy-svg-icon__v1">
                      <svg
                        className="crancy-svg-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M15 10L13.7071 11.2929C13.3166 11.6834 13.3166 12.3166 13.7071 12.7071L15 14M14 12L22 12M6 20C3.79086 20 2 18.2091 2 16V8C2 5.79086 3.79086 4 6 4M6 20C8.20914 20 10 18.2091 10 16V8C10 5.79086 8.20914 4 6 4M6 20H14C16.2091 20 18 18.2091 18 16M6 4H14C16.2091 4 18 5.79086 18 8"
                          stroke="#28303F"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <span className="menu-bar__name">Login</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="#!" className="collapsed">
                  <span className="menu-bar__text">
                    <span className="crancy-menu-icon crancy-svg-icon__v1">
                      <svg
                        className="crancy-svg-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="20"
                        viewBox="0 0 24 20"
                        fill="none"
                      >
                        <path
                          d="M20.7998 12L22.2927 10.5071C22.6832 10.1166 22.6832 9.48342 22.2927 9.09289L20.7998 7.6"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21.9 9.8H13.1M5.4 18.6C2.96995 18.6 1 16.6301 1 14.2V5.4C1 2.96995 2.96995 1 5.4 1M5.4 18.6C7.83005 18.6 9.8 16.6301 9.8 14.2V5.4C9.8 2.96995 7.83005 1 5.4 1M5.4 18.6H14.2C16.6301 18.6 18.6 16.6301 18.6 14.2M5.4 1H14.2C16.6301 1 18.6 2.96995 18.6 5.4"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <span className="menu-bar__name">Logout</span>
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          {/* <!-- End Nav Menu --> */}
          {/* <!-- Support Card --> */}
          <div
            className="crancy-support-card crancy-bg-cover"
            style={{ backgroundImage: `url(${bg})` }}
          >
            <div className="crancy-support-card__sing">
              <img src={signInIcon} />
            </div>
            <h4 className="crancy-support-card__title">Help Center</h4>
            <p className="crancy-support-card__text">
              Having trouble Dashboard? Please contact us for more question?
            </p>
            <Link
              to="/support-ticket"
              className="crancy-btn crancy-ybcolor mg-top-20"
            >
              Go To Help Center
            </Link>
          </div>
          {/* <!-- End Support Card --> */}
        </div>
      </div>
    </div>
  );
}

export default Menu;

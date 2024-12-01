import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
// import logo from "../../assets/img/logo-dark.png";
import logoWhite from "../../assets/img/logo-white.png";
import logo from "../../assets/img/LogoAYUVI_FullAzul.png";
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
                  { link: "voluntarios", title: "Voluntarios" },
                  { link: "talonarios", title: "Talonarios" },
                  { link: "materiales", title: "Materiales" },
                  { link: "administradores", title: "Administradores" },
                  { link: "mercanciaVoluntarios", title: "Mercancía voluntarios" },
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

import React, { useEffect, useState } from "react";
import logo from "../../assets/img/logo.png";
import logoWhite from "../../assets/img/logo-white.png";
import logoIcon from "../../assets/img/logo-icon.png";
import arrowIcon from "../../assets/img/arrow-icon.svg";
import { Link } from "react-router-dom";
import SearchForm from "../form/SearchForm";
import Language from "./Language";
import Author from "./Author";
import Alarm from "./Alarm";
import Message from "./Message";
import Currency from "./Currency";
import FullScreenBtn from "./FullScreenBtn";

function Header({ toggleMenu, menu }) {
  const [subNav, setSubNav] = useState(false);
  useEffect(() => {
    if (subNav) {
      document
        .querySelector("html")
        .addEventListener("click", () => setSubNav(false));
    } else {
      document
        .querySelector("html")
        .removeEventListener("click", () => setSubNav(false));
    }
  }, [subNav]);

  //full screen
  const handleFullScreen = () => {
    const elem = document.documentElement;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };
  return (
    <header className={`crancy-header ${menu && "crancy-close"}`}>
      <div className="container g-0">
        <div className="row g-0">
          <div className="col-12">
            {/* <!-- Dashboard Header --> */}
            <div className="crancy-header__inner">
              <div className="crancy-header__middle">
                <div className="crancy-header__left">
                  <div className="crancy-header__nav-bottom">
                    {/* <!-- Logo --> */}
                    <div className="logo crancy-sidebar-padding">
                      <a className="crancy-logo" href="index.html">
                        {/* <!-- Logo for Default --> */}
                        <img className="crancy-logo__main" src={logo} alt="#" />
                        <img
                          className="crancy-logo__main--dark"
                          src={logoWhite}
                          alt="#"
                        />
                        {/* <!-- Logo for Dark Version --> */}
                        <img
                          className="crancy-logo__main--small"
                          src={logoIcon}
                          alt="#"
                        />
                        <img
                          className="crancy-logo__main--small--dark"
                          src={logoWhite}
                          alt="#"
                        />
                      </a>
                    </div>
                  </div>
                  {/* <!--  End Logo --> */}
                  <div
                    id="crancy__sicon"
                    className="crancy__sicon close-icon"
                    onClick={toggleMenu}
                  >
                    <img src={arrowIcon} />
                  </div>
                  <SearchForm />
                </div>
                <div className="crancy-header__right">
                  <div className="crancy-header__group">
                    <div className="crancy-header__group-two">
                      <div className="crancy-header__right">
                        <Language
                          subNav={subNav}
                          setSubNav={setSubNav}
                          title="language"
                        />
                        <Currency
                          subNav={subNav}
                          setSubNav={setSubNav}
                          title="currency"
                        />
                        {/* <!-- Header Zoom --> */}
                        <FullScreenBtn />
                        <div className="crancy-header__options">
                          <Alarm
                            subMenu={subNav}
                            setSubMenu={setSubNav}
                            title="alarm"
                          />
                          <Message
                            subNav={subNav}
                            setSubNav={setSubNav}
                            title="message"
                          />
                          <div className="crancy-header__settings">
                            <button id="crancy-header__settings">
                              <Link to="/settings">
                                <svg
                                  className="crancy-header__svg--icon"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M22.5244 16.4785L21.8848 16.0869L21.8848 16.0869L22.5244 16.4785ZM21.3754 18.3549L22.015 18.7466L22.015 18.7466L21.3754 18.3549ZM1.47427 7.5216L0.834662 7.12994H0.834662L1.47427 7.5216ZM2.62327 5.64521L3.26288 6.03687H3.26288L2.62327 5.64521ZM5.76238 4.85216L6.12096 4.19343L6.12096 4.19343L5.76238 4.85216ZM2.3154 10.4813L1.95681 11.14H1.95681L2.3154 10.4813ZM18.2363 19.148L17.8777 19.8067L17.8777 19.8067L18.2363 19.148ZM21.6833 13.5188L21.3247 14.1775L21.6833 13.5188ZM2.62327 18.3549L1.98365 18.7466H1.98365L2.62327 18.3549ZM1.47427 16.4786L2.11388 16.0869H2.11388L1.47427 16.4786ZM21.3754 5.64523L22.015 5.25357L22.015 5.25357L21.3754 5.64523ZM22.5244 7.52162L21.8848 7.91328L21.8848 7.91328L22.5244 7.52162ZM21.6833 10.4813L22.0419 11.1401L21.6833 10.4813ZM18.2363 4.85217L18.5949 5.5109L18.2363 4.85217ZM2.31539 13.5188L2.67397 14.1776H2.67398L2.31539 13.5188ZM5.76238 19.148L5.4038 18.4893L5.40379 18.4893L5.76238 19.148ZM18.1142 4.91866L17.7556 4.25994V4.25994L18.1142 4.91866ZM5.88453 4.91865L5.52595 5.57738L5.52595 5.57738L5.88453 4.91865ZM18.1142 19.0815L18.4728 18.4228H18.4728L18.1142 19.0815ZM5.88453 19.0815L6.24311 19.7402L6.24312 19.7402L5.88453 19.0815ZM10.8504 1.91675H13.1483V0.416748H10.8504V1.91675ZM13.1483 22.0834H10.8504V23.5834H13.1483V22.0834ZM10.8504 22.0834C9.95323 22.0834 9.30237 21.4082 9.30237 20.6667H7.80237C7.80237 22.3185 9.20919 23.5834 10.8504 23.5834V22.0834ZM14.6963 20.6667C14.6963 21.4082 14.0455 22.0834 13.1483 22.0834V23.5834C14.7895 23.5834 16.1963 22.3185 16.1963 20.6667H14.6963ZM13.1483 1.91675C14.0455 1.91675 14.6963 2.59198 14.6963 3.33341H16.1963C16.1963 1.68162 14.7895 0.416748 13.1483 0.416748V1.91675ZM10.8504 0.416748C9.20919 0.416748 7.80237 1.68162 7.80237 3.33342H9.30237C9.30237 2.59198 9.95323 1.91675 10.8504 1.91675V0.416748ZM21.8848 16.0869L20.7358 17.9633L22.015 18.7466L23.164 16.8702L21.8848 16.0869ZM2.11388 7.91326L3.26288 6.03687L1.98366 5.25355L0.834662 7.12994L2.11388 7.91326ZM3.26288 6.03687C3.67891 5.35747 4.63841 5.09424 5.4038 5.51088L6.12096 4.19343C4.68813 3.41346 2.83677 3.86035 1.98366 5.25355L3.26288 6.03687ZM2.67398 9.8226C1.93198 9.41869 1.71509 8.56452 2.11388 7.91326L0.834662 7.12994C-0.0356889 8.55128 0.500584 10.3473 1.95681 11.14L2.67398 9.8226ZM20.7358 17.9633C20.3198 18.6427 19.3603 18.9059 18.5949 18.4893L17.8777 19.8067C19.3106 20.5867 21.1619 20.1398 22.015 18.7466L20.7358 17.9633ZM23.164 16.8702C24.0344 15.4489 23.4981 13.6528 22.0419 12.8601L21.3247 14.1775C22.0667 14.5815 22.2836 15.4356 21.8848 16.0869L23.164 16.8702ZM3.26288 17.9633L2.11388 16.0869L0.834661 16.8702L1.98365 18.7466L3.26288 17.9633ZM20.7358 6.03689L21.8848 7.91328L23.164 7.12996L22.015 5.25357L20.7358 6.03689ZM21.8848 7.91328C22.2836 8.56453 22.0667 9.4187 21.3247 9.82261L22.0419 11.1401C23.4981 10.3474 24.0344 8.5513 23.164 7.12995L21.8848 7.91328ZM18.5949 5.5109C19.3603 5.09425 20.3198 5.35749 20.7358 6.03689L22.015 5.25357C21.1619 3.86037 19.3106 3.41348 17.8777 4.19345L18.5949 5.5109ZM2.11388 16.0869C1.71509 15.4356 1.93198 14.5815 2.67397 14.1776L1.95681 12.8601C0.500582 13.6528 -0.0356903 15.4489 0.834661 16.8702L2.11388 16.0869ZM1.98365 18.7466C2.83677 20.1398 4.68813 20.5867 6.12096 19.8067L5.40379 18.4893C4.6384 18.9059 3.6789 18.6427 3.26288 17.9633L1.98365 18.7466ZM18.4728 5.57739L18.5949 5.5109L17.8777 4.19345L17.7556 4.25994L18.4728 5.57739ZM5.40379 5.51088L5.52595 5.57738L6.24312 4.25993L6.12096 4.19343L5.40379 5.51088ZM18.5949 18.4893L18.4728 18.4228L17.7556 19.7402L17.8777 19.8067L18.5949 18.4893ZM5.52596 18.4228L5.4038 18.4893L6.12095 19.8067L6.24311 19.7402L5.52596 18.4228ZM1.95681 11.14C2.63819 11.511 2.63819 12.4892 1.95681 12.8601L2.67398 14.1776C4.39914 13.2385 4.39914 10.7617 2.67398 9.8226L1.95681 11.14ZM6.24312 19.7402C6.94605 19.3576 7.80237 19.8664 7.80237 20.6667H9.30237C9.30237 18.7284 7.22842 17.496 5.52595 18.4228L6.24312 19.7402ZM16.1963 20.6667C16.1963 19.8664 17.0527 19.3576 17.7556 19.7402L18.4728 18.4228C16.7703 17.496 14.6963 18.7284 14.6963 20.6667H16.1963ZM22.0419 12.8601C21.3605 12.4892 21.3605 11.511 22.0419 11.1401L21.3247 9.82261C19.5996 10.7617 19.5996 13.2385 21.3247 14.1775L22.0419 12.8601ZM5.52595 5.57738C7.22842 6.50413 9.30237 5.27178 9.30237 3.33342H7.80237C7.80237 4.13375 6.94605 4.64258 6.24312 4.25993L5.52595 5.57738ZM17.7556 4.25994C17.0527 4.64259 16.1963 4.13376 16.1963 3.33341H14.6963C14.6963 5.27178 16.7703 6.50414 18.4728 5.57739L17.7556 4.25994ZM14.8605 12.0001C14.8605 13.5802 13.5795 14.8612 11.9994 14.8612V16.3612C14.4079 16.3612 16.3605 14.4087 16.3605 12.0001H14.8605ZM11.9994 14.8612C10.4192 14.8612 9.13825 13.5802 9.13825 12.0001H7.63825C7.63825 14.4087 9.59078 16.3612 11.9994 16.3612V14.8612ZM9.13825 12.0001C9.13825 10.4199 10.4192 9.13897 11.9994 9.13897V7.63897C9.59078 7.63897 7.63825 9.59151 7.63825 12.0001H9.13825ZM11.9994 9.13897C13.5795 9.13897 14.8605 10.4199 14.8605 12.0001H16.3605C16.3605 9.59151 14.4079 7.63897 11.9994 7.63897V9.13897Z"
                                    fill="#2F3032"
                                  />
                                </svg>
                              </Link>
                            </button>
                          </div>
                        </div>
                        <Author
                          subNav={subNav}
                          setSubNav={setSubNav}
                          title="author"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

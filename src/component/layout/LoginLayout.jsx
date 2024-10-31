import React from "react";
import { Link, Outlet } from "react-router-dom";
import bg from "../../assets/img/credential-bg.svg";
import logoW from "../../assets/img/logo-white.png";
import welcomeImg from "../../assets/img/welcome-vector.png";

function LoginLayout({ children }) {
  return (
    <div className="body-bg">
      <section
        className="crancy-wc crancy-wc__full crancy-bg-cover"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="crancy-wc__form">
                {/* <!-- Welcome Banner --> */}
                <div className="crancy-wc__form--middle">
                  <div className="crancy-wc__banner">
                    <div className="crancy-wc__logo">
                      <Link to="/">
                        <img src={logoW} alt="#" />
                      </Link>
                    </div>
                    <img src={welcomeImg} alt="#" />
                  </div>
                  <div className="crancy-wc__form-inner">
                    {/* <!-- Sign in Form --> */}
                    {children}
                    <Outlet />
                    {/* <!-- End Sign in Form --> */}
                  </div>
                </div>
                {/* <!-- End Welcome Banner --> */}
                {/* <!-- Footer Top --> */}
                <div className="crancy-wc__footer--top">
                  <div className="crancy-wc__footer">
                    <ul className="crancy-wc__footer--list list-none">
                      <li>
                        <Link to="#">Terms & Condition</Link>
                      </li>
                      <li>
                        <Link to="#">Privacy Policy</Link>
                      </li>
                      <li>
                        <Link to="#">Help</Link>
                      </li>
                    </ul>
                    <div className="crancy-wc__footer--languages">
                      <select
                        className="crancy-wc__footer--language"
                        defaultValue="English"
                      >
                        <option data-display="English">English</option>
                        <option value="2">Bengali</option>
                        <option value="3">Frances</option>
                      </select>
                    </div>
                  </div>
                  <p className="crancy-wc__footer--copyright">
                    @ 2023 <a href="#">Dashra.</a> All Right Reserved.{" "}
                  </p>
                </div>
                {/* <!-- End Footer Top --> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LoginLayout;

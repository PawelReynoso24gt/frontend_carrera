import React from "react";
import googleLogo from "../../assets/img/google-logo.png";
import appleLogo from "../../assets/img/apple-logo.png";
import { Link } from "react-router-dom";

function LoginForm() {
  return (
    <>
      <div className="crancy-wc__heading">
        <h3 className="crancy-wc__form-title crancy-wc__form-title__one">
          Login to your account
        </h3>
      </div>
      <form className="crancy-wc__form-main">
        {/* <!-- Form Group --> */}
        <div className="form-group">
          <div className="form-group__input">
            <input
              className="crancy-wc__form-input"
              type="email"
              name="email"
              placeholder="admin@mail.com"
              required="required"
            />
          </div>
        </div>
        {/* <!-- Form Group --> */}
        <div className="form-group">
          <div className="form-group__input">
            <input
              className="crancy-wc__form-input"
              placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
              id="password-field"
              type="password"
              name="password"
              maxLength="8"
              required="required"
            />
            <span className="crancy-wc__toggle">
              <i className="fas fa-eye" id="toggle-icon"></i>
            </span>
          </div>
        </div>
        {/* <!-- Form Group --> */}
        <div className="form-group">
          <div className="crancy-wc__check-inline">
            <div className="crancy-wc__checkbox">
              <input
                className="crancy-wc__form-check"
                id="checkbox"
                name="checkbox"
                type="checkbox"
              />
              <label htmlFor="checkbox">Remember Me</label>
            </div>
            <div className="crancy-wc__forgot">
              <a href="forget-password.html" className="forgot-pass">
                Forgot Password?
              </a>
            </div>
          </div>
        </div>
        {/* <!-- Form Group --> */}
        <div className="form-group form-mg-top25">
          <div className="crancy-wc__button">
            <button className="ntfmax-wc__btn" type="submit">
              Sign in with email
            </button>
          </div>
          <div className="crancy-wc__form-login--label">
            <span>Or login with</span>
          </div>
          <div className="crancy-wc__button--group">
            <button
              className="ntfmax-wc__btn ntfmax-wc__btn--two"
              type="submit"
            >
              <div className="ntfmax-wc__btn-icon">
                <img src={googleLogo} alt="" />
              </div>
              Google
            </button>
            <button
              className="ntfmax-wc__btn ntfmax-wc__btn--two"
              type="submit"
            >
              <div className="ntfmax-wc__btn-icon">
                <img src={appleLogo} alt="" />
              </div>
              Apple
            </button>
          </div>
        </div>
        {/* <!-- Form Group --> */}
        <div className="form-group form-mg-top30">
          <div className="crancy-wc__bottom">
            <p className="crancy-wc__text">
              Dont’t have an account ?{" "}
              <Link to="/create-account">Get Started</Link>
            </p>
          </div>
        </div>
      </form>
    </>
  );
}

export default LoginForm;

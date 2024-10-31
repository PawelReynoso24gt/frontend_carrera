import React from "react";
import img from "../../assets/img/password-success.svg";

function PasswordSuccess() {
  return (
    <>
      <div className="crancy-wc__heading">
        <img src={img} alt="" />
        <h3 className="crancy-wc__form-title crancy-wc__form-title__one">
          Successfully changed your password{" "}
        </h3>
        <p>Setting up an account takes less than 1 minute.</p>
      </div>
      <div className="crancy-wc__button crancy-wc__button--center mg-top-40">
        <button className="ntfmax-wc__btn ntfmax-wc__btn--login" type="submit">
          Continue
          <span>
            <i className="fa-solid fa-arrow-right"></i>
          </span>
        </button>
      </div>
    </>
  );
}

export default PasswordSuccess;

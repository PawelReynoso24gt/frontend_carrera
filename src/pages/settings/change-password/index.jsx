import React from "react";
import img from "../../../assets/img/password-reset.png";

function ChangePassword() {
  return (
    <div className="tab-pane fade show active">
      <div className="crancy-paymentm crancy__item-group">
        <h4 className="crancy__item-group__title">Change Password</h4>
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-6 col-12">
            {/* <!-- Sign in Form --> */}
            <form
              className="crancy-wc__form-main crancy-wc__form-main p-0"
              action="#"
              method="post"
            >
              <div className="form-group">
                <label className="crancy-wc__form-label">Old Password</label>
                <div className="form-group__input">
                  <input
                    className="crancy-wc__form-input"
                    placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                    id="password-field1"
                    type="password"
                    name="password"
                    maxLength="8"
                    required="required"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="crancy-wc__form-label">New Password</label>
                <div className="form-group__input">
                  <input
                    className="crancy-wc__form-input"
                    placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                    id="password-field2"
                    type="password"
                    name="password"
                    maxLength="8"
                    required="required"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="crancy-wc__form-label">
                  Re-enter Password
                </label>
                <div className="form-group__input">
                  <input
                    className="crancy-wc__form-input"
                    placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                    id="password-field3"
                    type="password"
                    name="password"
                    maxLength="8"
                    required="required"
                  />
                </div>
              </div>
            </form>
            {/* <!-- End Sign in Form --> */}
          </div>
          <div className="col-lg-6 col-md-6 col-12">
            <div className="crancy-password__img">
              <img src={img} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;

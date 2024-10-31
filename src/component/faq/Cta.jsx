import React from "react";
import searchIcon from "../../assets/img/search.png";
import img from "../../assets/img/cta-vector.png";

function Cta() {
  return (
    <div className="row">
      <div className="col-12">
        <div className="crancy-cta">
          <div className="crancy-cta__content">
            <h3 className="crancy-cta__title">How Can We Help you?</h3>
            <p className="crancy-cta__text">
              Contrary to popular belief, orem Ipsum is not simply random text.
              It has roots in piece of classical Latin literature from 45 BC,
            </p>
            <div className="crancy-header__form crancy-cta__search">
              <form className="crancy-header__form-inner" action="#">
                <button className="search-btn" type="submit">
                  <img src={searchIcon} alt="#" />
                </button>
                <input
                  name="s"
                  type="text"
                  placeholder="Search for anything..."
                />
              </form>
            </div>
          </div>
          <div className="crancy-cta__content--img">
            <img src={img} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cta;

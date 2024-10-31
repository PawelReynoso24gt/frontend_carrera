import React from "react";
import flag from "../../assets/img/flag-1.png";
import flag2 from "../../assets/img/flag-2.jpg";
import flag3 from "../../assets/img/flag-3.jpg";
import flag4 from "../../assets/img/flag-4.jpg";
function Language({ subNav, setSubNav, title }) {
  return (
    <div className="crancy-header__dropdown">
      {/* <!-- Crancy Language --> */}
      <div className="crancy-header__dropdown--single crancy-language">
        <a
          id="button"
          className="crancy-language_main"
          onMouseOver={() => {
            setSubNav(title);
          }}
        >
          <img src={flag} alt="" />
          <span>United State</span>
          <svg
            className="crancy-header__svg--icon"
            width="11"
            height="7"
            viewBox="0 0 11 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="10.1799"
              y="1.13079"
              width="7.19582"
              height="1.59907"
              transform="rotate(135 10.1799 1.13079)"
            />
            <rect
              x="5.08838"
              y="6.21893"
              width="7.19582"
              height="1.59907"
              transform="rotate(-135 5.08838 6.21893)"
            />
          </svg>
        </a>
        <div
          id="text"
          className="crancy-balance crancy-language__list fm-hover-animation-2"
          style={{ display: subNav === title ? "flex" : "none" }}
        >
          <a href="#">
            <img src={flag2} />
            <span>Franch</span>
          </a>
          <a href="#">
            <img src={flag3} />
            <span>Germany</span>
          </a>
          <a href="#">
            <img src={flag4} />
            <span>Italy</span>
          </a>
        </div>
      </div>
      {/* <!-- End Crancy Language --> */}
      {/* <!-- Crancy Currency --> */}

      {/* <!-- End Crancy Currency --> */}
    </div>
  );
}

export default Language;

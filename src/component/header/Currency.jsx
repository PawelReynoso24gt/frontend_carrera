import React from "react";

function Currency({ subNav, setSubNav, title }) {
  return (
    <div className="crancy-header__dropdown--single crancy-language crancy-currency ">
      <a
        id="button"
        className="crancy-language_main"
        onMouseOver={() => {
          setSubNav(title);
        }}
      >
        <span>USD</span>
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
          USD
          <span />
        </a>
        <a href="#">
          Euro
          <span />
        </a>
        <a href="#">
          JPY
          <span />
        </a>
        <a href="#">
          AMD
          <span />
        </a>
      </div>
    </div>
  );
}

export default Currency;

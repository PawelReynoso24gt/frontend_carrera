import React from "react";
import { Link } from "react-router-dom";

function BreadCrumb({ title, link }) {
  return (
    <div className="row">
      <div className="col-12 mg-top-30">
        <div className="crancy-pbreadcrumb">
          <h4 className="crancy-sidebar__title">{title}</h4>
          <ul className="crancy-pbreadcrumb__list">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li className="active">
              <Link to={link}>{title}</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BreadCrumb;

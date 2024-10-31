import React from "react";
import { Link, useLocation } from "react-router-dom";

function TabList() {
  const location = useLocation();
  const pathSegments = location.pathname
    .split("/")
    .filter((segment) => segment !== "");
  const lastPath =
    pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : null;
  return (
    <div className="crancy-pcats__bar">
      <div className="crancy-pcats__list list-group ">
        <Link
          className={`list-group-item ${
            lastPath === "profile-overview" ? "active" : ""
          }`}
          to=""
        >
          Overview
        </Link>
        <Link
          className={`list-group-item ${
            lastPath === "activities" ? "active" : ""
          }`}
          to="activities"
        >
          Activities
        </Link>
        <Link
          className={`list-group-item ${
            lastPath === "projects" ? "active" : ""
          }`}
          to="projects"
        >
          Projects
        </Link>
        <Link
          className={`list-group-item ${
            lastPath === "documents" ? "active" : ""
          }`}
          to="documents"
        >
          Documents
        </Link>
        <Link
          className={`list-group-item ${
            lastPath === "gallery" ? "active" : ""
          }`}
          to="gallery"
        >
          Gallery
        </Link>
      </div>
    </div>
  );
}

export default TabList;

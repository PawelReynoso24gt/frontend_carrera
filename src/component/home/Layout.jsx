import React from "react";

function Layout({ children }) {
  return (
    <section className="crancy-adashboard crancy-show">
      <div className="container-fluid">
        <div className="row">{children}</div>
      </div>
    </section>
  );
}

export default Layout;

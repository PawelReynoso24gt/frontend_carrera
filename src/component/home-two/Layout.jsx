import React from "react";

function Layout({ children }) {
  return (
    <section className="crancy-adashboard crancy-show ">
      <div className="container-fluid">{children}</div>
    </section>
  );
}

export default Layout;

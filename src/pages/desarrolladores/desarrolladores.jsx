import React from "react";
import Layout from "../../component/home-two/Layout.jsx";
import BreadCrumb from "../../component/home-two/BreadCrumb.jsx";
import Wrapper from "../../component/pricing/Wrapper.jsx";
import DesarrolladoresComponent  from "../../component/desarrolladores/desarrolladores.jsx";
import useMenu from "../../hooks/useMenu.jsx";

function ActividadPage () {
  useMenu();
  return (
    <Layout>
        <BreadCrumb title="Desarrolladores" link="/desarrolladores" />
            <Wrapper>
            <DesarrolladoresComponent/>
            </Wrapper>
    </Layout>
    );
}

export default ActividadPage ;

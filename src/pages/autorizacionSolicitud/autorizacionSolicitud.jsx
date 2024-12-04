import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import AutorizacionSolicitud  from "../../component/autorizacionSolicitud/autorizacionSolicitud";
import useMenu from "../../hooks/useMenu";

function RolesPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Autorización de solicitudes" link="/autorizacionSolicitud" />
      <Wrapper>
        <AutorizacionSolicitud/>
      </Wrapper>
    </Layout>
  );
}

export default RolesPage ;

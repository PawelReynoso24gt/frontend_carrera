import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import PermisosComponent  from "../../component/permisos/permisos";
import useMenu from "../../hooks/useMenu";

function PermisosPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Permisos" link="/permisos" />
      <Wrapper>
      <PermisosComponent/>
      </Wrapper>
    </Layout>
  );
}

export default PermisosPage ;

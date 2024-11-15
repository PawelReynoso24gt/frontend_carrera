import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import TipoTrasladosComponent from "../../component/tipoTraslado/tipoTraslado";
import useMenu from "../../hooks/useMenu";

function tipoTrasladosPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="tipoTraslado" link="/tipoTraslado"/>
      <Wrapper>
        <TipoTrasladosComponent/>
      </Wrapper>
    </Layout>
  );
}

export default tipoTrasladosPage;

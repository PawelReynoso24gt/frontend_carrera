import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import TrasladosComponent  from "../../component/traslados/traslados";
import useMenu from "../../hooks/useMenu";

function TrasladosPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Traslados" link="/Categorias" />
      <Wrapper>
        <TrasladosComponent/>
      </Wrapper>
    </Layout>
  );
}

export default TrasladosPage ;

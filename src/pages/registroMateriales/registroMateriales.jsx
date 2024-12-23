import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import RegistroMateriales  from "../../component/registroMateriales/registroMateriales";
import useMenu from "../../hooks/useMenu";

function MunicipiosPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Registro Materiales" link="/registroMateriales" />
      <Wrapper>
        <RegistroMateriales/>
      </Wrapper>
    </Layout>
  );
}

export default MunicipiosPage ; 

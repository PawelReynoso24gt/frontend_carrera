import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import RegistroActitivdades  from "../../component/registroActividades/registroActividades";
import useMenu from "../../hooks/useMenu";

function MunicipiosPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Registro Actividades" link="/registroActividades" />
      <Wrapper>
        <RegistroActitivdades/>
      </Wrapper>
    </Layout>
  );
}

export default MunicipiosPage ; 

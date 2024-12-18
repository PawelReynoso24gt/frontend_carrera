import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import RegistroComisiones  from "../../component/registroComisiones/registroComisiones";
import useMenu from "../../hooks/useMenu";

function MunicipiosPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Registro Comisiones" link="/registroComisiones" />
      <Wrapper>
        <RegistroComisiones/>
      </Wrapper>
    </Layout>
  );
}

export default MunicipiosPage ; 

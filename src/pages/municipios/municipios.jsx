import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import MunicipiosComponents  from "../../component/municipios/municipios";
import useMenu from "../../hooks/useMenu";

function MunicipiosPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Muicipios" link="/municipios" />
      <Wrapper>
        <MunicipiosComponents/>
      </Wrapper>
    </Layout>
  );
}

export default MunicipiosPage ;

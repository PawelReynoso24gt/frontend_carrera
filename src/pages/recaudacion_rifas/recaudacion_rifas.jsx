import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import RecaudacionRifas  from "../../component/recaudacion_rifas/recaudacion_rifas";
import useMenu from "../../hooks/useMenu";

function RecaudacionRifasPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Recaudación de Rifas" link="/recaudacion_rifas" />
      <Wrapper>
        <RecaudacionRifas/>
      </Wrapper>
    </Layout>
  );
}

export default RecaudacionRifasPage ;

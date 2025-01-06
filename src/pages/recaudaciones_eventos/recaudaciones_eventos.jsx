import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import RecaudacionEventos  from "../../component/recaudacion_eventos/recaudacion_eventos";
import useMenu from "../../hooks/useMenu";

function RecaudacionEventosPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Recaudación de Eventos" link="/recaudacion_eventos" />
      <Wrapper>
        <RecaudacionEventos/>
      </Wrapper>
    </Layout>
  );
}

export default RecaudacionEventosPage ;

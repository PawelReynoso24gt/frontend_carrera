import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import AsistenciaEventosComponent  from "../../component/asistencia_eventos/asistencia_eventos";
import useMenu from "../../hooks/useMenu";

function AsistenciasPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Asistencia a Eventos" link="/asistencia_eventos" />
      <Wrapper>
        <AsistenciaEventosComponent/>
      </Wrapper>
    </Layout>
  );
}

export default AsistenciasPage;

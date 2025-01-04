import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import ReporteEventosComponent  from "../../component/reporteEventos/reporteEventos";
import useMenu from "../../hooks/useMenu";

function ReporteEventosPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Reporte de Eventos" link="/reporteEventos" />
      <Wrapper>
      <ReporteEventosComponent/>
      </Wrapper>
    </Layout>
  );
}

export default ReporteEventosPage ;

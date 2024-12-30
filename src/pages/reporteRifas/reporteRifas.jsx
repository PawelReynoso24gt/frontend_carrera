import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import ReporteRifasComponent  from "../../component/reporteRifas/reporteRifas";
import useMenu from "../../hooks/useMenu";

function ReporteRifasPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Reporte rifas" link="/reporteRifas" />
      <Wrapper>
      <ReporteRifasComponent/>
      </Wrapper>
    </Layout>
  );
}

export default ReporteRifasPage;
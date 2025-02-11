import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import ReporteContabilidadComponent  from "../../component/reporteContabilidad/reporteContabilidad";
import useMenu from "../../hooks/useMenu";

function ReporteContabilidadPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Reporte de contabilidad" link="/reporteContabilidad" />
      <Wrapper>
      <ReporteContabilidadComponent/>
      </Wrapper>
    </Layout>
  );
}

export default ReporteContabilidadPage;
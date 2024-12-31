import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import ReporteAspirantesComponent  from "../../component/reporteAspirantes/reporteAspirantes";
import useMenu from "../../hooks/useMenu";

function ReporteAspirantesPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Reporte de aspirantes" link="/reporteAspirantes" />
      <Wrapper>
      <ReporteAspirantesComponent/>
      </Wrapper>
    </Layout>
  );
}

export default ReporteAspirantesPage;
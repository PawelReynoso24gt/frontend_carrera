import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import ReporteProblemasComponent  from "../../component/reporteProblemas/reporteProblemas";
import useMenu from "../../hooks/useMenu";

function ReporteProblemasPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Reporte de Problemas" link="/reporteProblemas" />
      <Wrapper>
      <ReporteProblemasComponent/>
      </Wrapper>
    </Layout>
  );
}

export default ReporteProblemasPage ;

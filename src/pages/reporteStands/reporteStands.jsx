import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import ReporteStandsComponent  from "../../component/reporteStands/reporteStands";
import useMenu from "../../hooks/useMenu";

function ReporteStandsPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Reporte de Stands" link="/reporteStands" />
      <Wrapper>
      <ReporteStandsComponent/>
      </Wrapper>
    </Layout>
  );
}

export default ReporteStandsPage ;

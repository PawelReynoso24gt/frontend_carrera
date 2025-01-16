import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import ReporteTrasladosComponent from "../../component/reporteTraslados/reporteTraslados";
import useMenu from "../../hooks/useMenu";

function ReporteTrasladosPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Reporte de Traslados" link="/reporteTraslados" />
      <Wrapper>
      <ReporteTrasladosComponent/>
      </Wrapper>
    </Layout>
  );
}

export default ReporteTrasladosPage ;

import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import ReportePeidosComponent  from "../../component/reportePedidos/reportePedidos";
import useMenu from "../../hooks/useMenu";

function ReporteProblemasPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Reporte de Pedidos" link="/reportePedidos" />
      <Wrapper>
      <ReportePeidosComponent/>
      </Wrapper>
    </Layout>
  );
}

export default ReporteProblemasPage;

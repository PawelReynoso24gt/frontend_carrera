import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import ReporteMercanciaVoluntariosComponent  from "../../component/reporteMercanciaVoluntarios/reporteMercanciaVoluntarios";
import useMenu from "../../hooks/useMenu";

function ReporteMercanciaVoluntariosPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Reporte de donaciones de voluntarios" link="/reporteMercanciaVoluntarios" />
      <Wrapper>
      <ReporteMercanciaVoluntariosComponent/>
      </Wrapper>
    </Layout>
  );
}

export default ReporteMercanciaVoluntariosPage;
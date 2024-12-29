import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import VentasComponent  from "../../component/ventas_voluntarios/ventas_voluntarios";
import useMenu from "../../hooks/useMenu";

function VentasPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Ventas de Voluntarios" link="/ventas_voluntarios" />
      <Wrapper>
        <VentasComponent/>
      </Wrapper>
    </Layout>
  );
}

export default VentasPage ;

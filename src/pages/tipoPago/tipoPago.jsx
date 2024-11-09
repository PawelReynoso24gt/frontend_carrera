import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import TipoPagoComponent  from "../../component/tipoPago/tipoPago";
import useMenu from "../../hooks/useMenu";

function TipoPagoPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Tipo Pago" link="/TipoPago" />
      <Wrapper>
        <TipoPagoComponent/>
      </Wrapper>
    </Layout>
  );
}

export default TipoPagoPage ;

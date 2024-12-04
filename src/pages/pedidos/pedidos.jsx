import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import PedidosComponent  from "../../component/pedidos/pedidos";
import useMenu from "../../hooks/useMenu";

function pedidosPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Pedidos" link="/pedidos"/>
      <Wrapper>
      <PedidosComponent/>
      </Wrapper>
    </Layout>
  );
}

export default pedidosPage ;

import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import EventosComponent  from "../../component/eventos/eventos";
import useMenu from "../../hooks/useMenu";

function eventosPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Eventos" link="/Eventos"/>
      <Wrapper>
        <EventosComponent/>
      </Wrapper>
    </Layout>
  );
}

export default eventosPage ;

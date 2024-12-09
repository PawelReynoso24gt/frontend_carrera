import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import AutorizacionTalonariosComponent  from "../../component/autorizacionTalonarios/autorizacionTalonarios";
import useMenu from "../../hooks/useMenu";

function AutorizacionTalonarios () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Autorizar Talonarios" link="/autorizacionTalonarios" />
      <Wrapper>
        <AutorizacionTalonariosComponent/>
      </Wrapper>
    </Layout>
  );
}

export default AutorizacionTalonarios;

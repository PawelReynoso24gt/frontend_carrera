import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import PaginaPrincipal  from "../../component/cards/paginaPrincipal";
import useMenu from "../../hooks/useMenu";

function PrincipalPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb link="/paginaPrincipal" />
      <Wrapper>
        <PaginaPrincipal/>
      </Wrapper>
    </Layout>
  );
}

export default PrincipalPage ;

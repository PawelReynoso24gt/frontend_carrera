import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import TalonariosComponent  from "../../component/talonarios/talonarios";
import useMenu from "../../hooks/useMenu";

function RolesPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Talonarios" link="/talonarios" />
      <Wrapper>
        <TalonariosComponent/>
      </Wrapper>
    </Layout>
  );
}

export default RolesPage ;

import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import SedesComponent  from "../../component/Sedes/sedes";
import useMenu from "../../hooks/useMenu";
import Sedes from "../../component/Sedes/sedes";

function SedesPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Sedes" link="/Sedes" />
      <Wrapper>
      <SedesComponent/>
      </Wrapper>
    </Layout>
  );
}

export default SedesPage ;

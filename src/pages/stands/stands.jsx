import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import StandsComponent  from "../../component/stands/stands";
import useMenu from "../../hooks/useMenu";

function StandsPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Stands" link="/stands" />
      <Wrapper>
        <StandsComponent/>
      </Wrapper>
    </Layout>
  );
}

export default StandsPage ;

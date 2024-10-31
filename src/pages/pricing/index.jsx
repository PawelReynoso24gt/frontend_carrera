import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import PricingCom from "../../component/pricing/PricingCom";
import FunFact from "../../component/pricing/FunFact";
import useMenu from "../../hooks/useMenu";

function Pricing() {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Pricing" link="/pricing" />
      <Wrapper>
        <PricingCom />
        <FunFact />
      </Wrapper>
    </Layout>
  );
}

export default Pricing;

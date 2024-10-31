import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import IntegrationsCom from "../../component/integrations";
import useMenu from "../../hooks/useMenu";

function Integrations() {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Integrations" link="/integrations" />
      <IntegrationsCom />
    </Layout>
  );
}

export default Integrations;

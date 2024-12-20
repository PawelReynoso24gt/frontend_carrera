import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import AsignacionStandComponent  from "../../component/asignacionStand/asignacionStand";
import useMenu from "../../hooks/useMenu";

function AsignacionStandPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Asignación de stands" link="/asignacionStand" />
      <Wrapper>
      <AsignacionStandComponent/>
      </Wrapper>
    </Layout>
  );
}

export default AsignacionStandPage ;

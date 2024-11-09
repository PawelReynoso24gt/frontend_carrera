import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import RolesComponent  from "../../component/roles/roles";
import useMenu from "../../hooks/useMenu";

function RolesPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Roles" link="/roles" />
      <Wrapper>
      </Wrapper>
    </Layout>
  );
}

export default RolesPage ;

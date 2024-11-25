import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import VoluntariosComponent  from "../../component/voluntarios/voluntarios";
import useMenu from "../../hooks/useMenu";

function RolesPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Voluntarios" link="/voluntarios" />
      <Wrapper>
        <VoluntariosComponent/>
      </Wrapper>
    </Layout>
  );
}

export default RolesPage ;

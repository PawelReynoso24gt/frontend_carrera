import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import ActividadComponent  from "../../component/actividades/actividades";
import useMenu from "../../hooks/useMenu";

function ActividadPage () {
  useMenu();
  return (
    <Layout>
        <BreadCrumb title="Actividades" link="/actividades" />
            <Wrapper>
            <ActividadComponent/>
            </Wrapper>
    </Layout>
    );
}

export default ActividadPage ;

import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import PersonasComponent  from "../../component/personas/personas";
import useMenu from "../../hooks/useMenu";

function personasPage () {
    useMenu();
    return (
    <Layout>
        <BreadCrumb title="Personas" link="/personas" />
        <Wrapper>
            <PersonasComponent/>
        </Wrapper>
    </Layout>
    );
}

export default personasPage ;

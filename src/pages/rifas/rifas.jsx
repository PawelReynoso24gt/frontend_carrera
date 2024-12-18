import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import RifaComponent  from "../../component/rifas/rifas";
import useMenu from "../../hooks/useMenu";

function rifaPage () {
    useMenu();
    return (
    <Layout>
        <BreadCrumb title="Rifas" link="/rifas" />
        <Wrapper>
            <RifaComponent/>
        </Wrapper>
    </Layout>
    );
}

export default rifaPage ;

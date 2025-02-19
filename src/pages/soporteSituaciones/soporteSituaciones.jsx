import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import SoporteTComponent  from "../../component/soporteSituaciones/soporteSituaciones";
import useMenu from "../../hooks/useMenu";

function SoportePage () {
    useMenu();
    return (
        <Layout>
            <BreadCrumb title="Registros de Situaciones" link="/soporteSituaciones" />
            <Wrapper>
            <SoporteTComponent/>
            </Wrapper>
        </Layout>
    );
}

export default SoportePage ;

import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import SoporteTComponent  from "../../component/soporteTecnico/soporteTecnico";
import useMenu from "../../hooks/useMenu";

function SoportePage () {
    useMenu();
    return (
        <Layout>
            <BreadCrumb title="Registros de Soporte Técnico" link="/soporteTecnico" />
            <Wrapper>
            <SoporteTComponent/>
            </Wrapper>
        </Layout>
    );
}

export default SoportePage ;

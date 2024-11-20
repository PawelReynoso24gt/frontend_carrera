import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import HorariosComponent from "../../component/horarios/horarios";
import useMenu from "../../hooks/useMenu";

function HorariosPage() {
    useMenu();
    return (
        <Layout>
            <BreadCrumb title="Manejo de horarios" link="/horarios" />
            <Wrapper>
                <HorariosComponent />
            </Wrapper>
        </Layout>
    );
}

export default HorariosPage;
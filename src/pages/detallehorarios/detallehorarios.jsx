import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import DetalleHorariosComponent from "../../component/detallehorarios/detallehorarios";
import useMenu from "../../hooks/useMenu";

function DetalleHorariosPage() {
    useMenu();
    return (
        <Layout>
            <BreadCrumb title="Asignacion de horarios de horarios" link="/detallehorarios" />
            <Wrapper>
                <DetalleHorariosComponent />
            </Wrapper>
        </Layout>
    );
}

export default DetalleHorariosPage;
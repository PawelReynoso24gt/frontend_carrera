import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import TipoStandsComponent from "../../component/tipoStands/tipoStands";
import useMenu from "../../hooks/useMenu";

function TipoStandsPage() {
    useMenu();
    return (
        <Layout>
            <BreadCrumb title="Manejo de stands" link="/tipoStands" />
            <Wrapper>
                <TipoStandsComponent />
            </Wrapper>
        </Layout>
    );
}

export default TipoStandsPage;
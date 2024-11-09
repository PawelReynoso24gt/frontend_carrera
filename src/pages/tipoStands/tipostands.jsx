import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import TipoStandsComponent from "../../component/tipoStands/tipostands";
import useMenu from "../../hooks/useMenu";

function DepartamentosPage() {
    useMenu();
    return (
        <Layout>
            <BreadCrumb title="Manejo de stands" link="/tipoStands" />
            <Wrapper>
                <DepartamentosComponent />
            </Wrapper>
        </Layout>
    );
}

export default DepartamentosPage;
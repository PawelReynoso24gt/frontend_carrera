import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import MaterialesComponent from "../../component/materiales/materiales";
import useMenu from "../../hooks/useMenu";

function HorariosPage() {
    useMenu();
    return (
        <Layout>
            <BreadCrumb title="Administracion de materiales" link="/materiales" />
            <Wrapper>
                <MaterialesComponent />
            </Wrapper>
        </Layout>
    );
}

export default HorariosPage;
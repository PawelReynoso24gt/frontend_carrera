import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import mercanciaVoluntariosComponent from "../../component/mercanciaVoluntarios/mercanciaVoluntarios";
import useMenu from "../../hooks/useMenu";

function mercanciaVoluntariosPage() {
    useMenu();
    return (
        <Layout>
            <BreadCrumb title="Mercancia Voluntarios" link="/mercanciaVoluntarios" />
            <Wrapper>
                <mercanciaVoluntariosComponent />
            </Wrapper>
        </Layout>
    );
}

export default mercanciaVoluntariosPage;
import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import UsuariosAdminComponent from "../../component/administradores/administradores";
import useMenu from "../../hooks/useMenu";

function HorariosPage() {
    useMenu();
    return (
        <Layout>
            <BreadCrumb title="Usuarios" link="/administradores" />
            <Wrapper>
                <UsuariosAdminComponent />
            </Wrapper>
        </Layout>
    );
}

export default HorariosPage;
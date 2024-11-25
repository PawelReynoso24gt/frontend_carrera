import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import TipoPublicoComponent  from "../../component/tipo_publicos/tipo_publicos";
import useMenu from "../../hooks/useMenu";

function tipoPublicoPage () {
    useMenu();
    return (
    <Layout>
        <BreadCrumb title="Tipo Público" link="/tipo_publicos" />
        <Wrapper>
            <TipoPublicoComponent/>
        </Wrapper>
    </Layout>
    );
}

export default tipoPublicoPage ;

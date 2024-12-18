import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import CategoriaBitacoraComponent  from "../../component/categoria_bitacoras/categoria_bitacoras";
import useMenu from "../../hooks/useMenu";

function categoriaBitacoraPage () {
    useMenu();
    return (
    <Layout>
        <BreadCrumb title="Categoría Bitácoras" link="/categoria_bitacoras" />
        <Wrapper>
            <CategoriaBitacoraComponent/>
        </Wrapper>
    </Layout>
    );
}

export default categoriaBitacoraPage ;

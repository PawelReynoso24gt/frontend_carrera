import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import ProductosComponent  from "../../component/productos/productos";
import useMenu from "../../hooks/useMenu";

function productosPage () {
    useMenu();
    return (
    <Layout>
        <BreadCrumb title="Productos" link="/productos" />
        <Wrapper>
            <ProductosComponent/>
        </Wrapper>
    </Layout>
    );
}

export default productosPage ;

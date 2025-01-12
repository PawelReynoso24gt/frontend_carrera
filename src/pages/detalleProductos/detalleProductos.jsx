import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import DetalleProductosPage  from "../../component/detalleProductos/detalleProductos";
import useMenu from "../../hooks/useMenu";

function detalleProductosPage () {
    useMenu();
    return (
    <Layout>
        <BreadCrumb title="Detalle Productos" link="/detalleProductos" />
        <Wrapper>
            <DetalleProductosPage/>
        </Wrapper>
    </Layout>
    );
}

export default detalleProductosPage ;

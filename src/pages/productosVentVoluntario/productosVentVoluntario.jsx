import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import ProductosVoluntariosComponent  from "../../component/productosVentVoluntario/productosVentVoluntario";
import useMenu from "../../hooks/useMenu";

function productosPage () {
    useMenu();
    return (
    <Layout>
        <BreadCrumb title="Productos de venta para voluntarios " link="/productosVentVoluntarios" />
        <Wrapper>
            <ProductosVoluntariosComponent/>
        </Wrapper>
    </Layout>
    );
}

export default productosPage ;

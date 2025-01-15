import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import BitacoraComponent  from "../../component/bitacoras/bitacoras";
import useMenu from "../../hooks/useMenu";

function BitacoraPage () {
    useMenu();
    return (
    <Layout>
        <BreadCrumb title="Bitácora" link="/bitacoras" />
        <Wrapper>
            <BitacoraComponent/>
        </Wrapper>
    </Layout>
    );
}

export default BitacoraPage ;

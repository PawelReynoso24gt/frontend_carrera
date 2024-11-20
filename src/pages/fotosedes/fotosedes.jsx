import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import FotosSedesComponent from "../../component/fotosedes/fotosedes";
import useMenu from "../../hooks/useMenu";

function FotoSedesPage() {
    useMenu();
    return (
        <Layout>
            <BreadCrumb title="Manejo de fotos" link="/fotosedes" />
            <Wrapper>
                <FotosSedesComponent />
            </Wrapper>
        </Layout>
    );
}

export default FotoSedesPage;
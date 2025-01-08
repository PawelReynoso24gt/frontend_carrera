import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import ComisionComponent  from "../../component/comisiones/comisiones";
import useMenu from "../../hooks/useMenu";

function ComisionPage () {
  useMenu();
  return (
    <Layout>
        <BreadCrumb title="Comisiones" link="/comisiones" />
            <Wrapper>
            <ComisionComponent/>
            </Wrapper>
    </Layout>
    );
}

export default ComisionPage ;

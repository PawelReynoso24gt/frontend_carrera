import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import PublicacionComponent  from "../../component/publicaciones/publicaciones";
import useMenu from "../../hooks/useMenu";

function PublicacionPage () {
  useMenu();
  return (
    <Layout>
        <BreadCrumb title="Publicaciones" link="/publicaciones" />
            <Wrapper>
            <PublicacionComponent/>
            </Wrapper>
    </Layout>
    );
}

export default PublicacionPage ;

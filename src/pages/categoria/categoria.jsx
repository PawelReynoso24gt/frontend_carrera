import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import CategoriaComponent  from "../../component/categoria/categoria";
import useMenu from "../../hooks/useMenu";

function CategoriasPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Categorias" link="/Categorias" />
      <Wrapper>
        <CategoriaComponent/>
      </Wrapper>
    </Layout>
  );
}

export default CategoriasPage ;

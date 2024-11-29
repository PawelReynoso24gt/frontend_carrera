import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import CategoriaHorariosComponent  from "../../component//categoriaHorarios/categoriaHorarios";
import useMenu from "../../hooks/useMenu";

function categoriaHorariosPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="CategoriaHorarios" link="/categoriaHorarios"/>
      <Wrapper>
      <CategoriaHorariosComponent/>
      </Wrapper>
    </Layout>
  );
}

export default categoriaHorariosPage ;

import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import DepartamentosComponent  from "../../component/departamentos/departamentos";
import useMenu from "../../hooks/useMenu";

function DepartamentosPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Departamentos" link="/Departamentos" />
      <Wrapper>
      </Wrapper>
    </Layout>
  );
}

export default DepartamentosPage ;

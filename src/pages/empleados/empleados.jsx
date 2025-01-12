import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import EmpleadosComponent  from "../../component/empleados/empleados";
import useMenu from "../../hooks/useMenu";

function EmpleadosPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Empleados" link="/empleados" />
      <Wrapper>
        <EmpleadosComponent/>
      </Wrapper>
    </Layout>
  );
}

export default EmpleadosPage;

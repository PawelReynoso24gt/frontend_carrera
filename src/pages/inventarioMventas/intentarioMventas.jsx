import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import InventariosMventasComponent  from "../../component/inventarioMventas/inventarioMventas";
import useMenu from "../../hooks/useMenu";

function RolesPage () {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Inventario de mercancía para ventas" link="/inventarioMventas" />
      <Wrapper>
        <InventariosMventasComponent/>
      </Wrapper>
    </Layout>
  );
}

export default RolesPage ;

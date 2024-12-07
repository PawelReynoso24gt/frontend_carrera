import React, { useState } from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import InventariosMventasComponent from "../../component/inventarioMventas/inventarioMventas";
import InventariosVoluntarios from "../../component/inventarioVoluntarios/inventarioVoluntarios";
import useMenu from "../../hooks/useMenu";

function RolesPage() {
  useMenu();

  // Estado para controlar el componente seleccionado
  const [selectedComponent, setSelectedComponent] = useState("mventas");

  // Función para manejar el cambio en el combobox
  const handleSelectionChange = (event) => {
    setSelectedComponent(event.target.value);
  };

  return (
    <Layout>
      <BreadCrumb title="Inventario de mercancía para ventas" link="/inventarioMventas" />
      <Wrapper>
        {/* Combobox para seleccionar el componente */}
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="component-select" style={{ marginRight: "10px" }}>
            Selecciona el inventario a mostrar:
          </label>
          <select
            id="component-select"
            value={selectedComponent}
            onChange={handleSelectionChange}
            style={{ padding: "5px", fontSize: "16px" }}
          >
            <option value="mventas">Inventario de mercancía para ventas</option>
            <option value="voluntarios">Inventario de voluntarios</option>
          </select>
        </div>

        {/* Renderizado condicional del componente seleccionado */}
        {selectedComponent === "mventas" ? (
          <InventariosMventasComponent />
        ) : (
          <InventariosVoluntarios />
        )}
      </Wrapper>
    </Layout>
  );
}

export default RolesPage;

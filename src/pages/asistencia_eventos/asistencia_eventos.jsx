import React, { useState } from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/pricing/Wrapper";
import AsistenciaEventosComponent  from "../../component/asistencia_eventos/asistencia_eventos";
import RegistroComisiones  from "../../component/registroComisiones/registroComisiones";
import RegistroMateriales from "../../component/registroMateriales/registroMateriales";
import RegistroActividades  from "../../component/registroActividades/registroActividades";
import useMenu from "../../hooks/useMenu";

function AsistenciasPage () {
  useMenu();
  // Estado para controlar el componente seleccionado
    const [selectedComponent, setSelectedComponent] = useState("mventas");
  
    // Función para manejar el cambio en el combobox
    const handleSelectionChange = (event) => {
      setSelectedComponent(event.target.value);
    };

  return (
    <Layout>
      <BreadCrumb title="Asistencia a Eventos" link="/asistencia_eventos" />
      <Wrapper >
      <div style={{ backgroundColor: "#CEECF2", padding: "20px", borderRadius: "10px" }}>
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
            <option value="inscripcion">Inscripciones a eventos</option>
            <option value="registroComision">Registros a comisiones</option>
            <option value="registroActividades">Registros a Actividades</option>
            <option value="registroMateriales">Registros a Materiales</option>        
          </select>
        </div>

        {/* Renderizado condicional del componente seleccionado */}
        {selectedComponent === "inscripcion" && <AsistenciaEventosComponent />}
        {selectedComponent === "registroComision" && <RegistroComisiones />}
        {selectedComponent === "registroMateriales" && <RegistroMateriales />}
        {selectedComponent === "registroActividades" && <RegistroActividades />}
        </div>
      </Wrapper>
    </Layout>
  );
}

export default AsistenciasPage;

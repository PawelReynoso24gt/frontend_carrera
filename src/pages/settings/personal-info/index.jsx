import React, { useState } from "react";
import fetchWithToken from "../../../utils/fetchWithToken";

function PersonalInfo() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    domicilio: ""
  });

  const [mensaje, setMensaje] = useState("");

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Obtener el personId desde localStorage
    const personId = localStorage.getItem("personId");
    const token = localStorage.getItem("token");

    if (!personId || !token) {
      setMensaje(
        "No se encontró el ID del usuario o el token en el almacenamiento local."
      );
      return;
    }

    try {
      const response = await fetchWithToken(`http://localhost:5000/personas/update/${personId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Agregar el token al encabezado
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMensaje("Datos actualizados correctamente.");
      } else {
        const error = await response.json();
        setMensaje(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
      setMensaje("Ocurrió un error al intentar actualizar los datos.");
    }
  };

  return (
    <div className="tab-pane fade show active">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12">
            <div className="crancy-ptabs__separate">
              <div className="crancy-ptabs__form-main">
                <div className="crancy__item-group">
                  <h4 className="crancy__item-group__title">
                    Actualizar mi información
                  </h4>
                  <div className="crancy__item-form--group">
                    <div className="row">
                      <div className="col-lg-6 col-12">
                        <div className="crancy__item-form--group mg-top-form-20">
                          <label className="crancy__item-label">Nombre </label>
                          <input
                            className="crancy__item-input"
                            type="text"
                            name="nombre"
                            placeholder="Ingresar nombre"
                            required="required"
                            value={formData.nombre}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="crancy__item-form--group mg-top-form-20">
                    <label className="crancy__item-label">Email</label>
                    <input
                      className="crancy__item-input"
                      type="email"
                      name="correo"
                      placeholder="tucorreo@gmail.com"
                      required="required"
                      value={formData.correo}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="crancy__item-form--group">
                    <div className="row">
                      <div className="col-lg-6 col-12">
                        <div className="crancy__item-form--group mg-top-form-20">
                          <label className="crancy__item-label">Teléfono</label>
                          <input
                            className="crancy__item-input"
                            type="text"
                            name="telefono"
                            placeholder="+502 12345678"
                            required="required"
                            value={formData.telefono}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="crancy__item-form--group  mg-top-form-20">
                    <label className="crancy__item-label">Dirección</label>
                    <input
                      className="crancy__item-input"
                      type="text"
                      name="domicilio"
                      placeholder="Ingresar dirección"
                      required="required"
                      value={formData.domicilio}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="crancy__item-button--group crancy__item-button--group--fix crancy__ptabs-bottom">
          <button
            className="crancy-btn crancy-btn__nostyle crancy-color4 p-0"
            type="button"
            onClick={() => setFormData({ nombre: "", correo: "", telefono: "", domicilio: "" })}
          >
            Cancelar
          </button>
          <button className="crancy-btn crancy-color8__bg" type="submit">
            Actualizar datos
          </button>
        </div>
      </form>
      {mensaje && <p style={{ marginTop: "20px", color: "green" }}>{mensaje}</p>}
    </div>
  );
}

export default PersonalInfo;

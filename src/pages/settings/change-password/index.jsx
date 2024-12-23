import React, { useState } from "react";
import img from "../../../assets/img/password-reset.png";
import fetchWithToken from "../../../utils/fetchWithToken";
import { getUserDataFromToken } from "../../../utils/jwtUtils";

function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [mensaje, setMensaje] = useState("");

  // Manejar cambios en los campos del formulario
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

    // Verificar que las contraseñas nuevas coincidan
    if (formData.newPassword !== formData.confirmPassword) {
        setMensaje("La nueva contraseña y la confirmación no coinciden.");
        return;
    }

    try {
        // Obtener el idUsuario y el token del localStorage
        const idUsuario = getUserDataFromToken(localStorage.getItem("token"))?.idUsuario;
        const token = localStorage.getItem("token"); // Obtén el token almacenado

        if (!idUsuario || !token) {
            setMensaje("No se encontró el ID del usuario o el token en el almacenamiento local.");
            return;
        }

        // Enviar la solicitud al backend con el token en el encabezado
        const response = await fetchWithToken(`http://localhost:5000/usuarios/${idUsuario}/contrasenia`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Agregar el token al encabezado
            },
            body: JSON.stringify({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            }),
        });

        if (response.ok) {
            setMensaje("La contraseña ha sido actualizada correctamente.");
            setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" }); // Limpiar el formulario
        } else {
            const error = await response.json();
            setMensaje(`Error: ${error.message || "Ocurrió un error al actualizar la contraseña."}`);
        }
    } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        setMensaje("Ocurrió un error al intentar actualizar la contraseña.");
    }
  };

  return (
    <div className="tab-pane fade show active">
      <div className="crancy-paymentm crancy__item-group">
        <h4 className="crancy__item-group__title">Cambiar contraseña</h4>
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-6 col-12">
            {/* Formulario */}
            <form
              className="crancy-wc__form-main crancy-wc__form-main p-0"
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label className="crancy-wc__form-label">Antigua contraseña</label>
                <div className="form-group__input">
                  <input
                    className="crancy-wc__form-input"
                    placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                    id="current-password"
                    type="password"
                    name="currentPassword"
                    maxLength="16"
                    required
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="crancy-wc__form-label">Nueva contraseña</label>
                <div className="form-group__input">
                  <input
                    className="crancy-wc__form-input"
                    placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                    id="new-password"
                    type="password"
                    name="newPassword"
                    maxLength="16"
                    required
                    value={formData.newPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="crancy-wc__form-label">Confirmar contraseña</label>
                <div className="form-group__input">
                  <input
                    className="crancy-wc__form-input"
                    placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                    id="confirm-password"
                    type="password"
                    name="confirmPassword"
                    maxLength="16"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="crancy__item-button--group crancy__ptabs-bottom">
                <button
                  className="crancy-btn crancy-btn__nostyle crancy-color4 p-0"
                  type="button"
                  onClick={() =>
                    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })
                  }
                >
                  Cancelar
                </button>
                <button className="crancy-btn crancy-color8__bg" type="submit">
                  Cambiar contraseña
                </button>
              </div>
            </form>
            {/* Fin del Formulario */}
          </div>
          <div className="col-lg-6 col-md-6 col-12">
            <div className="crancy-password__img">
              <img src={img} alt="Cambiar contraseña" />
            </div>
          </div>
        </div>
      </div>
      {mensaje && <p style={{ marginTop: "20px", color: "green" }}>{mensaje}</p>}
    </div>
  );
}

export default ChangePassword;
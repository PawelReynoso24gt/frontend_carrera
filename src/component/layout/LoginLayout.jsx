import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import bg from "../../assets/img/credential-bg.svg";
import logoW from "../../assets/img/logo-white.png";

function LoginLayout() {
  const [usuario, setUsuario] = useState(""); // Estado para el usuario
  const [contrasenia, setContrasenia] = useState(""); // Estado para la contraseña
  const [error, setError] = useState(null); // Estado para los mensajes de error
  const navigate = useNavigate();

  // Manejar la solicitud de inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/usuarios/login", {
        usuario,
        contrasenia,
      });

      // Si la autenticación es exitosa, guarda el token y redirige
      const token = response.data.token;
      const userId = response.data.usuario.idUsuario;
      const personId = response.data.usuario.idPersona;
      const sedeId = response.data.usuario.idSede;
      localStorage.setItem("personId", personId);
      localStorage.setItem("token", token); // Almacenar el token en localStorage
      localStorage.setItem("userId", userId);
      localStorage.setItem("sedeId", sedeId);
      
      navigate("/dashboard-sass"); // Redirigir a la página del dashboard (cambia la ruta según tus necesidades)
    } catch (err) {
      setError("Usuario o contraseña incorrectos. Por favor, intenta de nuevo.");
    }
  };

  return (
    <div className="body-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <section
        className="crancy-wc crancy-wc__full crancy-bg-cover"
        style={{ backgroundImage: `url(${bg})`, width: "100%", height: "100%" }}
      >
        <div className="container" style={{ maxWidth: "400px", padding: "40px", backgroundColor: "rgba(255, 255, 255, 0.95)", borderRadius: "16px", boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)" }}>
          <div className="text-center mb-4">
            <img src={logoW} alt="Logo" style={{ width: "150px", marginBottom: "20px" }} />
            <h4 style={{ color: "#333", fontWeight: "bold" }}>Iniciar Sesión</h4>
          </div>
          {/* Formulario de Inicio de Sesión */}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="usuario" style={{ color: "#333", fontWeight: "bold" }}>Usuario</label>
              <input
                type="text"
                className="form-control"
                id="usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                placeholder="Ingrese su usuario"
                style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="contrasenia" style={{ color: "#333", fontWeight: "bold" }}>Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="contrasenia"
                value={contrasenia}
                onChange={(e) => setContrasenia(e.target.value)}
                required
                placeholder="Ingrese su contraseña"
                style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
              />
            </div>
            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}
            <button type="submit" className="btn btn-primary mt-4 w-100" style={{ padding: "12px", borderRadius: "8px", fontWeight: "bold", backgroundColor: "#007AC3", border: "none" }}>
              Iniciar Sesión
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default LoginLayout;
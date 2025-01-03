import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import bg from "../../assets/img/BannerAYUVILOGIN.png";
import logoW from "../../assets/img/logo-white.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LoginLayout() {
  const [usuario, setUsuario] = useState(""); // Estado para el usuario
  const [contrasenia, setContrasenia] = useState(""); // Estado para la contraseña
  const [error, setError] = useState(null); // Estado para los mensajes de error
  const [showPassword, setShowPassword] = useState(false);
  
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
      localStorage.setItem("token", token); // Almacenar el token en localStorage
      
      navigate("/dashboard-sass"); // Redirigir a la página del dashboard (cambia la ruta según tus necesidades)
    } catch (err) {
      setError("Usuario o contraseña incorrectos. Por favor, intenta de nuevo.");
    }
  
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="body-bg" style={{  display: "flex", alignItems: "center", justifyContent: "center" }}>
      <section
        className="crancy-wc crancy-wc__full crancy-bg-cover"
        style={{ backgroundImage: `url(${bg})`, width: "100%", height: "100vh", backgroundSize: "cover"}}
      >
        <div className="container" style={{ maxWidth: "450px", padding: "80px", backgroundColor: "#D5F8FB", borderRadius: "16px", boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)", marginTop: "350px" }}>
          <div className="text-center mb-4">
            
            <h4 style={{ color: "#333", fontWeight: "bold" }}>Iniciar Sesión</h4>
          </div>
          {/* Formulario de Inicio de Sesión */}
          <form onSubmit={handleLogin} >
            <div className="form-group" >
              <label htmlFor="usuario" style={{ color: "#333", fontWeight: "bold", fontSize: "20px" }}>Usuario</label>
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
              <label htmlFor="contrasenia" style={{ color: "#333", fontWeight: "bold", fontSize: "20px" }}>Contraseña</label>
              <span
                onClick={togglePasswordVisibility}
                style={{
                  position: "absolute",
                  right: "20px", 
                  top: "70%", 
                  transform: "translateY(-50%)",
                  cursor: "pointer", 
                  fontSize: "18px", 
                  color: "#333", 
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              <input
                type={showPassword ? "text" : "password"}
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
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import bg from "../../assets/img/BannerAYUVILOGIN2.png";

const LoginLayout = () => {
  const [usuario, setUsuario] = useState(""); // Estado para el usuario
  const [contrasenia, setContrasenia] = useState(""); // Estado para la contraseña
  const [error, setError] = useState(null); // Estado para los mensajes de error
  const [showPassword, setShowPassword] = useState(false);
  const [bgImageLoaded, setBgImageLoaded] = useState(false);

  const navigate = useNavigate();

  // Manejar la solicitud de inicio de sesión
  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://api.voluntariadoayuvi.com/usuarios/login", {
        usuario,
        contrasenia,
      });

      // Si la autenticación es exitosa, guarda el token y redirige
      const token = response.data.token;
      localStorage.setItem("token", token); // Almacenar el token en localStorage
      // Registrar en la bitácora
      // await axios.post("https://api.voluntariadoayuvi.com/bitacora/create", {
      //   descripcion: `Usuario ${usuario} se ha logueado`,
      //   idCategoriaBitacora: 41,
      //   idUsuario: null,
      //   fechaHora: new Date()
      // });

      navigate("/paginaPrincipal"); // Redirigir a la página del dashboard (cambia la ruta según tus necesidades)
    } catch (err) {
      setError("Usuario o contraseña incorrectos. Por favor, intenta de nuevo.");
    }
  }, [usuario, contrasenia, navigate]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  }, []);

  // Pre-cargar la imagen de fondo después de que el componente se haya montado
  useEffect(() => {
    const img = new Image();
    img.src = bg;
    img.onload = () => setBgImageLoaded(true);
  }, []);

  return (
    <div className="body-bg" style={{
      display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", maxWidth: "100%",
      margin: "0 auto",
    }}>
      <section
        className="crancy-wc crancy-wc__full"
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0f2f5",
          backgroundImage: bgImageLoaded ? `url(${bg})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-fluid" style={{ maxWidth: "450px", padding: "80px", backgroundColor: "#D5F8FB", borderRadius: "30px", boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)" }}>
          <div className="text-center mb-4">
            <h4 style={{ color: "#333", fontWeight: "bold" }}>Iniciar Sesión</h4>
          </div>
          {/* Formulario de Inicio de Sesión */}
          <form onSubmit={handleLogin}>
            <div className="form-group">
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
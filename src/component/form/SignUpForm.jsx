import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import bg from "../../assets/img/credential-bg.svg";
import logoW from "../../assets/img/logo-white.png";

function SignUpForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/usuarios", {
        usuario,
        contrasenia: password,
        idRol: 1, // Puedes ajustar el rol según sea necesario
      });

      if (response.status === 201) {
        // Si la cuenta se crea correctamente, redirigir al login
        navigate("/login");
      }
    } catch (err) {
      setError("No se pudo crear la cuenta. Por favor, intenta de nuevo.");
    }
  };

  return (
    <div className="body-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <section
        className="crancy-wc crancy-wc__full crancy-bg-cover"
        style={{ backgroundImage: `url(${bg})`, width: "100%", height: "100%" }}
      >
        <div className="container" style={{ maxWidth: "500px", padding: "40px", backgroundColor: "rgba(255, 255, 255, 0.95)", borderRadius: "16px", boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)" }}>
          <div className="text-center mb-4">
            <img src={logoW} alt="Logo" style={{ width: "150px", marginBottom: "20px" }} />
            <h4 style={{ color: "#333", fontWeight: "bold" }}>Crea tu cuenta</h4>
          </div>
          {/* Formulario de Registro */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="firstName" style={{ color: "#333", fontWeight: "bold" }}>Nombre</label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="Ingresa tu nombre"
                style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="lastName" style={{ color: "#333", fontWeight: "bold" }}>Apellido</label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Ingresa tu apellido"
                style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="email" style={{ color: "#333", fontWeight: "bold" }}>Correo Electrónico</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Ingresa tu correo"
                style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="usuario" style={{ color: "#333", fontWeight: "bold" }}>Usuario</label>
              <input
                type="text"
                className="form-control"
                id="usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                placeholder="Ingresa tu usuario"
                style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="password" style={{ color: "#333", fontWeight: "bold" }}>Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Ingresa tu contraseña"
                style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
              />
            </div>
            <div className="form-group mt-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="terms"
                  required
                />
                <label htmlFor="terms" className="form-check-label" style={{ color: "#333" }}>
                  Acepto los <Link to="#">Términos y Condiciones</Link>
                </label>
              </div>
            </div>
            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}
            <button type="submit" className="btn btn-primary mt-4 w-100" style={{ padding: "12px", borderRadius: "8px", fontWeight: "bold", backgroundColor: "#007AC3", border: "none" }}>
              Registrarse
            </button>
          </form>
          <div className="text-center mt-4">
            <p style={{ color: "#333" }}>
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" style={{ color: "#007AC3", fontWeight: "bold" }}>
                Inicia Sesión
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SignUpForm;
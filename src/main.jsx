import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import App from "./App.jsx";
import "./assets/css/bootstrap.min.css";
import "./assets/css/font-awesome-all.min.css";
import "./assets/css/lightBox.css";
import "./assets/css/reset.css";
import "./assets/css/style.css";
import "./assets/js/main.js";
import "react-daypicker/lib/DayPicker.css";
import PermissionModal from "./PermissionModal.jsx";
import "./utils/activityMonitor"; // Importa el archivo activityMonitor

const Main = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Configuración global de Axios
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token"); // Obtiene el token del localStorage
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Agrega el token al header
      }
      return config;
    },
    (error) => {
      return Promise.reject(error); // Maneja errores de la solicitud
    }
  );

  axios.interceptors.response.use(
    (response) => response, // Devuelve directamente la respuesta si no hay errores
    (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Si el token es inválido o expiró, limpia el localStorage y redirige al login
        localStorage.clear(); // Limpia el localStorage
        window.location.href = "/login"; // Redirige al usuario a la página de login
      } else if (error.response?.status === 409) {
        // Abre el modal si ocurre un error 409
        setIsModalOpen(true);
      }
      return Promise.reject(error); // Propaga el error para manejarlo en los componentes si es necesario
    }
  );

  return (
    <React.StrictMode>
      <App />
      <PermissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);

import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios"; // Importa Axios
import App from "./App.jsx";
import "./assets/css/bootstrap.min.css";
import "./assets/css/font-awesome-all.min.css";
import "./assets/css/lightBox.css";
import "./assets/css/reset.css";
import "./assets/css/style.css";
import "./assets/js/main.js";
import "react-daypicker/lib/DayPicker.css";

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
    return Promise.reject(error); // Maneja errores
  }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

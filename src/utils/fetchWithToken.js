// src/utils/fetchWithToken.js

import renewToken from './renewToken';

async function fetchWithToken(url, options = {}) {
  const token = localStorage.getItem("token");

  if (!token) {
    // Si no hay token, redirige al login
    window.location.href = "/login";
    return Promise.reject("No se encontró un token.");
  }

  // Agregar el token al header de la solicitud
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(url, { ...options, headers });

    // Si el token expira o es inválido, redirige al login
    if (response.status === 401 || response.status === 403) {
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject("Token inválido o expirado.");
    }

    return response;
  } catch (error) {
    console.error("Error en fetchWithToken:", error);
    throw error;
  }
}

export default fetchWithToken;

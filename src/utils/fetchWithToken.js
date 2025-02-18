async function fetchWithToken(url, options = {}) {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
    return Promise.reject("No se encontró un token.");
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(url, { ...options, headers });

    if (response.status === 401 || response.status === 403) {
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject("Token inválido o expirado.");
    }

    return response;
  } catch (error) {
    throw error;
  }
}

export default fetchWithToken;
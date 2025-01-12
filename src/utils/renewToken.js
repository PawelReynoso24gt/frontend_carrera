// src/utils/renewToken.js

import axios from 'axios';

async function renewToken() {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No se encontró un token.");
    }

    try {
        const response = await axios.post("http://localhost:5000/renew", null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status !== 200) {
            throw new Error("No se pudo renovar el token.");
        }

        localStorage.setItem("token", response.data.token);
    } catch (error) {
        console.error("Error al renovar el token:", error);
        throw error;
    }
}

export default renewToken;
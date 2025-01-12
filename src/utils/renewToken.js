// src/utils/renewToken.js

async function renewToken() {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No se encontró un token.");
    }

    const response = await fetch("/api/renew", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("No se pudo renovar el token.");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
}

export default renewToken;
import axios from 'axios';

async function renewToken() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No se encontró un token.");
        throw new Error("No se encontró un token.");
    }

    try {
        const response = await axios.post("http://localhost:5000/renew", null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status !== 200) {
            console.error("No se pudo renovar el token. Estado:", response.status);
            throw new Error("No se pudo renovar el token.");
        }

        localStorage.setItem("token", response.data.token);
        //console.log("Token renovado y almacenado en localStorage:", response.data.token);
    } catch (error) {
        console.error("Error al renovar el token:", error);
        throw error;
    }
}

export default renewToken;
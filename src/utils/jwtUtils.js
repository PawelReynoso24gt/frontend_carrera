// jwtUtils.js

export const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
    } catch (e) {
        console.error('Error al decodificar el token:', e);
        return null;
    }
};

// Cambiar el nombre de la función para reflejar que lo que devuelve es un objeto con los datos del usuario
export const getUserDataFromToken = (token) => {
    const decodedToken = parseJwt(token);
    return decodedToken ? decodedToken : null; // Devuelve el objeto completo
};
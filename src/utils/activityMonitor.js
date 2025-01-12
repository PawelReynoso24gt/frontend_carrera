// src/utils/activityMonitor.js

import renewToken from './renewToken';

let timeoutId;
const ACTIVITY_TIMEOUT = 1 * 60 * 1000; // 1 minuto

function resetTimeout() {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
        console.log("No ha habido actividad durante 1 minuto. Redirigiendo al login...");
        localStorage.clear();
        window.location.href = "/login";
    }, ACTIVITY_TIMEOUT);
}

function setupActivityListeners() {
    const events = ['mousemove', 'keydown', 'scroll', 'click'];

    events.forEach(event => {
        window.addEventListener(event, async () => {
            console.log(`Evento detectado: ${event}`);
            resetTimeout();

            // Intentar renovar el token si hay actividad
            try {
                console.log('Intentando renovar el token...');
                await renewToken();
                console.log('Token renovado exitosamente.');
            } catch (error) {
                console.error("Error al renovar el token:", error);
                localStorage.clear();
                window.location.href = "/login";
            }
        });
    });
}

// Inicializar el monitor de actividad
setupActivityListeners();
resetTimeout();
// src/utils/activityMonitor.js

import renewToken from './renewToken';

let timeoutId;
const ACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutos

function resetTimeout() {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
        localStorage.clear();
        window.location.href = "/login";
    }, ACTIVITY_TIMEOUT);
}

function setupActivityListeners() {
    const events = ['mousemove', 'keydown', 'scroll', 'click'];

    events.forEach(event => {
        window.addEventListener(event, async () => {
            resetTimeout();

            // Intentar renovar el token si hay actividad
            try {
                await renewToken();
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
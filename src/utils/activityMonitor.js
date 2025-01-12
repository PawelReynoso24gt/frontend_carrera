// src/utils/activityMonitor.js

import renewToken from './renewToken';

const ACTIVITY_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutos
let lastActivityTime = Date.now();

function updateLastActivityTime() {
    lastActivityTime = Date.now();
}

function setupActivityListeners() {
    const events = ['keydown', 'scroll', 'click'];

    events.forEach(event => {
        window.addEventListener(event, () => {
            //console.log(`Evento detectado: ${event}`);
            updateLastActivityTime();
        });
    });
}

function startActivityCheckInterval() {
    setInterval(async () => {
        const currentTime = Date.now();
        const timeSinceLastActivity = currentTime - lastActivityTime;

        // Si ha habido actividad en los últimos 5 minutos, intenta renovar el token
        if (timeSinceLastActivity < ACTIVITY_CHECK_INTERVAL) {
            //console.log('Actividad reciente detectada, intentando renovar el token...');
            try {
                await renewToken();
                //console.log('Token renovado exitosamente.');
            } catch (error) {
                //console.error("Error al renovar el token:", error);
                localStorage.clear();
                window.location.href = "/login";
            }
        } else {
            //console.log('No ha habido actividad reciente, no se renueva el token.');
        }
    }, ACTIVITY_CHECK_INTERVAL);
}

// Inicializar el monitor de actividad
setupActivityListeners();
startActivityCheckInterval();
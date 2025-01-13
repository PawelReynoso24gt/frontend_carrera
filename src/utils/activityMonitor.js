// src/utils/activityMonitor.js

import renewToken from './renewToken';

const ACTIVITY_CHECK_INTERVAL = 15 * 60 * 1000; // 15 minutos
let lastActivityTime = Date.now();

function updateLastActivityTime() {
    lastActivityTime = Date.now();
}

function setupActivityListeners() {
    const events = ['keydown', 'scroll', 'click'];

    events.forEach(event => {
        window.addEventListener(event, () => {
            updateLastActivityTime();
        });
    });
}

function startActivityCheckInterval() {
    setInterval(async () => {
        const currentTime = Date.now();
        const timeSinceLastActivity = currentTime - lastActivityTime;

        if (timeSinceLastActivity >= ACTIVITY_CHECK_INTERVAL) {
            localStorage.clear();
            window.location.href = "/login";
        } else {
            try {
                await renewToken();
            } catch (error) {
                localStorage.clear();
                window.location.href = "/login";
            }
        }
    }, ACTIVITY_CHECK_INTERVAL);
}

// Inicializar el monitor de actividad
setupActivityListeners();
startActivityCheckInterval();
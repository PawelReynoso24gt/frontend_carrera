import renewToken from './renewToken';

const ACTIVITY_CHECK_INTERVAL = 10 * 60 * 1000; // 1 minuto
let lastActivityTime = Date.now();

function updateLastActivityTime() {
    lastActivityTime = Date.now();
    //console.log("Actividad detectada, actualizando lastActivityTime:", lastActivityTime);
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

        //console.log("Tiempo desde la última actividad:", timeSinceLastActivity);

        if (timeSinceLastActivity >= ACTIVITY_CHECK_INTERVAL) {
            //console.log("Tiempo de inactividad excedido, cerrando sesión.");
            localStorage.clear();
            window.location.href = "/login";
        } else {
            try {
                await renewToken();
                //console.log("Token renovado exitosamente.");
            } catch (error) {
                //console.log("Error al renovar el token, cerrando sesión.");
                localStorage.clear();
                window.location.href = "/login";
            }
        }
    }, ACTIVITY_CHECK_INTERVAL);
}

// Inicializar el monitor de actividad
setupActivityListeners();
startActivityCheckInterval();
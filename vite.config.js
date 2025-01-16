import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost", // Puedes dejarlo como localhost o usar 0.0.0.0
    port: 5173,        // Cambia el puerto si es necesario
    open: "/login",    // Agrega esta línea para que la ruta inicial sea "/login"
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { BASE_PATH } from "./const";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // **************** INSERCIÓN CLAVE PARA GITHUB PAGES ****************
  // Se establece la ruta base (Base Path) para que coincida con el nombre del repositorio.
  // Tu repositorio es 'plan-smart-voice'.
  // base: '/plan-smart-voice/',
  base: BASE_PATH,
  // *******************************************************************

  // **************** CLAVE: RENOMBRAR LA CARPETA DE SALIDA ****************
  // Se fuerza a Vite a generar los archivos en la carpeta 'docs' en lugar de 'dist'.
  // Esto es necesario porque GitHub Pages solo ve '/root' o '/docs' como carpetas de despliegue.
  build: {
    outDir: 'docs', 
  },
  // *******************************************************************
  
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
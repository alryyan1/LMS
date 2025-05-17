import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
 import tailWindcss from "@tailwindcss/vite";
 
export default defineConfig({
  optimizeDeps:{
    include: [
      '@emotion/react', 
      '@emotion/styled', 
      '@mui/material/Tooltip'
    ],
  },
  build :{
    outDir:'c:/app/dist'
  },
  plugins: [react(),tailWindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
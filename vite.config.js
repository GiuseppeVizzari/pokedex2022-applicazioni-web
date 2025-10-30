// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
    base: "/pokedex2022-applicazioni-web",
    plugins: [react()],
})
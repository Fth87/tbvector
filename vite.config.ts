import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  // Dev only: run tbvector-server on :8000 (uv run uvicorn app.main:app).
  server: { proxy: { "/api": "http://localhost:8000" } },
});

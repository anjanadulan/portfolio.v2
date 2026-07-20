import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://anjanaw.vercel.app",
  output: "static",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()]
  },
  build: {
    format: "directory"
  }
});

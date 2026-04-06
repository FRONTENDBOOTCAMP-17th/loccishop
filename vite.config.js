import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [tailwindcss()],
  root: ".",
  server: {
    port: 5173,
    open: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        productDetail: resolve(
          __dirname,
          "src/pages/product/detail/index.html",
        ),
        login: resolve(__dirname, "src/pages/login/index.html"),
        signup: resolve(__dirname, "src/pages/signup/index.html"),
      },
    },
  },
});

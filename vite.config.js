import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  base: "/",
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
        login: resolve(__dirname, "/src/pages/login/index.html"),
        signup: resolve(__dirname, "/src/pages/signup/index.html"),
        adminSignup: resolve(__dirname, "/src/pages/admin/signup/index.html"),
        productList: resolve(__dirname, "/src/pages/product/list/index.html"),
        productDetail: resolve(
          __dirname,
          "/src/pages/product/detail/index.html",
        ),
        cart: resolve(__dirname, "/src/pages/cart/index.html"),
        shipping: resolve(__dirname, "/src/pages/order/shipping/index.html"),
      },
    },
  },
});

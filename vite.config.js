import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  base: "/",
  plugins: [tailwindcss()],
  root: ".",
  resolve: {
    alias: {
      "/src": resolve(__dirname, "src"),
      "/admin": resolve(__dirname, "admin"), // 추가
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "src/pages/login/index.html"),
        signup: resolve(__dirname, "src/pages/signup/user/index.html"),
        mypage: resolve(__dirname, "src/pages/mypage/index.html"),
        adminSignup: resolve(__dirname, "src/pages/signup/admin/index.html"),
        productList: resolve(__dirname, "src/pages/product/list/index.html"),
        productDetail: resolve(
          __dirname,
          "src/pages/product/detail/index.html",
        ),
        productCategory: resolve(
          __dirname,
          "src/pages/product/category/index.html",
        ),
        cart: resolve(__dirname, "src/pages/cart/index.html"),
        shipping: resolve(__dirname, "src/pages/order/shipping/index.html"),
        payment: resolve(__dirname, "src/pages/order/payment/index.html"),
        complete: resolve(__dirname, "src/pages/order/complete/index.html"),
        wishlist: resolve(__dirname, "src/pages/wishlist/index.html"),
        adminLogin: resolve(__dirname, "admin/index.html"),
        dashboard: resolve(__dirname, "admin/dashboard.html"),
      },
    },
  },
});

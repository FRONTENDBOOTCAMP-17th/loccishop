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
    proxy: {
      "/api": {
        target: "https://api.fullstackfamily.com",
        changeOrigin: true,
      },
    },
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
        orderDetail: resolve(
          __dirname,
          "src/pages/mypage/order-detail/index.html",
        ),
        wishlist: resolve(__dirname, "src/pages/wishlist/index.html"),
        adminLogin: resolve(__dirname, "admin/index.html"),
        dashboard: resolve(__dirname, "admin/dashboard.html"),
      },
    },
  },
});

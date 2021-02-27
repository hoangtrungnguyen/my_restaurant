import Vue from 'vue'
import Router from 'vue-router'
import HomePage from "@/view/HomePage";
import MenuPage from "@/view/MenuPage";
import BlogPage from "@/view/BlogPage";
import FoodDetails from "../view/FoodDetails";
import CartPage from "../view/CartPage";

Vue.use(Router)

export default new Router(
  {
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Trang chủ',
      component: HomePage,
    },
    {
      path: '/menu',
      name: "Thực đơn",
      component: MenuPage
    },
    {
      path: '/blog',
      name: "Blog",
      component: BlogPage
    },
    {
      path: '/cart',
      name: "Giỏ hàng",
      component: CartPage
    },
    {
      path: "/food/:id",
      component: FoodDetails
    }
  ],
})

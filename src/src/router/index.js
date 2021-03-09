import Vue from 'vue'
import Router from 'vue-router'
import HomePage from "@/view/HomePage";
import MenuPage from "@/view/MenuPage";
import BlogPage from "@/view/BlogPage";
import FoodDetails from "../view/FoodDetails";
import CartPage from "../view/CartPage";
import CheckoutPage from "../view/CheckoutPage";
import CheckoutOkPage from "../view/CheckoutOkPage";
import ContactPage from "../view/ContactPage";
import AuthenticatePage from "../view/AuthenticatePage";
import {auth} from "../model/db";
import AccountPage from "../view/AccountPage";
import AccountProfile from "../components/account/AccountProfile";
import OrderProfile from "../components/account/OrderProfile";
import ForgotPasswordPage from "../view/ForgotPasswordPage";
import FindOrderPage from "../view/FindOrderPage";
import ViewSubmittedOrder from "../components/account/ViewSubmittedOrder";
import AdminPage from "../view/admin/AdminPage";
import AdminOverview from "../components/admin/AdminOverview";
import AdminOrder from "../components/admin/AdminOrder";
import AdminFood from "../components/admin/AdminFood";
import AdminUser from "../components/admin/AdminUser";
import AdminBlog from "../components/admin/AdminBlog";
import AdminOrderDetail from "../components/admin/AdminOrderDetail";
import AdminFoodCreate from "../components/admin/AdminFoodCreate";
import AdminFoodList from "../components/admin/AdminFoodList";
import AdminFoodTopping from "../components/admin/AdminFoodTopping";
import AdminFoodView from "../components/admin/AdminFoodView";
import AdminBlogList from "../components/admin/AdminBlogList";
import AdminBlogView from "../components/admin/AdminBlogView";
import ErrorPage from "../view/ErrorPage";
import AdminBlogCreate from "../components/admin/AdminBlogCreate";
import BlogSinglePage from "../view/BlogSinglePage";
import PageNotFound from "../view/PageNotFound";

Vue.use(Router)

const router = new Router(
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
        path: '/blog/:id',
        name: "blog.view",
        component: BlogSinglePage
      },
      {
        path: '/cart',
        name: "Giỏ hàng",
        component: CartPage
      },
      {
        path: '/checkout',
        name: "Thanh toán",
        component: CheckoutPage
      },
      {
        path: "/food/:id",
        component: FoodDetails
      },
      {
        path: "/checkout-ok/:id",
        component: CheckoutOkPage
      },
      {
        path: "/contact",
        component: ContactPage
      },
      {
        path: "/authenticate",
        component: AuthenticatePage,
        beforeEnter: (to, from, next) => {
          if (auth.currentUser) {
            next("/account")
          } else {
            next()
          }
        }
      },
      {
        path: "/forgot-pw",
        component: ForgotPasswordPage,
      },
      {
        path: "/error",
        component: ErrorPage
      },
      {
        path: "/account",
        component: AccountPage,
        children: [
          {
            path: "",
            component: AccountProfile
          },
          {
            path: "order",
            component: OrderProfile
          },
          {
            path: "order/:id",
            component: ViewSubmittedOrder,
          },
        ],
        beforeEnter: (to, from, next) => {

          // const requiresAuth = to.matched.some(x => x.meta.requiresAuth)

          // if (requiresAuth && !auth.currentUser) {
          if (!auth.currentUser) {
            next('/authenticate')
          } else {
            next()
          }
        }
      },
      {
        //https://github.com/vuejs/vue-router/issues/704
        path: "/admin",
        component: AdminPage,
        beforeEnter: (to, from, next) => {
          if (!auth.currentUser) {
            next('/error')
          } else {
            auth.currentUser.getIdTokenResult().then(result =>{
              if(result.claims.admin){
                next()
              } else {
                next('/error')
              }
            })
          }
        },
        meta: {
          isAdminPage: true,
          //TODO checking permission here
          permission: ['ADMIN', 'OWNER']
        },
        children: [
          {
            path: "",
            name: "admin.overview",
            component: AdminOverview,

          },
          {
            path: "user",
            name: "admin.user",
            component: AdminUser,
          },
          {
            path: "blog",
            component: AdminBlog,
            children: [
              {
                path: '',
                name: "admin.blog",
                component: AdminBlogList
              },
              {
                path: "create",
                name: "admin.blog.creat",
                component: AdminBlogCreate,
              },
              {
                path: ":id",
                name: "admin.blog.view",
                component: AdminBlogView,
              },
            ]
          },
          {
            path: "order",
            component: AdminOrder,
          },
          {
            path: "order/:id",
            name: "admin.order.details",
            component: AdminOrderDetail,
          },
          {
            path: "food",
            component: AdminFood,
            // need router-view tag to work
            //https://stackoverflow.com/questions/59628964/vue-router-nested-route-not-loading-my-component-page
            children: [
              {
                path: '',
                name: "admin.food",
                component: AdminFoodList
              },
              {
                path: "create",
                name: "admin.food.create",
                component: AdminFoodCreate,
              },
              {
                path: ':id',
                name: "admin.food.view",
                component: AdminFoodView
              },

              {
                path: 'topping/create',
                name: "admin.food.topping",
                component: AdminFoodTopping
              },
            ]
          },
        ],
      },
      { path: '/404', component: PageNotFound },
      {path: "*", redirect: '/404'}
    ],
  })


export default router

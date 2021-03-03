<template>
  <div id="app">
    <navigation v-if="!adminPage"/>
    <main>
      <router-view v-bind:final_order="final_order"
                   v-bind:count="count"
                   v-bind:userProfile="userProfile"
                   :updateCount="updateCount"
                   :setUserProfile="setUserProfile"
      />
    </main>
    <bottom-navigation v-if="!adminPage"/>
  </div>
</template>

<script>
import Navigation from "./components/widgets/Navigation";
import BottomNavigation from "./components/widgets/BottomNavigation";
import {auth} from "./model/db";

/*** cart model in session
 //  {
//      orderId : {
//          foodId: 111
//          food: Food Object
//          count: 1,
//          note: "",
//          orderId: orderId,
//          name: "name",
//          price: '10000'
//          size: 1, // 1 - 2 - 3
//          toppings: [
//                  {
//                      topping_id: 'ID',
//                      topping_name: 'name',
//                      topping_price: '100000'
//                  },
//                  ...
//              ]
//        },
//      ....
//  }
 ***/
export default {
  name: 'App',
  components: {Navigation, BottomNavigation},
  data: function () {
    return {
      count: 0,
      userProfile: {},
      final_order: {
        bill_method: "CASH",
        note: "",
        orders: []
      },
      authUser: null
    }
  },
  methods: {
    setUserProfile: function (userProfile) {
      this.userProfile = userProfile
    },
    updateCount: function () {
      let cart = this.$session.get('cart')
      let cart_count = 0
      for (const property in cart) {
        if (property === 'note') {
          continue
        }
        if (cart.hasOwnProperty(property)) {
          cart_count += parseInt(cart[property].count)
        }
      }
      this.count = cart_count
      // console.log(this.count)
    }
  },
  created() {
    this.updateCount()
  },
  computed:{
    adminPage:function(){
      return this.$router.currentRoute.matched.some(route => route.meta.isAdminPage)
    }
  }
}
</script>

<style>
@import '../static/css/base.css';
@import '../static/css/carousel.css';
/*@import  url("https://fonts.gstatic.com");*/
@import url("https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200&display=swap");

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

main {
  background-color: #eceaea
}
label{
  font-weight: 600;
}

</style>

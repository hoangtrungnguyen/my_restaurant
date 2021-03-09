<template>
  <div id="app">
    <navigation v-if="!isAdminPage"/>
    <main>
      <router-view v-bind:final_order="final_order"
                   v-bind:count="count"
                   v-bind:userProfile="userProfile"
                   :setIsAdminPage="setIsAdminPage"
                   :updateCount="updateCount"
                   :setUserProfile="setUserProfile"
      />
    </main>
    <bottom-navigation v-if="!isAdminPage"/>

    <b-modal ref="my-modal" hide-footer title="Chào mừng bạn !!">
      <div class="d-block text-center">
        <h3>Chương trình khai trương: Giảm giá đến 30%~</h3>
      </div>
      <b-row>
<!--        <b-button class="mt-3" variant="outline-danger" block @click="hideModal">Đóng</b-button>-->
        <b-button class="mt-2" variant="outline-info" block @click="toggleModal">Xem ngay</b-button>
      </b-row>

    </b-modal>
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
      authUser: null,
      isAdminPage:this.$router.currentRoute.matched.some(route => route.meta.isAdminPage)
    }
  },
  mounted() {
    if(!this.isAdminPage)
      this.showModal()
  },
  methods: {
    showModal() {
      this.$refs['my-modal'].show()
    },
    hideModal() {
      this.$refs['my-modal'].hide()
    },
    toggleModal() {
      // We pass the ID of the button that we want to return focus to
      // when the modal has hidden
      this.$refs['my-modal'].toggle('#toggle-btn')
      this.$router.push("/blog")
    },
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
    },
    setIsAdminPage:function(value){
      this.isAdminPage = value
    }
  },
  created() {
    this.updateCount()
  },
  watch:{

  },
  computed:{

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

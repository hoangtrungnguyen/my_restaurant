<template>
  <div>
    <main>
      <div id="menu-banner" class="parallax">
        <b-container fluid="true" class="head-banner">
          <h2>Sản phẩm</h2>
          <p>Thêm topping, chi tiết về sản phẩm.</p>
        </b-container>
      </div>

      <b-container fluid="" class="py-4" id="food-content">
        <b-row>
          <b-col md="6">
            <b-col>
              <b-img class="img-fluid" v-bind:src="food.image_url"></b-img>
              <b-row class="pt-3">
                <b-col cols="4">
                  <a href=""></a>
                  <img class="img-fluid" v-bind:src="'http://placehold.it/325x325'" height="225"
                       alt="">
                </b-col>
                <b-col cols="4" class="pl-2">
                  <a href=""></a>
                  <img class="img-fluid" v-bind:src="'http://placehold.it/325x325'" height="225"
                       alt="">
                </b-col>
                <b-col cols="4" class="pl-2">
                  <a href=""></a>
                  <img class="img-fluid" v-bind:src="'http://placehold.it/325x325'" height="225"
                       alt="">
                </b-col>
              </b-row>

            </b-col>
          </b-col>
          <b-col md="6">
            <h3 class="pt-md-0 pt-4">{{ food.title }}</h3>
            <p class="text-dark text-left">{{ food.description }}</p>
            <hr>
            <h4> {{ food.price | formatBill }} VND</h4>
            <hr>
            <h5>Cỡ</h5>
            <form>
              <input type="radio" v-model="order.size" value="1">
              <label>Nhỏ</label>
              <input type="radio" checked v-model="order.size" value="2">
              <label>Vừa</label>
              <input type="radio" v-model="order.size" value="3">
              <label>Lớn</label>
            </form>
            <h5 class="py-2">Topping thêm</h5>
            <form action="" id="add-topping" class="px-4">
              <b-row class="justify-content-between" v-bind:key="topping.id"
                     v-for="topping in toppings">
                <span>
                  <input type="checkbox" class="topping-checkbox" v-bind:value="topping"
                         v-model="order.toppings">
                  <label class="px-2">{{ topping.name }}</label>
                  </span>
                <p>{{ topping.price|formatBill }}VND</p>
              </b-row>

              <b-row class="p-0 m-0 pt-3">
                <b-col cols="3" class="pl-0">
                  <input class="w-100" id="quantity" min="1" type="number" value="1"
                         v-model="order.count"
                         style="padding-right: 0">
                </b-col>
                <b-col cols="9">
                  <b-btn v-on:click="addAnOrder(food, order.count, order.toppings,order.size)" id="add-btn" class="btn-primary w-100">
                    <b-row class="justify-content-between px-3">
                      <span class="" id="bill">
                        {{ billPerUnit | formatBill }}VND / suất
                      </span>
                      <span>Thêm</span>
                    </b-row>
                  </b-btn>
                </b-col>
              </b-row>
            </form>


          </b-col>
        </b-row>

      </b-container>
    </main>
  </div>

</template>

<script>
import {db} from '../model/db'
import addToCartMixin from "../mixin/addToCartMixin";

export default {
  name: "FoodDetails",
  props: {
    'updateCount':{type:Function}
  },
  data: function () {
    return {
      id: this.$route.params.id,
      food: {},
      toppings: [],
      order: {
        size:1,
        count: 1,
        toppings: []
      }
    }
  },
  methods: {
      addAnOrder: function(food, count, toppings,size){
        this.addToCart(food, count, toppings,size)
        this.updateCount()
      }
  },
  mixins:[
     addToCartMixin
  ],
  computed: {
    billPerUnit: function () {
      let bill = parseInt(this.food.price) + 10000 * (this.order.size - 1)
      for (let i=0;i <this.order. toppings.length; i++) {
        const topping = this.order.toppings[i]
        if (topping.hasOwnProperty('price'))
          bill += parseInt(topping['price'])
      }
      return bill
    }
  },
  created() {
    db.collection('food').doc(this.id).get().then((doc) => {
      let food = {}
      food.id = doc.id
      food.description = doc.data().description
      food.price = doc.data().price
      food.title = doc.data().title
      food.image_url = doc.data().image_url
      food.image_name = doc.data().image_name
      food.is_remaining = doc.data().is_remaining
      food.ref = doc.ref
      this.food = food

    })
    db.collection('topping').get().then((value) => {
      this.toppings = value.docs.map(e => {
        return {
          id: e.id,
          name: e.data().name,
          price: e.data().price,
          description: e.data().description,
        }
      })
    })
  }
}
</script>

<style scoped>
.head-banner {
  width: 100%;
  padding: 10vh 0;
}

@media (min-width: 992px) {
  .head-banner {
    width: 100%;
    padding: 15vh 0;
  }
}

#food-content {
  text-align: left;
  padding: 0 10%;
}

#quantity {
  margin: 0 20px;
}
</style>

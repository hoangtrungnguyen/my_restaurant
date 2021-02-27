<template>
  <div class="container-fluid m-0 p-0">
    <main>
      <div id="menu-banner" class="parallax">
        <b-container fluid class="head-banner">
          <h2>Menu</h2>
          <p>Chọn món ăn của bạn</p>
        </b-container>
      </div>
      <b-container fluid="true" id="menu-content">
        <b-row>
          <b-col lg="3">
            <h1 class="my-4">Tiệm cơm Tây Bắc</h1>
            <div class="list-group">
              <a class="list-group-item" href="#">Ăn sáng</a>
              <a class="list-group-item" href="#">Ăn trưa</a>
              <a class="list-group-item" href="#">Ăn vặt</a>
            </div>
          </b-col>
          <b-col lg="9">
            <b-row class="mx-0 my-4">
              <b-col lg="4" class="align-content-center" sm="6" v-bind:key="food.id"
                     v-for="food in foods">
                <div class="image-wrapper">

                  <img alt="Ảnh" class="image-food" v-bind:src="food.image_url"/>
                  <div class="overlay"></div>
                  <div class="button">
                    <b-btn v-if="!isInCart(food)" v-on:click.prevent="addAnOrder(food)" class="btn-primary">Thêm vào giỏ</b-btn>
                    <router-link to="/cart" v-if="isInCart(food)" class="btn btn-primary">Đi đến giỏ </router-link>
                  </div>
                </div>

                <b-row style="max-width: 320px" class="justify-content-between px-4 pt-1">
                  <h4>
                    <router-link v-bind:to="`/food/${food.id}`">{{ food.title }}</router-link>
                  </h4>
                  <p><small>{{ food.price | formatBill }}VND</small></p>
                </b-row>

              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>

    </main>
  </div>
</template>

<script>
import Navigation from "../components/widgets/Navigation";
import BottomNavigation from "../components/widgets/BottomNavigation";
// RecentDocuments.vue
import {db} from '../model/db'

import addToCartMixin from "../mixin/addToCartMixin";

export default {
  name: "MenuPage",
  props: {
    updateCount: {type:Function}
  },
  data: function () {
    return {
      foods: [],
      foodsInCart:[]
    }
  },
  components: {
    "navigation": Navigation,
    "bottom-navigation": BottomNavigation
  },
  methods: {
    isInCart: function(food){
      try {
        let cart = this.$session.get('cart')

        return cart.hasOwnProperty(food.id)
      } catch (e){
        return false
      }
    },
    addAnOrder: function(food){
      this.addToCart(food,1,[],1)
      this.isInCart(food)
    }
  },
  mixins:[
    addToCartMixin
  ],
  computed:{

  },
  created() {
    db.collection('food').get().then((value) => {
      this.foods = value.docs.map((doc) => {
        let food = {}
        food.id = doc.id
        food.image_url = doc.data().image_url
        food.title = doc.data().title
        food.price = doc.data().price
        food.description = doc.data().description
        food.ref = doc.ref
        return food
      })
    })
  },

}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

#menu-content {
  padding: 0 5%;
}

.row h2, .row p {
  margin: auto 0
}

.image-food {
  background: 100% 50% no-repeat; /* 50% 50% centers image in div */
  width: 300px;
  height: 300px;
}

.image-wrapper {
  width: 300px;
  height: 300px;
  position: relative;
}


.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  transition: background 0.5s ease;
}

.image-wrapper:hover .overlay {
  display: block;
  background: rgba(0, 0, 0, .3);
}


.title {
  position: absolute;
  width: 500px;
  left: 0;
  top: 120px;
  font-weight: 700;
  font-size: 30px;
  text-align: center;
  text-transform: uppercase;
  color: white;
  z-index: 1;
  transition: top .5s ease;
}

.image-wrapper:hover .title {
  top: 90px;
}

.button {
  position: absolute;
  text-align: center;
  opacity: 0;
  top: 50%;
  left: 50%;
  width: 150px;
  margin: -10px 0 0 -72px;
  transition: opacity .35s ease;
}

.button button {
  text-align: center;
  color: white;
  border: solid 2px white;
  z-index: 1;

}

.image-wrapper:hover .button {
  opacity: 1;
}


</style>

<template>
  <div class="container-fluid m-0 p-0">
    <banner/>
    <b-container id="menu" class="py-4 px-2">
      <h3 class="text-center text-md-left">Thực đơn của chúng tôi
        <small class="font-16">
          <router-link to="/menu">Xem thêm</router-link>
        </small></h3>
      <b-container class="pt-4 m-auto">
        <b-row>
          <b-col cols="12" col md="6" lg="4"
            v-bind:key="food.id" v-for="food in foods"
          >
            <b-card
              v-bind:title="food.title"
              v-bind:img-src="food.image_url"
              img-alt="Image"
              img-top
              tag="article"
              style="max-width: 20rem;"
              class="mb-2">
<!--              <b-card-text>{{ food.title }}</b-card-text>-->
              <b-button v-bind:to="`/food/${food.id}`" href="#" variant="dark">{{ food.price|formatBill }} VND</b-button>
            </b-card>

          </b-col>
        </b-row>
      </b-container>
    </b-container>
    <hr>
    <b-container id="story" class="py-4 px-2">
      <h3 class="text-center text-md-left pb-4">
        Hương vị Tây Bắc
      </h3>
      <b-container class="videoWrapper">
        <iframe width="967" height="544" src="https://www.youtube.com/embed/ks0mOYXeMJk"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>

        </iframe>
      </b-container>
    </b-container>

    <div id="contact">
      <b-form>

      </b-form>
    </div>
  </div>

</template>

<script>
import Banner from "../components/widgets/Banner";
import Navigation from "../components/widgets/Navigation";
import BottomNavigation from "../components/widgets/BottomNavigation";
import {db, foodCollection} from "../model/db";
import Food from "../model/food";

export default {
  name: "HomePage",
  props: [],
  data: function () {
    return {
      foods: []
    }
  },
  components: {
    'banner': Banner,
    'navigation': Navigation,
    'bottom-navigation': BottomNavigation,
  },
  methods: {},
  created() {
    foodCollection.limit(3).get().then(snapshots => {
      this.foods = snapshots.docs.map(snapshot => {
        let food = new Food()
        food.id = snapshot.id
        food.price = snapshot.data().price
        food.title = snapshot.data().title
        food.image_url = snapshot.data().image_url
        return food
      })
    });
  }
}
</script>

<style scoped>

</style>

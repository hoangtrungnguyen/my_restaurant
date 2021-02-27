<template>
  <div class="container-fluid m-0 p-0">
      <banner/>
      <b-container id="menu" class="py-4 px-2">
        <h3 class="text-center text-md-left">Thực đơn của chúng tôi
        <small class="font-16"><router-link to="/menu">Xem thêm</router-link></small></h3>
        <b-container class="pt-4 m-auto">
          <b-row>
            <b-col cols="12" col md="6" lg="4">
              <b-card
                title="Xôi Gà (Lớn)"
                img-src="https://picsum.photos/600/300/?image=25"
                img-alt="Image"
                img-top
                tag="article"
                style="max-width: 20rem;"
                class="mb-2">
                <b-card-text>Xôi gà</b-card-text>
                <b-button href="#" variant="primary">45.000 VND</b-button>
              </b-card>

            </b-col>
            <b-col cols="12" col md="6" lg="4">
              <b-card
                title="Sốt vang (Lớn)"
                img-src="https://picsum.photos/600/300/?image=25"
                img-alt="Image"
                img-top
                tag="article"
                style="max-width: 20rem;"
                class="mb-2">
                <b-card-text>Sốt vang</b-card-text>
                <b-button href="#" variant="primary">50.000 VND</b-button>
              </b-card>
            </b-col>
            <b-col cols="12" col md="6" lg="4">
              <b-card
                title="Thịt bò (Lớn)"
                img-src="https://picsum.photos/600/300/?image=25"
                img-alt="Image"
                img-top
                tag="article"
                style="max-width: 20rem;"
                >
                <b-card-text>Thịt bò</b-card-text>
                <b-button href="#" variant="primary">60.000 VND</b-button>
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
        <b-container  class="videoWrapper">
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
export default {
  name: "HomePage",
  props: [],
  data: function () {
    return {
      foods:[]
    }
  },
  components: {
    'banner': Banner,
    'navigation': Navigation,
    'bottom-navigation': BottomNavigation,
  },
  methods:{
  }
}
</script>

<style scoped>

</style>

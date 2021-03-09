<template>
  <main class="text-left">
    <div id="blog-banner" class="parallax">
      <b-container fluid class="head-banner">
        <p class="text-muted">Blog</p>
        <h4 class="text-center text-white">{{ blog.title }}</h4>
      </b-container>
    </div>
    <b-container class="py-4">
      <b-card>
        <p>{{ blog.summary }}</p>
        <hr>
        <div class="text-center">
          <b-img-lazy class="w-100" style="max-height:600px; max-width:900px; object-fit: cover"
                      v-bind:src="blog.image_url"></b-img-lazy>
        </div>

        <div class="pt-3" v-html="blog.content"></div>

        <hr>
        <div class="text-center">
          <p>Chia sẻ:</p>
          <v-flex align-self-center>
            <a class="px-3">
              <b-icon-facebook scale="1.5"/>
            </a>
            <a class="px-3">
              <b-icon-share class="text-info" scale="1.5"/>
            </a>
            <a class="px-3" >
              <b-icon-youtube class="text-danger" scale="1.5"/>
            </a>
          </v-flex>
        </div>
      </b-card>
    </b-container>
  </main>
</template>

<script>
import {blogCollection} from "../model/db";
import {Blog} from "../model/blog";

export default {
  name: "BlogSinglePage",
  data: function () {
    return {
      blog: new Blog()
    }
  },
  created() {
    blogCollection.doc(this.$route.params.id).get().then(snapshot => {
      this.blog = snapshot.data(Blog)
      this.blog.id = snapshot.id

    })
  }
}
</script>

<style scoped>

</style>

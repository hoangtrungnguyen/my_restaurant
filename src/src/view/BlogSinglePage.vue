<template>
  <main class="text-left">
    <div id="blog-banner" class="parallax">
      <b-container fluid class="head-banner">
        <h2>Blog</h2>
        <p>{{ blog.title }}</p>
      </b-container>
    </div>
    <b-container class="py-4">
      <b-card>
        <h5>{{ blog.summary }}</h5>
        <hr>
        <div class="text-center">
          <b-img-lazy class="w-100" style="max-height:600px; max-width:900px; object-fit: cover"
                      v-bind:src="blog.image_url"></b-img-lazy>
        </div>

        <div class="pt-3" v-html="blog.content"></div>
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

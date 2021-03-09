<template>
  <div id="blog">
    <main class="text-left">
      <div id="blog-banner" class="parallax">
        <b-container fluid class="head-banner">
          <h2>Blog</h2>
          <br>
          <p></p>
        </b-container>
      </div>
      <b-container fluid class="py-4">
        <b-row>
          <b-col cols="12" md="3">
            <b-card>
              <h4>Chuyên mục</h4>
              <b-card-body>
                <a>Dinh dưỡng</a>
              </b-card-body>
            </b-card>
          </b-col>
          <b-col cols="12" md="9">
            <b-row class="pt-2 pt-md-0">
              <b-col class="pb-2 pb-lg-0" v-bind:key="blog.title" v-for="blog in blogs" cols="12" md="6" lg="4">
<!--                img-src="https://images.unsplash.com/photo-1601625618547-bb78b496298e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"-->
                <b-card
                  v-bind:img-src="blog.image_url"
                  img-alt="Image"
                  img-width="250"
                  img-top
                  img-height="200"
                  tag="article"
                  style="max-width: 20rem;"
                  class="mb-2">
                  <h4><router-link v-bind:to="'/blog/'+blog.id">{{blog.title}} </router-link></h4>
                  <p><small>{{blog.summary ? blog.summary : '...'}}</small></p>
                  <p>{{blog.time_created | formatTimeCreated }}</p>
                </b-card>
              </b-col>
            </b-row>

          </b-col>

        </b-row>


      </b-container>
    </main>
  </div>
</template>

<script>
import {blogCollection} from "../model/db";
import {Blog} from "../model/blog";

export default {
  name: "BlogPage",
  data: function () {
    return {
      blogs: []
    }
  },
  created() {
    blogCollection.get().then(snapshots => {
      this.blogs = snapshots.docs.map(snapshot =>{
        let blog = snapshot.data(Blog)
        blog.id = snapshot.id
        return blog
      })
    })
  }
}
</script>

<style scoped>

</style>

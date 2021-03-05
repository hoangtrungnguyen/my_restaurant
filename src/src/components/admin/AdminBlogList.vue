<template>
  <b-card>
    <b-table class="font-14" hover :items="blogs" :fields="fields">
      <template #cell(index)="data">
        {{ data.index + 1 }}
      </template>
      <template #cell(image_url)="data">
        <b-img-lazy height="100" width="100" v-bind:src="data.item.image_url"/>
      </template>
      <template #cell(view)="data">
        <router-link exact v-bind:to="'/admin/blog/'+data.item.id">Xem</router-link>
      </template>
    </b-table>
  </b-card>
</template>

<script>
import {blogCollection} from "../../model/db";
import {Blog} from "../../model/blog";

export default {
  name: "AdminBlogList",
  data: function () {
    return {
      blogs: [],
      fields: [
        {
          key: "image_url",
          label: "Ảnh bìa"
        },
        {
          key: "title",
          label: "Tiêu đề"
        },
        {
          key: "summary",
          label: "Tóm tắt"
        },
        {
          key:"view",
          label: ''
        }

      ]
    }
  },
  created() {
    blogCollection.get().then(snapshots => {
      this.blogs = snapshots.docs.map(snapshot => {
        let blog =  snapshot.data(Blog)
        blog.id = snapshot.id
        return blog
      })
    })
  }
}
</script>

<style scoped>

</style>

<template>
  <div>
    <h2>Blog > Chỉnh sửa </h2>
    <admin-blog-editor v-bind:blogId="id"></admin-blog-editor>
    <b-card class="mt-3">
      <div class="pb-1">
        <span class="text-danger">Nhập id blog để xóa: </span>
        <b-input v-model="deleteCode" class="w-25"/>
      </div>
      <b-btn variant="outline-danger" v-on:click.prevent="deleteBlog">
        Xóa blog
      </b-btn>
    </b-card>
  </div>
</template>

<script>
import AdminBlogEditor from "./AdminBlogEditor";
import {blogCollection} from "../../model/db";

export default {
  name: "AdminBlogView",
  data: function () {
    return {
      id: this.$route.params.id,
      deleteCode: '',
    }
  },
  components:
    {'admin-blog-editor': AdminBlogEditor},
  methods: {
    deleteBlog: function () {
      if (this.deleteCode !== this.id) {
        this.$bvToast.toast("Từ chối",{
           title: null,
            variant: 'danger'
        })
        return
      }
      blogCollection.doc(this.id).delete().then(result => {
        this.$router.back()
      })
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <div>
    <h2>Blog > Tạo </h2>
    <admin-blog-editor></admin-blog-editor>
  </div>
</template>

<script>

import AdminBlogEditor from "./AdminBlogEditor";

export default {
  name: "AdminBlogCreate",
  components:
    {'admin-blog-editor': AdminBlogEditor}

}
</script>

<style scoped>

</style>

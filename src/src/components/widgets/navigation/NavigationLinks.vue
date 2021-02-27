<template>
  <b-navbar-nav class="m-auto">
    <b-nav-item>
      <router-link to="/" exact :class="textWhite? 'text-white' :''">Trang chủ</router-link>
    </b-nav-item>
    <b-nav-item>
      <router-link to="/menu" exact :class="textWhite? 'text-white' :''">Thực đơn</router-link>
    </b-nav-item>
    <b-nav-item>
      <router-link to="/blog" exact :class="textWhite? 'text-white' :''">Blog</router-link>
    </b-nav-item>
    <b-nav-item>
      <router-link to="/contact" exact :class="textWhite? 'text-white' :''">Liên hệ</router-link>
    </b-nav-item>
  </b-navbar-nav>
</template>

<script>
export default {
  name: "Menu",
  props: ['textWhite'],
}
</script>

<style scoped>

</style>

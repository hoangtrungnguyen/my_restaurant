<template>
  <main>
    <div id="blog-banner" class="parallax">
      <b-container fluid class="head-banner">
        <h2>Đặt hàng thành công</h2>
      </b-container>
    </div>
    <b-container class="py-4">
      <h4>Chúng tôi sẽ liên hệ bạn trong chốc lát</h4>
      <p>Mã đơn hàng của bạn: {{this.$route.params.id}}</p>
      <router-link class='btn btn-dark' to="/">Trở về trang chủ</router-link>
    </b-container>
  </main>
</template>

<script>
export default {
  name: "CheckoutOkPage"
}
</script>

<style scoped>

</style>

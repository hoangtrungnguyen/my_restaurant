<template>
  <div class="text-left">
    <h2>Tổng quan</h2>
    <b-container fluid="true">
      <b-card>
        <p>Danh sách đơn mới</p>
        <p>Danh sách số lượng sản phẩm còn lại</p>
        <p>Doanh thu</p>
        <p>Chi phí</p>
        <p>Lượt truy cập trang</p>
      </b-card>
      <b-card>
        <h4>Đơn hàng mới:</h4>
      </b-card>
      <b-card>
        <h4>Số lượng sản phẩm còn lại:</h4>
      </b-card>
    </b-container>
  </div>

</template>

<script>
export default {
name: "AdminOverview"
}
</script>

<style scoped>
.card{
  margin-bottom: 1em;
}
</style>

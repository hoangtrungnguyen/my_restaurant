<template>
  <div id="bottom-navigation">
    <footer class="text-light">
      <div class="col">
        <div class="row justify-content-center">
          <div class="col-lg-3 justify-content-center pb-sm-4 pb-3">
            <h1 class="text-center">LOGO</h1>
          </div>
          <div class="col-lg-3 col-sm-4">
            <h3>About</h3>
            <p><a>Về chúng tôi</a></p>
            <p><a>Địa chỉ</a></p>
            <p>Sản phẩm</p>
          </div>
          <div class="col-lg-3 col-sm-4">
            <h3 class="">Social</h3>
            <p><a class="fa fa-facebook" href="#" style="color:light-blue"> Facebook</a></p>
            <p><a class="fa fa-youtube" href="#" style="color:red"> Youtube</a></p>
            <p><a class="fa fa-tiktok" href="#"></a></p>
          </div>
          <div class="col-lg-3 col-sm-4">
            <h3>Service</h3>
            <p>Giao hàng</p>
            <p>Thanh toán</p>
          </div>
        </div>
        <div class="container pt-4 text-center">
          <p>© 2021 Company, Inc. ·<a class="text-light" href="#">Privacy</a> ·<a
            class="text-light" href="#">Terms</a></p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "bottom-navigation"
}
</script>

<style scoped>
footer .row p {
  font-size: 14px;
  text-align: left;
}

footer .row p {
  font-size: 14px;
  text-align: left;
}
footer h3 {
  text-align: start;
}
</style>

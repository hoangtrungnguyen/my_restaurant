<template>
  <main>

    <div id="blog-banner" class="parallax">
      <b-container fluid class="head-banner">
        <h2>Thanh toán</h2>
        <br>
        <p></p>
      </b-container>
    </div>

    <b-container class="m-auto py-4">
<!--      <h2><span class="text-muted">Giỏ hàng</span> > <span>Thanh toán</span><span-->
<!--        class="text-muted"> > Hoàn thành</span></h2>-->
      <b-row class="py-4">
        <div class="col-12 col-lg-6">
          <b-card class="text-left">
            <h4 >Thông tin liên hệ</h4>
            <hr>
            <b-card-body style="padding: 0">
              <form id="info">
                <label for="fullName">Họ và tên *</label>
                <input required type="text" id="fullName" name="fullName">
                <label for="phone">Số điện thoại *</label>
                <input required type="text" id="phone" name="phone">
                <label for="email">Địa chỉ email (tùy chọn)</label>
                <input type="email" id="email" name="email">
<!--                <label for="city">Thành phố</label>-->
<!--                <input required type="text" id="city" name="city">-->
                <label for="province">Quận/Huyện *</label>
                <input required type="text" id="province" name="province">
                <label for="unit">Xã/Phường *</label>
                <input required type="text" id="unit" name="unit">
                <label for="homeNumber">Đỉa chỉ *</label>
                <input required type="text" id="homeNumber" name="homeNumber">
              </form>
            </b-card-body>
          </b-card>

            <b-card class="my-4 text-left">
              <h4>Lưu ý chung:</h4>
              <p>Giúp giao hàng thuận tiện hơn</p>
              <hr>
              <b-card-body class="mx-0 px-0">

                <textarea v-model="note" rows="5" id="note" class="form-control"
                          placeholder="VD: Không thìa, không được để xe ngoài đường, mang nước xát khuẩn, v..v..">
              </textarea>
              </b-card-body>
            </b-card>
        </div>
        <div class="col-12 col-lg-6 text-left">
          <b-card style="border: 2px solid black">
            <h4 class="text-left">Đơn hàng của bạn</h4>
            <hr>
            <b-card-body class="px-0">
              <h5>Sản phẩm</h5>
              <b-row v-bind:key="order.orderId" v-for="order in final_order.orders" class="px-3 justify-content-between">
                <p class="font-14">{{ order.name }} <span class="font-weight-bold">x{{order.count}}</span></p>
                <p class="font-14 font-weight-bold">{{ order.price * order.count|formatBill}}</p>
              </b-row>
              <b-row class="px-3 justify-content-between">
                <p class="font-14">Giao hàng</p>
                <p class="font-14 font-weight-bold">{{ shippingFee|formatBill}}</p>
              </b-row>
              <hr>
              <b-row class="px-3 pb-0 justify-content-between">
                <h6>Tổng <small>vnđ</small></h6>
                <p class="font-14 font-weight-bold">{{ totalBill()|formatBill}}</p>
              </b-row>
              <hr style="border: 1px solid gray" class="mt-0">
              <p class="font-16">Phương thức thanh toán</p>
              <form class="font-14 pt-0 m-0"  id="radio">
                <label>Tiền mặt</label>
                <input type="radio" value="CASH" checked v-model="final_order.bill_method"/><br>
                <label>Chuyển khoản</label>
                <input type="radio" value="TRANSFER" v-model="final_order.bill_method"/><br>
                <label>Ví điện tử</label>
                <input type="radio" value="EWALLET" v-model="final_order.bill_method"/>
              </form>
              <hr>
              <b-container class="font-16" v-if="final_order.bill_method === 'TRANSFER'">
                <p>- Vietcombank: 14****** - HOANG TRUNG NGUYEN</p>
                <p>Vui lòng ghi rõ Mã đơn hàng + Số điện thoại khi chuyển khoản.
                  Nếu cần hỗ trợ hãy liên hệ fanpage: https://www.facebook.com/tiemcomtaybac
                  hoặc số điện thoại: 0962485001</p>
              </b-container>
              <b-container  class="font-16 justify-content-center" v-if="final_order.bill_method === 'EWALLET'">
                <img src="../assets/momo.jpg" height="500" width="500" >
                <p>Vui lòng ghi rõ Mã đơn hàng + Số điện thoại khi chuyển khoản.
                  Nếu cần hỗ trợ hãy liên hệ fanpage: https://www.facebook.com/tiemcomtaybac
                  hoặc số điện thoại: 0962485001</p>

              </b-container>
              <hr v-if="final_order.bill_method !== 'CASH'">
              <button class="btn btn-outline-danger w-100">Đặt hàng</button>


            </b-card-body>
          </b-card>
        </div>
      </b-row>
    </b-container>


  </main>
</template>

<script>
export default {
  name: "CheckoutPage",
  props:{
    final_order: {type: Object}
  },
  data: function (){
    return {
      note:"",
      shippingFee: 15000,
      province:[]

    }
  },
  methods:{
    totalBill:function (){
      let bill = 0

      for(let i=0;i < this.final_order.orders.length; i++){
        const order = this.final_order.orders[i]
        bill += (parseInt(order.price) * parseInt(order.count))
      }
      return bill + this.shippingFee
    }
  }
}
</script>

<style scoped>
label{
  padding-top: 10px;
  font-weight: 400;
}
#radio label{
  padding: 0;
}
#info input{
  width: 100%;
}


</style>

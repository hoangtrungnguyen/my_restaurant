<template>
  <b-card>
    <h3>Chi tiết đơn hàng <small class="font-20">(Trạng thái: {{ submitted_order.status |statusFormat }})</small></h3>
    <b-card-body class="p-0 pt-3">
      <b-row v-bind:key="order.orderId" v-for="order in submitted_order.orders"
             class="px-3 justify-content-between">
        <p class="font-14">{{ order.name }}
          <span>({{order.size | sizeFormat}})</span>
          <span class="font-weight-bold">x{{ order.count }}</span>
        </p>
        <p class="font-14 font-weight-bold">{{ order.price * order.count|formatBill }}</p>
      </b-row>
      <b-row class="px-3 justify-content-between">
        <p class="font-14">Phương thức thanh toán</p>
        <p class="font-14 font-weight-bold">{{ submitted_order.bill_method|billMethod }}</p>
      </b-row>
      <b-row class="px-3 justify-content-between">
        <p class="font-14">Giao hàng</p>
        <p class="font-14 font-weight-bold">{{ submitted_order.shipping|formatBill }}</p>
      </b-row>
      <hr>
      <b-row class="px-3 pb-0 justify-content-between">
        <h6>Tổng <small>vnđ</small></h6>
        <p class="font-14 font-weight-bold">{{ totalBill(submitted_order)|formatBill }}</p>
      </b-row>
    </b-card-body>
    <h3>Địa chỉ thanh toán</h3>
    <p>Thời gian đặt: {{ submitted_order.time_created | formatTimeCreated}}</p>
    <p>Tên người đặt: {{submitted_order.full_name}}</p>
    <p>Điện thoại: {{submitted_order.phone}}</p>
    <p>Email: {{submitted_order.email}}</p>
    <p>{{submitted_order.address.join(', ')}}</p>
  </b-card>
</template>

<script>
import {orderCollection} from "../../model/db";
import {SubmitForm, totalBill} from "../../model/order";

export default {
  name: "ViewSubmittedOrder",
  data: function () {
    return {
      'submitted_order': {
      },
    }
  },
  methods:{
    totalBill: function (submitted_order){
      return totalBill(submitted_order)
    }
  },
  computed:{
  },
  created() {
    orderCollection.doc(this.$route.params.id).get().then(snapshot => {
      console.log(snapshot.data(SubmitForm))
      this.submitted_order = snapshot.data(SubmitForm)
      return this.submitted_order
    })
  }
}
</script>

<style scoped>

</style>

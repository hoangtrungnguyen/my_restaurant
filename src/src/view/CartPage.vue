<template>
  <main>
    <div id="blog-banner" class="parallax">
      <b-container fluid class="head-banner">
        <h2>Giỏ hàng</h2>
        <br>
        <p></p>
      </b-container>
    </div>
    <b-container v-if="orders.length < 1" fluid class="m-auto py-4">
      <h4 class="align-self-center">Hãy thêm một số món hàng</h4>
      <router-link to="/menu" class="btn btn-outline-dark w-25 align-self-center">Tiếp tục mua
      </router-link>
    </b-container>

    <b-container v-if="orders.length >= 1" class="py-4">
      <b-row>
        <b-col cols="12" lg="8">
          <b-container fluid class="inbox">
            <b-container class="ibox-title d-flex justify-content-between">
              <h4 class="d-inline-block">Số lượng đơn hàng</h4>
              <span class="pull-right">(<strong id="count">{{ this.$parent.$data.count }}</strong>)đơn</span>
            </b-container>
            <cart-item :removeAnOrder="removeAnOrder" :updateCount="updateCount"
                       v-bind:key="order.orderId" v-bind:order="order" v-for="order in orders"/>

          </b-container>
        </b-col>
        <b-col cols="12" lg="4" class="pt-4 pt-md-0">
          <!--          .card-->
          <!--          h5.card-header Tóm tắt đơn hàng-->
          <!--          .card-body-->
          <!--          h6.card-subtitle Thành tiền:-->
          <!--          p#total-order-bill.pl-3.card-text= formatBill(totalPrice) + " VND"-->
          <!--          h6.card-subtitle Thời gian vận chuyển:-->
          <!--          p.pl-3.card-text 22:00 phút-->
          <!--          small (dự kiến)-->
          <b-container fluid class="text-left py-4">
            <b-card>
              <h4>
                Tóm tắt đơn hàng:
              </h4>
              <hr>
              <b-card-body>
                <b-row class="justify-content-between">
                  <b-col>
                    <h6>Đồ ăn</h6>
                  </b-col>
                  <p>{{ totalPrice - shippingFee | formatBill }} VND</p>
                </b-row>
                <b-row class="justify-content-between">
                  <b-col>
                    <h6>Giao hàng</h6>
                    <small>Thời gian vận chuyển: ~15 phút</small>
                  </b-col>
                  <p>{{ shippingFee | formatBill }} VND</p>
                </b-row>
                <hr>
                <b-row class="justify-content-between">
                  <h5>Thành tiền:</h5>
                  <p>{{ totalPrice | formatBill }} VND </p>
                </b-row>
                <div v-on:click="checkOut" class="btn btn-outline-danger w-100">
                  Tiến hành thanh toán
                </div>
              </b-card-body>

            </b-card>
          </b-container>
        </b-col>
      </b-row>

    </b-container>


  </main>
</template>

<script>
import {db} from "../model/db"
import Food from "../model/food";
import CartItem from "../components/widgets/CartItem";


/***
 * order format
 orders:
 //  [
 //      {
//          foodId: 111
//          count: 1,
//          note: "",
//          orderId: orderId,
//          name: "name",
//          price: '10000'
//          size: 1, // 1 - 2 - 3
//          toppings: [
//                  {
//                      topping_id: 'ID',
//                      topping_name: 'name',
//                      topping_price: '100000'
//                  },
//                  ...
//              ]
//        },
 //      ....
 //  ]
 * ***/

export default {
  name: "CartPage",
  props: {
    updateCount: {type: Function},
    final_order: {type: Object}
  },
  components: {
    "cart-item": CartItem
  },
  data: function () {
    return {
      orders: [],
      shippingFee: 15000,
      note: ""
    }
  },
  methods: {
    removeAnOrder: function (order) {
      let cart = this.$session.get('cart')
      if (cart.hasOwnProperty(order.orderId)) {
        delete cart[order.orderId]
        this.$session.set('cart', cart)
        for (let i = 0; i < this.orders.length; i++) {
          if (this.orders[i].orderId === order.orderId) {
            this.orders.splice(i, 1);
            break;
          }
        }
        // this.$router.go()
        this.updateCount()
      }
    },
    checkOut: function(){
      this.final_order.orders = this.orders
      this.$router.push("checkout")
    }
  },
  created() {
    const cart = this.$session.get('cart')
    let items = []
    for (const pro in cart) {
      if (cart.hasOwnProperty(pro)) {
        items.push(cart[pro])
      }
    }
    this.orders = items
  }, computed: {
    totalPrice: function () {
      let totalPrice = 0;
      try {
        this.orders.forEach(order => {
          totalPrice += order.price * order.count
        })
      } catch (e) {
        console.error(e)
      }
      return totalPrice + this.shippingFee
    }
  }
}
</script>

<style scoped>
body {

  background: #eee;
}

h3 {
  font-size: 16px;
}

.text-navy {
  color: #1ab394;
}

.cart-product-imitation {
  text-align: center;
  height: 80px;
  width: 80px;
  background-color: #f8f8f9;
}

.product-imitation.xl {
  padding: 120px 0;
}

.product-desc {
  padding: 20px;
  position: relative;
}

.ecommerce .tag-list {
  padding: 0;
}

.ecommerce .fa-star {
  color: #d1dade;
}

.ecommerce .fa-star.active {
  color: #f8ac59;
}

.ecommerce .note-editor {
  border: 1px solid #e7eaec;
}

table.shoping-cart-table {
  margin-bottom: 0;
}

table.shoping-cart-table tr td {
  border: none;
  text-align: right;
}

table.shoping-cart-table tr td.desc,
table.shoping-cart-table tr td:first-child {
  text-align: left;
}

table.shoping-cart-table tr td:last-child {
  width: 80px;
}

.ibox {
  clear: both;
  margin-bottom: 25px;
  margin-top: 0;
  padding: 0;
}

.ibox.collapsed .ibox-content {
  display: none;
}

.ibox:after,
.ibox:before {
  display: table;
}

.ibox-title {
  -moz-border-bottom-colors: none;
  -moz-border-left-colors: none;
  -moz-border-right-colors: none;
  -moz-border-top-colors: none;
  background-color: #ffffff;
  border-color: #e7eaec;
  border-image: none;
  border-style: solid solid none;
  border-width: 3px 0 0;
  color: inherit;
  margin-bottom: 0;
  padding: 14px 15px 7px;
  min-height: 48px;
}

.ibox-content {
  background-color: #ffffff;
  color: inherit;
  padding: 15px 20px 20px 20px;
  border-color: #e7eaec;
  border-image: none;
  border-style: solid solid none;
  border-width: 1px 0;
}

.ibox-footer {
  color: inherit;
  border-top: 1px solid #e7eaec;
  font-size: 90%;
  background: #ffffff;
  padding: 10px 15px;
}

.head-banner {
  width: 100%;
  padding: 10vh 0;
}

@media (min-width: 992px) {
  .head-banner {
    width: 100%;
    padding: 15vh 0;
  }
}

</style>

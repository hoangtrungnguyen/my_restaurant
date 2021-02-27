<template>
  <div class="ibox-content">
    <div class="table-responsive">
      <table class="table shoping-cart-table">
        <tbody>
        <tr>
          <td width="90">
            <img v-bind:src="order.food.image_url" width="80" height="80" alt="">
          </td>
          <td class="desc" width="200">
            <h3>
              <router-link v-bind:to="`food/${order.food.id}`" class="text-navy">{{
                  order.food.title
                }}
                <span><small>({{ order.size | sizeFormat }})</small></span>
              </router-link>
            </h3>
            <b-btn class="btn-sm order-note text-white font-10">
              {{ order.note && order.note.length > 0 ? "Sửa ghi chú" : "Thêm ghi chú" }}
            </b-btn>
            <p class="mb-1">
              <small class="note font-12">{{ order.note }}</small>
            </p>
            <div v-if="order.note.length > 0">
              <hr class="m-1 mt-0" style="background-color:gray">
            </div>
            <div v-if="order.toppings.length > 0">
              <p class="font-14 m-0" style="line-height: 1.5">Đồ ăn kèm</p>
              <p class="font-12 m-0 text-muted" style="line-height: 1.5"
                 v-for="topping in order.toppings">
                {{ topping.name }}: {{ topping.price|formatBill }}VND
              </p>

            </div>
          </td>
          <td width="100">
            <input class="form-control food-quantity" type="number" min="1"
                   v-model="order.count"
                   v-on:change="setOrderCount(order.count)"
                   style="min-width: 50px; padding-right:0;"/>
          </td>

          <td>
            <h5 class="font-20">{{ billPerItem * order.count | formatBill }}VND</h5>
            <p class="font-12 text-navy"> {{ billPerItem | formatBill }}VND/suất</p>
          </td>
          <td>
            <b-btn v-on:click="deleteOrder(order)" class="btn-outline-danger remove-item text-danger" style="background-color: white">Xóa</b-btn>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import addToCartMixin from "../../mixin/addToCartMixin";

export default {
  name: "CartItem",
  props: {
    "order": {type: Object},
    "cart": {type: Array},
    updateCount: {type: Function},
    removeAnOrder: {type: Function},
  },
  methods: {
    setOrderCount: function (count) {
      let cart = this.$session.get('cart')
      if (cart[this.order.orderId]) {
        cart[this.order.orderId].count = count
        this.$session.set('cart', cart)
      }
      this.updateCount()
    },
    deleteOrder: function(order){
      this.removeAnOrder(order)
    }
  },
  mixins: [
    addToCartMixin
  ],
  computed: {
    billPerItem: function () {
      return this.order.price
    }
  },
  filters: {
    sizeFormat: function (size) {
      switch (size) {
        case 1:
          return "Nhỏ";
        case 2:
          return "Vừa";
        case 3:
          return "Lớn";
      }
      return "NaN"
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

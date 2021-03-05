<template>
  <div class="text-left">
    <h3>Đơn hàng > Chi tiết</h3>
    <submitted-order-details :key="orderDetailKey" v-ref:details>

    </submitted-order-details>
    <b-card class="mt-3">
      <h4>Cập nhật đơn hàng</h4>
      <p>Id: {{ $route.params.id }}</p>
      <form action="">
        <label class="w-100">Trạng thái *<br>
          <select name="status" id="" v-model="updatedInfo.status">
            <option v-bind:key="item" v-bind:value="item" v-for="item in status">
              {{ item |statusFormat }}
            </option>
          </select>
        </label>

        <b-button variant="btn-danger" v-on:click.prevent="updateOrder" class="btn-outline-danger">
          Cập nhật
        </b-button>
        <b-button variant="btn-danger" v-on:click.prevent="updateOrder('STAY')"
                  class="btn-outline-danger">Cập nhật và ở lại trang
        </b-button>
        <hr>
        <label for="">Nhập id đơn hàng để xóa:
          <input v-model="deleteCode" class="w-100" placeholder="id đơn hàng" type="text">
        </label>
        <div>
          <b-button @click="deleteOrder" variant="danger">Xóa đơn hàng</b-button>
        </div>
      </form>
    </b-card>

  </div>
</template>

<script>
import ViewSubmittedOrder from "../account/ViewSubmittedOrder";
import {status} from "../../model/food";
import {orderCollection} from "../../model/db";

export default {
  name: "AdminOrderDetail",
  data: function () {
    return {
      status: status,
      orderDetailKey: 0,
      updatedInfo: {
        // status: status[0]
      },
      deleteCode:''
    }
  },
  methods: {
    updateOrder: function (action) {
      orderCollection.doc(this.$route.params.id).update({
        status: this.updatedInfo.status
      }).then(result => {
        if (action === 'STAY') {
          this.orderDetailKey += 1
        } else {
          this.$router.go(-1)
        }

      })
    },
    deleteOrder: function(){
      if(this.deleteCode !== this.$route.params.id){
        alert("từ chối")
        return
      }

      orderCollection.doc(this.$route.params.id).delete().then(ok=>{
        this.$router.back()
      })
    }
  },
  components: {
    'submitted-order-details': ViewSubmittedOrder
  }
}
</script>

<style scoped>
label {
  font-weight: 600;
}

</style>

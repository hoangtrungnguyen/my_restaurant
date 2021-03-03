<template>
  <b-card>
    <h3>Danh sách đơn hàng</h3>
    <b-card-body class="p-0 pt-3">
      <div v-if="submitted_forms.length> 0">
        <!--        <div v-bind:key="order.id" v-for="order in submitted_forms">-->
        <!--          <p>Mã đơn hàng: <router-link v-bind:to="'/account/order/'+order.id">{{ order.id }}</router-link></p>-->
        <!--          <p>Trạng thái: <span>{{ order.status }}</span></p>-->
        <!--          <hr>-->
        <!--        </div>-->
        <b-table small class="font-14" hover :items="submitted_forms" :fields="fields">
          <template #cell(index)="data">
            {{ data.index + 1 }}
          </template>

          <template #cell(time_created)="data">
            {{
              data.item.time_created| formatTimeCreated
            }}
          </template>

          <template #cell(address)="data">
            {{ data.item.address.join(', ') }}
          </template>
          <template #cell(phone)="data">
            {{ data.item.phone }}
          </template>
          <template #cell(status)="data">
            {{ data.item.status |statusFormat }}
          </template>

          <template #cell(bill)="data">
            <p>{{ totalBill(data.item)|formatBill }}<small>(vnđ)</small></p>
          </template>
          <template #cell(view)="data">
            <router-link v-bind:to="'/account/order/'+data.item.id">Xem</router-link>
          </template>

        </b-table>
      </div>
      <div v-if="submitted_forms.length<=0">
        <p>Chưa có đơn hàng nào</p>
        <router-link to="/menu" class="btn btn-dark">Đặt hàng ngay</router-link>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
import {auth, db, orderCollection} from "../../model/db";
import {Order, SubmitForm, totalBill} from "../../model/order";

export default {
  name: "OrderProfile",
  data: function () {
    return {
      submitted_forms: [],
      fields: [
        {
          key: 'index',
          label: "STT"
        },
        {
          key: 'full_name',
          label: "Họ và tên"
        }, {
          key: 'time_created',
          label: "Thời gian tạo"
        }, {
          key: 'address',
          label: 'Địa chỉ'
        },
        {
          key: 'phone',
          label: 'SĐT'
        },
        {
          key: 'status',
          label: 'Trạng thái'
        },
        {
          key: 'bill',
          label: 'Tổng tiền'
        },
        {
          key: "view",
          label: ""
        }
      ]
    }
  },
  methods: {
    totalBill: function (submittedForm) {
      return totalBill(submittedForm)
    }
  },
  created() {
    orderCollection.where('uid', "==", auth.currentUser.uid).get().then(snapshots => {
      this.submitted_forms = snapshots.docs.map(snapshot => {
        console.log(snapshot.data(SubmitForm))
        // let submitForm = new SubmitForm()
        let submitForm = snapshot.data(SubmitForm)
        submitForm.id = snapshot.id

        return submitForm
      })
    })
  }
}
</script>

<style scoped>

</style>

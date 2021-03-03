<template>
  <div class="text-left">
    <h3>Đơn hàng</h3>
    <b-container fluid="true">
      <b-card>
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
                data.item.time_created | formatTimeCreated
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
              <router-link v-bind:to="'/admin/order/'+data.item.id">Xem</router-link>
            </template>

          </b-table>
        </div>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import {auth, orderCollection} from "../../model/db";
import {SubmitForm, totalBill} from "../../model/order";

export default {
  name: "AdminOrder",
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
  methods:{
    totalBill:totalBill
  },
  created() {
    orderCollection.get().then(snapshots => {
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

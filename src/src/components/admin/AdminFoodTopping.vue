<template>
  <div>
    <h2>Danh sách > Topping</h2>
    <b-card>
      <b-card-title>
        Danh sách đồ ăn kèm (toppings)
      </b-card-title>
      <b-card-body>
        <b-table small hover :items="topping" :fields="fields">
          <template #cell(price)="data">
            {{ data.item.price | formatBill }}
          </template>

          <template #cell(delete)="data">
            <b-btn v-on:click.prevent="deleteTopping(data.item.id)" variant="danger">Xóa</b-btn>
          </template>
          <template #cell(update)="data">
            <b-btn @click="changeMode(data.item)" variant="primary">Sửa</b-btn>
          </template>
        </b-table>
      </b-card-body>

    </b-card>
    <b-card class="mt-1">
      <b-card-title>
        {{ !isModified ? "Tạo đồ ăn kèm (topping)" : "Cập nhật" }}
      </b-card-title>

      <b-card-body>
        <b-form>
          <label class="w-100">Tên *
            <br>
            <b-input required placeholder="Vd: Canh cà chua" class="w-100 " type="text"
                     v-model="topping_form_data.name"/>
          </label>
          <label class="w-100">Giá *
            <br>
            <b-input required placeholder="10.000 vnđ" class="w-100 " type="number"
                     v-model="topping_form_data.price"/>
          </label>
          <label class="w-100">Số lượng còn lại *
            <br>
            <b-input required placeholder="Vd: 10" class="w-100 " type="number"
                     v-model="topping_form_data.remains"/>
          </label>
          <label class="w-100">Mô tả *
            <br>
            <b-input required placeholder="Vd: Canh cà chua" class="w-100 " type="text"
                     v-model="topping_form_data.description"/>
          </label>

          <b-btn v-if="!isModified" v-on:click.prevent="createTopping" variant="dark">Tạo</b-btn>
          <div v-if="isModified">
            <b-btn v-on:click.prevent="updateTopping" variant="dark">Cập nhật</b-btn>
            <b-btn @click.prevent="isModified = false" variant="outline-dark">Hủy cập nhật</b-btn>
          </div>

        </b-form>
      </b-card-body>

    </b-card>
  </div>
</template>

<script>
import {toppingCollection} from "../../model/db";
import Food, {Topping} from "../../model/food";

export default {
  name: "AdminFoodTopping",
  data: function () {
    return {
      topping: [],
      topping_form_data: {
        name: '',
        price: 0,
        description: '',
      },
      isModified: false,
      fields: [
        {
          key: 'name',
          label: "Tên sản phẩm"
        },
        {
          key: 'price',
          label: "Giá"
        },
        {
          key: 'remains',
          label: "Số lượng còn lại"
        },
        {
          key: 'description',
          label: "Mô tả"
        },
        {
          key: 'delete',
          label: ""
        },
        {
          key: 'update',
          label: ""
        },
      ]
    }
  },
  methods: {
    checkingForm:function(){
      if(!this.topping_form_data.name){
        this.$bvToast.toast("Tên không được để trống",{
          variant: "warning",
        })
        return false
      } else if(!this.topping_form_data.price){
        this.$bvToast.toast("Giá tiền không được để trống",{
          variant: "warning",
        })
        return false
      }

      return true
    },
    createTopping: function () {
      if(!this.checkingForm()){
        return
      }

      toppingCollection.doc().set(
        JSON.parse(JSON.stringify(this.topping_form_data),(key, value) => {
          if(key === 'price'){
            return parseInt(value)
          }
          return value
        })
      ).then(response => {
        this.topping_form_data = new Topping()
        this.getToppings()
      }).catch(e =>{
        console.log(e)
      })
    },
    deleteTopping: function (id) {
      toppingCollection.doc(id).delete().then(response => {
        this.getToppings()
      })
    },
    updateTopping: function () {
      if(!this.checkingForm()){
        return
      }
      toppingCollection.doc(this.topping_form_data.id).update(
        this.topping_form_data
      ).then(response => {
        this.isModified = false
        this.topping_form_data = new Topping()
      }).catch(e => {
        console.log(e)
      })
    },
    getToppings: function () {
      toppingCollection.get().then(snapshots => {
        this.topping = snapshots.docs.map(snapshot => {
          let topping = snapshot.data(Topping)
          topping.id = snapshot.id
          return topping
        })
      })
    },

    changeMode: function (topping) {
      this.isModified = true
      this.topping_form_data = topping
    }
  },
  created() {
    this.getToppings()
  }
}
</script>

<style scoped>

</style>

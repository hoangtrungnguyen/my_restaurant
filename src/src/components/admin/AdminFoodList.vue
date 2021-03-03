<template>
  <div class="text-left">
    <h2>Sản phẩm > Danh sách</h2>
    <b-card>
      <b-table small class="font-14" hover :items="foods" :fields="fields">
        <template #cell(index)="data">
          {{ data.index + 1 }}
        </template>
        <template #cell(image_url)="data">
          <b-img-lazy height="100" width="100" v-bind:src="data.item.image_url.toString()"/>
        </template>
        <template #cell(title)="data">
          {{ data.item.title }}
        </template>
        <template #cell(price)="data">
          {{ data.item.price|formatBill }}vnđ
        </template>
        <template #cell(description)="data">
          {{ data.item.description | shortenSentence }}
        </template>

        <template #cell(view)="data">
          <router-link exact v-bind:to="'/admin/food/'+data.item.id">Xem</router-link>
        </template>

      </b-table>
    </b-card>

  </div>
</template>

<script>
import {foodCollection} from "../../model/db";
import Food from "../../model/food";

export default {
  name: "AdminFood",
  data:function (){
    return {
      foods:[],
      fields:[
        {
          key:"image_url",
          label: "Hình ảnh"
        },
        {
          key:"title",
          label: "Tên"
        },
        {
          key:"description",
          label: "Mô tả"
        },
        {
          key:"price",
          label: "Giá sản phẩm"
        },
        {
          key:"remains",
          label: "Số suất còn lại"
        },
        {
          key:"sold_count",
          label: "Đã bán"
        },
        {
          key:"view",
          label: ''
        }
      ]
    }
  },
  created() {
    foodCollection.get().then(snapshots =>{
      this.foods = snapshots.docs.map(snapshot =>{
        let food = snapshot.data(Food)
        food.id = snapshot.id
        return food
      })
    })
  }
}
</script>

<style scoped>

</style>

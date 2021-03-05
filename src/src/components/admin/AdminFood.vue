<template>
<div class="text-left">
  <router-view/>
  <b-card class="my-2">
    <router-link exact to="/admin/food/" class="btn btn-dark">Sản phẩm chính</router-link>
    <router-link exact to="/admin/food/topping/create" class="btn btn-dark">Tạo/Sửa topping</router-link>
<!--    <router-link exact to="/admin/food/" class="btn btn-dark">Danh sách sản phẩm</router-link>-->
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

    }
  },
  created() {

  }
}
</script>

<style scoped>

</style>

<template>
  <div class="text-left">
    <h2>Người dùng</h2>
    <b-card>
      <b-table class="font-14" hover :items="users"></b-table>
    </b-card>
  </div>
</template>

<script>
import {baseApi} from "../../config/admin";

export default {
  name: "AdminUser",
  data: function () {
    return {
      users: []
    }
  },
  created() {
  //   this.$http.post(`${baseApi}/users`, {
  //     headers: {
  //       'Access-Control-Allow-Origin': 'http://localhost:3000',
  //       'Access-Control-Allow-Credentials': true
  //     }
  //   })
  //     .then(response => {
  //       console.log(response)
  //     })
  }

}
</script>

<style scoped>

</style>

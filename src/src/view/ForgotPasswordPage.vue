<template>
  <main>
    <div id="blog-banner" class="parallax">
      <b-container fluid class="head-banner">
        <h2>Đặt lại mật khẩu</h2>
        <br>
        <p></p>
      </b-container>
    </div>
    <b-container class="text-left py-4">
      <b-col>
        <b-card>
          <b-card-body>
            <label class="w-100">Email *<br>
              <input placeholder="abc@email.com" class="w-100" type="email" v-model="resetPwEmail"/>
            </label>
            <p>Một email đặt lại mật khẩu sẽ được gửi đến hòm thư của bạn</p>
            <p v-if="ok"><span class="">Gửi thành công </span><router-link to="/authenticate">Quay lại trang đăng nhập</router-link></p>
            <b-btn v-on:click.prevent="sendResetPwEmail" class="btn-dark">Xác nhận</b-btn>
            <br>
          </b-card-body>
        </b-card>
      </b-col>
    </b-container>
  </main>
</template>

<script>
import {auth} from "../model/db";
import {getFirebaseErrorMessage} from "../model/firebase_error";

export default {
  name: "ForgotPasswordPage",
  data: function () {
    return {
      resetPwEmail: '',
      ok:false
    }
  },
  methods: {
    sendResetPwEmail: function () {
        auth.sendPasswordResetEmail(this.resetPwEmail).then(data=>{
          this.ok = true
        }).catch(err=>{
          alert(getFirebaseErrorMessage(err))
        })
    }
  }
}
</script>

<style scoped>
label {
  font-weight: 600;
}

</style>

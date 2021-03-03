<template>
  <b-card>
    <h3>Thông tin tài khoản</h3>
    <b-card-body class="p-0 pt-3">
      <label class="w-100">Email *<br>
        <input required placeholder="abc@email.com" class="w-100" type="email"
               v-model="userProfile.email"/>
        <small class="text-danger" v-if="isEmailVerify">Email chưa được xác nhận</small>
        <div>
          <b-btn class="px-1 py-0" v-if="isEmailVerify" v-on:click="sendEmailVerify"><small>Gửi lại
            email xác nhận</small></b-btn>
        </div>

      </label>
      <label class="w-100">Họ và tên *<br>
        <input required placeholder="" class="w-100" type="text"
               v-model="userProfile.full_name"/>
      </label>
      <h5 class="pt-3">Thay đổi mật khẩu</h5>
      <label class="w-100">Mật khẩu cũ *<br>
        <input required placeholder="" class="w-100" type="password"
               v-model="passwordChanger.oldPw"/>
      </label>
      <label class="w-100">Mật khẩu mới *<br>
        <input required placeholder="" class="w-100" type="password"
               v-model="passwordChanger.newPw1"/>
      </label>
      <label class="w-100">Xác nhận mật khẩu mới *<br>
        <input required placeholder="" class="w-100" type="password"
               v-model="passwordChanger.newPw2"/>
      </label>
      <div class="py-3">
        <b-btn v-on:click="updateProfile">Xác nhận thay đổi</b-btn>
      </div>

    </b-card-body>
  </b-card>
</template>

<script>
import {actionCodeSettings, auth} from "../../model/db";
import {getFirebaseErrorMessage} from "../../model/firebase_error";

export default {
  name: "AccountProfile",
  props: {
    userProfile: {type: Object}
  },
  data: function () {
    return {
      isEmailVerify: false,
      passwordChanger: {
        oldPw: "",
        newPw1: "",
        newPw2: "",
      }
    }
  },
  methods: {
    sendEmailVerify: function () {
      auth.currentUser.sendEmailVerification().then(data => {
        this.isEmailVerify = true
      }).catch(err => {
        alert(getFirebaseErrorMessage(err))
      })
    },
    updateProfile: function () {

    }
  },
  created() {
    this.isEmailVerify = auth.currentUser.emailVerified
  },

}
</script>

<style scoped>
label {
  font-weight: 600;
}
</style>

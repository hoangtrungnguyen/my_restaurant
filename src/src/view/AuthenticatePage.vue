<template>
  <main>
    <div id="blog-banner" class="parallax">
      <b-container fluid class="head-banner">
        <h2>Đăng nhập/ Đăng ký</h2>
        <br>
        <p></p>
      </b-container>
    </div>
    <b-container class="py-4">
      <b-row class="text-left">
        <b-col cols="12" lg="6">
          <b-card>
            <h4>Đăng nhập</h4>
            <b-card-body>
              <label class="w-100">Email *
                <br><input required placeholder="abc@email.com" class="w-100 " type="email"
                           v-model="authenticateInfo.email"/>
              </label>
              <br>
              <label class="w-100">Mật khẩu *<br>
                <input required class="w-100" type="password" v-model="authenticateInfo.password"/>
              </label>
              <br>
              <b-btn v-on:click.prevent="logIn" class="btn-dark">Đăng nhập</b-btn>
              <br>
              <div class="pt-1">
                <router-link to="/forgot-pw">Quên mật khẩu?</router-link>
              </div>
              <hr>

            </b-card-body>
          </b-card>
        </b-col>

        <b-col cols="12" lg="6">
          <b-card>
            <h4>Đăng ký</h4>
            <b-card-body>
              <label class="w-100">Email *<br>
                <input required placeholder="abc@email.com" class="w-100" type="email"
                       v-model="registerInfo.email"/>
              </label>
              <label class="w-100">Mật khẩu *<br>
                <input required class="w-100" type="password" v-model="registerInfo.password"/>
              </label>
              <label class="w-100">Xác nhận mật khẩu *<br>
                <input required class="w-100" type="password" v-model="registerInfo.password2"/>
              </label>
              <p><small>Bằng cách đăng ký tài khoản bạn đã đồng ý với điều khoản của chúng
                tôi</small></p>
              <b-btn v-on:click.prevent="createAccount" class="btn-dark">Đăng ký</b-btn>
              <br>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>

  </main>
</template>

<script>
import * as firebase from "../model/db";
import {getFirebaseErrorMessage} from "../model/firebase_error";

export default {
  name: "AuthenticatePage",
  props: {
    "setUserProfile": {type: Function}
  },
  data: function () {
    return {
      isLoading: false,
      registerInfo: {
        email: '',
        password: "",
        password2: "",
      },
      authenticateInfo: {
        email: '',
        password: ""
      }
    }
  },
  methods: {
    loading:function (){
      let loader = this.$loading.show({
        // Optional parameters
        container: this.$refs.formContainer,//fullPage
        canCancel: true,
        // onCancel: this.onCancel,
      });
      return loader
    },
    logIn: function () {
      if (!this.validateEmail(this.authenticateInfo.email)) {
        alert("Email không đúng định dạng")
        return
      }
      let loader = this.loading()
      firebase.auth.signInWithEmailAndPassword(this.authenticateInfo.email, this.authenticateInfo.password)
        .then(async (userCredential) => {
          // Signed in
          const user = userCredential.user;
          const userProfile = await firebase.userCollection.doc(user.uid).get()

          this.setUserProfile(userProfile)
        }).then(data => {
        this.$router.replace('account')
      })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const message = getFirebaseErrorMessage(error)
          loader.hide()
          alert(message)
        }).finally(() => {
          try{
            loader.hide()
          }catch (e){}
      });
    },
    createAccount: function () {
      if (this.registerInfo.password !== this.registerInfo.password2) {
        alert("Mật khẩu không khớp")
        return
      } else if (!this.validateEmail(this.registerInfo.email)) {
        alert("Email không đúng định dạng")
        return
      }
      let loader = this.loading()
      firebase.auth.createUserWithEmailAndPassword(this.registerInfo.email, this.registerInfo.password).then(async userCredential => {
        // Signed in
        const user = userCredential.user;
        const userProfile = await firebase.userCollection.doc(user.uid).get()
        this.setUserProfile(userProfile)
      }).then(value => {
        this.$router.replace('account')
      })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const message = getFirebaseErrorMessage(error)
          alert(message)
        }).finally(() => {
        loader.hide()
      });
    },
    validateEmail: function (email) {
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  }
}
</script>

<style scoped>
label {
  font-weight: 600;
}
</style>

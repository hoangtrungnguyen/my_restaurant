<template>
  <main>
    <div id="blog-banner" class="parallax">
      <b-container fluid class="head-banner">
        <h2>Cá nhân</h2>
        <br>
        <p></p>
      </b-container>
    </div>
    <b-container fluid class="py-4">
      <b-row>
        <b-col cols="3">
          <b-card>
            <b-navbar-nav class="m-auto">
              <b-nav-item v-if="admin">
                <b-btn exact v-on:click="$router.push('/admin')">Trang quản trị</b-btn>
              </b-nav-item>

              <b-nav-item>
                <router-link to="/account/">Thông tin tài khoản</router-link>
              </b-nav-item>
              <b-nav-item>
                <router-link to="/account/order">Đơn hàng</router-link>
              </b-nav-item>

              <b-nav-item>
                <a v-on:click="signOut">Đăng xuất</a>
              </b-nav-item>
            </b-navbar-nav>
          </b-card>
        </b-col>
        <b-col cols="9">
          <router-view v-bind:userProfile="userProfile" class="text-left">

          </router-view>
        </b-col>
      </b-row>
    </b-container>
  </main>
</template>

<script>
import {auth, db, userCollection} from "../model/db";

export default {
  name: "AccountPage",
  data: function () {
    return {
      userProfile: {},
      admin: false
    }
  },
  methods: {
    signOut: function () {
      auth.signOut().then(data => {
        this.$router.replace('/authenticate')
      })
    },
    isAdmin: async function () {
      try {
        const result = await auth.currentUser.getIdTokenResult()
        // console.log(result.claims)
        // console.log(result.claims.admin)
        // console.log(this.userProfile)
        return result.claims.admin === true
      } catch (e) {
        return false
      }
    }
  },
  created() {
    userCollection.doc(auth.currentUser.uid).get().then(snapshot => {
      this.userProfile = snapshot.data()
    }).then(async () => {
      this.admin =  await this.isAdmin()
    })
  }
}
</script>

<style scoped>

</style>

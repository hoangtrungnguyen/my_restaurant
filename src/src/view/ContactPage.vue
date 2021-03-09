<template>
  <main>
    <div id="blog-banner" class="parallax">
      <b-container fluid class="head-banner">
        <h2>Liên hệ</h2>
        <br>
        <p></p>
      </b-container>
    </div>

    <b-container class="py-4 text-left">
      <b-card class="w-75 m-auto">
        <b-form class="align-self-center">
          <label class="w-100">Họ và tên *
            <br>
            <b-input name="name" required placeholder="VD: ten " class="w-100 " type="text"
                     v-model="feedBack.full_name"/>
          </label>
          <label class="w-100">Email
            <br>
            <b-input name="email" required placeholder="VD: abc@gmail.ocm" class="w-100 " type="text"
                     v-model="feedBack.email"/>
          </label>

          <label class="w-100">SĐT
            <br>
            <b-input name="phone" required placeholder="VD: 012345678 " class="w-100 " type="phone"
                     v-model="feedBack.phone"/>
          </label>

          <label class="w-100">Tin nhắn/Phản hồi *
            <br>
            <b-textarea rows="8" required placeholder="VD: " class="w-100 " type="text"
                     v-model="feedBack.message"/>
          </label>

          <b-btn variant="dark" v-on:click.prevent="send">Gửi</b-btn>

        </b-form>
      </b-card>
    </b-container>

  </main>
</template>

<script>
import {FeedBack} from "../model/feedBack";
import {feedBackCollection} from "../model/db";

export default {
  name: "ContactPage",
  data: function () {
    return {
      feedBack: new FeedBack()
    }
  },
  methods:{
    send:function(){
        feedBackCollection.doc().set(
          JSON.parse(JSON.stringify(this.feedBack))
        ).then(result =>{
          this.$bvToast.toast('Gửi thành công', {
            title: `Thông báo`,
            variant: 'success',
            solid: true
          })
          this.feedBack = new FeedBack()
        })
    }
  }
}
</script>

<style scoped>

</style>

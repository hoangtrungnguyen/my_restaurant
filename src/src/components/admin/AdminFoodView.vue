<template>
  <b-container fluid="true">
    <h2>Sản phẩm > Chi tiết </h2>
    <b-card>
      <b-form action="">
        <label class="w-100">Tên sản phẩm *
          <br>
          <b-input required placeholder="Vd: cơm gà" class="w-100 " type="text"
                   v-model="food.title"/>
        </label>
        <label class="w-100">Giá *
          <br>
          <b-input required placeholder="VD: 20000vnđ" class="w-100 " type="number"
                   v-model="food.price"/>
        </label>
        <label class="w-100">Mô tả *
          <br>
          <b-textarea rows="5" required placeholder="Vd: cơm gà" class="w-100 " type="text"
                      v-model="food.description"/>
        </label>
        <label class="w-100">Số lượng *
          <br>
          <b-input required placeholder="Vd: cơm gà" class="w-100 " type="number"
                   v-model="food.remains"/>
        </label>
        <b-img-lazy :src="this.food.image_url" height="150" v-if="this.food.image_url"/>
        <label class="w-100">Ảnh *
          <br><input
            ref="image"
            class="w-100" type="file"
            @change="onFilePicked"/>
        </label>

        <div>
          <b-btn variant="outline-dark" v-if="!isLoading" class="mt-3" v-on:click.prevent="update">
            Cập nhật sản phẩm
          </b-btn>
          <h6 v-if="isLoading">
            Đang cập nhật ...
          </h6>
        </div>
        <hr>
        <div>
          <span class="text-danger">Nhập id sản phẩm để xóa: </span>
          <b-input v-model="deleteCode" class="w-25"/>
          <b-btn variant="danger" class="mt-3" v-on:click.prevent="deleteFood">
            Xóa sản phẩm
          </b-btn>
        </div>

      </b-form>
    </b-card>
  </b-container>
</template>

<script>
import Food from "../../model/food";
import {db, foodCollection, storage} from "../../model/db";

export default {
  name: "AdminFoodView",
  data: function () {
    return {
      formKey: 0,
      isLoading: false,
      food: new Food(),
      oldImageName: '',
      imageFile: "",
      deleteCode: ''
    }
  },
  methods: {
    pickFile() {
      this.$refs.image.click();
    },
    onFilePicked: function (e) {
      // console.log('event ',e)
      const files = e.target.files;
      // console.log('files ',files)
      if (files[0] !== undefined) {
        this.oldImageName = this.food.image_name
        this.food.image_name = files[0].name;
        if (this.food.image_name.lastIndexOf(".") <= 0) {
          console.log("no name")
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.food.image_url = fr.result;
          //console.log("imageUrl");
          this.imageFile = files[0]; // this is an image file that can be sent to server...
        });
      } else {
        console.log("none2")
        this.food.image_name = "";
        this.imageFile = "";
        this.food.image_url = "";
      }
    },
    uploadImage: async function () {
      // ストレージオブジェクト作成
      const storageRef = storage.ref();
      // ファイルのパスを設定
      console.log('uploadImage:', this.food.image_name)
      if (!this.food.image_name) {
        alert("Chưa có ảnh")
        return
      }
      try {
        const mountainsRef = storageRef.child(`images/${this.food.image_name}`);
        // ファイルを適用してファイルアップロード開始
        const snapshot = await mountainsRef.put(this.imageFile)

        const downloadURL = await snapshot.ref.getDownloadURL()

        this.food.image_url = downloadURL;

        const bucketName = "restaurant-56248.appspot.com";
        // const bucket = storage.bucket("restaurant-56248.appspot.com");
        db.collection("images").add({
          downloadURL,
          downloadUrl:
            `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/images` +
            "%2F" +
            `${encodeURIComponent(this.food.image_name)}?alt=media`,
          timestamp: new Date()
        }).then(response => {

        });
        // this.getImages();
      } catch (err) {
        alert(err.message)
        console.log(err)
      }
    },
    removeOldImage: async function () {
      const storageRef = storage.ref();
      if (!this.oldImageName) {
        alert("Chưa có ảnh")
        return
      }
      const foodImagesRef = storageRef.child(`images/${this.oldImageName}`);
      // ファイルを適用してファイルアップロード開始
      const result = await foodImagesRef.delete()

    },
    update: async function () {
      try {
        this.isLoading = true
        if(this.oldImageName) {
          await this.removeOldImage()
          await this.uploadImage()
        }
        await foodCollection.doc(this.food.id).update(
          JSON.parse(JSON.stringify(this.food)),
        )
        alert("OK")
      } catch (e) {
        alert(e.message)
      } finally {
        this.isLoading = false
      }
    },
    deleteFood: function () {
      if (this.deleteCode !== this.food.id) {
        alert("Từ chối")
        return
      }
      foodCollection.doc(this.food.id).delete().then(result => {
        this.$router.back()
      })
    },
  },
  created() {
    foodCollection.doc(this.$route.params.id).get().then(snapshot => {
      this.food = snapshot.data(Food)
      this.food.id = snapshot.id
    })
  }
}
</script>

<style scoped>

</style>

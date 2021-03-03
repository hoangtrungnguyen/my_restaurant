<template>
  <b-container fluid="true">
    <h2>Sản phẩm > Tạo </h2>
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
        <b-img-lazy :src="imageUrl" height="150" v-if="imageUrl"/>
        <label class="w-100">Ảnh *
          <br><input
            ref="image"
            class="w-100" type="file"
            @change="onFilePicked"/>
        </label>


        <b-btn variant="outline-dark" v-if="!isLoading" class="mt-3" v-on:click.prevent="create">
          Tạo sản phẩm
        </b-btn>
        <h6 v-if="isLoading">
          Đang tạo ...
        </h6>
      </b-form>
    </b-card>
  </b-container>
</template>

<script>
import Food from "../../model/food";
import {db, foodCollection, storage} from "../../model/db";

export default {
  name: "AdminFoodCreate",
  data: function () {
    return {
      formKey: 0,
      isLoading: false,
      food: new Food(),
      imageName: "",
      imageUrl: "",
      imageFile: "",
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
        this.imageName = files[0].name;
        if (this.imageName.lastIndexOf(".") <= 0) {
          console.log("no name")
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.imageUrl = fr.result;
          //console.log("imageUrl");
          this.imageFile = files[0]; // this is an image file that can be sent to server...

          this.food.image_name = this.imageName
        });
      } else {
        console.log("none2")
        this.imageName = "";
        this.imageFile = "";
        this.imageUrl = "";
      }
    },
    uploadImage: async function () {
      // ストレージオブジェクト作成
      const storageRef = storage.ref();
      // ファイルのパスを設定
      console.log('uploadImage:', this.imageName)
      if (!this.imageName) {
        alert("Chưa có ảnh")
        return
      }
      try {
        const mountainsRef = storageRef.child(`images/${this.imageName}`);
        // ファイルを適用してファイルアップロード開始
        const snapshot = await mountainsRef.put(this.imageFile)

        const downloadURL = await snapshot.ref.getDownloadURL()

        this.imageUrl = downloadURL;

        const bucketName = "restaurant-56248.appspot.com";
        // const bucket = storage.bucket("restaurant-56248.appspot.com");
        const filePath = this.imageName;
        db.collection("images").add({
          downloadURL,
          downloadUrl:
            `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/images` +
            "%2F" +
            `${encodeURIComponent(filePath)}?alt=media`,
          timestamp: new Date()
        }).then(response => {
        });
        // this.getImages();
      } catch (err) {
        alert(err.message)
        console.log(err)
      }
    },
    create: async function () {
      try {
        this.isLoading = true
        await this.uploadImage()
        this.food.image_url = this.imageUrl
        await foodCollection.doc().set(
          JSON.parse(JSON.stringify(this.food)),
        )
        alert("OK")
        this.reloadForm()
      } catch (e) {
        alert(e.message)
      } finally {
        this.isLoading = false
      }
    },
    reloadForm: function () {
      this.formKey += 1
      this.food = new Food()
      this.imageName = ""
      this.imageUrl = ""
      this.imageFile = ""

    }
  }
}
</script>

<style scoped>

</style>

<template>
  <b-container id="admin-blog-editor" fluid="true">
    <b-card>
      <b-form action="">
<!--        <b-img-lazy  v-bind:src="imageFile" height="150" v-if="imageFile"/>-->
        <b-img-lazy  v-bind:src="imageUrl" height="150" v-if="imageUrl"/>
        <label class="w-100">Ảnh *
          <br><input
            ref="image"
            class="w-100" type="file"
            @change="onFilePicked"/>
        </label>

        <label class="w-100">Tiêu đề *
          <br>
          <b-input required placeholder="Vd: Ăn uống lành mạnh" class="w-100 " type="text"
                   v-model="blog.title"/>
        </label>
        <label class="w-100">Tóm tắt *
          <br>
          <b-input required placeholder="VD: " class="w-100 " type="text"
                   v-model="blog.summary"/>
        </label>
        <label class="w-100">Nội dung *</label>
        <vue-editor v-model="blog.content" :editorToolbar="customToolbar"></vue-editor>

        <b-btn variant="outline-dark" v-if="!isLoading" class="mt-3" v-on:click.prevent="create">
          {{$route.params.id ? "Cập nhật" : "Tạo blog"}}
        </b-btn>
        <h6 v-if="isLoading">
          Đang tạo ...
        </h6>
      </b-form>
    </b-card>
    <br>
    <h3>Preview</h3>
    <br>
    <b-card>
      <h2>{{ blog.title }}</h2>
      <p>{{ blog.summary }}</p>
      <hr>
        <div class="text-center">
          <b-img-lazy class="w-100" style="max-height:600px; max-width:900px; object-fit: cover" v-bind:src="imageUrl"></b-img-lazy>
        </div>

      <div class="pt-3" v-html="blog.content"></div>
    </b-card>
  </b-container>
</template>

<script>
import {blogCollection, db, storage,bucketName} from "../../model/db";
import {Blog} from "../../model/blog";
import {VueEditor} from "vue2-editor";
import {resizeImage} from "../../util/resize_image";

export default {
  name: "AdminBlogEditor",
  props: {
    blogId: {type: String}
  },
  components: {
    VueEditor
  },
  data: function () {
    return {
      formKey: 0,
      isLoading: false,
      blog: new Blog(),
      imageName: "",
      imageUrl: "",
      imageFile: "",
      customToolbar:
        [
          [{'header': [1, 2, 3, 4, false]}],
          ["bold", "italic", "underline"],
          [{list: "ordered"}, {list: "bullet"}],
          [{"align": ['', 'center', 'right', 'justify']}],
          /*["image", "code-block"]*/
        ]

    }
  },
  methods: {
    pickFile() {
      this.$refs.image.click();
    },
    onFilePicked: async function (e) {
      // console.log('event ',e)
      const files = e.target.files;
      // console.log('files ',files)
      if (files[0] === undefined) {
        console.log("none2")
        this.imageName = "";
        this.imageFile = "";
        this.imageUrl = "";
      } else {
        this.imageName = files[0].name;
        if (this.imageName.lastIndexOf(".") <= 0) {
          console.log("no name")
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.imageUrl = fr.result;
          console.log(this.imageUrl);
          this.imageFile = files[0]; // this is an image file that can be sent to server...
          // this.imageFile = resizedImg; // this is an image file that can be sent to server...

          this.blog.image_name = this.imageName
        });

        // const resizedImg = await resizeImage({ file: files[0], maxSize: 150 })
        // this.imageFile =resizedImg


      }
    },
    uploadImage: async function () {
      // ストレージオブジェクト作成
      const storageRef = storage.ref();
      // ファイルのパスを設定
      // console.log('uploadImage:', this.imageName)
      if (!this.imageName) {
        // alert("Chưa có ảnh")
        return
      }
      try {
        const mountainsRef = storageRef.child(`images/${this.imageName}`);
        // ファイルを適用してファイルアップロード開始
        const snapshot = await mountainsRef.put(this.imageFile)

        const downloadURL = await snapshot.ref.getDownloadURL()

        this.imageUrl = downloadURL;
        console.log('imageURL',this.imageUrl)


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
        // console.log(err)
      }
    },
    removeOldImage: async function () {
      const storageRef = storage.ref();
      if (!this.oldImageName) {
        return
      }
      const foodImagesRef = storageRef.child(`images/${this.oldImageName}`);
      // ファイルを適用してファイルアップロード開始
      const result = await foodImagesRef.delete()

    },
    create: async function () {
      try {
        this.isLoading = true

        if(this.$route.params.id){
          await this.removeOldImage()
          await this.uploadImage()
          if(this.imageUrl)
            this.blog.image_url = this.imageUrl
          await blogCollection.doc(this.$route.params.id).update(
            JSON.parse(JSON.stringify(this.blog)),
          )
        } else {
          await this.uploadImage()
          if(this.imageUrl)
            this.blog.image_url = this.imageUrl
          await blogCollection.doc().set(
            JSON.parse(JSON.stringify(this.blog)),
          ).then(result =>{
            this.reloadForm()
          })
        }
        alert("OK")
      } catch (e) {
        alert(e.message)
      } finally {
        this.isLoading = false
      }
    },
    reloadForm: function () {
      this.formKey += 1
      this.food = new Blog()
      this.imageName = ""
      this.imageUrl = ""
      this.imageFile = ""

    }
  },
  created() {
    if (this.blogId) {
      blogCollection.doc(this.blogId).get().then(snapshot =>{
        this.blog = snapshot.data(Blog)
        this.blog.id = snapshot.id
        this.imageUrl = this.blog.image_url
        this.imageName = this.blog.image_name
      })
    } else {
      this.blog.content = "<h1>Thêm nội dung ở đây</h1>"
    }
  }
}
</script>

<style scoped>

</style>

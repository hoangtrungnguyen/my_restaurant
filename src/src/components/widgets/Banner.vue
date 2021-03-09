<template>
  <div id="banner" class="full-height p-0">
    <div class="carousel-item active">
      <div class="first-slide parallax"></div>
      <div class="container">
        <div class="carousel-caption text-center">
          <h1 class="pb-3">Tiệm cơm Online</h1>
<!--          <p>Đặt hàng nhanh chóng, thuận tiện mà lại ngon miệng</p>-->
          <p>{{ sologan }}</p>
          <p><router-link class="btn btn-lg btn-primary" to="/menu" role="button">Đặt món</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "banner",
  data: function(){
    return {
      sologan: "Vì chúng tôi hiểu và tôn trọng đồng tiền của bạn nên bạn xứng đáng nhận được dịch vụ hoàn hảo"
    }
  },
  components:{
  }
}
</script>

<style scoped>
#banner{
  height: 100vh;
}
.first-slide {
  background-image: url("https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80");
}


/* Carousel base class */
.carousel {
  /*margin-bottom:3rem;*/
  background: rgb(0,0,0);
  background: linear-gradient(180deg, rgba(0,0,0,1) 12%, rgba(0,0,1,0) 100%);
}
/* Since positioning the image, we need to help out the caption */
.carousel-caption {
  position: absolute;
  top: 50%;
  transform: translateY(-50%)
}

/* Declare heights because of positioning of img element */
.carousel-item {
  height: 100vh;
  /*background-color: #777;*/
}
.carousel-item > img {
  position: absolute;
  object-fit: cover;
  top: 0;
  left: 0;
  min-width: 100%;
  height: 100vh;
}



/* MARKETING CONTENT
-------------------------------------------------- */

/* Center align the text within the three columns below the carousel */
.marketing .col-lg-4 {
  margin-bottom: 1.5rem;
  text-align: center;
}
.marketing h2 {
  font-weight: 600;
}
.marketing .col-lg-4 p {
  margin-right: .75rem;
  margin-left: .75rem;
}

.marketing .title-btn{
  text-align: end;
}

.marketing .title{
  text-align: start;
}

.marketing img{
  margin-bottom: 15px;
}
@media screen and (min-width: 768px) {
  .marketing .title-btn{
    text-align: center;
  }
  .marketing .title{
    padding-bottom: 16px;
    text-align: center;
  }
}


/* Featurettes
------------------------- */

.featurette-divider {
  margin: 5rem 0; /* Space out the Bootstrap <hr> more */
}

/* Thin out the marketing headings */
.featurette-heading {
  font-weight: 300;
  line-height: 1;
  letter-spacing: -.05rem;
}



/* RESPONSIVE CSS
-------------------------------------------------- */

@media screen and (max-width: 768px) {
  /* Bump up size of carousel content */
  .carousel-caption p {
    margin-bottom: 1.25rem;
    line-height: 1.4;
  }


  .featurette-heading {
    font-size: 50px;
  }

}

@media (min-width: 768px) {
  .featurette-heading {
    margin-top: 7rem;
  }
}

</style>

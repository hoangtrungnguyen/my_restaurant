<template>
  <div id="navigation">
    <b-navbar class="navbar-expand-md w-100"
              v-on:resize="onResize"
              :class="{'d-none': !isMdScreen}" id="mainNav">
      <b-container fluid class="d-flex justify-content-between"><a
        class="navbar-brand js-scroll-trigger logo" href="#page-top">LOGO</a>
        <div class="collapse navbar-collapse">
          <navigation-links :textWhite="true"></navigation-links>
        </div>
        <ul class="navbar-nav">
          <b-nav-item class="nav-item"><router-link class="cart-icon" to="/cart" exact>
            <b-icon-bag-fill font-scale="0.75"/>
            <span class="font-14">{{ countItem }}</span>
          </router-link></b-nav-item>
          <b-nav-item class="cart-icon account dropdown" href="/register">
            <b-icon-person font-scale="0.75"/>
          </b-nav-item>
        </ul>
      </b-container>
    </b-navbar>

    <b-navbar class="headroom fixed-top bg-dark py-0 my-0"
              v-on:scroll="onScroll"
              v-on:resize="onResize"
              :class="{'headroom--unpinned': !scrolled, 'd-none': !isMdScreen}"
              id="mainNavOnScroll">
      <b-container fluid class="d-flex justify-content-between">
        <a class="navbar-brand js-scroll-trigger logo text-white" href="#page-top">LOGO</a>
        <div class="collapse navbar-collapse">
          <navigation-links :textWhite="true"></navigation-links>
        </div>
        <ul class="navbar-nav">
          <b-nav-item class="nav-item">
            <router-link class="cart-icon" to="/cart" exact>
            <b-icon-bag-fill font-scale="0.75"/>
              <span class="font-14">{{ countItem }}</span>
          </router-link></b-nav-item>
          <b-nav-item class="cart-icon account dropdown" href="/register">
            <b-icon-person font-scale="0.75"/>
          </b-nav-item>
        </ul>
      </b-container>
    </b-navbar>

    <b-navbar toggleable="md" class="fixed-top bg-dark py-1 my-0"
           v-on:resize="onResize"
           :class="{'d-none': isMdScreen}" id="mainNavReponsive">
      <b-container fluid class="d-flex justify-content-between">
        <b-navbar-toggle class="bg-white" target="navbarResponsive"/>

        <b-navbar-brand class="js-scroll-trigger logo text-white">LOGO</b-navbar-brand>

        <b-row>
          <div class="px-2" href="/cart">
            <router-link to="/cart">
            <b-icon-bag-fill class="text-white" font-scale="1.2"></b-icon-bag-fill>
            </router-link>
            <span class="font-14 text-white">{{ countItem }}</span>
          </div>
          <div class="account dropdown pl-2 pr-4" href="/register">
            <a href="">
              <b-icon-person class="text-white" font-scale="1.2"/>
            </a>
          </div>
        </b-row>

        <b-collapse id="navbarResponsive" is-nav>
          <navigation-links :textWhite="true"></navigation-links>
        </b-collapse>
      </b-container>
    </b-navbar>
  </div>

</template>

<script>
import {BIconBagFill, BIconPerson} from 'bootstrap-vue'
import NavigationLinks from "./navigation/NavigationLinks";

export default {
  name: "Navigation",
  components: {
    BIconBagFill,
    BIconPerson,
    'navigation-links':NavigationLinks
  },

  data() {
    return {
      showNavbar: true,
      lastScrollPosition: 0,
      limitPosition: 50,
      scrolled: false,
      isMdScreen: true,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.onResize)
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onResize() {
      this.isMdScreen = window.innerWidth >= 768;
    },
    onScroll() {
      if (this.lastPosition < window.scrollY && this.limitPosition < window.scrollY) {
        this.scrolled = true;
        // move up!
      }

      if (this.lastPosition > window.scrollY) {
        this.scrolled = false;
        // move down
      }

      this.lastPosition = window.scrollY;
      // this.scrolled = window.scrollY > 250;
    },
  },
  computed:{
    countItem: function (){
     return this.$parent.count
    }
  },
}


</script>

<style scoped>
.cart-icon {
  color: white;
  text-decoration: none;
  position: relative;
  display: inline-block;
}

.cart-icon .cart-badge {
  font-size: 12px;
  height: 15px;
  width: 15px;
  text-align: center;
  position: absolute;
  border-radius: 80%;
  background: red;
  color: white;
}

.navbar .active {
  color: white;
}

.navbar .nav-link {
  color: #d5d5d7;
}

.navbar a {
  list-style: none;
  margin-left: 0;
}

.navbar a:hover {
  color: #ffffff;

}

#mainNav {
  top: 0;
  position: absolute;
  z-index: 1000;
}


.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 120px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  transform: translateX(-70%);
}

.dropdown:hover .dropdown-content {
  display: block;
  margin-top: 2px;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  color: #5a5a5a;
}


.headroom {
  will-change: transform;
  transition: transform 200ms linear;
}

.headroom--pinned {
  transform: translateY(0%);
}

.headroom--unpinned {
  transform: translateY(-100%);
}
</style>

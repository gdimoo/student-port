<template>


  <div id="app">
    <router-view />
    <nav class="nav"
    :class="{ 'navbar--hidden': !showNavbar }">
      <router-link to="/Home" class="nav__link active">
        <i class="material-icons nav__icon">home</i>
        <span class="nav__text">Home</span>
      </router-link>
      <router-link to="/produc" class="nav__link">
        <i class="material-icons nav__icon">add_business</i>
        <span class="nav__text">การผลิต</span>
      </router-link>
      <router-link to="/reader" class="nav__link">
        <i class="material-icons nav__icon">qr_code_scanner</i>
        <span class="nav__text">SCAN</span>
      </router-link>
      <router-link to="#" class="nav__link">
        <i class="material-icons nav__icon">contact_page</i>
        <span class="nav__text">ข้อมูล {{this.$store.state.token?this.$store.state.user:''}}</span>
      </router-link>
    </nav>
  </div>
</template>
<script>
export default {
  name: "stow3",
  data () {
    return {
      showNavbar: true,
      lastScrollPosition: 0
    }
  },

  mounted () {
    window.addEventListener('scroll', this.onScroll)
  },

  beforeDestroy () {
    window.removeEventListener('scroll', this.onScroll)
  },

methods: {
  onScroll () {
    const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop
    if (currentScrollPosition < 0) {
      return
    }
    this.showNavbar = currentScrollPosition < this.lastScrollPosition
    this.lastScrollPosition = currentScrollPosition
  }

  }
}
</script>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Prompt", sans-serif;
}

.nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  margin: 0 auto;
  height: 55px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
  display: flex;
  overflow-x: auto;
  transform: translate3d(0, 0, 0);
  transition: 0.1s all ease-out;
  /* position: sticky; */
}
.nav.navbar--hidden {
  box-shadow: none;
  transform: translate3d(0, 100%, 0);
}

.nav__link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  min-width: 30px;
  overflow: hidden;
  white-space: nowrap;
  font-family: sans-serif;
  font-size: 14px;
  color: #000;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 0.1s ease-in-out;
  border-radius: 50px;
}

.nav__link:hover {
  color: #5c5c5c;
}

a.router-link-exact-active{
   background-color: #f0d9a5;
}
.nav__icon {
  font-size: 30px;
}

</style>

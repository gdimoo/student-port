<template>
  <div id="app" >
      <nav>
        <a href="/" class="brand-logo">Student Portfolio</a>
        <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
      <ul v-if="!user" id="nav-mobile" class="right hide-on-med-and-down">
        <li><router-link to="/login-student">เข้าสู่ระบบนักเรียน</router-link></li>
        <li><router-link to="/login-teacher">เข้าสู่ระบบโรงเรียน</router-link></li>
        <li><router-link to="/login-training">เข้าสู่ระบบสถาบันฝึกอบรม</router-link></li>
      </ul>
      <ul v-else id="nav-mobile" class="right hide-on-med-and-down">
<li class="brown-text text-darken-4">ยินดีต้อนรับ คุณ {{user||''}}</li>
        <li><a @click="managePage()">จัดการข้อมูล
        </a></li>
        <li><a @click="handleLogout()">ออกจากระบบ
        </a></li>
      </ul>
      </nav>
      
    <router-view />
  </div>
</template>
<script>
import { resetState } from "@/store/index.js";

export default {
  name: "App",
  data () {
    return {
      showNavbar: true,
      lastScrollPosition: 0,
      user:localStorage.getItem("LoggedUser").split(',')[1]?localStorage.getItem("LoggedUser").split(',')[1]:localStorage.getItem("LoggedUser")
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
  },
  handleLogout() {
    this.auth2.signOut();
      localStorage.clear();
      resetState();
    console.log('App :',this.$store.state.token);
    location.reload()
            
    },
    managePage(){
this.$router.push('/' +  this.$store.state.role);
    }

  },
  created(){

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

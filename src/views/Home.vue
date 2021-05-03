<template>
  <div class="home">
   <header>
     <nav>
      <div class="logo" > <router-link to="#">LOGO</router-link></div>
      <div class="logout"  @click="handleLogout()"> <router-link to="/">logout</router-link></div>
     </nav>
     <div class="image">
       <router-link to="/show"><img src="../assets/SCAN.svg" alt="scan"></router-link>
     </div>
   </header>
   <section>
     <div class="title">
       <h3>รายการผลิตล่าสุด</h3>
     </div>
     <div class="box">
       <div class="head">
         <h4>เก็บเกี่ยว</h4>
       </div>
       <div class="text">
         <p>เลขล็อต</p>
         <p>ว/ด/ป</p>
       </div>
     </div>
   </section>
  </div>
<!-- <HelloWorld /> -->
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import { resetState } from '@/store/index.js'
export default {
  name: 'Home',
  components: {
    // HelloWorld
  },
  methods: {
    handleLogout() { 
      resetState()
      localStorage.clear()
    },
  },
}
</script>

<style scoped>
header{
  width: 100%;
  height: 448px;
  margin: 0 auto;
  background: url('../assets/coffee.jpg') no-repeat;
  background-position: center;
}
nav{
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
nav a{
  text-decoration: none;
  color: #F0D9A5;
}

.logo{
  margin-left: 5%;
  font-size: 30px;
  font-weight: bold;
}

.logout{
  margin-right: 5%;
  font-size: 25px;
}

.image{
  display: flex;
  justify-content: center;
  margin-top: 50px;
}

section{
  width: 50%;
  min-width: 300px;
  margin: 0 auto;
}
.title h3{
text-align: center;
margin-top: 40px;
font-size: 25px;
}

.box{
  width: 100%;
  margin: 20px auto;
}

.head{
  height: 40px;
  background-color: #81542D;
}

.head h4{
color: white;
font-size: 20px;
font-weight: inherit;
margin-left: 30px;
padding-top: 3px;
}

.text{
  height: 94px;
  background-color: #F0D9A5;
}

.text p{
font-size: 16px;
font-weight:lighter;
margin-left: 30px;
padding-top: 10px;
}
</style>

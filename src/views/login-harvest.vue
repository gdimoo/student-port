<template>
  <div class="login-harvest">
     <header>
     <nav>
      <div class="logo"> <router-link to="#">LOGO</router-link></div>
     </nav>
    <p>Coffee Bean Trace</p>
   </header>
    <!-- <form action="/action_page.php" method="post"> -->
    <!-- <div class="imgcontainer">
      <img src="img_avatar2.png" alt="Avatar" class="avatar" />
    </div> -->
        <div class="title">
            <img src="../assets/harvest.svg" alt="เก็บเกี่ยว">
            <h3>เก็บเกี่ยว</h3>
        </div>
    <div class="container">
        
<dropdown class="my-dropdown-toggle"
          :options="arrayOfObjects" 
          :selected="object" 
          v-on:updateOption="methodToRunOnSelect" 
          :placeholder="'เลือกผู้ใช้'"
          :closeOnOutsideClick="true">
</dropdown>

      <!-- <label for="uname"><b>Username</b></label>
    <input type="text" placeholder="ID" name="uname" required>

    <br><label for="psw"><b>Password</b></label>
    <input type="password" placeholder="Password" name="psw" required> -->

      <!-- <br><button v-on:click="login()">Login</button> -->
      <br><button @click="login()">Login</button>
    </div>
    <!-- </form> -->
  </div>
</template>

<script>
import axios from "axios";
import dropdown from 'vue-dropdowns';

export default {
  name: "login-harvest",
  data(){
    return{
arrayOfObjects: [{
                name: 'farmer1',
            },
            {
                name: 'farmer2',

            }],
            object: {
              name: this.user,
            }
    }
  },
  components: {            'dropdown': dropdown,

  },
        created(){
          this.object = this.$store.state.user
        },
  computed: {
    user () {
      return this.$store.state.user
    }
    },
  methods: {
    methodToRunOnSelect(payload) {
            this.$store.commit('setUser', payload.name)
            console.log(this.$store.state.user);
            // this.object = payload;
          },
    login() {
      console.log("cur user to login", this.user);
      // POST request using axios with set headers
      // const headers = {
      //   "Authorization": this.user,
      //   "My-Custom-Header": "foobar"
      // };
      let urlUser = this.$store.state.url.farmer;
      if (this.user === "milling1") {
        urlUser = this.$store.state.url.milling;
      } else if (this.user === "stow1") {
        urlUser = this.$store.state.url.stow;
      }
      axios
        .post(urlUser + "login", { username: this.user })
        .then((res) => {
          if (res.data !== "Wrong username") {
            console.log(res.data);
            const token = res.data;
            localStorage.setItem("LoggedUser", this.user);
            console.log("login    ", localStorage.getItem("LoggedUser"));
            localStorage.setItem("token", token);
            this.$router.replace({ path: "/produc" });
          }
        })
        .catch((err) => alert(err)
        );
      // this.$router.replace({ path: '/harvest1' });
    },
  }
}
</script>

<style scoped>
header{
  width: 100%;
  height: 200px;
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
p{
  color: #F0D9A5;
    font-size: 28px;
  font-weight: bold;
  text-align: center;
}

form {
  border: 3px solid #f1f1f1;
}

.title{
    margin: 20px;
    text-align: center;
    min-width: 300px;
    font-size: 20px;
}
.title img{
    width: 200px;
}

button {
  background-color: #81542D;
  border-radius: 20px;
  color: white;
  margin-top: 50px;
  border: none;
  cursor: pointer;
  width: 90%;
  height: 55px;
  max-width: 370px;
  font-size: 25px;
  font-weight: bold;
}

button:hover {
  opacity: 0.8;
}

.imgcontainer {
  text-align: center;
  margin: 24px 0 12px 0;
}

img.avatar {
  width: 40%;
  border-radius: 50%;
}

.container {
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

span.psw {
  float: right;
  padding-top: 16px;
}
/* Change styles for span and cancel button on extra small screens */
@media screen and (max-width: 500px) {
  span.psw {
    display: block;
    float: none;
  }
  .cancelbtn {
    width: 100%;
  }

  .title{
    font-size: 18px;
}
  .title img{
    width: 100px;
}
}
</style>

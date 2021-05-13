<template>
  <div class="login-teacher">

        <div class="title">
            <img src="../assets/school.svg" alt="school">
            <h3>ครู</h3>
        </div>
    <div class="container">
      <googleLogin />

    </div>
  </div>
</template>

<script>
import axios from "axios";
import googleLogin from "./google-signin";

export default {
  name: "login-student",
  components: {            
    googleLogin,

  },
  created(){
    if (localStorage.getItem("LoggedUser")) {
      this.$router.replace({ path: "/school" });
    }
          this.$store.commit('setType', 'school')
        },
  methods: {
    login() {
      console.log("cur user to login", this.user);
      // POST request using axios with set headers
      // const headers = {
      //   "Authorization": this.user,
      //   "My-Custom-Header": "foobar"
      // };
      let urlUser = this.$store.state.url.farmer;
      if (this.user === "cert1") {
        urlUser = this.$store.state.url.cert;
      } else if (this.user === "school1") {
        urlUser = this.$store.state.url.school;
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
            this.$router.replace({ path: "/school" });
          }
        })
        .catch((err) => alert(err)
        );
      // this.$router.replace({ path: '/study_report1' });
    },
  }
}
</script>

<style scoped>
header{
  width: 100%;
  height: 200px;
  margin: 0 auto;
  
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

.title{
    margin: 20px;
    text-align: center;
    min-width: 300px;
    font-size: 20px;
}
.title img{
    width: 150px;
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

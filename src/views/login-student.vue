<template>

  <div class="login-student">

        <div class="title">
            <img src="../assets/student.svg" alt="นักเรียน">
            <h3>นักเรียน</h3>
        </div>
    <div class="container">
      
        <input
          v-model="user"
          type="text"
          name="เลขประจำตัวประชาชน"
          placeholder="เลขประจำตัวประชาชน"
          required
        />
      <br><button @click="login()">Login</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "login-student",
  data(){
    return{
      user:""
    }
  },
  created(){
    if (localStorage.getItem("LoggedUser")) {
      this.$router.replace({ path: "/data-center" });
    }
        },
  methods: {
    login() {
      console.log("cur user to login", this.user);

      let urlUser = this.$store.state.url.data;

      axios
        .post(urlUser + "login", { username: this.user })
        .then((res) => {
          if (res.data !== "ไม่พบผู้ใช้นี้ในระบบ" && res.data.status!=500) {
            console.log(res.data);
            const token = res.data;
            localStorage.setItem("LoggedUser", this.user);
            console.log("login    ", localStorage.getItem("LoggedUser"));
            localStorage.setItem("token", token);
            localStorage.setItem("role", "data-center");
            this.$router.replace({ path: "/data-center" });
      location.reload()

          }
          else{
            alert("ไม่พบผู้ใช้นี้ในระบบ")
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

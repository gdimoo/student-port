<template>
  <div class="login">
    <header>
      <nav>
        <div class="logo"><router-link to="#">LOGO</router-link></div>
      </nav>
      <p>Coffee Bean Trace</p>
    </header>

    <!-- </form> -->
    <div class="space">
        <router-link to="/login-harvest">login-harvest</router-link>
        <br><router-link to="/login-milling">login-milling</router-link>
        <br><router-link to="/login-stow">login-stow</router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// import dropdown from
export default {
  name: "post-request-set-headers",
  components: {
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
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
  },
};
</script>

<style scoped>
header {
  width: 100%;
  height: 200px;
  margin: 0 auto;
  background: url("../assets/coffee.jpg") no-repeat;
  background-position: center;
}
nav {
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
nav a {
  text-decoration: none;
  color: #f0d9a5;
}

.logo {
  margin-left: 5%;
  font-size: 30px;
  font-weight: bold;
}
p {
  color: #f0d9a5;
  font-size: 28px;
  font-weight: bold;
  text-align: center;
}

form {
  border: 3px solid #f1f1f1;
}

input[type="text"],
input[type="password"] {
  width: 20rem;
  padding: 12px 20px;
  margin: 0.5em;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

button {
  background-color: #81542d;
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

.space {
  height: 160px;
  text-align: center;
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
}
</style>

<template>
  <div id="g-signin2" data-onsuccess="onSignIn">
    <GoogleLogin :params="params" :onSuccess="onSuccess" :onFailure="onFailure">
      <div class="col s12 m6 offset-m3 center-align">
        <a
          class="oauth-container btn darken-4 white black-text"
          style="text-transform: none"
        >
          <div class="left">
            <img
              width="20px"
              style="margin-top: 7px; margin-right: 8px"
              alt="Google sign-in"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
            />
          </div>
          Login with Google
        </a>
      </div>
    </GoogleLogin>
  </div>
</template>

<script>
import GoogleLogin from "vue-google-login";
export default {
  name: "googleLogin",
  data() {
    return {
      // client_id is the only required property but you can add several more params, full list down bellow on the Auth api section
      params: {
        client_id:
          "624928619172-6cq2g8hagvcaa5cmrql2jegiqe9ref1q.apps.googleusercontent.com",
      },
      // only needed if you want to render the button with the google ui
    };
  },
  components: {
    GoogleLogin,
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    onSuccess(googleUser) {
      // This only gets the user information: id, name, imageUrl and email
      console.log(googleUser.getBasicProfile());
      console.log("token", googleUser.getAuthResponse().id_token);
      const token = googleUser.getAuthResponse().id_token;
      localStorage.setItem("LoggedUser", 
      [googleUser.getBasicProfile().getId(),googleUser.getBasicProfile().getName(),googleUser.getBasicProfile().getEmail()]);
      console.log("login    ", localStorage.getItem("LoggedUser"));
      localStorage.setItem("token", token);
      if (this.$store.state.type === 'school') {
      localStorage.setItem("type", this.$store.state.type);
            localStorage.setItem("role", "school");

      this.$router.replace({ path: "/school" });
        
      } else if(this.$store.state.type === 'training') {
      localStorage.setItem("type", this.$store.state.type);
            localStorage.setItem("role", "training");

      this.$router.replace({ path: "/training" });
        
      }
      location.reload()
    },
    onFailure(e){
      alert('เกิดข้อผิดพลาด ลงชื่อเข้าใช้ไม่สำเร็จ',e)
    }
  },
};
</script>

<style scoped>
header {
  width: 100%;
  height: 200px;
  margin: 0 auto;
  
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

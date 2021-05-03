<template>
  <div id="qr">
    <header>
      <router-link to="/">
        <i class="material-icons nav__icon">keyboard_backspace</i>
      </router-link>
    </header>
    <div class="image">
      <vue-qrcode :value="url" />
    </div>
    <section>
      <h2>การเก็บเกี่ยว</h2>
      <p>หมายเลขล็อต : {{ lotID }}</p>
      <p>สายพันธุ์ : {{ farm.species }}</p>
      <p>เกรด : -</p>
      <p>ปริมาณ : {{ farm.value }}</p>
    </section>
    
    <div class="button">
      <router-link to="#">
        <i class="material-icons nav__icon">keyboard_backspace</i>
      </router-link>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import VueQrcode from "vue-qrcode";
export default {
  components: {
    VueQrcode,
  },
  computed: {
    lotID() {
      return this.$store.state.lotID;
    },
    farm() {
      return this.$store.state.farm;
    },
    url() {
      // if (this.listing.owner.include(this.$store.state.user)) {

      return (
        this.$store.state.url.milling +
        `api/v1/receiveData/${this.$store.state.lotID}`
      );
      // } else {
      //   return ''
      // }
    },
  },
  data() {
    return {
      // url: `http://165.232.173.183:4000/api/v1/receiveData/${this.$store.state.lotID}`
    };
  },
  created() {
    axios
      .get(this.$store.state.url.farmer, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        this.$router.push("/");
        alert("คุณไม่มีสิทธิ์ กรุณา Login", err);
      });
  },
};
</script>
<style scoped>
header {
  height: 65px;
  position: relative;
}
header i {
  position: absolute;
  left: 10%;
  bottom: 0;
}
.nav__icon {
  font-size: 30px;
  color: #000;
}
.image {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
section {
  margin: 30px 10%;
}
section h2 {
  font-size: 20px;
}
section p {
  font-size: 16px;
  margin: 15px 20px;
}
.button {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.button a {
  text-decoration: none;
  color: #fff;
  background-color: #81542d;
  text-align: center;
  padding: 10px;
  width: 370px;
  font-size: 20px;
  font-weight: bolder;
  margin: 10px 0;
}
.button i {
  color: #fff;
}
.input {
  display: flex;
  flex-direction: column;
}
input {
  width: 100%;
  height: 50px;
  margin: 0px 0px 20px 0px;
  font-size: 18px;
  font-weight: lighter;
  padding-left: 20px;
  padding-right: 20px;
}
button {
  margin: 10px auto;
  background-color: #81542d;
  color: white;
  border: none;
  cursor: pointer;
  width: 50%;
  min-width: 250px;
  height: 55px;
  font-size: 20px;
  font-weight: bold;
}
</style>
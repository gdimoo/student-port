<template>
  <div id="stow3">
    <header>
      <router-link :to="'/stow2?id='+this.$store.state.stow.receiveLotID">
        <i class="material-icons nav__icon">keyboard_backspace</i>
      </router-link>
    </header>
    <section>
      <h2>ข้อมูลเบื้องต้น</h2>
      <div class="input">
        <input
          type="text"
          name="ชื่อยี่ห้อ"
          v-model="name"
          placeholder="ชื่อยี่ห้อ"
          value="ชื่อยี่ห้อ"
        />
         <p>วัน/เดือน/ปี บรรจุ</p>
        <input
          type="date"
          name="ว/ด/ป"
          v-model="packDate"
          placeholder="ว/ด/ป"
          value="2021-03-10"
        />
         <p>วัน/เดือน/ปี หมดอายุ</p>
        <input
          type="date"
          name="ว/ด/ป"
          v-model="expDate"
          placeholder="ว/ด/ป"
          value="2021-03-10"
        />
        <p>รายละเอียดของกาแฟ</p>
        <input
          type="text"
          name="รายละเอียด"
          v-model="Detail"
          placeholder="เป็นการผสมผสานเอสเพรสโซที่เป็นเอกลักษณ์ของBluestone Lane เหมาะกับการบดระดับหยาบถึงปานกลาง"
        />
        <p>การชงที่แนะนำ</p>
        <input
          type="text"
          name="แนะนำ"
          v-model="guide"
          placeholder="บดหยาบเหมาะกับการชงแบบ French Press บดปานกลางเหมาะกับการชงแบบดริป"
        />
        <p>ปริมาณที่บรรจุ</p>
        <input
          v-model="packValue"
          type="text"
          name="ปริมาณที่จุ"
          placeholder="ปริมาณที่จุ"
        />
      </div>
    <div class="input">
      <button @click="recordData()">QR Code</button>
    </div>
      <div class="input">
          <div class="next"><router-link :to="'/stow2?id='+this.$store.state.stow.receiveLotID"><i class="material-icons nav__icon">arrow_back</i></router-link></div>
      </div>
    </section>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "stow3",
  data() {
    return {
      name: this.$store.state.stow.info.name,
      packDate: this.$store.state.stow.info.packDate,
      expDate: this.$store.state.stow.info.expDate,
      Detail: this.$store.state.stow.info.Detail,
      guide: this.$store.state.stow.info.guide,
      packValue: this.$store.state.stow.info.packValue,
      listing: {},
      info: ''
    };
  },
  computed: {
    user() {
      return "stow1";
    },
    stow() {
      return this.$store.state.stow;
    },
  },
  
  methods: {
    recordData() {
      // POST request using axios with set headers
      this.$store.commit('setLotID', this.stow.lotID)

        this.$store.commit("setStow", {
        ...this.stow,
        info:{
        name:this.name,
      packDate:this.packDate,
      expDate:this.expDate,
      Detail:this.Detail,
      guide:this.guide,
      packValue:this.packValue}
      });

        console.log(this.$store.state.stow);

      axios
        .post(this.$store.state.url.stow+"api/v1/createData", this.$store.state.stow, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        })
        .then((res) => {
          if (res.status == 200) {
      this.$router.replace({ path: "/qr-stow" });
            }
          });
    },
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
  bottom: 0px;
}
.nav__icon {
  font-size: 30px;
  color: #000;
}
.box{
    width: 100%;
    background-color: #dadada;
    height: 50px;
    border: 1px solid black;
    text-align: left;
    padding: 12px 20px;
    margin: 15px 0px 5px 0px;
}
section {
  margin: 0 auto;
  width: 50%;
  min-width: 290px;
}

.input {
  display: flex;
  flex-direction: column;
}
p {
  margin-top: 5px;
}
input {
  width: 100%;
  height: 50px;
  margin: 0px 0px 15px 0px;
  font-size: 18px;
  font-weight: lighter;
  padding-left: 20px;
  padding-right: 20px;
}
select {
  width: 100%;
  height: 50px;
  margin: 0px 0px 15px 0px;
  font-size: 18px;
  font-weight: lighter;
  padding-left: 20px;
}
button {
  margin: 50px auto;
  background-color: #81542d;
  color: white;
  border: none;
  cursor: pointer;
  width: 230px;
  height: 55px;
  font-size: 25px;
  font-weight: bold;
}
.next {
  margin: 50px auto;
  background-color: #81542d;
  min-width: 280px;
  height: 53px;
  font-size: 25px;
  font-weight: bold;
   display: flex;
  align-items: center;
   justify-content: center;
}
.next .nav__icon{
    text-decoration: none;
    color: #fff;
    font-size: 40px;
    margin: 10px auto;
}

</style>

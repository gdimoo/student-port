<template>
  <div id="milling4">
    <header>
      <router-link to="/milling3">
        <i class="material-icons nav__icon">keyboard_backspace</i>
      </router-link>
    </header>
    <section>
      <h2>รายละเอียด</h2>
      <div class="input">
        <p>เกรด</p>
        <input
          type="text"
          name="เกรด"
          v-model="this.$route.query.grade"
          :disabled="true"
          placeholder="เกรด"
          @input="update"
        />
        <p>วัน/เดือน/ปี หมดอายุ</p>
        <input
          type="date"
          name="ว/ด/ป"
          v-model="millingExp"
          placeholder="ว/ด/ป"
          value="2021-03-10"
          @input="update"
        />
        <p>ปริมาณ</p>
        <input
          type="number"
          name="ปริมาณ"
          v-model="value"
          placeholder="ปริมาณ"
          @input="update"
        />
        <p>รายละเอียด</p>
        <input
          type="text"
          name="รายละเอียด"
          v-model="Detail"
          placeholder="เมล็ดกลมสวย ไม่มีแตกหัก"
          @input="update"
        />
      </div>
    </section>
    <div class="input">
      <button @click="recordData()">QR Code</button>
    </div>
    <div class="input">
      <div class="next">
        <router-link to="/milling3"
          ><i class="material-icons nav__icon">arrow_back</i></router-link
        >
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "milling4",
  data() {
    if (this.$route.query.grade == 'A') {
      return {
      millingExp: this.$store.state.milling.grade.millingExp,
      Detail: this.$store.state.milling.grade.Detail,
      value: this.$store.state.milling.grade.value,
    }
    }
    else if (this.$route.query.grade == 'B') {
      return {
      millingExp: this.$store.state.milling.grade.millingExp,
      Detail: this.$store.state.milling.grade.Detail,
      value: this.$store.state.milling.grade.value,
    }
    
  }
  },

  computed: {
    user() {
      return 'milling1';
    },
    milling() {
      return this.$store.state.milling;
    },
  },
  methods: {
    update() {
      // POST request using axios with set headers
      // this.$store.commit('setLotID', this.lotID)
      // console.log(data);

        this.$store.commit("setMilling", {
        ...this.milling,
        grade:{
        millingExp: this.millingExp,
      Detail: this.Detail,
      grade: this.$route.query.grade,
      value: this.value,}
      });
   
        console.log(this.$store.state.milling);

    },
    recordData() {
      // POST request using axios with set headers
      this.$store.commit('setLotID', this.milling.lotID+this.$route.query.grade)
      // console.log(data);
      this.$store.commit("setMilling", {
        ...this.milling,
        grade:{
          gradeLotID:this.milling.lotID+this.$route.query.grade,
        millingExp: this.millingExp,
      Detail: this.Detail,
      grade: this.$route.query.grade,
      value: this.value,}
      });

        console.log(this.$store.state.milling);

      axios
        .post(this.$store.state.url.milling+"api/v1/createData", this.$store.state.milling, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        })
        .then((res) => {
          if (res.status == 200) {
      this.$router.replace({ path: "/qr-Rongsi" });
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
.box {
  width: 100%;
  background-color: #dadada;
  height: 50px;
  border: 1px solid black;
  text-align: left;
  padding: 12px 20px;
  margin: 15px 0px 5px 0px;
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
.next .nav__icon {
  text-decoration: none;
  color: #fff;
  font-size: 40px;
  margin: 10px auto;
}
</style>

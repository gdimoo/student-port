<template>
  <div id="milling2">
    <header>
      <router-link to="/milling1">
        <i class="material-icons nav__icon">keyboard_backspace</i>
      </router-link>
    </header>
    <section>
      <h2>ข้อมูลเบื้องต้น</h2>
      <div class="input">
        <input
          type="text"
          name="เลขล็อต"
          v-model="this.listing.lotID"
          :disabled="true"
          placeholder="ล็อตที่ได้รับ"
        />
        <input
          type="text"
          name="สายพันธุ์"
          :disabled="true"
          v-model="this.listing.species"
          placeholder="สายพันธุ์"
        />
        <input
          type="text"
          name="ปริมาณที่ได้รับ"
          :disabled="true"
          v-model="this.listing.value"
          placeholder="ปริมาณ"
        />
        <p>หมายเลขล็อต</p>
        <input
          type="text"
          name="เลขล็อต"
          :disabled="true"
          v-model="lotID"
          placeholder="หมายเลขล็อต"
        />
        <h2>เตรียมเมล็ด</h2>
        <p>วัน/เดือน/ปี เตรียมเมล็ด</p>
        <input
          type="date"
          name="ว/ด/ป"
          v-model="millingDate"
          placeholder="ว/ด/ป"
          value="2021-03-10"
        />
        <p>วิธีทำ</p>
        <select id="Prepare" name="Prepare" v-model="Prepare" form="Prepare">
          <option value="เตรียมแบบแห้ง">เตรียมแบบแห้ง</option>
          <option value="เตรียมแบบเปียก">เตรียมแบบเปียก</option>
        </select>
        <p>ปริมาณ</p>
        <input v-model="value" type="text" name="ปริมาณ" placeholder="ปริมาณ" />
      </div>

      <div class="input">
        <div class="next"  v-on:click="recordData()">
          <i class="material-icons nav__icon">arrow_forward</i>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import axios from "axios";
import moment from 'moment';

// if ( this.$store.state.milling.lotID == '') {
//    this.$store.state.milling.lotID = moment(new Date()).format('YYYYMMDDhmm')+'1'+this.$store.state.user
// }
export default {
  name: "milling2",
  data() {
    return {
      lotID: moment(new Date()).format('YYYYMMDDhmm')+'1'+localStorage.getItem('LoggedUser'),
      millingDate: this.$store.state.milling.millingDate,
      Prepare: this.$store.state.milling.Prepare,
      value: this.$store.state.milling.value,
      listing: {},
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    milling() {
      return this.$store.state.milling;
    },
  },
  created() {
    console.log("current user", this.user, this.$route.query.id,this.$store.state.token);
    // POST request using axios with set headers
    const headers = {
      Authorization: localStorage.getItem('token'),
      "My-Custom-Header": "foobar",
    };
    axios
      .get(
        this.$store.state.url.milling+`api/v1/getData/${this.$route.query.id}`,
        { headers }
      )
      .then((res) => {
        this.listing = res.data;
        console.log(this.listing);
      })
      .catch((err) =>  {
          this.$router.push("/");
          alert("คุณไม่มีสิทธิ์ กรุณา Login",err);
      });
  },
  methods: {
    recordData() {
      // POST request using axios with set headers
      // this.$store.commit('setLotID', this.lotID)
      // console.log(data);
      this.$store.commit("setMilling", {
        ...this.milling,
        receiveLotID:this.listing.lotID,
        species:this.listing.species,
        lotID: this.lotID,
        millingDate: this.millingDate,
        Prepare: this.Prepare,
        value: this.value,
      });
        console.log(this.$store.state.milling);

      // axios
      //   .post("http://165.232.173.183:3000/api/v1/createData", data, {
      //     headers: {
      //       Authorization: this.user,
      //     },
      //   })
      //   .then((res) => {
      //     if (res.status == 200) {
      this.$router.replace({ path: "/milling3" });
      //       }
      //     });
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
.box {
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
.next .nav__icon {
  text-decoration: none;
  color: #fff;
  font-size: 40px;
  margin: 10px auto;
}
</style>

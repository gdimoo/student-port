<template>
  <div id="school2">
    <header>
      <router-link to="/school1">
        <i class="material-icons nav__icon">keyboard_backspace</i>
      </router-link>
    </header>
    <section>
      <h2>ข้อมูลเบื้องต้น</h2>
      <div class="input">
        <input
          type="text"
          name="หมายเลขเอกสาร"
          v-model="this.listing.docID"
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
          name="เกรด"
          v-model="this.grade"
          :disabled="true"
          placeholder="เกรด"
        />
        <input
          type="text"
          name="ปริมาณที่ได้รับ"
          v-model="this.listing.value"
          :disabled="true"
          placeholder="ปริมาณ"
        />
        <p>หมายเลขเอกสาร</p>
        <input
          type="text"
          name="หมายเลขเอกสาร"
          :disabled="true"
          v-model="docID"
          placeholder="หมายเลขเอกสาร"
        />
        <h2>คั่ว</h2>
        <p>วัน/เดือน/ปี</p>
        <input
          type="date"
          name="ว/ด/ป"
          v-model="roastDate"
          placeholder="ว/ด/ป"
          value="2021-03-10"
        />
        <p>ระดับการคั่ว</p>
        <select id="roast" name="roast" v-model="roast_lv" form="roast">
          <option value="Light">คั่วอ่อน</option>
          <option value="Medium">คั่วปานกลาง</option>
          <option value="Dark">คั่วเข้ม</option>
        </select>
        <p>ปริมาณ</p>
        <input
          v-model="value"
          type="text"
          name="ปริมาณ"
          placeholder="ปริมาณ"
        />
        <p>วัน/เดือน/ปี หมดอายุ</p>
        <input
          type="date"
          name="ว/ด/ป"
          v-model="roastExp"
          placeholder="ว/ด/ป"
          value="2021-03-10"
        />
      </div>
    
      <div class="input">
          <div class="next" v-on:click="recordData()"><i class="material-icons nav__icon">arrow_forward</i></div>
      </div>
    </section>
  </div>
</template>
<script>
import axios from "axios";
import moment from 'moment';
export default {
  name: "school2",
  data() {
    return {
      docID: moment(new Date()).format('YYYYMMDDhmm')+'2'+localStorage.getItem('LoggedUser'),
      roastDate: this.$store.state.school.roastDate,
      roastExp: this.$store.state.school.roastExp,
      roast_lv: this.$store.state.school.roast_lv,
      value: this.$store.state.school.value,
      grade: this.$route.query.id.slice(-1),
      listing: {},
      info: ''
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    school() {
      return this.$store.state.school;
    },
  },
  created() {
    console.log("current user", this.user, this.$route.query.id);
    // POST request using axios with set headers
    const headers = {
      Authorization: localStorage.getItem('token'),
      "My-Custom-Header": "foobar",
    };
    axios
      .get(
        this.$store.state.url.school+`api/v1/getData/${this.$route.query.id}`,
        { headers }
      )
      .then((res) => {
        this.listing = res.data;
        console.log(this.listing);
      })
      .catch((err) => alert(err));
  },
  methods: {
    recordData() {
      // POST request using axios with set headers
      // this.$store.commit('setdocID', this.docID)
      // console.log(data);
      this.$store.commit("setschool", {
        ...this.school,
        receivedocID:this.listing.docID,
        species:this.listing.species,
        docID: this.docID,
        grade: this.grade,
        value: this.value,
        roast_Date: this.roastDate,
        roastExp: this.roastExp,
        roast_lv: this.roast_lv,
      });
        console.log(this.$store.state.school);

      // axios
      //   .post("http://165.232.173.183:3000/api/v1/createData", data, {
      //     headers: {
      //       Authorization: this.user,
      //     },
      //   })
      //   .then((res) => {
      //     if (res.status == 200) {
      this.$router.replace({ path: "/school3" });
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

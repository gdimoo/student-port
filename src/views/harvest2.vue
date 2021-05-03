<template>
  <div id="harvest2">
    <header>
      <router-link to="/harvest1">
        <i class="material-icons nav__icon">keyboard_backspace</i>
      </router-link>
    </header>
    <section>
      <h2>ข้อมูลเบื้องต้น</h2>
      <div class="input">
        <p>หมายเลขล็อต</p>
        <input
          type="text"
          name="เลขล็อต"
          :disabled="true"
          v-model="lotID"
          placeholder="หมายเลขล็อต"
        />
        <p>สายพันธุ์</p>
        <select id="Species" name="Species" v-model="species" form="Species">
          <option value="อราบิก้า">อราบิก้า</option>
          <option value="โรบัสต้า">โรบัสต้า</option>
        </select>
        <p>วัน/เดือน/ปี การเก็บเกี่ยว</p>
        <input
          type="date"
          name="ว/ด/ป"
          v-model="harvestDate"
          placeholder="ว/ด/ป"
          value="2021-03-10"
        />
        <p>ส่วนผสมในดิน/สารเคมีที่ใช้</p>
        <input
          v-model="fertilizer"
          type="text"
          name="ส่วนผสมในดิน/สารเคมีที่ใช้"
          placeholder="หน้าดิน ปุ๋ยคอก ปูนขาว (โดโลไมท์)  ปุ๋ยฟอสเฟตและฟูราดาน ผสมให้เข้ากัน และไม่ใช้สารเคมี"
        />
      </div>
      <h2>วิธีเก็บ</h2>
      <div class="input">
        <p>วิธีเก็บเกี่ยว</p>
        <select id="how" name="how" form="how" v-model="method">
          <option value="แบบรวดเดียว">แบบรวดเดียว</option>
          <option value="แบบคัดสรร">แบบคัดสรร</option>
        </select>
        <p>ปริมาณ</p>
        <input
          type="number"
          name="ปริมาณ"
          v-model="value"
          placeholder="ปริมาณ"
        />
      </div>
    </section>
    <div class="input">
      <button @click="created()">QR Code</button>
    </div>
    <!-- <div class="input">
      <router-link to="/qr">QR Code</router-link>
    </div> -->
  </div>
</template>

<script>
import axios from "axios";
import moment from 'moment';
// lotID = YYYYMMDD(0,1,2)(userid)(time)
export default {
  name: "harvest2",
  data() {
    return {
      lotID: moment(new Date()).format('YYYYMMDDhmm')+'0'+localStorage.getItem('LoggedUser'),
      species: "",
      harvestDate: "",
      fertilizer: "",
      method: "",
      value: 0,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    farm() {
      return this.$store.state.farm;
    },
  },
  methods: {
    created() {
      // POST request using axios with set headers
      this.$store.commit('setLotID', this.lotID)

      this.$store.commit("setFarm", {
        ...this.farm,
        species:this.species,
        lotID: this.lotID,
        harvestDate: this.harvestDate,
        fertilizer: this.fertilizer,
        method: this.method,
        value: String(this.value),
      });
      console.log(this.$store.state.url.farmer);
      console.log(this.$store.state.user);
      axios
        .post(this.$store.state.url.farmer+"api/v1/createData", this.$store.state.farm, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        })
        .then((res) => {
          if (res.status == 200) {
            this.$router.replace({ path: "/qr" });
          }
        }).catch((err) => {
        console.log(err.response.status);
        if (err.response.status === 401) {
          this.$router.push("/");
          alert("คุณไม่มีสิทธิ์ กรุณา Login");
          
        }
      });
    },
  },
  created(){
    console.log('harvest2',this.$store.state.token);
    axios
        .get(this.$store.state.url.farmer, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        })
        .then((res) => {
          console.log(res);
        }).catch((err) => {
          this.$router.push("/");
          alert("คุณไม่มีสิทธิ์ กรุณา Login",err);
      });
    },
  
};
</script>

<style scoped>
header {
  height: 65px;
  position: relative;
  margin-bottom: 50px;
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

/* .input a {
  text-decoration: none;
  color: #fff;
  background-color: #81542d;
  text-align: center;
  padding: 10px;
  font-size: 20px;
  font-weight: bolder;
} */
</style>

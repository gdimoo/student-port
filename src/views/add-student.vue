<template>
  <div id="study_report2">
    <header>
      <router-link to="/school">
        <i class="material-icons nav__icon">keyboard_backspace</i>
      </router-link>
    </header>
    <section>
      <h2>ข้อมูลนักเรียน</h2>
      <div class="input">
        <p>เลขบัตรประชาชนนักเรียน</p>
        <input
          v-model="idCard"
          type="text"
          name="เลขบัตรประชาชนนักเรียน"
          placeholder="เลขบัตรประชาชนนักเรียน"
        />
        <p>วัน/เดือน/ปี ที่เข้าศึกษา</p>
        <input
          type="date"
          name="ว/ด/ป"
          v-model="study_reportDate"
          placeholder="ว/ด/ป"
          value="2021-03-10"
        />
        <p>คำนำหน้าชื่อ</p>
        <input
          type="text"
          name="ว/ด/ป"
          v-model="study_reportDate"
          placeholder="ว/ด/ป"
          value="2021-03-10"
        />
        <p>ชื่อ-นามสกุล</p>
        <input
          type="text"
          name="ว/ด/ป"
          v-model="study_reportDate"
          placeholder="ว/ด/ป"
          value="2021-03-10"
        />
        <p>วัน/เดือน/ปี เกิด</p>
        <input
          type="date"
          name="ว/ด/ป"
          v-model="study_reportDate"
          placeholder="ว/ด/ป"
          value="2021-03-10"
        />
      </div>
    </section>
    <div class="input">
      <button @click="created()">บันทึกข้อมูล</button>
    </div>
    <!-- <div class="input">
      <router-link to="/qr">QR Code</router-link>
    </div> -->
  </div>
</template>

<script>
import axios from "axios";
import moment from 'moment';
// docID = YYYYMMDD(0,1,2)(userid)(time)
export default {
  name: "study_report2",
  data() {
    return {
      docID: moment(new Date()).format('YYYYMMDDhmm')+'0'+localStorage.getItem('LoggedUser'),
      species: "",
      study_reportDate: "",
      fertilizer: "",
      method: "",
      value: 0,
      workExperiences: [
      {
        company: "",
        title: ""
      },
    ]
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
      this.$store.commit('setdocID', this.docID)

      this.$store.commit("setFarm", {
        ...this.farm,
        species:this.species,
        docID: this.docID,
        study_reportDate: this.study_reportDate,
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
          // this.$router.push("/");
          // alert("คุณไม่มีสิทธิ์ กรุณา Login");
          
        }
      });
    },
    addExperience () {
      this.workExperiences.push({
        company: '',
        title: ''
      })
    },

    submit () {
      const data = {
        workExperiences: this.workExperiences
      }
      alert(JSON.stringify(data, null, 2))
    }
  },
  // created(){
  //   console.log('study_report2',this.$store.state.token);
  //   axios
  //       .get(this.$store.state.url.farmer, {
  //         headers: {
  //           Authorization: localStorage.getItem('token'),
  //         },
  //       })
  //       .then((res) => {
  //         console.log(res);
  //       }).catch((err) => {
  //         // this.$router.push("/");
  //         alert(err);
  //     });
  //   },
  
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

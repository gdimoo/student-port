<template>
  <div id="study_report2">
    <header>
      <router-link to="/study_report1">
        <i class="material-icons nav__icon">keyboard_backspace</i>
      </router-link>
    </header>
    <section>
        <h2>ข้อมูลเบื้องต้น</h2>
      <div class="input">
        <p>หมายเลขเอกสาร</p>
        <input
          type="text"
          name="หมายเลขเอกสาร"
          :disabled="true"
          v-model="docID"
          placeholder="หมายเลขเอกสาร"
        />
        <p>วัน/เดือน/ปี ที่บันทึกข้อมูล</p>
        <input
          type="date"
          name="ว/ด/ป"
          v-model="study_reportDate"
          placeholder="ว/ด/ป"
          value="2021-03-10"
        />
        <p>เลขบัตรประชาชนนักเรียน</p>
        <input
          v-model="fertilizer"
          type="text"
          name="เลขบัตรประชาชนนักเรียน"
          placeholder="เลขบัตรประชาชนนักเรียน"
          
        />
      </div>
      <h2>ผลการศึกษา</h2>
       <form>
      <h1>รายวิชา</h1>
      <div class="work-experiences">

        <div class="form-row" v-for="(experience, index) in studyReports" :key="index">
          <div class="form-group col-md-6">
            <label>วิชา</label>
            <input v-model="experience.subject" :name="`studyReports[${index}][subject]`" type="text" class="form-control" placeholder="ชื่อรายวิชา">
          </div>
          <div class="form-group col-md-6">
            <label>คะแนน</label>
            <input v-model="experience.score" :name="`studyReports[${index}][score]`" type="text" class="form-control" placeholder="คะแนน">
          </div>
        </div>
      </div>

      <div class="form-group">
        <button @click="addExperience" type="button" class="btn btn-secondary">เพิ่มรายวิชา</button>
      </div>
      
      <hr>

      <div class="form-group">
        <button @click="submit" type="button" class="btn btn-primary">Submit</button>
      </div>
    </form>
      <div class="input">
        <p>ภาคการศึกษา</p>
        <input
          type="number"
          name="ปริมาณ"
          v-model="value"
          placeholder="ปริมาณ"
        />
        <p>ปีการศึกษา</p>
        <input
          type="number"
          name="ปริมาณ"
          v-model="value"
          placeholder="ปริมาณ"
        />
      </div>
    </section>
    <div class="input">
      <button @click="created()">บันทึกข้อมูล</button>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";

// if ( this.$store.state.cert.docID == '') {
//    this.$store.state.cert.docID = moment(new Date()).format('YYYYMMDDhmm')+'1'+this.$store.state.user
// }
export default {
  name: "cert2",
  data() {
    return {
      docID:
        moment(new Date()).format("YYYYMMDDhmm") +
        "1" +
        localStorage.getItem("LoggedUser"),
      certDate: this.$store.state.cert.certDate,
      Prepare: this.$store.state.cert.Prepare,
      value: this.$store.state.cert.value,
      listing: {},
      studyReports: [
      {
        subject: "",
        score: ""
      }
    ]
    };
  },
  computed: {
    user() {
      return this.$store.state.token;
    },
  },
  methods: {
    addExperience () {
      this.studyReports.push({
        subject: '',
        score: ''
      })
    },

    submit () {
      const data = {
        studyReports: this.studyReports
      }
      alert(JSON.stringify(data, null, 2))
    },
    recordData() {
      // POST request using axios with set headers
      // this.$store.commit('setdocID', this.docID)
      // console.log(data);
      this.$store.commit("setcert", {
        ...this.cert,
        receivedocID: this.listing.docID,
        species: this.listing.species,
        docID: this.docID,
        certDate: this.certDate,
        Prepare: this.Prepare,
        value: this.value,
      });
      console.log(this.$store.state.cert);

      axios
        .post(this.$store.state.url.school+"api/v1/createReport", data, {
          headers: {
            Authorization: this.user,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            alert('บันทึกข้อมูลสำเร็จ')
      this.$router.replace({ path: "/study_report1" });
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

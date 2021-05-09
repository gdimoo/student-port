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
          :disabled="true"
          name="ว/ด/ป"
          v-model="recordDate"
          placeholder="ว/ด/ป"
        />
        <p>เลขบัตรประชาชนนักเรียน</p>
        <input
          v-model="owner"
          type="text"
          name="เลขบัตรประชาชนนักเรียน"
          placeholder="เลขบัตรประชาชนนักเรียน"
          
        />
      
        <p>ภาคการศึกษา</p>
        <input
          type="semester"
          name="ภาคการศึกษา"
          v-model="semester"
          placeholder="ภาคการศึกษา"
        />
        <p>ปีการศึกษา</p>
        <input
          type="year"
          name="ปีการศึกษา"
          v-model="year"
          placeholder="ปีการศึกษา"
        />
      </div>
      <h2>ผลการศึกษา</h2>
       <form>
      <h1>รายวิชา</h1>
      <div class="report">

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
        <button @click="addReport" type="button" class="btn btn-secondary">เพิ่มรายวิชา</button>
      </div>
      
      <hr>
    </form>
    </section>
    <div class="input">
      <button @click="recordData()">บันทึกข้อมูล</button>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";

export default {
  name: "report2",
  data() {
    return {
      docID:
        moment(new Date()).format("YYMMDD")+
        localStorage.getItem("LoggedUser").split(',')[0],
      recordDate: moment().format('YYYY-MM-DD'),
      owner: this.$store.state.report.owner,
      semester: this.$store.state.report.semester,
      year: this.$store.state.report.year,
      listing: {},
      studyReports: [{
        subject: "",
        score: ""
      }],
    };
  },
  computed: {
    user() {
      return this.$store.state.token;
    },
  },
  methods: {
    addReport () {
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
      axios
        .post(this.$store.state.url.school+"api/v1/readData/"+this.owner, this.$store.state.report, {
          headers: {
            Authorization: this.user,
          },
        })
        .then((res) => {
          if (res) {
            console.log(res);
            alert(res)
      // this.$router.replace({ path: "/study_report1" });
            }
          });

      // this.$store.commit("setReport", {
      //   ...this.report,
      //   docID: this.docID,
      //   recordDate: this.recordDate,
      // owner: this.owner,
      // semester: this.semester,
      // year: this.year,
      // studyReports: JSON.stringify(this.studyReports, null, 2),
      // });
      // console.log(this.$store.state.report);
      // console.log(this.$store.state.report);

      // axios
      //   .post(this.$store.state.url.school+"api/v1/createReport", this.$store.state.report, {
      //     headers: {
      //       Authorization: this.user,
      //     },
      //   })
      //   .then((res) => {
      //     if (res.status == 200) {
      //       alert('บันทึกข้อมูลสำเร็จ')
      // this.$router.replace({ path: "/study_report1" });
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

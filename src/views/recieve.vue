<template>
  <div id="study_report2">
    <header>
      <router-link to="/">
        <i class="material-icons nav__icon">keyboard_backspace</i>
      </router-link>
    </header>
    <section>
      <h5>กรอกรหัสที่ได้รับจากนักเรียน เพื่อยืนยันสิทธิ์ในการดูเอกสาร</h5>
      <div class="input">
        <p>รหัสมอบสิทธิ์ในการดูเอกสาร</p>
        <input
          type="text"
          name="รหัสมอบสิทธิ์ในการดูเอกสาร"
          v-model="transferToken"
          placeholder="รหัสมอบสิทธิ์ในการดูเอกสาร"
        />
  </div>

    </section>
    <div class="input">
      <button class="waves-effect waves-light btn-large" @click="recordData()">ยืนยันข้อมูล</button>
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
    creator(){
      return localStorage.getItem("LoggedUser").split(',')[0];

    }
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
      try {
        axios
        .get(this.$store.state.url.school+"api/v1/readData/"+this.owner, {
          headers: {
            Authorization: this.user,
          },
        })
        .then((res) => {
          console.log(res.data.status);
          if (res.data.status!=500) {
             this.$store.commit("setReport", {
        ...this.report,
        docID: this.docID,
        recordDate: this.recordDate,
      owner: this.owner,
      semester: this.semester,
      year: this.year,
      studyReports: JSON.stringify(this.studyReports, null, 2),
      studentProfile: res
      });
      console.log(this.$store.state.report);

      axios
        .post(this.$store.state.url.school+"api/v1/createReport", this.$store.state.report, {
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
            }

            else{
              alert('ยังไม่มีข้อมูลนักเรียนในระบบ กรุณาเพิ่มข้อมูลนักเรียน')
              this.$router.replace({ path: "/add-student" });

            }
          });
      } 
      catch (error) {
        alert(error)
      }
    }
      

     
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

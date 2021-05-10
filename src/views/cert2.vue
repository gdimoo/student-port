<template>
  <div id="cert2">
    <header>
      <router-link to="/cert1">
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
        <p>วัน/เดือน/ปี ที่ฝึกอบรม</p>
        <input
          type="date"
          name="ว/ด/ป"
          :disabled="true"
          v-model="certDate"
          placeholder="ว/ด/ป"
        />
        <p>เลขบัตรประชาชนผู้เข้าอบรม</p>
        <input
          v-model="idCard"
          type="text"
          name="เลขบัตรประชาชนผู้เข้าอบรม"
          placeholder="เลขบัตรประชาชนผู้เข้าอบรม"
        />
      </div>
      <h2>รายละเอียดการอบรม</h2>

        <p>ชื่อหลักสูตร</p>
        <input
          type="text"
          name="ชื่อหลักสูตร"
          v-model="course"
          placeholder="ชื่อหลักสูตร"
        />
        <p>ผู้ฝึกสอน</p>
        <input
          v-model="trainer"
          type="text"
          name="ผู้ฝึกสอน"
          placeholder="ผู้ฝึกสอน"
        />
    </section>
    <div class="input">
      <button @click="created()">บันทึกข้อมูล</button>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import axios from "axios";

export default {
  name: "cert2",
  data() {
    return {
      docID:
        moment(new Date()).format("YYYYMMDDhmm") +
        localStorage.getItem("LoggedUser").split(',')[0],
      certDate:  moment().format('YYYY-MM-DD'),
      course: "",
      idCard: "",
      trainer: "",
    };
  },
  created(){
      console.log('cert2',localStorage.getItem("LoggedUser"));

  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    cert() {
      return this.$store.state.cert;
    },
  },
  methods: {

    submit () {
      const data = {
        studyReports: this.studyReports
      }
      alert(JSON.stringify(data, null, 2))
    },
    recordData() {

      this.$store.commit("setCert", {
        docID: this.docID,
        owner: this.idCard,
        certDate: this.certDate,
        course: this.course,
        trainer: this.trainer,
      });
      console.log(this.$store.state.cert);

      axios
        .post("http://165.232.173.183:3000/api/v1/createData", {
          headers: {
            Authorization: this.user,
          },
        })
        .then((res) => {
          if (res.status == 200) {
      this.$router.replace({ path: "/cert3" });
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

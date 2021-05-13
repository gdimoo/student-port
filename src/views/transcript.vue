<template>
  <div id="study_report1">
    <header>
      <i @click="$router.go(-1)" class="material-icons nav__icon">keyboard_backspace</i>
    </header>
    <div class="title">
      <h1>รายการผลการศึกษา</h1>
      <div class="icon">
        <!-- <router-link to="/study_report2">
          <i class="material-icons nav__icon">add_circle</i>
        </router-link> -->
      </div>
    </div>
    <section>
      <h1 v-if="this.reportData.length > 0">
        <div
          class="collection"
          v-for="item in this.reportData"
          :key="item.docID"
        >
        <p>หมายเลขเอกสาร : {{ (item.docID) }}</p>
          <p>นักเรียน : {{ (item.owner) }}</p>
          <p>ว/ด/ป ที่บันทึกข้อมูล : {{ JSON.parse(item.information).recordDate }}</p>
          <p>ปีการศึกษา : {{ JSON.parse(item.information).semester }} / {{ JSON.parse(item.information).year }}</p>
          <p>ผลการศึกษา : {{ JSON.parse(item.information).studyReports }}</p>

        </div>
      </h1>
      <h2 v-else>ผู้ใช้ยังไม่การบันทึกข้อมูลการเรียน</h2>
    </section>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "study_report1",
  data() {
    return {
      listing: [],
      reportData: [],
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  created() {
    console.log("login    ", localStorage.getItem("LoggedUser"));
    const headers = {
      Authorization: localStorage.getItem('token'),
      "My-Custom-Header": "foobar",
    };
    axios
      .get(this.$store.state.url.school + "api/v1/readData", { headers })
      .then((res) => {
        this.listing = res.data;

        this.listing.forEach(record => {
          if (record.Record.category.includes('transcript') && record.Record.owner.includes(localStorage.getItem("LoggedUser")) ) {
            this.reportData.push(record.Record)
          }
          });
          console.log(this.reportData);
        if (res.status == 401) {
          this.$router.replace({ path: "/login" });
        }
      })
      .catch((err) => {
        console.log(err.response.status);
        if (err.response.status === 401) {
          this.$router.push("/school");
          alert("คุณไม่มีสิทธิ์ในจัดการข้อมูลในโรงเรียน");
          
        }
      });
  },
};
</script><style scoped>
header {
  height: 50px;
  position: relative;
}
header i {
  position: absolute;
  left: 10%;
  bottom: 0px;
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 50px 0;
  position: relative;
}
.title h1 {
  font-size: 30px;
  font-weight: bolder;
  position: absolute;
  left: 5%;
}
.title i {
  margin-top: 10px;
  position: absolute;
  right: 10%;
}

section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  font-size: 18px;
  width: 60%;
  
}
h1 {
  min-width: 450px;
  max-width: 600px;
}
section h2 {
  font-size: 18px;
  font-weight: 500;
}
.collection{
  width: 100%;
  background-color: #faeac6;
}
.collection p {
  font-size: 18px;
  font-weight: lighter;
  margin: 0 0 5px 40px;
  line-height: normal;

  padding-top: 5px;
}

.nav__icon {
  font-size: 30px;
  color: #000;
}
</style>
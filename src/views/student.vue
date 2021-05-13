<template>
  <div id="study_report1">
    <header>
      <router-link to="/school">
        <i class="material-icons nav__icon">keyboard_backspace</i>
      </router-link>
    </header>
    <div class="title">
      <h1>รายชื่อนักเรียน</h1>
      <div class="icon">
        <router-link to="/add-student">
          <i class="material-icons nav__icon">add_circle</i>
        </router-link>
      </div>
    </div>
    <section>
      <h1 v-if="this.studentData.length > 0">
        <ul class="collection"
          v-for="item in this.studentData"
          :key="item.docID"
        >
        <p>หมายเลขบัตรประจำตัวประชาชน : {{ (item.docID) }}</p>
          <p>ว/ด/ป ที่เข้าเรียน : {{ JSON.parse(item.information).admissionDate }}</p>
          <p>ชื่อ-สกุล : {{ JSON.parse(item.information).title }} {{ JSON.parse(item.information).name }}</p>
          <p>ว/ด/ป เกิด : {{ JSON.parse(item.information).birthDate }}</p>
        </ul>
      </h1>
      <h2 v-else>ผู้ใช้ยังไม่มีข้อมูลนักเรียน</h2>
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
      studentData: [],
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  created() {
    console.log("current user har1", this.$store.state.user, localStorage.getItem('token'));
    // POST request using axios with set headers
    const headers = {
      Authorization: localStorage.getItem('token'),
      "My-Custom-Header": "foobar",
    };
    axios
      .get(this.$store.state.url.school + "api/v1/readData", { headers })
      .then((res) => {
        this.listing = res.data;
        // this.listing = JSON.stringify(this.listing).replace(/\\/g, '')
        // console.log((this.listing),this.listing.length);
        this.listing.forEach(record => {
          // console.log(record.Record)
          if (record.Record.category.includes('Profile')) {
            this.studentData.push(record.Record)
          }
          });
          console.log('studentData',this.studentData);
        if (res.status == 401) {
          this.$router.replace({ path: "/login" });
        }
      })
      .catch((err) => {
        console.log(err.response.status);
        if (err.response.status === 401) {
          this.$router.push("/school");
          alert("คุณไม่มีสิทธิ์ส่วนการจัดการข้อมูลนักเรียน");
          
        }
      });
  },
};
</script>
<style scoped>
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
  padding-top: 5px;
}

.nav__icon {
  font-size: 30px;
  color: #000;
}
</style>

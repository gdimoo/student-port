<template>
  <div id="study_report1">
    <header>
      <router-link to="/school">
        <i class="material-icons nav__icon">keyboard_backspace</i>
      </router-link>
    </header>
    <div class="title">
      <h1>การอบรม</h1>
      <div class="icon">
        <router-link to="/cert2">
          <i class="material-icons nav__icon">add_circle</i>
        </router-link>
      </div>
    </div>
    <section>
      <h1 v-if="this.farmerData.length > 0">
        <div
          class="content"
          v-for="item in this.farmerData"
          :key="item.docID"
        >
        <p>หมายเลขเอกสาร : {{ (item.docID) }}</p>
          <p>ว/ด/ป ที่บันทึกข้อมูล : {{ JSON.parse(item.other).farm.study_reportDate }}</p>
          <p>เอกสารของ : {{ (item.species) }}</p>
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
      farmerData: [],
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
      .get(this.$store.state.url.farmer + "api/v1/readData", { headers })
      .then((res) => {
        this.listing = res.data;
        // this.listing = JSON.stringify(this.listing).replace(/\\/g, '')
        // console.log((this.listing),this.listing.length);
        this.listing.forEach(record => {
          // console.log(record.Record)
          if (record.Record.docID.includes('0'+localStorage.getItem('LoggedUser'))) {
            this.farmerData.push(record.Record)
          }
          });
          console.log(this.farmerData);
        if (res.status == 401) {
          this.$router.replace({ path: "/login" });
        }
      })
      .catch((err) => {
        console.log(err.response.status);
        if (err.response.status === 401) {
          this.$router.push("/school");
          alert("คุณไม่มีสิทธิ์ในส่วนการนักเรียน");
          
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
  width: 50%;
  min-width: 300px;
}
section h2 {
  font-size: 18px;
  font-weight: 500;
}
.content {
  width: 100%;
  height: 190px;
  background-color: #faeac6;
  margin: 10px 0 10px 0;
}
.content p {
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

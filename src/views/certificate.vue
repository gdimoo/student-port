<template>
  <div id="study_report1">
    <header>
      <i @click="$router.go(-1)" class="material-icons nav__icon"
        >keyboard_backspace</i
      >
    </header>
    <div class="title">
      <h1>การอบรม</h1>
    </div>
    <section>
      <h1 v-if="this.certData.length > 0">
        <div class="collection" v-for="item in this.certData" :key="item.docID">
          <!-- <p>หมายเลขเอกสาร : {{ (item.docID) }}</p> -->
          <p>
            วัน/เดือน/ปี ที่ฝึกอบรม :
            {{ JSON.parse(item.information).certDate }}
          </p>
          <p>ชื่อหลักสูตร : {{ JSON.parse(item.information).course }}</p>
          <p>ผู้ฝึกสอน : {{ JSON.parse(item.information).trainer }}</p>
          <p>เอกสารของ : {{ item.owner }}</p>
        </div>
      </h1>
      <h2 v-else>ผู้ใช้ยังไม่มีบันทึกข้อมูลการฝึกอบรม</h2>
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
      certData: [],
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  created() {
    const headers = {
      Authorization: localStorage.getItem("token"),
      "My-Custom-Header": "foobar",
    };
    axios
      .get(this.$store.state.url.data + "api/v1/readData", { headers })
      .then((res) => {
        this.listing = res.data;
        // this.listing = JSON.stringify(this.listing).replace(/\\/g, '')
        // console.log((this.listing),this.listing.length);
        this.listing.forEach((record) => {
          // console.log(record.Record)
          if (
            record.Record.category.includes("certificate") &&
            record.Record.owner.includes(localStorage.getItem("LoggedUser"))
          ) {
            this.certData.push(record.Record);
          }
        });
        console.log(this.certData);
        if (res.status == 401) {
          this.$router.replace({ path: "/login" });
        }
      })
      .catch((err) => {
        console.log(err.response.status);
        if (err.response.status === 401) {
          this.$router.push("/school");
          alert("คุณไม่มีสิทธิ์ในส่วนการอบรม");
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
.collection {
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
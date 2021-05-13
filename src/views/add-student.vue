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
          v-model="admissionDate"
          placeholder="ว/ด/ป"
        />
        <p>คำนำหน้าชื่อ</p>
        <input
          type="text"
          name="ว/ด/ป"
          v-model="title"
          placeholder="คำนำหน้าชื่อ"
        />
        <p>ชื่อ-นามสกุล</p>
        <input
          type="text"
          name="ว/ด/ป"
          v-model="name"
          placeholder="ชื่อ-นามสกุล"
        />
        <p>วัน/เดือน/ปี เกิด</p>
        <input
          type="date"
          name="ว/ด/ป"
          v-model="birthDate"
          placeholder="วัน/เดือน/ปี เกิด"
        />
      </div>
    </section>
    <div class="input">
      <button @click="addStudent()">บันทึกข้อมูล</button>
    </div>

  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "study_report2",
  data() {
    return {
      idCard: "",
      admissionDate: new Date().toISOString().substr(0, 10),
      title: "",
      name: "",
      birthDate: new Date().toISOString().substr(0, 10)
    };
  },
  methods: {
    addStudent() {
      this.$store.commit("setStudentProfile", {
        docID: this.idCard,
        owner: this.idCard,
        title: this.title,
        name: this.name,
        admissionDate: this.admissionDate,
        birthDate: this.birthDate,
      });
      console.log(this.$store.state.user);
      axios
        .post(this.$store.state.url.school+"api/v1/addStudent" ,this.$store.state.studentProfile, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        })
        .then((res) => {
          console.log(res);
          if (res.status == 200) {
            alert('เพิ่มข้อมูลสำเร็จ')
            this.$router.replace({ path: "/student" });
          }
        }).catch((err) => {
        console.log(err.response.status);
        if (err.response.status === 401) {
          // this.$router.push("/");
          // alert("คุณไม่มีสิทธิ์ กรุณา Login");
          
        }
      });
    },
    submit () {
      const data = {
        workExperiences: this.workExperiences
      }
      alert(JSON.stringify(data, null, 2))
    }
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

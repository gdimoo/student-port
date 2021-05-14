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
      <button class="waves-effect waves-light btn-large" @click="recieve(transferToken)">
        ยืนยันข้อมูล
      </button>
    </div>
  </div>
</template>
<script>
import axios from "axios";
// import moment from "moment";
export default {
  name: "recieve",
  components:{
  },
  data() {
    return {
      listing: [],
      transferToken:'',
    };
  },
  computed: {
    creator() {
      return localStorage.getItem("LoggedUser").split(",")[0];
    },
  },
  methods: {
    recieve(docID) {
      console.log("recieve ", docID);
      axios
        .get(this.$store.state.url.data + `api/v1/recieve/${docID}`, {
        })
        .then((res) => {
          if (res.data.status!=500) {
          console.log(res);
          if (
            res.data.creator.includes(res.data.owner) && res.data.category.includes('request')
          ) {
            alert('ข้อมูลยังไม่ได้รับการอนุมัติจากองค์กรที่เกี่ยวข้อง')
          } else if(res.data.category.includes('request')) {
            alert('ระบบรับรหัสมอบสิทธิ์ในการดูเอกสาร')
          this.listing = res.data;
          this.$store.commit("setPublicReport", {
      owner: this.listing.owner,
      transcript: JSON.parse(this.listing.information).transcript == 'true',
      certificate: JSON.parse(this.listing.information).certficate == 'true',
      });
      this.$router.replace({ path: "/report" });

          }
          else{
            alert("รหัสมอบสิทธิ์ในการดูเอกสารไม่ถูกต้อง")
          }
          }
          else{
            alert("รหัสมอบสิทธิ์ในการดูเอกสารไม่ถูกต้อง")
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

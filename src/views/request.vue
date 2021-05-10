<template>
  <div id="cert2">
    <header>
      <router-link to="/training">
        <i class="material-icons nav__icon">keyboard_backspace</i>
      </router-link>
    </header>
    <section>
      <div id="tabs" class="container">
        <div class="tabs">
          <a
            v-on:click="activetab = 1"
            v-bind:class="[activetab === 1 ? 'active' : '']"
            >รอดำเนินการ<span class="new badge">{{pending}}</span></a
          >
          <a
            v-on:click="activetab = 2"
            v-bind:class="[activetab === 2 ? 'active' : '']"
            >ดำเนินการเสร็จสิ้น</a
          >
        </div>

        <div class="content">
          <div v-if="activetab === 1" class="tabcontent">
            Is this the real life? Is this just fantasy?
          </div>
          <div v-if="activetab === 2" class="tabcontent">
            Caught in a landslide, no escape from reality
          </div>
          <div v-if="activetab === 3" class="tabcontent">
            Open your eyes, look up to the skies and see
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import moment from "moment";
import axios from "axios";

export default {
  name: "cert2",
  data() {
    return {
      activetab: 1,
      pending:4,
      docID:
        moment(new Date()).format("YYYYMMDDhmm") +
        localStorage.getItem("LoggedUser").split(",")[0],
      certDate: moment().format("YYYY-MM-DD"),
      course: "",
      idCard: "",
      trainer: "",
    };
  },
  created() {
    console.log("cert2", localStorage.getItem("LoggedUser"));
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
    submit() {
      const data = {
        studyReports: this.studyReports,
      };
      alert(JSON.stringify(data, null, 2));
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
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* STYLING */
.container {
  margin: 40px auto;
  min-height: 50%;
  color: #888;
}

/* Style the tabs */
.tabs {
  overflow: hidden;
  margin-left: 20px;
  margin-bottom: -2px;
}

.tabs ul {
  list-style-type: none;
  margin-left: 20px;
}

.tabs a {
  float: left;
  cursor: pointer;
  padding: 12px 24px;
  transition: background-color 0.2s;
  border: 1px solid #ccc;
  border-right: none;
  background-color: #f1f1f1;
  border-radius: 10px 10px 0 0;
  font-weight: bold;
}
.tabs a:last-child {
  border-right: 1px solid #ccc;
}

/* Change background color of tabs on hover */
.tabs a:hover {
  background-color: #aaa;
  color: #fff;
}

/* Styling for active tab */
.tabs a.active {
  background-color: #fff;
  color: #484848;
  border-bottom: 2px solid #fff;
  cursor: default;
}

/* Style the tab content */
.tabcontent {
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 3px 3px 6px #e1e1e1;
}
</style>

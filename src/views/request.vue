<template>
  <div id="cert2">
    <header>
      <i @click="$router.go(-1)" class="material-icons nav__icon"
        >keyboard_backspace</i
      >
    </header>
    <section>
      <div id="tabs" class="container">
        <div class="tabs">
          <a
            v-if="this.$store.state.role == 'data-center'"
            v-on:click="activetab = 3"
            v-bind:class="[activetab === 3 ? 'active' : '']"
            >เพิ่มคำขอ</a
          >
          <a
            v-on:click="activetab = 1"
            v-bind:class="[activetab === 1 ? 'active' : '']"
            >รอดำเนินการ<span
              class="new badge blue"
              data-badge-caption="รายการ"
              >{{ this.requestData.length }}</span
            ></a
          >
          <a
            v-on:click="activetab = 2"
            v-bind:class="[activetab === 2 ? 'active' : '']"
            >ดำเนินการเสร็จสิ้น<span
              class="new badge blue"
              data-badge-caption="รายการ"
              >{{ this.completeData.length }}</span
            ></a
          >
        </div>

        <div class="content">
          <div v-if="activetab === 1" class="tabcontent">
            <h1 v-if="this.requestData.length > 0">
              <div
                class="collection"
                v-for="item in this.requestData"
                :key="item.docID"
              >
                <p>หมายเลขเอกสาร : {{ item.docID }}</p>
                <p>
                  ว/ด/ป ที่ขอข้อมูล :
                  {{ JSON.parse(item.information).recordDate }}
                </p>
                <p>
                  เอกสารที่ขอ :
                  {{
                    JSON.parse(item.information).transcript == "true"
                      ? "ผลการศึกษา"
                      : ""
                  }}
                  {{
                    JSON.parse(item.information).certificate == "true"
                      ? "หลักสูตรที่ฝึกอบรม"
                      : ""
                  }}
                </p>
                <button
                  v-if="role != 'data-center'"
                  class="btn waves-effect waves-light"
                  @click="approve(item.docID)"
                  name="action"
                >
                  อนุมัติ
                  <i class="material-icons right">done</i>
                </button>
              </div>
            </h1>
            <h2 v-else>ผู้ใช้ยังไม่มีรายการคำขอ</h2>
          </div>
          <div v-if="activetab === 2" class="tabcontent">
            <h1 v-if="this.completeData.length > 0">
              <div
                class="collection"
                v-for="item in this.completeData"
                :key="item.docID"
              >
                <p>หมายเลขเอกสาร : {{item.docID}}
                   <button class="waves-effect waves-light btn"
      v-clipboard:copy="item.docID"
      v-clipboard:success="onCopy"
      v-clipboard:error="onError">คัดลอกรหัสส่งต่อ</button>
                </p>
                <p>
                  ว/ด/ป ที่ขอข้อมูล :
                  {{ JSON.parse(item.information).recordDate }}
                </p>
                <p>
                  เอกสารที่ขอ :
                  {{
                    JSON.parse(item.information).transcript == "true"
                      ? "ผลการศึกษา"
                      : ""
                  }}
                  {{
                    JSON.parse(item.information).certificate == "true"
                      ? "หลักสูตรที่ฝึกอบรม"
                      : ""
                  }}
                </p>
              </div>
            </h1>
            <h2 v-else>ผู้ใช้ยังไม่มีรายการคำขอ</h2>
          </div>
          <div v-if="activetab === 3" class="tabcontent request">
            <p>
              <label>
                <input type="checkbox" class="filled-in" v-model="transcript" />
                <span class="black-text">ผลการศึกษา</span>
              </label>
            </p>
            <p>
              <label>
                <input
                  type="checkbox"
                  class="filled-in"
                  v-model="certificate"
                />
                <span class="black-text">หลักสูตรที่ฝึกอบรม</span>
              </label>
            </p>
            <button
              class="btn waves-effect waves-light"
              @click="submit"
              name="action"
              :disabled="!transcript && !certificate"
            >
              สร้างคำขอ
              <i class="material-icons right">send</i>
            </button>
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
  name: "request",
  data() {
    return {
      activetab: 1,
      docID:
        moment(new Date()).format("YYYYMMDDhmm") +
        localStorage.getItem("LoggedUser").split(",")[0],
      transcript: false,
      certificate: false,
      listing: [],
      requestData: [],
      completeData: [],
      role: this.$store.state.role,
    };
  },
  created() {
    console.log("login    ", this.$store.state.role);
    const headers = {
      Authorization: localStorage.getItem("token"),
      "My-Custom-Header": "foobar",
    };
    axios
      .get(this.$store.state.url.data + "api/v1/readData", { headers })
      .then((res) => {
        this.listing = res.data;
        this.listing.forEach((record) => {
          if (this.$store.state.role == "data-center") {
            if (
              record.Record.category.includes("request") &&
              record.Record.creator.includes(
                localStorage.getItem("LoggedUser")
              ) &&
              record.Record.owner.includes(localStorage.getItem("LoggedUser"))
            ) {
              this.requestData.push(record.Record);
            } else if (
              record.Record.category.includes("request") &&
              record.Record.owner.includes(localStorage.getItem("LoggedUser"))
            ) {
              this.completeData.push(record.Record);
            }
          } else if (this.$store.state.role == "school") {
            if (
              record.Record.category.includes("request") &&
              JSON.parse(record.Record.information).transcript == "true"
            ) {
              console.log(record.Record.creator);
                  
              if (
                record.Record.creator.includes(
                  localStorage.getItem("LoggedUser").split(',')[2]
                )
              ) {
                console.log('sch complete');
                this.completeData.push(record.Record);
              } else {
                console.log('sch request');

                this.requestData.push(record.Record);
              }
            }
          } else if (this.$store.state.role == "training") {
            if (
              record.Record.category.includes("request") &&
              JSON.parse(record.Record.information).certificate == "true"
            ) {
              if (
                record.Record.creator.includes(
                  localStorage.getItem("LoggedUser").split(',')[2]
                )
              ) {
                this.completeData.push(record.Record);
              } else {
                this.requestData.push(record.Record);
              }
            }
          }
        });
        console.log("request", this.requestData);
        console.log("completeData", this.completeData);
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
  computed: {
    user() {
      return this.$store.state.token;
    },
    cert() {
      return this.$store.state.cert;
    },
  },
  methods: {
    submit() {
      this.$store.commit("setRequest", {
        docID: this.docID,
        owner: localStorage.getItem("LoggedUser").split(",")[1]
          ? localStorage.getItem("LoggedUser").split(",")[1]
          : localStorage.getItem("LoggedUser"),
        transcript: this.transcript,
        certificate: this.certificate,
        recordDate: moment(new Date()).format("YYYYMMDDhmm"),
      });
      console.log(this.$store.state.request);

      axios
        .post(
          this.$store.state.url.data + "api/v1/createRequest",
          this.$store.state.request,
          {
            headers: {
              Authorization: this.user,
            },
          }
        )
        .then((res) => {
          if (res.status == 200) {
            alert("บันทึกคำขอสำเร็จ");
            location.reload();
          }
        });
    },
    approve(docID) {
      console.log("approve ", docID);
      let url;
      if (this.role == "school") {
        url = this.$store.state.url.school;
      } else {
        url = this.$store.state.url.cert;
      }
      axios
        .get(url + `api/v1/approve/${docID}`, {
          headers: {
            Authorization: this.user,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            alert("อนุมัติสำเร็จ");

            location.reload();
          }
        });
    },
    onCopy: function (e) {
      alert('คุณได้คัดลอกรหัสส่งต่อ ' + e.text)
    },
    onError: function () {
      alert('ไม่สามารถคัดลอกได้')
    }
  },
};
</script>
<style scoped>
* {
  font-size: 18px;
  font-weight: lighter;
  margin: 0 0 5px 40px;
  padding-top: 5px;
}
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
  margin: 20px 20px 20px 20px;
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

.request {
  align-items: center;
  text-align: center;
}
</style>

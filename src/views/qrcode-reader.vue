<template>
  <div>
    <p class="error">{{ error }}</p>

    <p class="decode-result">
      Last result: <b>{{ result }}</b>
    </p>

    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="290">
        <!-- <template v-slot:activator="{ on, attrs }">
           <v-btn color="primary"  v-bind="attrs" v-on="on">
            Open Dialog
          </v-btn> 
        </template> -->
        <v-card>
          <div id="check">
            <header></header>
            <section>
              <h2>ชื่อขั้นตอน</h2>
              <div class="input">
                <div class="text">
                  <h4>หมายเลขล็อต : {{this.listing.lotID}}</h4>
                  <h4>สายพันธุ์ : {{this.listing.species}}</h4>
                  <h4>เกรด : -</h4>
                  <h4>ปริมาณ : {{this.listing.value}} ก.ก.</h4>
                </div>
              </div>

            </section>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green en-1" text @click="transfer()">
              ยืนยัน
            </v-btn>
            <v-btn class="cancel" text @click="dialog = false">
              ยกเลิก
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-dialog v-model="camera">
    <qrcode-stream @decode="onDecode" @init="onInit" />
    </v-dialog>
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import { QrcodeStream } from "vue-qrcode-reader";
import axios from "axios";
export default {
  components: { QrcodeStream },

  data() {
    return {
      result: "",
      error: "",
      dialog: false,
      camera: true,
      listing: {},

    };
  },

  methods: {
    onDecode(result) {
      this.result = result;
      // this.dialog = true

      const headers = {
        Authorization: localStorage.getItem('token'),
        "My-Custom-Header": "foobar",
      };
      axios
        .get(result, { headers })
        .then((res) => {
          console.log(res);
          this.listing = res.data;
        console.log(this.listing);
        if (result.includes('milling') && this.listing.owner.includes('farmer')) {
  console.log('2mill');
      this.dialog = true
        }else if (result.includes('buyerReceiveData')) {
          console.log('buyer');
            this.$router.push('/show?id=' +  this.listing.lotID);
      
        }
        else if (result.includes('stow') && this.listing.owner.includes('milling')) {
          console.log('2stow');
      this.dialog = true
        }
        
        else {
        alert('ไม่สามารถรับข้อมูลได้ เนื่องจากรายการนี้ได้ถูกส่งต่อไปแล้ว')
            this.$router.push("/produc");

        }
        this.camera = !this.dialog;
        })
        .catch((err) => {
          if (err.response.status === 401) {
            console.log(err.response.status);
            this.$router.push("/");
            alert("ไม่สามารถรับข้อมูลได้ กรุณา login และตรวจสอบสิทธิ์ของคุณ");
          }
        });
    },
    transfer(){
          console.log(this.result);

      this.dialog = false

      const headers = {
        Authorization: localStorage.getItem('token'),
        "My-Custom-Header": "foobar",
      };
      axios
        .get(this.result+'/1', { headers })
        .then((res) => {
          console.log(res,this.listing.lotID);
          if (this.result.includes('milling.coffee')) {
            console.log('transfer2m');
          this.$router.push('/milling2?id=' + this.listing.lotID);
            
          } else if (this.result.includes('stow.coffee')){
            console.log('transfer2s');

          this.$router.push('/stow2?id=' + this.listing.lotID);
            
          }

        })
        .catch((err) => {
          if (err.response.status === 401) {
            console.log(err.response.status);
            this.$router.push("/");
            alert("ไม่สามารถรับข้อมูลได้ กรุณา login และตรวจสอบสิทธิ์ของคุณ");
          }
        });

    },

    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.error = "ERROR: you need to grant camera access permisson";
        } else if (error.name === "NotFoundError") {
          this.error = "ERROR: no camera on this device";
        } else if (error.name === "NotSupportedError") {
          this.error = "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.error = "ERROR: is the camera already in use?";
        } else if (error.name === "OverconstrainedError") {
          this.error = "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.error = "ERROR: Stream API is not supported in this browser";
        }
      }
    },
  },
};
</script>

<style scoped>
.error {
  font-weight: bold;
  color: red;
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
.text {
  margin: 20px 0 50px 20px;
}
h4 {
  font-weight: initial;
  margin-bottom: 10px;
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
  margin: 10px auto;
  background-color: #81542d;
  color: white;
  border: none;
  cursor: pointer;
  width: 50%;
  min-width: 250px;
  height: 55px;
  font-size: 25px;
  font-weight: bold;
}
button.cancel {
  background-color: #b60000;
}
</style>
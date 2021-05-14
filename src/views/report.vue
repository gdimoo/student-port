<template>
  <div id="report">
          <div
          class="collection"
          v-for="item in this.tranData"
          :key="item.docID"
        >
        <p>หมายเลขเอกสาร : {{ (item.docID) }}</p>
          <p>นักเรียน : {{ (item.owner) }}</p>
          <p>ว/ด/ป ที่บันทึกข้อมูล : {{ JSON.parse(item.information).recordDate }}</p>
          <p>ปีการศึกษา : {{ JSON.parse(item.information).semester }} / {{ JSON.parse(item.information).year }}</p>
          <p>ผลการศึกษา : {{ JSON.parse(item.information).studyReports }}</p>

        </div>
     <div
          class="collection"
          v-for="item in this.certData"
          :key="item.docID"
        >
        <p>หมายเลขเอกสาร : {{ (item.docID) }}</p>
          <p>นักเรียน : {{ (item.owner) }}</p>
          <p>ว/ด/ป ที่บันทึกข้อมูล : {{ JSON.parse(item.information).recordDate }}</p>
          <p>ปีการศึกษา : {{ JSON.parse(item.information).semester }} / {{ JSON.parse(item.information).year }}</p>
          <p>ผลการศึกษา : {{ JSON.parse(item.information).studyReports }}</p>

        </div> </div>

</template>
<script>
import axios from "axios";

export default {
  name: "report",
  data() {
    return {
      tran: true,
      cert: false,
      show:false,
tranData:[],
certData:[],
    };
  },
  
  created() {
    axios
      .get(this.$store.state.url.data + "api/v1/receiveData")
      .then((res) => {
        this.listing = res.data;
        console.log(this.listing,this.$store.state.publicReport );
        this.listing.forEach((record) => {
          if (this.$store.state.publicReport.transcript && record.Record.category.includes('transcript') && record.Record.owner.includes(this.$store.state.publicReport.owner) ) {
            this.tranData.push(record.Record)
          }
          else if(this.$store.state.publicReport.certificate && record.Record.category.includes('certficate') && record.Record.owner.includes(this.$store.state.publicReport.owner)){
            this.certData.push(record.Record)
          }
          });
 
        console.log("tranData", this.tranData);
        console.log("certData", this.certData);
        if (res.status == 401) {
          alert('ดึงข้อมูลไม่สำเร็จ')
        }
        });
  },
  methods: {
    update(show) {
      this.show=show
      
    },
  },
};
</script>
<style>
/* .nav{
  display: none;
  visibility: hidden;
} */
.open {
  appearance: none;
  outline: none;
  border: none;
  background: none;
  cursor: pointer;
  display: inline-block;
  color: #000;
  font-size: 18px;
  transition: 0.4s ease-out;
}
.close {
  appearance: none;
  outline: none;
  border: none;
  background: none;
  cursor: pointer;
  float: right;
  color: #000;
  font-size: 18px;
  transition: 0.4s ease-out;
}
.tag {
  background-color: #fff;
  border: 1px solid rgb(56, 51, 51);
  padding: 5px;
  margin-bottom: 15px;
}
button .pick {
  background-color: #f0d9a5;
  border: 1px solid rgb(56, 51, 51);
  padding: 5px;
  margin-bottom: 15px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 98;
  background-color: rgba(0, 0, 0, 0.3);
}
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
  width: 90%;
  max-width: 400px;
  background-color: #fff;
  border-radius: 16px;
  padding: 25px;
}
.modal p {
  margin-bottom: 10px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s;
}
.slide-enter,
.slide-leave-to {
  transform: translateY(-50%) translateX(100vw);
}
</style>
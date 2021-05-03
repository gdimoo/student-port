<template>
  <div id="stow1">
       <header>
      <router-link to="/produc">
        <i class="material-icons nav__icon">keyboard_backspace</i>
      </router-link>
    </header>
     <div class="title">
      <h1>คั่ว/บรรจุ</h1>
      <div class="icon">
        <router-link to="/stow2">
          <i class="material-icons nav__icon">add_circle</i>
        </router-link>
      </div>
    </div>
    <section>
      <h1 v-if="this.stowData.length > 0">
        <div class="content" v-for="item in this.stowData" :key="item.lotID">
      <!-- {{item}} -->
        <p>หมายเลขเลขล็อต : {{ (item.lotID) }}</p>
        <p>ว/ด/ป : {{ JSON.parse(item.other).roast_Date }}</p>
        <p>สายพันธุ์ : {{ (item.species) }}</p>
        <p>ปริมาณ : {{ (item.value) }} ก.ก.</p>
    <!-- {{ JSON.parse(JSON.stringify(item.Record.other)) }} -->
      </div>
      </h1>
<h2 v-else>ผู้ใช้ยังไม่มีข้อมูลการคั่ว/บรรจุ
</h2>
      </section>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "stow1",
  data(){
    return{
      stowData: [],
    listing:[]}
    
  },
  created() {
    console.log('current user',localStorage.getItem('LoggedUser'));
    // POST request using axios with set headers
    const headers = { 
      "Authorization": localStorage.getItem('token'),
      "My-Custom-Header": "foobar"
    };
    axios.get(this.$store.state.url.stow+"api/v1/readData", {headers})
      .then(res => { 
        this.listing = res.data
        this.listing.forEach(record => {
          // console.log(record.Record)
          if (record.Record.lotID.includes('2'+localStorage.getItem('LoggedUser'))) {
            this.stowData.push(record.Record)
          }
       })
      })
        .catch(err => {
        if (err.response.status === 401) {
          this.$router.push("/produc");
          alert("คุณไม่มีสิทธิ์ในส่วนการคั่ว/บรรจุ");
          
        }
        });

  }
}
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
.nav__icon {
  font-size: 30px;
  color: #000;
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
section h2{
  font-size: 18px;
  font-weight: 500;
}
.content{
  width: 100%;
  height: 190px;
  background-color: #FAEAC6;
 margin: 10px 0 10px 0;
  
}
.content p{
  font-size: 18px;
  font-weight: lighter;
  margin:0 0 5px 40px;
  padding-top: 5px;
}
</style>
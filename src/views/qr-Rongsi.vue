<template>
  <div id="qr">
    <header>
      <router-link to="/">
        <i class="material-icons nav__icon">keyboard_backspace</i>
      </router-link>
    </header>
    <div class="image">
            <vue-qrcode :value=url />
    </div>
    <section>
      <h2>การสี</h2>
      <p>หมายเลขเอกสาร : {{docID}}</p>
      <p>สายพันธุ์ : {{cert.species}}</p>
      <p>เกรด : {{cert.grade.grade}}</p>
      <p>ปริมาณ : {{cert.grade.value}}</p>
    </section>
    
    <div class="button">
      <router-link to="/cert3">
        <i class="material-icons nav__icon">keyboard_backspace</i>
      </router-link>
    </div>
  </div>
</template>
<script>
 import VueQrcode from 'vue-qrcode'

export default {
  components: {
    VueQrcode,
  },
  computed: {
    docID () {
      return this.$store.state.docID
    },
    cert () {
      return this.$store.state.cert
    },
    url(){
      return this.$store.state.url.school+`api/v1/receiveData/${this.$store.state.docID}`
    }
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
  bottom: 0;
}

.nav__icon {
  font-size: 30px;
  color: #000;
}
.image {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}

section{
    margin: 30px 10%;
}
section h2{
    font-size: 20px;
}
section p{
    font-size: 16px;
    margin: 15px 20px;
}

.button{
    display: flex;
  flex-direction: column;
  align-items: center;
}

.button a{
  text-decoration: none;
  color: #fff;
  background-color: #81542D;
  text-align: center;
  padding: 10px;
  width: 370px;
  font-size: 20px;
  font-weight: bolder;
  margin: 10px 0;
}
.button i{
    color: #fff;
}
.input {
  display: flex;
  flex-direction: column;
}
input {
  width: 100%;
  height: 50px;
  margin: 0px 0px 20px 0px;
  font-size: 18px;
  font-weight: lighter;
  padding-left: 20px;
  padding-right: 20px;
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
  font-size: 20px;
  font-weight: bold;
}
</style>

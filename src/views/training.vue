<template>
  <div id="produc">
    <header>
      <router-link to="/Home">
        <i class="material-icons nav__icon">keyboard_backspace</i>
      </router-link>
    </header>
    <section>
      <div class="study_report">
      <div class="box_har"></div>
      <router-link to="/cert1"><h1>บันทึกผลการอบรม</h1></router-link>
    </div>
    <div class="cert">
      <div class="box_mil"></div>
      <router-link to="/participate"><h1>ข้อมูลผู้เข้าอบรม</h1></router-link>
    </div>
    </section>
  </div>
</template>
<script>
export default {
  name: "training",
  components: {},
  methods: {
    // Tostudy_report(){
    //     this.$router.push({ name: 'study_report1' })
    // }
  },
};
</script>
<style scoped>
header{
  height: 50px;
  position: relative;
  margin-bottom: 20px;
}
header i{
  position: absolute;
  left: 10%;
  bottom: 0;
}

.nav__icon {
    font-size: 30px;
    color: #000;
}

div a {
  text-decoration: none;
  color: #000;
}
a h1{
  font-size: 20px;
  font-weight:inherit;
  position: absolute;
  top: 35%;
  right: 10%;
}

section{
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 320px;
  margin: 0 auto;
}

.study_report{
  height: 130px;
  width: 90%;
  border: 1px solid #A9D730;
  display: flex;
  position: relative;
  margin-bottom: 30px;
}
.box_har{
  height: 130px;
  width: 50%;
  background-color: #A9D730;
}

.cert{
  height: 130px;
  width: 90%;
  border: 1px solid #EEAD00;
  display: flex;
  position: relative;
  margin-bottom: 30px;
}
.box_mil{
  height: 130px;
  width: 50%;
  background-color: #EEAD00;
}
.cert a h1{
  left: 65%;
}

.school{
  height: 130px;
  width: 90%;
  border: 1px solid #E22E17;
  display: flex;
  position: relative;
  margin-bottom: 30px;
}
.box_st{
  height: 130px;
  width: 50%;
  background-color: #E22E17;
}

</style>

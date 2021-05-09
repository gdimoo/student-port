<template>
  <div id="produc">
    <header>

    </header>
    <section>
<a href="/cert1" class="study_report waves-effect waves-light btn-large"><i class="material-icons right">summarize</i><router-link to="cert1">การฝึกอบรม</router-link></a>
<a href="/request" class="school waves-effect waves-light btn-large"><i class="material-icons right">pending_actions</i><router-link to="request">คำขอรายงาน</router-link></a>

    </section>
  </div>
</template>
<script>
export default {
  name: "school",
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
  align-items: center;
}
a {
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
  border: 1px solid #6ec2b1;
  background-color: #6ec2b1;
  display: flex;
  position: relative;
  align-items: center;
  margin-bottom: 30px;
}
.box_har{
  height: 130px;
  width: 50%;
  background-color: #6ec2b1;
}

.cert{
  height: 130px;
  width: 90%;
  border: 1px solid #95e3bb;
  display: flex;
  background-color: #95e3bb;
  position: relative;
  margin-bottom: 30px;
}
.box_mil{
  height: 130px;
  width: 50%;
  background-color: #95e3bb;
}
.cert a h1{
  left: 65%;
}

.school{
  height: 130px;
  width: 90%;
  background-color: #ff545e;
  border: 1px solid #ff545e;
  display: flex;
  position: relative;
  margin-bottom: 30px;
}
.box_st{
  height: 130px;
  width: 50%;
  background-color: #ff545e;
}

</style>

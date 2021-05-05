<template>
  <div id="check">
    <section>
      <h2>ชื่อขั้นตอน</h2>
      <div class="input">
        <div class="text">
        <h4>หมายเลขเอกสาร : 123456789</h4>
        <h4>สายพันธุ์ : อราบิก้า</h4>
        <h4>เกรด : A</h4>
        <h4>ปริมาณ : 20 ก.ก.</h4>
        </div>
      </div>
    <div class="input">
      <button @click="confirm()">ยืนยัน</button>
      <button @click="cancel()" class="cancel">ยกเลิก</button>
    </div>
    </section>
  </div>
</template>
<script>
export default {
  name: "check",
  data() {
    return {};
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
.box{
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
.text{
  margin: 20px 0 50px 20px;
}
h4{
  font-weight:initial;
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
button.cancel{
  background-color: #B60000;
}


</style>

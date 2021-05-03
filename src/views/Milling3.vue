<template>
  <div id="milling3">
    <header>
      <router-link to="/milling1">
        <i class="material-icons nav__icon">keyboard_backspace</i>
      </router-link>
    </header>
    <section>
      <h2>คัดเกรด</h2>
      <div class="input">
        <p>วัน/เดือน/ปี</p>
        <input type="date" name="ว/ด/ป" v-model="milling.milling_grade_Date"
        placeholder="ว/ด/ป" value="2021-03-10" @input="update">
      </div>
      <div class="icon">
        <router-link to="/milling4">
          <i class="material-icons nav__icon">add_circle</i>
        </router-link>
      </div>
      <h2>เกรด A</h2>
      <div class="input">
        <router-link to="/milling4?grade=A"
          ><div class="box">{{milling.lotID+'A'}}</div></router-link
        >
        <h2>เกรด B</h2>
        <router-link to="/milling4?grade=B"
          ><div class="box">{{milling.lotID+'B'}}</div></router-link
        >
      </div>
      <div class="input">
        <div class="next">
          <router-link
            :to="'milling2?id='+this.$store.state.milling.receiveLotID ">
            <i class="material-icons nav__icon">arrow_back</i></router-link
          >
        </div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  name: "milling3",
  data() {
    return {};
  },

  computed: {
    user() {
      return this.$store.state.user;
    },
    milling() {
        return this.$store.state.milling;
  
  },
  },

  methods: {
    update(e) {
      this.$store.commit("setMilling", { ...this.milling,
      milling_grade_Date: e.target.value });
      console.log('uodate',this.milling);
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
.box {
  width: 100%;
  background-color: #dadada;
  height: 50px;
  border: 1px solid black;
  text-align: left;
  padding: 12px 20px;
  margin: 15px 0px 5px 0px;
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

<template>
  <div id="mill">
    <button class="open" @click="update(true)">
      {{ name }}
    </button>
    <transition name="fade" appear>
      <div
        class="modal-overlay"
        v-if="this.$store.state.showDetail.mill"
        v-on:click="update(false)"
      ></div>
    </transition>
    <transition name="slide" appear>
      <div class="modal" v-if="this.$store.state.showDetail.mill">
        <button class="close" @click="update(false)">
          <i class="material-icons nav__icon">close</i>
        </button>
        <div style="margin-top:40px">
        <button class="tag" @click="general = true, mill = false">ทั่วไป</button>
        <button class="tag" @click="mill = true, general = false">การสี/คัดเกรด</button>
        </div>
        <div v-if="general">
        <p>ชื่อบริษัท : {{this.$store.state.milling.millingUser}}</p>
        <p>ที่อยู่ : {{this.$store.state.location.millLocation}}</p>
        </div>
        <div v-if="mill">
        <p>หมายเลขล็อต : {{this.$store.state.location.millLotID}}</p>
        <p>เตรียมเมล็ด : {{this.$store.state.milling.Prepare}}</p>
        <p>เกรด : {{this.$store.state.milling.grade.grade}}</p>
        <p>รายละเอียด : {{this.$store.state.milling.grade.Detail}}</p>
        <p>ส่งต่อ : {{this.$store.state.stow.stowUser}}</p>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: "mill",
  data() {
    return {
      general:true,
      mill:false,
      name: "โรงสี",
      company:"โรงสีนายอ่ำ",
      address:"ตำบลเวียง อำเภอเทิง เชียงราย 57160 ",
      number:"123456789",
      prepare:"แบบเปียก",
      grade:"A",
      detail:"/////",
      For:"โรงผลิตอมร"
    };
  },
  methods:{
      update(show) {
      this.$store.commit("setShowDetail", {
        ...this.$store.state.showDetail,
        mill: show,
      });
    },
  }
};
</script>
<style>

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
.tag{
    background-color: #fff;
    border: 1px solid rgb(56, 51, 51);
    padding: 5px;
    margin-bottom: 15px;
}
.tag:active{
    background-color: #f0d9a5;
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
.modal p{
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

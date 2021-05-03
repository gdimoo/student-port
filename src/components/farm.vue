<template>
  <div id="farm">
    <button class="open" @click="update(true)">
      {{ name }}
    </button>
    <transition name="fade" appear>
      <div
        class="modal-overlay"
        v-if="this.$store.state.showDetail.farm"
        @click="update(false)"
      ></div>
    </transition>
    <transition name="slide" appear>
      <div class="modal" v-if="this.$store.state.showDetail.farm">
        <button class="close" @click="update(false)">
          <i class="material-icons nav__icon">close</i>
        </button>
        <div style="margin-top: 40px">
          <button class="tag" @click="(general = true), (crop = false)">
            ทั่วไป
          </button>
          <button class="tag" @click="(crop = true), (general = false)">
            เก็บเกี่ยว
          </button>
        </div>
        <div v-if="general">
          <p>ชื่อบริษัท : {{ this.$store.state.farm.farmer }}</p>
          <p>ที่อยู่ : {{ this.$store.state.location.farmLocation }}</p>
        </div>
        <div v-if="crop">
          <p>หมายเลขล็อต : {{ this.$store.state.farm.lotID }}</p>
          <p>
            ส่วนผสมในดิน/สารเคมีที่ใช้ : {{ this.$store.state.farm.fertilizer }}
          </p>
          <p>ส่งต่อ : {{ this.$store.state.milling.millingUser }}</p>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: "farm",
  data() {
    return {
      general: true,
      crop: false,
      name: "ไร่",
      company: this.$store.state.farm.farmer,
      address: this.$store.state.location.farmLocation,
      number: this.$store.state.farm.lotID,
      soil: this.$store.state.farm.fertilizer,
      For: this.$store.state.milling.lotID,
    };
  },
  methods: {
    update(show) {
      this.$store.commit("setShowDetail", {
        ...this.$store.state.showDetail,
        farm: show,
      });
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

<template>
  <div class="show">
    <div class="back">
      <router-link to="/Home">
        <i class="material-icons nav__icon">keyboard_backspace</i>
      </router-link>
    </div>
    <header>
      <div class="image">
        <img src="../assets/product.svg" alt="scan" />
      </div>
    </header>
    <section>
      <!-- {{ JSON.parse(JSON.stringify(this.listing.other)).stowUser }} -->
      <h3>{{ name }}</h3>
      <div>
        <h4>{{ company }}</h4>
      </div>
      <div>
        <p>ชนิด :</p>
        <h5>{{ type }}</h5>
      </div>
      <div>
        <p>ระดับการคั่ว :</p>
        <h5>{{ roast }}</h5>
      </div>
      <div>
        <p>เกรด :</p>
        <h5>{{ grade }}</h5>
      </div>
      <div>
        <p>รายละเอียด :</p>
        <h5><br />{{ detail }}</h5>
      </div>
      <div>
        <p>วิธีการชงที่แนะนำ :</p>
        <h5><br />{{ guide }}</h5>
      </div>
      <div><p>การเดินทางของสินค้า :</p></div>
      <h1 v-if="this.$store.state.location.farmLocation.length > 0">
        <GoogleMap />
      </h1>
      <h1 v-else>กำลังโหลด</h1>
      <farm />
      <mill />
      <production />
    </section>
  </div>
</template>

<script>
import axios from "axios";
import farm from "@/components/farm.vue";
import mill from "@/components/mill.vue";
import production from "@/components/production.vue";
import GoogleMap from "@/components/GoogleMap.vue";
export default {
  name: "show",
  components: {
    farm,
    mill,
    production,
    GoogleMap,
  },
  data() {
    return {
      name: "Maverick",
      company: "ชื่อบริษัท",
      type: "อราบิก้า",
      roast: "ปานกลาง",
      grade: "A",
      detail:
        "เป็นการผสมผสานเอสเพรสโซที่เป็นเอกลักษณ์ ของBluestone Lane เหมาะกับการบดระดับหยาบถึงปานกลาง",
      guide:
        "บดหยาบเหมาะกับการชงแบบ French Press บดปานกลางเหมาะกับการชงแบบดริป",
      listing: [],
    };
  },
  async created() {
    console.log("current user", this.user, this.$route.query.id);
    await axios
      .get(
        this.$store.state.url.stow +
          `api/v1/buyerReceiveData/${this.$route.query.id}`
      )
      .then(async (res) => {
        this.listing = res.data;
        this.name = JSON.parse(this.listing.other).infoData.info.name;
        // this.company = JSON.parse(this.listing.other.stowUser),
        (this.type = this.listing.species),
          (this.roast = JSON.parse(this.listing.other).infoData.roast_lv),
          (this.grade = JSON.parse(this.listing.other).grade),
          (this.detail = JSON.parse(this.listing.other).infoData.info.Detail),
          (this.guide = JSON.parse(this.listing.other).infoData.info.guide),
          this.$store.commit("setLocation", {
            ...this.$store.state.location,
            stowLocation: JSON.parse(this.listing.other).locationStow,
            stowLotID: this.listing.lotID,
            millLotID: JSON.parse(this.listing.other).infoData.receiveLotID,
          });
        this.$store.commit("setStow", {
          ...this.$store.state.stow,
          receiveLotID: JSON.parse(this.listing.other).infoData.receiveLotID,
          species: this.listing.species,
          lotID: this.listing.lotID,
          grade: JSON.parse(this.listing.other).grade,
          value: 0,
          roast_Date: JSON.parse(this.listing.other).roast_Date,
          roastExp: JSON.parse(this.listing.other).roastExp,
          roast_lv: JSON.parse(this.listing.other).roast_lv,
          stowUser: JSON.parse(this.listing.other).stowUser,
          info: {
            name: JSON.parse(this.listing.other).infoData.info.name,
            packDate: JSON.parse(this.listing.other).infoData.info.packDate,
            expDate: JSON.parse(this.listing.other).infoData.info.expDate,
            Detail: JSON.parse(this.listing.other).infoData.info.Detail,
            guide: JSON.parse(this.listing.other).infoData.info.guide,
            packValue: JSON.parse(this.listing.other).infoData.info.packValue,
          },
        });
        console.log(this.listing);
        await axios
          .get(
            this.$store.state.url.stow +
              `api/v1/buyerReceiveData/${this.$store.state.location.millLotID}`
          )
          .then(async (res) => {
            this.listing = res.data;
            this.$store.commit("setLocation", {
              ...this.$store.state.location,
              millLocation: JSON.parse(this.listing.other).locationMill,
              farmLotID: JSON.parse(this.listing.other).millingData
                .receiveLotID,
            });
            this.$store.commit("setMilling", {
              ...this.$store.state.milling,
              receiveLotID: JSON.parse(this.listing.other).millingData
                .receiveLotID,
              species: this.listing.species,
              millingUser: JSON.parse(this.listing.other).millingUser,
              lotID: this.listing.lotID,
              millingDate: JSON.parse(this.listing.other).millingData
                .millingDate,
              Prepare: JSON.parse(this.listing.other).millingData.Prepare,
              value: this.listing.value,
              milling_grade_Date: JSON.parse(this.listing.other).millingData
                .milling_grade_Date,
              grade: {
                gradeLotID: JSON.parse(this.listing.other).millingData.grade
                  .gradeLotID,
                millingExp: JSON.parse(this.listing.other).millingData.grade
                  .millingExp,
                value: JSON.parse(this.listing.other).millingData.grade.value,
                Detail: JSON.parse(this.listing.other).millingData.grade.Detail,
                grade: JSON.parse(this.listing.other).millingData.grade.grade,
              },
            });
            this.locationStow = JSON.parse(this.listing.other).locationStow;
            await axios
              .get(
                this.$store.state.url.stow +
                  `api/v1/buyerReceiveData/${this.$store.state.location.farmLotID}`
              )
              .then((res) => {
                this.listing = res.data;
                this.$store.commit("setLocation", {
                  ...this.$store.state.location,
                  farmLocation: JSON.parse(this.listing.other).farm
                    .locationFarm,
                });
                this.$store.commit("setFarm", {
                  ...this.$store.state.farm,
                  species: this.listing.species,
                  harvestDate: JSON.parse(this.listing.other).farm.harvestDate,
                  fertilizer: JSON.parse(this.listing.other).farm.fertilizer,
                  method: JSON.parse(this.listing.other).farm.method,
                  farmer: JSON.parse(this.listing.other).farm.farmer,
                  lotID: this.listing.lotID,
                  value: this.listing.value,
                });
                this.locationStow = JSON.parse(this.listing.other).locationStow;
              })
              .catch((err) => alert(err));
          })
          .catch((err) => alert(err));
      })
      .catch((err) => alert(err));
    console.log("coffee-trace :", this.$store.state.location);
  },
};
</script>

<style scoped>
/* .nav{
  display: none;
  visibility: hidden;
} */
header {
  width: 100%;
  height: 250px;
  margin-bottom: 50px;
  background: url("../assets/coffee.jpg") no-repeat;
  background-position: center;
}
.back {
  height: 65px;
  position: relative;
}
.back i {
  position: absolute;
  left: 10%;
  bottom: 0;
}
.nav__icon {
  font-size: 30px;
  color: #000;
}

.image {
  position: absolute;
  top: 170px;
  right: 1%;
}
.image img {
  width: 80%;
}

section {
  width: 80%;
  min-width: 280px;
  margin: 0 auto;
}
h5,
p {
  display: inline;
}
h5 {
  font-size: 16px;
  font-weight: 450;
  line-height: 20pt;
}
section div,
h3,
h4 {
  margin-bottom: 15px;
}
.space {
  height: 100px;
}
</style>

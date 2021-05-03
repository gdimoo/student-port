<template>
  <div>
    <br />
    <GmapMap :center="mill" :zoom="12" style="width: 100%; height: 600px"
    :options="{
   zoomControl: true,
   mapTypeControl: false,
   scaleControl: true,
   streetViewControl: false,
   rotateControl: false,
   fullscreenControl: true,
   disableDefaultUi: false
 }">
<gmap-custom-marker :marker="farm" @click.native="setShow('farm')">
    <img src="../assets/เก็บเกี่ยว.svg" height="70px" width="70px"/>
  </gmap-custom-marker>
<gmap-custom-marker :marker="mill" @click.native="setShow('mill')">
    <img src="../assets/โรงสี.svg" height="50px" width="50px"/>
  </gmap-custom-marker>
<gmap-custom-marker :marker="stow" @click.native="setShow('stow')">
    <img src="../assets/คั่ว.svg" height="60px" width="60px"/>
  </gmap-custom-marker>
      <DirectionsRenderer travelMode="DRIVING" :origin="farm" :middle="mill"  :destination="stow"/>

    </GmapMap>
  </div>
</template>

<script>
import DirectionsRenderer from "@/components/DirectionsRenderer";
import GmapCustomMarker from 'vue2-gmap-custom-marker';
export default {
  name: 'GoogleMap',
  components:{
    DirectionsRenderer,
    'gmap-custom-marker': GmapCustomMarker
  },
    computed: {
      user() {
        return this.$store.state.user;
      },
      farm() {
      
      return this.string2Lat(this.$store.state.location.farmLocation);
    },
    mill() {
      
      return this.string2Lat(this.$store.state.location.millLocation);
    },
    stow() {
      
      return this.string2Lat(this.$store.state.location.stowLocation);
    }
    },
  data() {
    return {
      latMillLocation:parseFloat(this.$store.state.location.millLocation.split(",")[0]),
      lngMillLocation:parseFloat(this.$store.state.location.millLocation.split(",")[1]),
      center: { lat: this.latMillLocation, lng: this.lngMillLocation },
      // center: {  lat: 19.89536899568421, lng: 99.59617665153226 },
      markers: [],
      places: [],
      start: "",
    end: ""
    }
  },
  created() {
    this.addMarker(this.$store.state.location.farmLocation)
    this.addMarker(this.$store.state.location.millLocation)
    this.addMarker(this.$store.state.location.stowLocation)

  },
  mounted() {
    // this.geolocate();
  },
  methods: {
    setShow(place) {
      this.$store.commit("setShowDetail", {
        ...this.$store.state.showDetail,
        [place]:true
      })
      console.log(place);
    },
    addMarker(location) {
console.log('add Marker', location);
      const marker = {
          lat: parseFloat(location.split(",")[0]),
          lng: parseFloat(location.split(",")[1])
        };

        this.markers.push({ position: marker });
        this.center = marker;
      
    },
    string2Lat(location) {
      const marker = {
          lat: parseFloat(location.split(",")[0]),
          lng: parseFloat(location.split(",")[1])
        };
      return marker;
    },
  },
};
</script>
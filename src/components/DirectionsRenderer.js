import { MapElementFactory } from "vue2-google-maps";

export default MapElementFactory({
  name: "directionsRenderer",

  ctr() {
    return window.google.maps.DirectionsRenderer;
  },

  events: [],

  mappedProps: {},

  props: {
    origin: { type: Object },
    destination: { type: Object },
    middle: { type: Object },
    travelMode: { type: String }
  },

  afterCreate(directionsRenderer) {
    let directionsService = new window.google.maps.DirectionsService();

    // this.$watch(
    //   () => [this.origin, this.destination, this.travelMode],
    //   () => {
    let { origin, destination, travelMode, middle } = this;
    console.log(origin, destination, travelMode, middle );
    if (!origin || !destination || !travelMode || !middle) return;
    console.log('create direction');
    directionsService.route(
      {
        origin,
        destination,
        waypoints:[{
          location: middle,
          stopover: true,
        }],
        travelMode,
        optimizeWaypoints: true,
      },
      (response, status) => {
        if (status !== "OK") return;
        directionsRenderer.setDirections(response);
      }
    );
  }
  //   );
  // }
});

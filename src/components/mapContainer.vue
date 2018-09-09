<template>
  <div>
    <div id="map" style="width: 100%; height: 90%; border: 1px solid #eee">
    </div>
  </div>
</template>

<script>
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Projection from 'ol/proj/Projection';
import {fromLonLat} from 'ol/proj.js';

export default {
  name: 'mapContainer',
  props: {

  },
  data () {
    return {
      map:''
    }
  },
  mounted () {
    console.log('this: ', this);
    var self = this;
    this.map.setTarget(document.getElementById('map'));

    this.$emit('mapMounted', self.map);
  },
  methods: {

  },
  created () {
    var aachenLonLat = [6.074166, 50.779002];
    var aachenLonLatWebMercator = fromLonLat(aachenLonLat);

    this.map = new Map({
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: aachenLonLatWebMercator,
        zoom: 16
      }),
    });
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

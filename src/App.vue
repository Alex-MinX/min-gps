<template>
  <div id="app">
    <addGPXData :map="map"/>
    <mapContainer @mapMounted="mapMounted"/>
  </div>
</template>

<script>
import mapContainer from './components/mapContainer.vue';
import addGPXData from './components/addGPXData.vue';

export default {
  name: 'app',
  components: {
    mapContainer,
    addGPXData
  },
  data () {
    return {
      map: ''
    }
  },
  methods: {
    mapMounted: function(value) {
      this.map = value;
      console.log('app.vue_map: ', this.map);
    }
  }
}
</script>

<style>

</style>

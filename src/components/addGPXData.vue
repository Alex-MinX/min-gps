<template>
  <div>
      <select id="GPXFileSelect" @change="selectGPX" v-model="selectedGPX">
          <option disabled value="">Please select one GPX file</option>
          <option v-for="(file, idx) in fileList.GPXFileList" :key="idx+'_'+file" :value="file.name">{{ file.name }}</option>
      </select>
      <input type="button" value="addGPXData" @click="addData"/>
  </div>
</template>

<script>
import Map from 'ol/Map.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import VectorSource from 'ol/source/Vector.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import GPX from 'ol/format/GPX.js';

import GPXFileList from '../assets/GPXFileList.json';

export default {
  name: 'addGPXData',
  props: ['map'],
  data () {
    return {
        fileList: GPXFileList,
        selectedGPX: ''
    }
  },
  mounted () {

  },
  methods: {
    selectGPX: function() {
        //console.log('selectedGPX:', this.selectedGPX);
    },
    addData: function() {
        var self = this;
        // clean the GPX vector layer
        this.map.getLayers().forEach(function(layer) {
            if (layer.get('service') == 'GPX') {
                layer.getSource().clear();
            }
        })
        // get the GPX file
        this.$http.get(self.selectedGPX + '.gpx').then(response => {
            var GPXString = response.body;
            // define the style for the vector features
            var style = {
                'Point': new Style({
                    image: new CircleStyle({
                        fill: new Fill({
                            color: 'rgba(255,255,0,0.5)'
                        }),
                        radius: 5,
                        stroke: new Stroke({
                            color: '#ff0',
                        width: 1
                        })
                    })
                }),
                'LineString': new Style({
                    stroke: new Stroke({
                        color: '#f00',
                        width: 3
                    })
                }),
                'Polygon': new Style({
                    fill: new Fill({
                        color: 'rgba(0,255,255,0.5)'
                    }),
                    stroke: new Stroke({
                        color: '#0ff',
                        width: 1
                    })
                }),
                'MultiPoint': new Style({
                    image: new CircleStyle({
                        fill: new Fill({
                            color: 'rgba(255,0,255,0.5)'
                        }),
                        radius: 5,
                        stroke: new Stroke({
                            color: '#f0f',
                            width: 1
                        })
                    })
                }),
                'MultiLineString': new Style({
                    stroke: new Stroke({
                        color: '#0bf2ec',
                        width: 3
                    })
                }),
                'MultiPolygon': new Style({
                    fill: new Fill({
                        color: 'rgba(0,0,255,0.5)'
                    }),
                    stroke: new Stroke({
                        color: '#00f',
                        width: 1
                    })
                })
            };
            
            // create the vector layer and add it to the map
            var vector = new VectorLayer({
                source: new VectorSource({}),
                style: function(feature) {
                    return style[feature.getGeometry().getType()];
                },
                service: 'GPX'
            });
            // read features from GPX file (in String form)
            var GPXfeatures = (new GPX()).readFeatures(GPXString, {featureProjection: 'EPSG:3857'});
            // add the features to the vector layer
            vector.getSource().addFeatures(GPXfeatures);
            // add the vector layer to the map
            this.map.addLayer(vector);
        }, response => {
            //error callback
            console.log('Http request get error');
        });
    }
  }
}
</script>

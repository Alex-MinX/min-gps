<template>
  <div>
      <div class="searchBox">
        <input type="text" placeholder="search for the GPX file" @input="searchGPXFile" v-model="searchItem"/>
        <div v-for="(file, idx) in searchList" :key="idx+'_'+file" @click="addDataFromSearch(file.name)">{{ file.name }}</div>
      </div>
      <div class="selectGPX">
        <select id="GPXFileSelect" @change="selectGPX" v-model="selectedGPX">
            <option disabled value="">Please select one GPX file</option>
            <option v-for="(file, idx) in fileList.GPXFileList" :key="idx+'_'+file" :value="file.name">{{ file.name }}</option>
        </select>
        <input type="button" value="addGPXData" @click="addData"/>
      </div>
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
        searchList: JSON.parse(JSON.stringify(GPXFileList)).GPXFileList, // a copy of GPXFileList
        selectedGPX: '',
        searchItem: ''
    }
  },
  methods: {
    searchGPXFile: function() {
        var self = this;
        // initialize the searchlist, so every time it starts with the original GPFFileList, avoid 2-way data binding so we don't modify the original array
        var searchList = JSON.parse(JSON.stringify(GPXFileList));
        // filter the searchList array, so only the matched items will show
        var filtered = searchList.GPXFileList.filter(function(el) {
            return el.name.indexOf(self.searchItem) > -1;
        });
        // set the searchList variable 
        this.searchList = filtered;
    },
    selectGPX: function() {
        this.addData();
    },
    addDataFromSearch: function(GPXFileName) {
        this.selectedGPX = GPXFileName;
        this.addData();
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
                        color: 'red',
                        width: 5
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

<style>
    .searchBox {
        border: 1px solid #0bf2ec;
        display: inline-block;
        min-height: 100px;
        padding: 2px 5px;
    }
    .searchBox > div:hover {
        cursor: pointer;
        background: #0bf2ec;
    }
    .searchBox > input {
        box-sizing: border-box; 
        width: 100%;
    }
    .selectGPX{
        border: 1px solid #0bf2ec;
        display: inline-block;
    }
</style>

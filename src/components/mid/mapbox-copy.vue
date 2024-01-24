<template>
    <div id="map"></div>
</template>
  
<script setup lang="ts">
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { onMounted, reactive, toRaw, inject, onBeforeUnmount } from 'vue';
import axios from 'axios';
import * as d3 from 'd3';
// import { useStore } from '../../store/index.js'

function Map() {
    // let universities
    let data: any
    let point_data: any
    let province_datas: any
    // let store = useStore()
    let bus = inject('bus')
    let obj = reactive({
        province: [],
        province_data: [],
        province_geo: [],
        poetMigration: []
    })



    mapboxgl.accessToken = 'pk.eyJ1IjoiZWFzb25samsiLCJhIjoiY2xxbmhjNzhzMzY1dzJtbWtrbHcybzd5NSJ9.MH_jutYfIQCn4jORLW-gXg';
    const map = new mapboxgl.Map({
        container: 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/light-v10',
        center: [110.4, 34.03],
        zoom: 5
    });

    // 初始化 Draw 控件，并设置允许绘制线条
    const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
            line_string: true, // 启用绘制线条的控件
            trash: true // 启用删除控件
        }
    });

    // 地图加载完成后添加 Draw 控件
    map.on('load', () => {
        map.addControl(draw);
    });

    // 当线条创建时触发
    map.on('draw.create', updateLine);

    // 当线条更新时触发
    map.on('draw.update', updateLine);

    // 当线条删除时触发
    map.on('draw.delete', updateLine);

    // 更新线条信息
    function updateLine(e) {
        const data = draw.getAll();
        if (data.features.length > 0) {
            // 假设我们只关心第一个绘制的线条特性
            const line = data.features[0];

            // 确保它是一个 LineString 类型
            if (line.geometry.type === 'LineString') {
                const coordinates = line.geometry.coordinates; // 线条坐标数组
                console.log('线条坐标:', coordinates); // 打印到控制台

                // 在这里可以进行后续操作，比如发送到服务器等
            }
        }
    }

}

onMounted(() => {
    Map()
})

</script>
  
<style scoped>
#map {
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
}
</style>
  
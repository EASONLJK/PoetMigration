<template>
  <div id="map"></div>
</template>

<script setup lang="ts">
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import { onMounted, toRaw } from 'vue';
import * as d3 from 'd3';
import { useStore } from 'vuex';

const store = useStore();
const isNorthOfLine = (lineCoords: never[], pointCoords: any) =>
  store.getters['map/isNorthOfLine'](lineCoords, pointCoords);

function MapBox() {
  mapboxgl.accessToken = 'pk.eyJ1IjoiZWFzb25samsiLCJhIjoiY2xxbmhjNzhzMzY1dzJtbWtrbHcybzd5NSJ9.MH_jutYfIQCn4jORLW-gXg';
  const map = new mapboxgl.Map({
    container: 'map',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/light-v10',
    center: [114.4, 33.03],
    zoom: 3.7
  });

  map.addControl(new MapboxLanguage({
    defaultLanguage: 'zh-Hans'
  }));

  //绘制中国地图
  map.on('load', () => {
    map.addLayer({
      id: 'china',
      type: 'fill',
      source: {
        type: 'geojson',
        data: store.state.map.china
      },
      layout: {},
      paint: {
        'fill-color': '#FFE7BA',
        'fill-opacity': 0.5
      }
    });
  })

  // 中国每个省份放置自定义标记
  map.on('load', () => {
    store.state.map.china_province.features.forEach((province: {
      properties: {
        [x: string]: any; attributes: any; center: any; name: string;
      };
    }, index: any) => {
      let data = toRaw(province.properties.attributes).filter((item: null | undefined) => item !== null && item !== undefined);
      //获取字段
      const fields = ['state', 'total'];
      //根据字段对数据进行切割，并排序
      const data1 = fields.map((field: string) => {
        return data.map((item: { [x: string]: any; }) => {
          return {
            total: item['total']
          }
        }).sort((a: { total: number; }, b: { total: number; }) => b.total - a.total)
      })

      const block_value = data.reduce((acc: any, cur: { total: any; }) => acc + cur.total, 0)
      const svg_box = document.createElement('div');
      svg_box.className = 'marker';
      svg_box.style.width = '25px';
      svg_box.style.height = '25px';
      const width = 40
      const height = 40

      const innerRadius = 5
      const outerRadius = data.find((d: { state: string; }) => d.state === "stayPoets")?.total || 0;
      // const nonZeroStates = data.some((d) => d.total > 0) ? 1 : 0; // 如果有任何非零的状态则为1，否则保持0
      const nonZeroStates = province.properties.topN

      const pieData = d3.pie()
        .value((d: { total: any; }) => d.total)
        .sort(null)(data)

      const arc = d3.arc()
        .innerRadius(nonZeroStates === 0 ? 0 : 5)
        .outerRadius(outerRadius * 2)

      const color = d3.scaleOrdinal()
        .domain(data.map((d: { state: any; }) => d.state))
        .range(['#ffcc66', '#ff9966', '#3399ff', '#33ccff'])

      const svg = d3.select(svg_box)
        .append('svg')
        .attr('width', width)
        .attr('height', height)

      // 在 svg 添加一个圆当所有状态都为 0
      if (nonZeroStates === 0) {
        const stayPoetsTotal = Math.sqrt(data.find((d: { state: string; }) => d.state === "stayPoets")?.total) || 0;

        // const stayPoetsTotal = 2
        // 如果nonZeroStates为0，那么说明所有项目的total均为0或者data为空，我们需要画一个实心圆
        svg.append('circle')
          .attr('cx', width / 2)
          .attr('cy', height / 2)
          .attr('r', function () {
            if (stayPoetsTotal === 0) {
              return 3;
            } else {
              return stayPoetsTotal * 5;
            }
          })
          .style('fill', function () {
            if (stayPoetsTotal === 0) {
              return "white";
            } else {
              // 否则，根据 isNorthOfLine 函数的返回值决定颜色
              return isNorthOfLine(store.state.map.qinlin_huaihe, province.properties.center) ? "steelblue" : "orange";
            }
          });
      } else {
        // 绘制饼图
        const arcGroup = svg.append('g')
          .attr("transform", `translate(${width / 2}, ${height / 2})`)
          .selectAll('path')
          .data(pieData)

        arcGroup.join("path")
          .attr("fill", (d: any, i: any) => color(i))
          .attr("d", arc)
          .append('title')
          .text((d: { data: { state: any; total: any; }; }) => `${d.data.state}:${d.data.total}`);
      }

      // 向地图添加自定义图形
      if (data && data.length > 0) {
        // 对于非空的属性数据，使用新的经纬度
        new mapboxgl.Marker(svg_box)
          .setLngLat(province.properties.center)
          .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML('<h3>' + province.properties.name + '</h3>'
              + '<p>' + '北:' + (data && data[0] ? data[0].total : '0') + '</p>'
              + '<p>' + '南->北:' + (data && data[1] ? data[1].total : '0') + '</p>'
              + '<p>' + '北->南:' + (data && data[2] ? data[2].total : '0') + '</p>'
              + '<p>' + '南:' + (data && data[3] ? data[3].total : '0') + '</p>'
              + '<h4>' + '总数:' + (block_value ? block_value : '0') + '</h4>'
            ))
          .addTo(map);
        // 创建图形名称标签
        const provinceId = `province${index}`
        map.addLayer({
          id: provinceId,
          type: 'symbol',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: province.properties.center,
              },
              properties: {
                name: province.properties.name
              },
            },
          },
          layout: {
            'text-field': ['get', 'name'],
            'text-size': 12,
            'text-offset': [0, -1],
            'text-anchor': 'top',
          },
          paint: {
            'text-color': '#000000',
          },
        });
      } else {
      }
    })
  })

  //绘制人员流动的路径
  function calculateLineWidth(volume: number) {
    return Math.min(8, Math.max(1, volume / 10)); // 示意逻辑
  }
  //自定义时间控件
  // 找到贝塞尔曲线数据中的最小和最大年份
  let minYear = Number.MAX_SAFE_INTEGER;
  let maxYear = Number.MIN_SAFE_INTEGER;

  store.state.map.poetMigration.forEach((curve: { year: number; time: number; }) => {
    if (curve.time < minYear) minYear = curve.time;
    if (curve.time > maxYear) maxYear = curve.time;
  });

  class TimeSliderControl {
    [x: string]: any;
    onAdd(map: any) {
      this._map = map;
      const sliderContainer = document.createElement('div');
      sliderContainer.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
      sliderContainer.style.display = 'flex'; // 使用CSS Flexbox
      sliderContainer.style.flexDirection = 'column'; // 元素子项沿主轴垂直排列
      sliderContainer.style.padding = '5px';
      sliderContainer.style.margin = '5px';

      //添加时间控件
      const timeContainer = document.createElement('div');
      timeContainer.style.display = 'flex'; // 使用CSS Flexbox
      timeContainer.style.flexDirection = 'row'; // 元素子项沿主轴垂直排列

      const timeSlider = document.createElement('input');
      timeSlider.type = 'range';
      timeSlider.min = minYear.toString();   // 最小值设为贝塞尔曲线中的最小年份
      timeSlider.max = maxYear.toString();
      timeSlider.value = maxYear.toString();
      timeSlider.step = '1';
      timeSlider.id = 'time-slider';
      timeSlider.className = 'time-slider';

      const timeSliderLabel = document.createElement('label');
      timeSliderLabel.innerHTML = `选择年份：`;
      timeSliderLabel.htmlFor = 'time-slider';

      timeContainer.appendChild(timeSliderLabel)
      timeContainer.appendChild(timeSlider)

      // 创建一个包装器div来包含label，以便使用flex
      const timeLabelWrapper = document.createElement('div');
      timeLabelWrapper.style.display = 'flex'; // 使用flex布局
      timeLabelWrapper.style.justifyContent = 'space-between'; // 两边对齐元素
      timeLabelWrapper.style.alignItems = 'center'; // 垂直居中

      // 创建时间显示标签
      const timeLabelMin = document.createElement('label');
      timeLabelMin.textContent = `Year: ${minYear}`;
      timeLabelMin.htmlFor = 'time-slider';
      timeLabelMin.style.marginLeft = 'auto'; // 把标签向右推

      // 创建时间显示标签（滑块值）
      const timeLabelVal = document.createElement('label');
      timeLabelVal.textContent = `Year: ${timeSlider.value}`;
      timeLabelVal.htmlFor = 'time-slider';
      timeLabelVal.id = 'time-slider-label';
      timeLabelVal.style.marginLeft = 'auto'; // 通过自动外边距把它推到右边

      // 将标签添加到包装器中
      timeLabelWrapper.appendChild(timeLabelMin);
      timeLabelWrapper.appendChild(timeLabelVal);

      // 添加数量控件
      const countContainer = document.createElement('div');
      countContainer.style.display = 'flex'; // 使用CSS Flexbox
      countContainer.style.flexDirection = 'row'; // 元素子项沿主轴垂直排列

      const countSlider = document.createElement('input');
      countSlider.type = 'range';
      countSlider.min = '1';
      countSlider.max = bezierCurvesMap.size.toString(); // 设置最大值为曲线总数
      countSlider.value = bezierCurvesMap.size.toString();
      countSlider.id = 'count-slider';
      countSlider.className = 'count-slider';

      const countSliderLabel = document.createElement('label');
      countSliderLabel.innerHTML = `显示路径：`;
      countSliderLabel.htmlFor = 'count-slider';

      countContainer.appendChild(countSliderLabel)
      countContainer.appendChild(countSlider)

      // 创建一个包装器div来包含label，以便使用flex
      const countLabelWrapper = document.createElement('div');
      countLabelWrapper.style.display = 'flex'; // 使用flex布局
      countLabelWrapper.style.justifyContent = 'space-between'; // 两边对齐元素
      countLabelWrapper.style.alignItems = 'center'; // 垂直居中

      // 创建时间显示标签
      const countLabelMin = document.createElement('label');
      countLabelMin.textContent = `Count: ${1}`;
      countLabelMin.htmlFor = 'count-slider';
      countLabelMin.style.marginLeft = 'auto'; // 把标签向右推

      // 创建时间显示标签（滑块值）
      const countLabelVal = document.createElement('label');
      countLabelVal.textContent = `Count: ${countSlider.value}`;
      countLabelVal.htmlFor = 'count-slider';
      countLabelVal.id = 'count-slider-label';
      countLabelVal.style.marginLeft = 'auto'; // 通过自动外边距把它推到右边

      // 将标签添加到包装器中
      countLabelWrapper.appendChild(countLabelMin);
      countLabelWrapper.appendChild(countLabelVal);

      // 当数量滑条输入改变时的处理程序
      countSlider.oninput = (e) => {
        const count = e.target.value;
        countLabelVal.innerHTML = `Count: ${count}`;
        filterCurvesByYearAndCount(timeSlider.value, count); // 更新时应同时传入年份和数量
      };

      timeSlider.oninput = (e) => {
        const year = e.target.value;
        timeLabelVal.textContent = `Year: ${year}`; // 更新label的内容
        filterCurvesByYearAndCount(year, countSlider.value); // 更新时应同时传入年份和数量
      };

      sliderContainer.appendChild(countLabelWrapper);
      sliderContainer.appendChild(countContainer);
      sliderContainer.appendChild(timeLabelWrapper);
      sliderContainer.appendChild(timeContainer);
      return sliderContainer;
    }
    onRemove() {
      this._map = undefined;
    }
  }

  // 根据所选年份和数量更新贝塞尔曲线的显示
  function filterCurvesByYearAndCount(selectedYear: string, selectedCount: string) {
    let visibleCount = 0;
    const maxCount = parseInt(selectedCount)
    bezierCurvesMap.forEach((bezierCurve, index) => {
      const layerId = `route${index}`;
      // 计数可见曲线并仅显示不超过所选年份匹配且不超过指定数量的曲线
      let isVisible = bezierCurve.time < parseInt(selectedYear) && visibleCount < maxCount;
      if (isVisible) visibleCount++;
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', isVisible ? 'visible' : 'none');
      }
    });
    console.log(`Updated to show ${visibleCount} curves for year ${selectedYear}`);
  }

  //绘制贝塞尔曲线
  function getMidPoint(start: any[], end: any[]) {
    // 计算中点
    return [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
  }

  function getControlPoint(start: number[], end: number[], offset: number) {
    // 计算中点
    const midPoint = getMidPoint(start, end);
    // 计算起点到终点的方向向量
    const dirVector = [end[0] - start[0], end[1] - start[1]];
    // 确定统一的旋转方向，这里假设向“左”旋转，这取决于坐标系的定义
    const perpVector = [-dirVector[1], dirVector[0]];

    // 确定偏移向量的长度
    const length = Math.sqrt(perpVector[0] * perpVector[0] + perpVector[1] * perpVector[1]);
    // 归一化垂直向量
    const normVector = [perpVector[0] / length, perpVector[1] / length];
    // 判断使用正偏或负偏以保持对称性
    const sign = (start[0] > end[0]) ? -1 : 1;
    // 中点加上归一化的垂直向量乘以想要的偏移量即为控制点
    return [midPoint[0] + normVector[0] * offset * sign, midPoint[1] + normVector[1] * offset * sign];
  }

  function getQuadraticBezierPoint(start: number[], control: number[], end: number[], t: number) {
    const x = (1 - t) ** 2 * start[0] + 2 * (1 - t) * t * control[0] + t ** 2 * end[0];
    const y = (1 - t) ** 2 * start[1] + 2 * (1 - t) * t * control[1] + t ** 2 * end[1];
    return [x, y];
  }

  function createBezierCurve(start: any, control: any, end: any, numberOfPoints: number) {
    const curve = [];
    for (let i = 0; i <= numberOfPoints; i++) {
      const t = i / numberOfPoints;
      curve.push(getQuadraticBezierPoint(start, control, end, t));
    }
    return curve;
  }

  // 存储曲线数据
  const bezierCurvesMap = new Map();
  store.state.map.poetMigration.forEach((route: { volume: number; start: number[]; end: number[]; }) => {
    // 计算控制点和贝塞尔曲线
    const controlPointOffset = Math.sqrt(route.volume) / 30;
    const controlPoint = getControlPoint(route.start, route.end, controlPointOffset);
    const curvePoints = createBezierCurve(route.start, controlPoint, route.end, 100);

    // 将曲线数据存储在映射中
    const key = `${route.start}-${route.end}`;
    const reverseKey = `${route.end}-${route.start}`;

    // 检查是否有对应的反向路线
    if (bezierCurvesMap.has(reverseKey)) {
      // 获取反向曲线的数据
      const reverseCurveData = bezierCurvesMap.get(reverseKey);

      const controlPointForConnectedCurves = reverseCurveData.control;

      const curvePointsForConnectedCurves = createBezierCurve(route.start, controlPointForConnectedCurves, route.end, 100);

      const connectedCurve = curvePointsForConnectedCurves.slice(0, 50)
        .concat(reverseCurveData.curve.slice(50));

      bezierCurvesMap.set(key, {
        ...route,
        control: controlPointForConnectedCurves,
        curve: connectedCurve
      });

      // 存储连接后的曲线信息
      bezierCurvesMap.set(key, {
        ...route,
        control: controlPoint,
        curve: connectedCurve
      });
    } else {
      // 如果没有对应的反向路线，直接存储曲线信息       
      bezierCurvesMap.set(key, {
        ...route,
        control: controlPoint,
        curve: curvePoints
      });
    }
  });

  map.on('load', () => {
    // 实例化自定义控件并添加到地图上
    const timeSliderControl = new TimeSliderControl();
    map.addControl(timeSliderControl, 'bottom-left');
    // 遍历每条贝塞尔曲线
    // 存储已配对的曲线索引
    let pairedIndices = new Set();
    bezierCurvesMap.forEach((bezierCurve, index) => {
      // 创建GeoJSON对象
      const lineString = {
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": bezierCurve.curve // 这里我们使用预先计算的贝塞尔曲线点集
        },
        "properties": {
          "lineWidth": calculateLineWidth(bezierCurve.volume),
          "lineColor": isNorthOfLine(store.state.map.qinlin_huaihe, bezierCurve.end) ? 'steelblue' : '#FF9912'
        }
      };

      // 将GeoJSON加到地图上
      const layerId = `route${index}`
      map.addLayer({
        'id': layerId, // 为每条曲线设置一个唯一的ID
        'type': 'line',
        'source': {
          'type': 'geojson',
          'data': lineString
        },
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': ['get', 'lineColor'],
          'line-width': ['get', 'lineWidth']
        }
      });
    });
  });

  //绘制金和南宋之间边界
  map.on('load', () => {
    map.addLayer({
      id: 'qinling-huaihe-line',
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: store.state.map.qinlin_huaihe
          }
        }
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': 'black',
        'line-width': 3,
        'line-dasharray': [2, 2]
      }
    });
  });

  // 在加载地图时禁用 place-label 图层
  map.on('style.load', function () {
    // 找到 place-label 图层
    map.getStyle().layers.forEach(function (layer: { [x: string]: string; type: string; id: any; }) {
      if (layer.type === 'symbol' && layer['source-layer'] === 'place_label') {
        // 设置 minzoom 属性
        map.setLayerZoomRange(layer.id, 0, 3.8);
      }
    });
  });
  map.on('load', () => {
    const legend = document.createElement('div');
    legend.className = 'legend';
    legend.style.position = 'absolute'; // 确保它有绝对定位
    legend.style.zIndex = '1'; // 让它浮在地图之上
    legend.style.width = '60px';
    legend.style.height = '80px';
    legend.style.padding = '5px';
    legend.style.margin = '5px';
    legend.style.background = 'white';
    legend.style.borderRadius = '4px';
    legend.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'; // 可选，增加阴影效果

    const legendColor = ['#ffcc66', '#ff9966', '#3399ff', '#33ccff'];
    const legendText = ['北', '南->北', '北->南', '南'];

    // 创建图例条目
    legendColor.forEach((item, index) => {
      const div = document.createElement('div');
      div.style.width = '100%'; // 修改为 100% 以匹配 legend 容器的宽度
      div.style.height = '20px';
      div.innerHTML = '<span style="background:' + item + '; display:inline-block; height:10px; width:20px;" ></span> ' + legendText[index];
      legend.appendChild(div);
    })

    // 获取地图容器，并将图例添加为子元素
    map.getContainer().appendChild(legend);

    // 你可以调整图例元素的位置来放置在你希望的角落
    // 这是将图例放在地图右上角的例子
    legend.style.bottom = '25px'; // 从顶部偏移
    legend.style.right = '10px'; // 从右边偏移
  });

}

onMounted(() => {
  // 使用 then() 确保在数据被存储后再执行后续操作
  store.dispatch('map/fetchData').then(() => {
    MapBox();

    // 在这里数据已经被存储到 Vuex 中，现在可以安全地访问
    console.log(store.state.map.china);
    console.log(store.state.map.china_province);
    // ... 访问其他数据
  }).catch((error) => {
    // 错误处理
    console.error('Error fetching data:', error);
  });
});

</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
}

.mapboxgl-ctrl mapboxgl-ctrl-group {
  display: flex;
  flex-direction: column;
  /* 竖直排列 */
}
</style>

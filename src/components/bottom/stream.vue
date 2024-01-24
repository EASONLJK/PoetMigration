<template>
  <div id='stream'>
    <h2>
      &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp南北宋诗人迁移图
    </h2>
  </div>

</template>
<script setup>
import { onMounted } from 'vue';
import * as d3 from 'd3';
//绘制图表
function streamGragh () {
  const keys = ['always_south', 'north_to_south', 'south_to_north', 'always_north']
  const data = [
    {
      year: 1125,
      always_north: 27,
      south_to_north: 3,
      north_to_south: 0,
      always_south: 32
    },
    {
      year: 1126,
      always_north: 33,
      south_to_north: 3,
      north_to_south: 7,
      always_south: 29
    },
    {
      year: 1127,
      always_north: 21,
      south_to_north: 0,
      north_to_south: 8,
      always_south: 45
    },
    {
      year: 1128,
      always_north: 6,
      south_to_north: 3,
      north_to_south: 1,
      always_south: 56
    },
    {
      year: 1129,
      always_north: 4,
      south_to_north: 1,
      north_to_south: 2,
      always_south: 54
    },
    {
      year: 1130,
      always_north: 4,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 59
    },
    {
      year: 1131,
      always_north: 2,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 60
    },
    {
      year: 1132,
      always_north: 2,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 63
    },
    {
      year: 1133,
      always_north: 2,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 62
    },
    {
      year: 1134,
      always_north: 2,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 64
    },
    {
      year: 1135,
      always_north: 2,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 65
    },
    {
      year: 1136,
      always_north: 2,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 64
    },
    {
      year: 1137,
      always_north: 2,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 65
    },
    {
      year: 1138,
      always_north: 2,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 64
    },
    {
      year: 1139,
      always_north: 3,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 63
    },
    {
      year: 1140,
      always_north: 2,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 63
    },
    {
      year: 1141,
      always_north: 2,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 63
    },
    {
      year: 1142,
      always_north: 1,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 61
    },
    {
      year: 1143,
      always_north: 1,
      south_to_north: 1,
      north_to_south: 0,
      always_south: 57
    },
    {
      year: 1144,
      always_north: 2,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 54
    },
    {
      year: 1145,
      always_north: 2,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 51
    },
    {
      year: 1146,
      always_north: 2,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 50
    },
    {
      year: 1147,
      always_north: 2,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 53
    },
    {
      year: 1148,
      always_north: 1,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 49
    },
    {
      year: 1149,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 1,
      always_south: 50
    },
    {
      year: 1150,
      always_north: 0,
      south_to_north: 1,
      north_to_south: 0,
      always_south: 46
    },
    {
      year: 1151,
      always_north: 0,
      south_to_north: 1,
      north_to_south: 0,
      always_south: 46
    },
    {
      year: 1152,
      always_north: 1,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 44
    },
    {
      year: 1153,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 1,
      always_south: 44
    },
    {
      year: 1154,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 42
    },
    {
      year: 1155,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 41
    },
    {
      year: 1156,
      always_north: 0,
      south_to_north: 1,
      north_to_south: 0,
      always_south: 38
    },
    {
      year: 1157,
      always_north: 0,
      south_to_north: 1,
      north_to_south: 1,
      always_south: 37
    },
    {
      year: 1158,
      always_north: 1,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 35
    },
    {
      year: 1159,
      always_north: 1,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 36
    },
    {
      year: 1160,
      always_north: 1,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 33
    },
    {
      year: 1161,
      always_north: 1,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 32
    },
    {
      year: 1162,
      always_north: 0,
      south_to_north: 1,
      north_to_south: 0,
      always_south: 31
    },
    {
      year: 1163,
      always_north: 1,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 32
    },
    {
      year: 1164,
      always_north: 1,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 30
    },
    {
      year: 1165,
      always_north: 1,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 32
    },
    {
      year: 1166,
      always_north: 1,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 29
    },
    {
      year: 1167,
      always_north: 1,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 27
    },
    {
      year: 1168,
      always_north: 1,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 27
    },
    {
      year: 1169,
      always_north: 1,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 28
    },
    {
      year: 1170,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 28
    },
    {
      year: 1171,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 26
    },
    {
      year: 1172,
      always_north: 1,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 23
    },
    {
      year: 1173,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 1,
      always_south: 20
    },
    {
      year: 1174,
      always_north: 0,
      south_to_north: 1,
      north_to_south: 0,
      always_south: 22
    },
    {
      year: 1175,
      always_north: 1,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 19
    },
    {
      year: 1176,
      always_north: 1,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 21
    },
    {
      year: 1177,
      always_north: 1,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 21
    },
    {
      year: 1178,
      always_north: 1,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 18
    },
    {
      year: 1179,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 1,
      always_south: 18
    },
    {
      year: 1180,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 19
    },
    {
      year: 1181,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 21
    },
    {
      year: 1182,
      always_north: 0,
      south_to_north: 1,
      north_to_south: 0,
      always_south: 19
    },
    {
      year: 1183,
      always_north: 1,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 19
    },
    {
      year: 1184,
      always_north: 1,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 18
    },
    {
      year: 1185,
      always_north: 1,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 19
    },
    {
      year: 1186,
      always_north: 1,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 18
    },
    {
      year: 1187,
      always_north: 1,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 18
    },
    {
      year: 1188,
      always_north: 1,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 17
    },
    {
      year: 1189,
      always_north: 1,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 16
    },
    {
      year: 1190,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 1,
      always_south: 16
    },
    {
      year: 1191,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 15
    },
    {
      year: 1192,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 15
    },
    {
      year: 1193,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 16
    },
    {
      year: 1194,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 14
    },
    {
      year: 1195,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 14
    },
    {
      year: 1196,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 12
    },
    {
      year: 1197,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 12
    },
    {
      year: 1198,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 12
    },
    {
      year: 1199,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 12
    },
    {
      year: 1200,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 12
    },
    {
      year: 1201,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 11
    },
    {
      year: 1202,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 11
    },
    {
      year: 1203,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 10
    },
    {
      year: 1204,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 8
    },
    {
      year: 1205,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 5
    },
    {
      year: 1206,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 5
    },
    {
      year: 1207,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 3
    },
    {
      year: 1208,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 4
    },
    {
      year: 1209,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 1
    },
    {
      year: 1210,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 1
    },
    {
      year: 1211,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 1
    },
    {
      year: 1212,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 2
    },
    {
      year: 1213,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 1
    },
    {
      year: 1214,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 1
    },
    {
      year: 1215,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 1
    },
    {
      year: 1216,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 1
    },
    {
      year: 1217,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 1
    },
    {
      year: 1218,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 2
    },
    {
      year: 1219,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 2
    },
    {
      year: 1220,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 2
    },
    {
      year: 1221,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 2
    },
    {
      year: 1222,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 1
    },
    {
      year: 1223,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 1
    },
    {
      year: 1246,
      always_north: 0,
      south_to_north: 0,
      north_to_south: 0,
      always_south: 1
    }
  ];
  const dom = document.getElementById('stream')
  const margin = { top: 20, right: 30, bottom: 30, left: 50 };
  const width = dom.offsetWidth - margin.left - margin.right;
  const height = dom.offsetHeight - margin.top - margin.bottom;
  //堆叠
  const stackData = d3.stack()
    // .order(d3.stackOrderInsideOut)
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetSilhouette)
    .keys(keys)(data)

  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, width])

  const y = d3.scaleLinear()
    .domain(d3.extent(stackData.flat(2)))
    .range([height, 0])
  //指定的DOM元素中创建一个SVG元素，并设置其大小和偏移，以便在SVG元素中绘制图表的内容
  const svg = d3.select(dom)
    .append('svg')
    .attr('width', width + margin.left + margin.right + 200)
    .attr('height', height + margin.bottom + margin.top)
    .append('g')
    .attr("transform", `translate(${margin.left}, ${margin.top})`)


  svg.append('g')
    .call(d3.axisBottom(x).ticks(10))
    .attr("transform", `translate(0, ${height})`)

  svg.append('g')
    .call(d3.axisLeft(y))

  const color = d3.scaleOrdinal()
    .domain(keys)
    // .range(d3.schemeCategory10)
    .range(["#ea9375", "#f6c496", "#94bbdb", "#4d6273"]);

  const area = d3.area()
    .x(d => x(d.data.year))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]))

  // svg.selectAll("text")
  //   .data(stackData)
  //   .join('text')
  //   .attr('x', d => d.x)
  //   .attr('y', -50)
  //   .text("李清照")
  //   .raise();


  svg.selectAll('mylayers')
    .data(stackData)
    .join('path')
    .attr("fill", d => color(d.key))
    .attr('stroke-opacity', 0.5)
    .attr("d", area.curve(d3.curveBasis)) // 使用曲线插值函数curveBasis
    .on('mouseover', function (event, d) {
      d3.selectAll('path').style('opacity', 0.2);
      d3.select(this).style('opacity', 1).append('title').text(d.key);
    })
    .on('mouseout', function (event, d) {
      d3.selectAll('path').style('opacity', 1);
    })
  // 在河流图中添加点和文本
  function addLabelsToStream () {
    // 给定的坐标点和对应文本信息
    const pointsTextInfo = [
      { year: 1128, position: 30, text: '岳飞' },
      { year: 1128.5, position: 25.5, text: '宇文虚中' },
      { year: 1126, position: 0, text: '叶梦得' },
      { year: 1150, position: 0, text: '范成大' }
    ];

    pointsTextInfo.forEach(point => {
      // 将年份转换为x坐标
      const pointX = x(point.year); // 注意: x是一个比例尺函数，需要替换为实际定义的比例尺
      // 使用给定的position作为y坐标
      const pointY = y(point.position); // 注意: y是一个比例尺函数，需要替换为实际定义的比例尺

      // 添加一个点
      svg.append('circle')
        .attr('cx', pointX)
        .attr('cy', pointY)
        .attr('r', 2)  // 圆点半径
        .attr('fill', '#000');

      // 添加对应的文本
      svg.append('text')
        .attr('x', pointX + 10) // 将文本稍微放到点的右侧
        .attr('y', pointY + 5)  // 根据字体大小微调文本的垂直位置
        .attr('font-size', '12px') // 设置文本字体大小为12px
        .text(point.text); // 使用指定的文本内容
    });
  }
  createLegend(svg, color, keys, width, height, margin);
  addLabelsToStream();

}

function createLegend (svg, color, keys, width, height, margin) {
  // 图例的尺寸和位置
  const legendMargin = { top: 10, right: 5, bottom: 10, left: 5 };
  const legendWidth = 150; // 图例的宽度
  const legendHeight = keys.length * 25; // 图例的高度，根据项目数动态计算

  const reversedKeys = keys.slice().reverse();

  // 创建图例容器
  const legend = svg.append('g')
    .attr('transform', `translate(${width + legendMargin.left + legendMargin.right - legendWidth}, ${legendMargin.top})`);

  // 创建图例颜色块，并为每个 key 附上相对应的颜色
  legend.selectAll('rect')
    .data(reversedKeys)
    .enter().append('rect')
    .attr('x', 0)
    .attr('y', (d, i) => i * 25)
    .attr('width', 20)
    .attr('height', 20)
    .attr('fill', d => color(d));

  // 创建文本标签并附上 key 值
  legend.selectAll('text')
    .data(reversedKeys)
    .enter().append('text')
    .attr('x', 30) // 文本标签在颜色块右侧，距离为 30px
    .attr('y', (d, i) => i * 25 + 15) // 文本标签在颜色块的中央
    .text(d => d)
    .attr('fill', 'black')
    .style('alignment-baseline', 'central') // 确保垂直对齐
    .style('font-size', '16px')
    .style('font-family', 'sans-serif');
}

onMounted(() => {
  try {
    streamGragh()
  } catch (error) {
    console.log(error)
  }
})

// onMounted(() => {
//   d3.csv('@/assets/data.csv').then(data => {
//     streamGraph(data);
//   }).catch(error => {
//     console.log(error);
//   });
// });
</script>

<style scope>
#stream {
  width: 100%;
  height: 100%;
  background-color: "#1C0D22";
}
</style>


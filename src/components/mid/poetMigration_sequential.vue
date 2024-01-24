<template>
  <div class="right-framwork">
    <div id="sequential">
      <div id="poetMigration_sequential">
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, watch, watchEffect, nextTick, inject, ref, toRef } from 'vue';
import * as d3 from 'd3'
import axios, { all } from 'axios'
// import { useStore } from '../../store/index.js'

let data_length = ref(0)
// let store = useStore()
let bus = inject('bus')
let allColleges = []
let url = 'http://127.0.0.1:5000/'

function sequential() {
  axios.get(url + 'poetMigration_sequential').then(res => {
    const data = res.data
    const sequential_view = document.getElementById('poetMigration_sequential')
    const margin = { top: 20, left: 20, right: 20, bottom: 20 }
    const width = sequential_view.offsetWidth - margin.left - margin.right,
      height = sequential_view.offsetHeight - margin.top - margin.bottom;
    const innerRadius = width / 5;
    const outerRadius = width / 2.5
    const gap = 0.2
   
    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))
      .range([0, 2 * Math.PI - gap]);

    const minY = d3.min(data, d => Math.min(d.stayPoets, d.inPoets, d.outPoets, d.noChangePoets));
    const maxY = d3.max(data, d => Math.max(d.stayPoets, d.inPoets, d.outPoets, d.noChangePoets));

    const y = d3.scaleRadial()
      .domain([minY, maxY])
      .range([innerRadius, outerRadius]);

    const line = d3.lineRadial()
      .curve(d3.curveLinearClosed)
      .angle(d => x(d.year));

    const area = d3.areaRadial()
      .curve(d3.curveLinearClosed)
      .angle(d => x(d.year));

    const svg = d3.select(sequential_view)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "width: 100%; height: auto; font: 10px sans-serif;")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round");

    const avgRadius = y(0); // 假定0值对应的半径
    const calculateInnerRadius = (datumValue) => {
      const radius = avgRadius - y(datumValue);
      return radius < 0 ? 0 : radius;
    };

    // 绘制代表 avg 的基准线圆
    svg.append('circle')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('r', innerRadius);

    // 绘制在 avg 外侧的 stayPoets 和 inPoets，它们从innerRadius向外画
    svg.append('path')
      .attr('fill', 'lightsteelblue')
      .attr('d', area.innerRadius(innerRadius).outerRadius(d => y(d.stayPoets))(data))
      .attr('fill-opacity', 0.2);

    svg.append('path')
      .attr('fill', 'steelblue')
      .attr('d', area.innerRadius(innerRadius).outerRadius(d => y(d.inPoets))(data))
      .attr('fill-opacity', 0.2);

    // 对于 outPoets，从 innerRadius 开始向内绘制，从外往内的半径
    svg.append('path')
      .attr('fill', 'steelblue')
      .attr('fill-opacity', 0.2)
      // 计算内半径，应该从 outerRadius 开始减去值的变化
      .attr('d', area.innerRadius(d => outerRadius - y(d.outPoets)).outerRadius(innerRadius)(data));

    // 对于 noChangePoets 也是一样的绘制逻辑
    svg.append('path')
      .attr('fill', 'lightsteelblue')
      .attr('fill-opacity', 0.2)
      // 同样需要计算从outerRadius到内半径的变化
      .attr('d', area.innerRadius(d => outerRadius - y(d.noChangePoets)).outerRadius(innerRadius)(data));

    svg.append("g")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", d => `
      rotate(${((x(d.year) * 180) / Math.PI - 90)})
      translate(${innerRadius},0)
    `)
      .call(g => g.append("line") // 用线而不是路径
        .attr("x2", outerRadius - innerRadius) // 从内半径到外半径画线
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.2))
      .call(g => g.append("text")
        .attr("transform", d => `rotate(${(x(d.year) * 180) / Math.PI > 180 ? -90 : 90})`)
        .attr("x", 8) // 将文本稍微移出径向线
        .attr("text-anchor", d => (x(d.year) * 180) / Math.PI > 180 ? "end" : "start")
        .text(d => d.year));

    // svg.append("g")
    //   .attr("text-anchor", "middle")
    //   .selectAll()
    //   .data(y.ticks().reverse())
    //   .join("g")
    //   .call(g => g.append("circle")
    //     .attr("fill", "none")
    //     .attr("stroke", "currentColor")
    //     .attr("stroke-opacity", 0.2)
    //     .attr("r", y))
    //   .call(g => g.append("text")
    //     .attr("y", d => -y(d))
    //     .attr("dy", "0.35em")
    //     .attr("stroke", "#fff")
    //     .attr("stroke-width", 5)
    //     .attr("fill", "currentColor")
    //     .attr("paint-order", "stroke")
    //     .text((x, i) => `${x.toFixed(0)}${i ? "" : "°F"}`)
    //     .clone(true)
    //     .attr("y", d => y(d)));
  })
}

onMounted(() => {
  try {
    sequential()
  } catch (error) {
  }
})

</script>

<style scoped>
.right-framwork {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

#sequential {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}

#poetMigration_sequential {
  width: 100%;
  height: 100%;
}
</style>
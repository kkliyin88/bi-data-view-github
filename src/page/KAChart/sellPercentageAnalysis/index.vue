<template>
  <div ref="wrap">
    <p>KA销售占比分析报表__开发中</p>
    <div>
      <div>
        <div id="myChart" :style="{width: '600px', height: '500px'}"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { post } from "@/axios/fetch";
export default {
  components: {},
  data() {
    return {};
  },
  mounted() {
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
    this.drawYuan();
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
  methods: {
    getHeight() {
      //设置页面高度
      this.pageHeight = window.innerHeight;
      this.$refs.wrap.style.height = this.pageHeight - 80 + "px";
    },
    drawYuan() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "办事销售处占比",
          // subtext: "纯属虚构",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "horizontal",
          x: "center",
          y: "bottom",
          data: ["浙江办事处", "武汉办事处", "广州办事处", "视频广告"]
        },
        calculable: true,
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: 2449011.56, name: "浙江办事处" },
              { value: 710063.85, name: "武汉办事处" },
              { value: 448.4, name: "广州办事处" },
              { value: 7384164.9, name: "视频广告" }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },
              normal: {
                label: {
                  show: true,
                  formatter: "{b} : ({d}%)"
                },
                labelLine: { show: true }
              }
            }
          }
        ]
      });
    }
  }
};
</script>
<style scoped>
</style>

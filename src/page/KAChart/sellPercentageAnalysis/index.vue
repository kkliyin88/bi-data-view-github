<template>
  <div ref="wrap" class='wrapBox'>
    <div>
      <Row>
        <Col :span="12">
          <div id="myChart1" class='chart1' :style="{width: '500px', height: pageHeight-200+'px'}"></div>
        </Col>
        <Col :span="12">
            <Table :data='tableData' :columns="columns"></Table>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script>
import { post } from "@/axios/fetch";
export default {
  components: {},
  data() {
    return {
      pageHeight:null,
      tableData:[],
      columns:[
          {
              type: 'index',
              align: 'center'
          },
           {
            title: '办事处',
            key: 'orgName',
            align:'center',
          },
          {
            title: '数量',
            key: 'posSaleSum',
            align:'center',
          },
           {
            title: '占比',
            key: 'posSaleRatio',
            align:'center',
          },
      ],
      chart1:{
        title: {
          text: "办事销售处占比",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {d}%"
        },
        legend: {
          orient: "horizontal",
          x: "center",
          y: "bottom",
          data: []
        },
        calculable: true,
        series: [
          {
//          name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [],
           
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
      },
    };
  },
  mounted() {
     this.getPageData();
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
  methods: {
    getHeight() {
      //设置页面高度
      this.pageHeight = window.innerHeight;
      this.$refs.wrap.style.height = this.pageHeight - 100 + "px";
    },
    getPageData(){
        let url='/kasm/saleReport/findOrgSale';
        post(url).then(res=>{
           console.log('res.data',res.data);
           this.chart1.series.data = [];
           this.tableData = res.data;
           console.log('tableData',this.tableData);
           res.data.map((item)=>{
               this.chart1.series[0].data.push({name:item.orgName,value:item.posSaleRatio});
               this.chart1.legend.data.push(item.orgName);
           })
           this.drawChart1();
        }).catch(error=>{
          this.loading = false;
          this.$Modal.warning({
            title:'提示',
            content:'连接服务失败!'
          })
        })
    },
    drawChart1() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart1"));
      // 绘制图表
      myChart.setOption(this.chart1);
      console.log('chart1',this.chart1)
    },
    
  }
};
</script>
<style scoped lang="less">
    .wrapBox{
        overflow-y: auto;
    }
</style>

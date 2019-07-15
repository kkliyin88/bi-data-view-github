<template>
  <div ref="wrap" class='wrapBox'>
     <section class='query'>
          <span>开始时间:<DatePicker size='small' type="month" placeholder="Select month" style="width: 150px;margin-left: 10px;"></DatePicker></span>
           <span style="margin-left: 15px;">结束时间:<DatePicker size='small' type="month" placeholder="Select month" style="width: 150px;margin-left: 10px"></DatePicker></span>
     </section>
    <div>
      <Row>
        <Col :span="11" v-if='level!=4'>
          <div ref="myChart1" class='chart1 box1' :style="{height: pageHeight-120+'px'}"></div>
        </Col>
        <Col :span="level==4?24:12" :push='1' >
            <div class='box1' :style="{height: pageHeight-120+'px'}" >
               <Table  :data='tableData' :columns="columns" size='small' :max-height=" pageHeight-120"></Table>
            </div>
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
      loading:false,
      tableData:[],
      myChart:{},
      relativeArr:[{},
        {title:'办事处销售占比',url:'/kasm/saleReport/findOrgSale',param:{}},
        {title:'分销商销售占比',url:'/kasm/saleReport/findDealerSale',param:{}}, // orgNo
        {title:'零售商销售占比',url:'/kasm/saleReport/findMarketSale',param:{}}, // dealerNo
        {title:'门店销售占比',url:'/kasm/saleReport/findStoreSale',param:{}},  // marketNo
      ],
      level:1, //1,2,3,4分别表示办事处/经销商/零售商/门店/
      columns:[
          {
              type: 'index',
              align: 'center'
          },
           {
            title: '名称',
            key: 'name',
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
            sortable: true
          },
      ],
      chartOption:{
        title: {
          text: "",
          x: "center"
        },
        toolbox: {
            right:20,
            feature: {
                myTool: {
                    show: true,
                    title: '返回',
                    icon: 'image://http://echarts.baidu.com/images/favicon.png',
                    onclick:()=>{
                        if(this.level-1 == 1 ){
                           this.relativeArr[this.level-1].param = {};
                        }
                        if(this.level==1){
                            return
                        }
                      this.getPageData(this.relativeArr[this.level-1].url,this.relativeArr[this.level-1].param);
                    }
                }
            }
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
            type: "pie",
            radius: "55%",
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },
              normal: {
                label: {
                  show: false,
                  formatter: "{b} : ({d}%)"
                },
                labelLine: { show: false }
              }
            }
          }
        ]
      },
    };
  },
  mounted() {
     this.getPageData(this.relativeArr[this.level].url,this.relativeArr[this.level].param);
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
    getPageData(url,param,){
        post(url,param).then(res=>{
            if(res.code!==200){
                this.$Modal.warning({
                    title:'提示',
                    content:res.message
                  })
                return
            }
           this.tableData = res.data;
           res.data.map((item)=>{
               item.value = item.posSaleRatio;
               this.chartOption.legend.data.push(item.name);
           });
           this.chartOption.series[0].data = res.data;
           this.level = res.data[0].level;
           this.chartOption.title.text = this.relativeArr[this.level].title;
           this.drawChart1();
        }).catch(error=>{
           console.log('error',error)
          this.$Modal.warning({
            title:'提示',
            content:'连接服务失败!'
          })
        })
    },
    drawChart1() {
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.$echarts.init(this.$refs.myChart1);
      // 绘制图表
      this.myChart.setOption(this.chartOption);
      this.myChart.on('click',(params)=>{
         if(params.data.level ==4){
             return
         };
         if(params.data.level==1){
              this.relativeArr[params.data.level+1].param.orgNo = params.data.orgNo;
         }else if(params.data.level==2){
             this.relativeArr[params.data.level+1].param.dealerNo = params.data.dealerNo;
         }else if(params.data.level==3){
           this.relativeArr[params.data.level+1].param.marketNo = params.data.marketNo;
         }
         this.getPageData(this.relativeArr[params.data.level+1].url,this.relativeArr[params.data.level+1].param);
     })
    },
  }
};
</script>
<style scoped lang="less">
    .wrapBox{
        overflow-y: auto;
       .chart1{
           width: 100%;
       }
    }
    .query{
        height: 50px;
        line-height: 50px;
    }
    .query:hover{
        background: lightgray;
    }
    .box1{
      background-color: #09153D !important ;
      border: 1px solid red;
    }
</style>

<template>
  <div ref="wrap" class='wrapBox'>
     <section class='query'>
          <span>开始时间:<DatePicker size='small' type="month" placeholder="Select month" style="width: 150px;margin-left: 10px;"></DatePicker></span>
           <span style="margin-left: 15px;">结束时间:<DatePicker size='small' type="month" placeholder="Select month" style="width: 150px;margin-left: 10px"></DatePicker></span>
     </section>
    <div>
      <Row>
        <Col :span="12" >
         <div ref="myChart1" class='chart1' :style="{height: pageHeight-120+'px'}"></div>
        </Col>
        <Col :span="12">
          <div v-for='(item,i) in tableList' :key='i'>

              <Table v-if='i==0'  :data='allOrgData' :columns="columnsList[0]" size='small' :max-height=" pageHeight-120"></Table>
               <!-- <Table  :data='item.newCompareList' :columns="columnsList[i]" size='small' :max-height=" pageHeight-120"></Table> -->

           </div>

        </Col>
      </Row>

      <!-- <Table  :data='item.newCompareList' :columns="columnsList[i]" size='small' :max-height=" pageHeight-120"></Table> -->

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
      tableList:[],
      summaryDataList:[],//所有汇总的数据
      allOrgData:[],
      myChart:{},
      level:1,
      relativeArr:[{},
        {title:'办事处销售占比',url:'/kasm/saleReport/findOrgSaleCompare',param:{year:'2019'}},
        {title:'分销商销售占比',url:'/kasm/saleReport/findDealerSale',param:{}}, // orgNo
        {title:'零售商销售占比',url:'/kasm/saleReport/findMarketSale',param:{}}, // dealerNo
        {title:'门店销售占比',url:'/kasm/saleReport/findStoreSale',param:{}},  // marketNo
      ],
      columnsList:[],
      chartOption:{
         xAxis: {
           type: 'category',
           data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar'
        }]
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
    getAllOrgData(){
      this.allOrgData=[];
      this.tableList.map((item)=>{
         this.allOrgData.push(...item.newCompareList)
      })
     console.log('allOrgData',this.allOrgData);
    },
    getPageData(url,param,){
        post(url,param).then(res=>{
            console.log()
            if(res.code!==200){
                this.$Modal.warning({
                    title:'提示',
                    content:res.message
                  })
                return
            }
         this.tableList = res.data;
         console.log(this.tableList,'tablelist')
         this.tableList.map((item,index)=>{ //每个表格横标题list
            this.tableList[index].newCompareList = [{},{},{}];
            this.columnsList[index] = [];

            this.columnsList[index].push(
              {   //横坐标参数
                title: '办事处',
                key: 'org',
                align:'center',
                rowspan:3,
                width:80,
              },
              {   //横坐标参数
                title: '年',
                key: 'year',
                align:'center',
                width:80,
              },

            )
            this.tableList[index].newCompareList[0].year = item.year;
            this.tableList[index].newCompareList[1].year = item.lastYear;
            this.tableList[index].newCompareList[2].year = '同比';
            item.compareList.map((item2)=>{
                this.tableList[index].newCompareList[0][`${item2.month}month`] = Number(item2.posSale).toFixed(2);

                this.tableList[index].newCompareList[1][`${item2.month}month`] = Number(item2.lastPosSale).toFixed(2);
                this.tableList[index].newCompareList[2][`${item2.month}month`] = Number(item2.compareRatio).toFixed(2);
                this.columnsList[index].push({ //横坐标参数
                    title: item2.month+'月',
                    key: item2.month+'month',
                    align:'center',
                    width:100,
                  })
            });
         })
          console.log('tableList1',this.tableList);
          console.log('columnsList',this.columnsList);

          this.getAllOrgData();
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
</style>

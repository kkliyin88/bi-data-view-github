<template>
  <div ref="wrap" class='wrapBox'>
     <section class='query'>
        <Form :model='query' :label-width='90' inline>
          <FormItem label='开始日期' >
            <DatePicker size='small'  v-model="query.year" @on-change='changeYear' type='year' placeholder="选择年" ></DatePicker>
          </FormItem>
        </Form>
     </section>
    <section>
      <Row>
        <Col :span="12" >
         <div ref="myChart1" class='chart1' :style="{height: pageHeight-120+'px'}"></div>
        </Col>
        <Col :span="12">
          <section class='table'>
            <Table @on-row-click='rowClick'  @on-row-dblclick='rowDBClick' :row-class-name="rowClassName" :data='allOrgData' :columns="columns" size='small' :max-height=" pageHeight-150"></Table>
          </section>
        </Col>
      </Row>
    </section>
  </div>
</template>
<script>
import { post } from "@/axios/fetch";

export default {
  components: { },
  data() {
    return {
      pageHeight:null,
      loading:false,
      tableList:[],
      query:{year:''},
      summaryDataList:[],//所有汇总的数据
      allOrgData:[],
      chartData:{},
      myChart:{},
      pageMsg:{
        level:0,
        arr:[{},{},{},{}],
      },
      columns:[],
      loadding:false,
      chartOption:{
          backgroundColor: '#09153D',
          toolbox: {
              right:20,
              feature: {
                  myTool: {
                      show: true,
                      title: '返回',
                      icon: 'image://../../../static/image/chartGoBack.png',
                      onclick:()=>{
                        if(this.tableList.length<1) return
                        let keyArr = this.getobjkeys(this.tableList[0]);
                        keyArr.map((item)=>{
                          switch(item){
                            case 'storeName' :
                              this.getMarketData(this.pageMsg.arr[2].code);
                              break;
                             case 'marketName' :
                                this.getDealerData(this.pageMsg.arr[1].code);
                             case 'dealerName' :
                                this.getOrgData('/kasm/saleReport/findOrgSaleCompare',{ year: "2018"});
                          }
                        })
                      }
                  }
              }
          },
          tooltip: {
              trigger: 'axis',
              formatter:function(data,index){
                let temp='';
                data.map((item)=>{
                  temp = temp+item.seriesName +':'
                  if(Number(item.value)>=10000&&Number(item.value)<100000){
                    item.tipValue = (Number(item.value)/10000).toFixed(2) +'k'
                  }else if(Number(item.value)>=100000){
                    item.tipValue = (Number(item.value)/100000).toFixed(2) +'w'
                  }else{
                    item.tipValue =Number(item.value).toFixed(2)
                  }
                  temp = temp + item.tipValue + '<br/>'
                })
                return temp;
              },
              axisPointer: {
                  type: 'cross',
                  crossStyle: {
                      color: '#999'
                  }
              },
          },
          title: {
            text: "",
            x: 'left',
            textStyle:{
              color:'#FFF',
              fontSize:'14px',
            }
        },

          legend: {
               textStyle:{
                color:'#fff'
              },
              data:['2018','2019','达成率']
          },
          xAxis:
              {
                  type: 'category',
                  data: [],
                  axisPointer: {
                      type: 'shadow'
                  },
                  axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff',
                        fontSize:'16'
                    }
                  },
                  splitLine: {
                      show: false,
                      //  改变轴线颜色
                      lineStyle: {
                          // 使用深浅的间隔色
                          // color: ['blue','green']
                      }
                  },
                  // x轴的颜色和宽度
                  axisLine:{
                      // lineStyle:{
                      //     color:'#fff',
                      //       width:1,   //这里是坐标轴的宽度,可以去掉
                      // }
                  }
              }
          ,
          yAxis: [
              {
                  type: 'value',
                  name: '销售额',
                  color:'#FFF',
                  axisLabel: {
                    formatter: function(value,index){
                      if(value>=10000&&value<100000){
                          return value/10000 +'k'
                      }else if(value>=100000){
                           return value/100000 +'w'
                      }else {
                        return value
                      }
                    },
                    textStyle: {
                      color:'#FFF'
                    },

                  },

              },
              {
                  type: 'value',
                  name: '达成率',
                  interval: 0.2,
                  axisLabel: {
                      formatter: '{value}%',
                      textStyle: {
                      color:'#FFF'
                    },
                  }
              }
          ],
          series: [
              {
                  name:'2018',
                  type:'bar',
                  data:[],
                  itemStyle:{
                    normal:{
                      color:'blue',
                    },
                  },
              },
              {
                  name:'2019',
                  type:'bar',
                  data:[],
                   itemStyle:{
                    normal:{
                      color:'green',
                    },
                  },
              },
              {
                  name:'达成率',
                  type:'line',
                  yAxisIndex: 1,
                  data:[],
                  itemStyle:{
                    normal:{
                     color:'yellow',
                    },
                  },
              }
          ]
      },
    };
  },
  mounted() {
    console
     this.getOrgData('/kasm/saleReport/findOrgSaleCompare',{year:this.query.year});
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
      this.$refs.wrap.style.height = this.pageHeight -75 + "px";
    },
    changeYear(year){
      console.log('year',year)
      console.log('tableList',this.tableList);
       if(this.tableList.length<1)return ;
       let keyArr = this.getobjkeys(this.tableList[0]);
       console.log('keyArr',keyArr)
      keyArr.map((item)=>{
        if(item=='orgName'){
           this.getOrgData('/kasm/saleReport/findOrgSaleCompare');
        }else if(item=='dealerName'){
           this.getDealerData(this.pageMsg.arr[1].code);
        }else if(item=='marketName'){
           this.getMarketData(this.pageMsg.arr[1].code);
        }else if(item=='storeName'){
           this.getStoreData(this.pageMsg.arr[2].code);
        }
      })
    },
    getobjkeys(obj){
     return  Object.keys(obj)
    },
    rowClick(row,index,){ //获取点击某一行
       if(!row.cellClassName) return
       let temp = Object.keys(row.cellClassName)[0];
      if(row.cellClassName[temp] == 'same-period-analysis-cell1' ){
         this.tableList.map((item)=>{
          if(item[temp]==row[temp]){
            this.packetChartData(item,temp);
            this.chartData = item;
          }
        })
      }
    },
    rowDBClick(row,index){
       console.log('year',this.query.year)
       if(!row.cellClassName) return ;
       let temp = Object.keys(row.cellClassName)[0];
       if(row.cellClassName[temp] !='same-period-analysis-cell1') return ;
       switch(temp){
          case 'orgName':
              this.getDealerData(row.orgNo);
              this.pageMsg.level = 0;
              this.pageMsg.arr[0].code = row.orgNo;
              break;
          case 'dealerName':
              this.getMarketData(row.dealerNo);
              this.pageMsg.level = 1;
              this.pageMsg.arr[1].code = row.dealergNo;
              break;
          case 'marketName':
              this.getStoreData(row.marketNo);
              this.pageMsg.level = 2;
              this.pageMsg.arr[2].code = row.marketgNo;
              break;
          default :
       }
      this.tableList.map((item)=>{
        if(item[this.pageMsg.arr[this.pageMsg.level].codekey] && item[this.pageMsg.arr[this.pageMsg.level].codekey] == row[this.pageMsg.arr[this.pageMsg.level].codekey]){
          this.getDataByLevel(this.pageMsg.level);
          return ;
        }
      })
    },
    getOrgData(url,param){
      this.loading = true ;
      let year = JSON.parse(JSON.stringify(this.query.year));
      year = year.indexOf('-')==-1?year:new Date(year).getFullYear().toString();
      console.log(typeof year,year)
       post(url,{year:year}).then(res=>{
         this.loading = false ;
        if(res.code!==200){
            this.$Modal.warning({
                title:'提示',
                content:res.message
              })
            return
        }
          this.tableList=res.data;
          if(this.tableList.length<1) {
            this.allOrgData = [];
            this.chartOption.series[0].data = [];
            this.chartOption.series[1].data = [];
            this.chartOption.series[2].data = [];
            this.drawChart1();
            return
          }
          this.packetChartData(this.tableList[0],'orgName');
          this.chartData = this.tableList[0];
          this.getPageData('办事处','orgName','orgNo');
       }).catch(error=>{
         this.loading = false ;
         console.log('error',error)
        this.$Modal.warning({
          title:'提示',
          content:'连接服务失败!'
        })
      })
    },
    getDealerData(code){  //获取经销商数据
      let year = JSON.parse(JSON.stringify(this.query.year));
      year = year.indexOf('-')==-1?year:new Date(year).getFullYear().toString();
      console.log(typeof year,year);
      this.loading = true ;
      post('/kasm/saleReport/findDealerSaleCompare',{orgNo:code,year:year}).then(res=>{
        this.loading = false ;
        if(res.code!==200){
            this.loading = false ;
            this.$Modal.warning({
                title:'提示',
                content:res.message
              })
            return
        };
        this.tableList=res.data;
        if(this.tableList.length<1) {
          this.allOrgData = [];
          this.chartOption.series[0].data = [];
          this.chartOption.series[1].data = [];
          this.chartOption.series[2].data = [];
          this.drawChart1();
          return
        }
        this.packetChartData(this.tableList[0],'dealerName');
        this.chartData = this.tableList[0];
        this.getPageData('经销商','dealerName','dealerNo');
      }).catch(error=>{
          this.$Modal.warning({
            title:'提示',
            content:'连接服务失败!'
          })
      })
    },
    getMarketData(code){  //获取零售商数据
      this.loading = true ;
       let year = JSON.parse(JSON.stringify(this.query.year));
       year = year.indexOf('-')==-1?year:new Date(year).getFullYear().toString();
       console.log(typeof year,year);
      post('/kasm/saleReport/findMarketSaleCompare',{dealerNo:code,year:year}).then(res=>{
        this.loading = false ;
        if(res.code!==200){
            this.$Modal.warning({
                title:'提示',
                content:res.message
            })
            return
        };
        this.tableList=res.data;
        if(this.tableList.length<1) {
          this.allOrgData = [];
          this.chartOption.series[0].data = [];
          this.chartOption.series[1].data = [];
          this.chartOption.series[2].data = [];
          this.drawChart1();
          return
        }
        this.packetChartData(this.tableList[0],'marketName');
        this.chartData = this.tableList[0];
        this.getPageData('零售商','marketName','marketNo');
      }).catch(error=>{
          this.loading = false ;
           console.log('error',error)
          this.$Modal.warning({
            title:'提示',
            content:'连接服务失败!'
          })
      })
    },
    getStoreData(code){
       this.loading = true ;
       let year = JSON.parse(JSON.stringify(this.query.year));
       year = year.indexOf('-')==-1?year:new Date(year).getFullYear().toString();
       console.log(typeof year,year);
      post('/kasm/saleReport/findStoreSaleCompare',{marketNo:code,year:year}).then(res=>{
        this.loading = false ;
        if(res.code!==200){
            this.$Modal.warning({
                title:'提示',
                content:res.message
            })
            return
        };
        this.tableList=res.data;
        if(this.tableList.length<1) {
          this.allOrgData = [];
          this.chartOption.series[0].data = [];
          this.chartOption.series[1].data = [];
          this.chartOption.series[2].data = [];
          this.drawChart1();
          return
        }
        this.packetChartData(this.tableList[0],'storeName');
        this.chartData = this.tableList[0];
        this.getPageData('门店','storeName','storeNo');
      }).catch(error=>{
          this.loading = false ;
          console.log('error',error)
          this.$Modal.warning({
            title:'提示',
            content:'连接服务失败!'
          })
      })
    },
    packetChartData(obj,Name){
      //设置title
       console.log('obj11',obj);
       console.log('Name',Name)
      this.chartOption.title.text=obj[Name];
      this.chartOption.xAxis.data = [];
      this.chartOption.series[0].data=[];
      this.chartOption.series[1].data=[];
      this.chartOption.series[2].data=[];
      this.chartOption.series[0].name = obj.lastYear;
      this.chartOption.series[1].name = obj.year;
      this.chartOption.legend.data[0] = obj.lastYear.toString()
      this.chartOption.legend.data[1] = obj.year.toString()
      obj.compareList.map((item)=>{
          this.chartOption.xAxis.data.push(item.month+'月') // x
          this.chartOption.series[0].data.push(item.lastPosSale);
          this.chartOption.series[1].data.push(item.posSale);
          this.chartOption.series[2].data.push(item.compareRatio)
      })
      this.drawChart1();
    },
    rowClassName(row, index){
      let i = index + 1 ;
      if(i%3!==0){
        return
      }
      return 'same-period-analysis-row';
    },
    getAllOrgData(orgName,orgNo){
      this.allOrgData=[];

      this.tableList.map((item)=>{
         this.allOrgData.push(...item.newCompareList)
      });
      this.allOrgData.map((item,index)=>{
        let i = index + 1
        if(i%3==0 || (i-1)%3==0){
            item.cellClassName = {[orgName]:'same-period-analysis-cell'}
        }else{
          item.cellClassName = {[orgName]:'same-period-analysis-cell1'}
        }
      });
    },

    getPageData(title,orgName,orgNo){
         this.tableList.map((item,index)=>{ //每个表格横标题list
            this.tableList[index].newCompareList = [{},{},{}];
            this.columns = [];
            this.columns.push({  title:title,  key: orgName, align:'center',minWidth:120,tooltip:true})
            this.columns.push({  title: '年',  key: 'year', align:'center',  minWidth:80,})
            this.tableList[index].newCompareList[0].year = item.year;
            this.tableList[index].newCompareList[1].year = item.lastYear;
            this.tableList[index].newCompareList[2].year = '同比';
            item.compareList.map((item2)=>{
                this.tableList[index].newCompareList[0][`${item2.month}month`] = Number(item2.posSale).toFixed(2);
                this.tableList[index].newCompareList[0][orgName]= item[orgName];
                this.tableList[index].newCompareList[0][orgNo] = item[orgNo]
                this.tableList[index].newCompareList[1][`${item2.month}month`] = Number(item2.lastPosSale).toFixed(2);
                this.tableList[index].newCompareList[1][orgName] = item[orgName];
                this.tableList[index].newCompareList[1][orgNo] = item[orgNo]
                this.tableList[index].newCompareList[2][`${item2.month}month`] = Number(item2.compareRatio).toFixed(2);
                this.tableList[index].newCompareList[2][orgName] = item[orgName];
                this.tableList[index].newCompareList[2][orgNo] = item[orgNo]
                this.columns.push({ //横坐标参数
                    title: item2.month+'月',
                    key: item2.month+'month',
                    align:'center',
                    minWidth:100,
                  })
            });
         })
          this.getAllOrgData(orgName,orgNo);
          this.drawChart1();
    },
    drawChart1() {
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.$echarts.init(this.$refs.myChart1,'dark');
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
        height: 40px;
        line-height: 40px;
    }
   .table{
    width: 100%;
    position: relative;
   }

</style>

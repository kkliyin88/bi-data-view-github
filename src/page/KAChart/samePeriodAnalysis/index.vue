<template>
  <div ref="wrap" class='wrapBox' style='padding: 8px;'>
     <section ref='querybox' >
        <Form :model='query' :label-width='70' ref='form' :rules='rules' inline>
          <FormItem label='选择年' style='width: 180px;' prop='year'>
            <DatePicker size='small' clearable v-model="query.year" @on-change='changeYear' type='year' placeholder="选择年" ></DatePicker>
          </FormItem>
           <FormItem label='' :label-width='0' >
            <Button  size='small' @click='goback' v-if='pageLevel>1'>返回上一级</Button>
          </FormItem>
        </Form>
     </section>
    <section>
      <Row>
        <Col :span="12" >
         <div ref="myChart1" class='chart1' :style="{height: pageHeight-queryBoxHeight-140+'px'}"></div>
        </Col>
        <Col :span="12">
          <section class='table'>
            <Table @on-row-click='rowClick' :show-header='allOrgData.length>0' :loading='loading' @on-row-dblclick='rowDBClick' :row-class-name="rowClassName" :data='allOrgData' :columns="columns" size='small' :max-height='pageHeight-queryBoxHeight-160'></Table>
          </section>
        </Col>
      </Row>
    </section>
  </div>
</template>
<script>
import { post } from "@/axios/fetch";
import chartOption from './chartOption.js';
export default {
  components: { },
  data() {
    return {
      pageHeight:null,
      queryBoxHeight:20,
      loading:false,
      tableList:[],
      query:{year:new Date()},
      summaryDataList:[],//所有汇总的数据
      allOrgData:[],
      pageLevel:1,
      rules:{
        year:{required:true,type:'date',message:'请选择年份',trigger:'change'},
      },
      myChart:{},
      pageMsg:{
        level:0,
        arr:[{},{},{},{}],
      },
      columns:[],
    };
  },
  mounted() {
     this.getOrgData('/kasm/saleReport/findOrgSaleCompare',this.query);
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
      this.$refs.wrap.style.height = this.pageHeight -70 + "px";
       console.log('pageHeight_same',this.pageHeight)
    },
    getQuerySectionHeight(){
      if(this.$refs.querybox&&this.$refs.querybox.style&&this.$refs.querybox.style.height){
        this.queryBoxHeight =  this.$refs.querybox.style.height;
        console.log('queryBoxHeight',this.queryBoxHeight);
      }
    },
    goback(){
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
              this.getOrgData('/kasm/saleReport/findOrgSaleCompare',this.query);
        }
      })
    },
    changeYear(year){
       if(this.tableList.length<1)return ;
       let keyArr = this.getobjkeys(this.tableList[0]);
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
          this.getQuerySectionHeight();
          this.pageLevel=1;
          if(this.tableList.length<1) {
            this.allOrgData = [];
            chartOption.series[0].data = [];
            chartOption.series[1].data = [];
            chartOption.series[2].data = [];
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
        this.getQuerySectionHeight();
        this.pageLevel=2;
        if(this.tableList.length<1) {
          this.allOrgData = [];
          chartOption.series[0].data = [];
          chartOption.series[1].data = [];
          chartOption.series[2].data = [];
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
        this.getQuerySectionHeight();
        this.pageLevel=3;
        if(this.tableList.length<1) {
          this.allOrgData = [];
          chartOption.series[0].data = [];
          chartOption.series[1].data = [];
          chartOption.series[2].data = [];
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
        this.getQuerySectionHeight();
        this.pageLevel=4;
        if(this.tableList.length<1) {
          this.allOrgData = [];
          chartOption.series[0].data = [];
          chartOption.series[1].data = [];
          chartOption.series[2].data = [];
          this.drawChart1();
          return
        }
        this.packetChartData(this.tableList[0],'storeName');
        this.chartData = this.tableList[0];
        this.getPageData('门店','storeName','storeNo');
      }).catch(error=>{
          this.loading = false ;
          this.$Modal.warning({
            title:'提示',
            content:'连接服务失败!'
          })
      })
    },
    packetChartData(obj,Name){
      //设置title
      chartOption.title.text=obj[Name];
      chartOption.xAxis.data = [];
      chartOption.series[0].data=[];
      chartOption.series[1].data=[];
      chartOption.series[2].data=[];
      chartOption.series[0].name = obj.lastYear;
      chartOption.series[1].name = obj.year;
      chartOption.legend.data[0] = obj.lastYear.toString()
      chartOption.legend.data[1] = obj.year.toString()
      obj.compareList.map((item)=>{
          chartOption.xAxis.data.push(item.month+'月')
          chartOption.series[0].data.push(item.lastPosSale==null?0:Number(item.lastPosSale).toFixed(2));
          chartOption.series[1].data.push(item.posSale==null?0:Number(item.posSale).toFixed(2));
          chartOption.series[2].data.push(item.compareRatio==null?0:Number(item.compareRatio).toFixed(2))
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
         let flag = false;
         this.$refs.form.validate((valid)=>{
         	flag = !valid;
         });
         if(flag) return false;
         this.tableList.map((item,index)=>{ //每个表格横标题list
            this.tableList[index].newCompareList = [{},{},{}];
            this.columns = [];
            this.columns.push({  title:title,  key: orgName, align:'center',minWidth:120,}) //fixed:'left'
            this.columns.push({  title: '年',  key: 'year', align:'center',  minWidth:80,})
            this.tableList[index].newCompareList[0].year = item.year;
            this.tableList[index].newCompareList[1].year = item.lastYear;
            this.tableList[index].newCompareList[2].year = '同比';
            item.compareList.map((item2)=>{
                this.tableList[index].newCompareList[0][`${item2.month}month`] = Number(item2.posSale).toFixed(2);
                this.tableList[index].newCompareList[0][orgNo] = item[orgNo]
                this.tableList[index].newCompareList[1][`${item2.month}month`] = Number(item2.lastPosSale).toFixed(2);
                this.tableList[index].newCompareList[1][orgName] = item[orgName];
                this.tableList[index].newCompareList[1][orgNo] = item[orgNo]
                this.tableList[index].newCompareList[2][`${item2.month}month`] =item2.compareRatio==null?0:`${(item2.compareRatio*100).toFixed(2)}%`;
                this.tableList[index].newCompareList[2][orgNo] = item[orgNo]
                this.columns.push({ //横坐标参数
                    title: item2.month.indexOf('合计')>-1?item2.month:item2.month+'月',
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
      this.myChart = this.$echarts.getInstanceByDom(this.$refs.myChart1)||this.$echarts.init(this.$refs.myChart1,'dark');
      this.myChart.setOption(chartOption);

    },
  }
};
</script>
<style scoped lang="less">
    .wrapBox{
        overflow-y: auto;
    }
</style>

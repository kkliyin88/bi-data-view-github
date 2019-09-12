<template>
  <div ref="wrap" class='wrapBox' style='padding: 8px;'>
    <section ref='querybox' >
      <Query ref='query' :query='query' disableOrg>
         <span slot='after'>
          <FormItem :label-width='0' >
             <Button size='small' @click='search' :loading='loading'>查询</Button>
          </FormItem>
           <FormItem :label-width='0' >
             <Button size='small' @click='goback' :loading='loading' v-if='this.level>1'>返回上一级</Button>
          </FormItem>
        </span>
      </Query>
    </section>
    <div>
      <Row>
        <Col :span="12" v-if='level!==4'>
          <div ref="myChart1" class='chart1' :style="{height: pageHeight-queryBoxHeight-140+'px'}"></div>
        </Col>
        <Col :span="level==4?24:12">
            <Table  :data='tableData'  :show-header='tableData.length>0' :columns="columns" :loading='loading' size='small' :max-height='pageHeight-queryBoxHeight-160' ></Table>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script>
import { post } from "@/axios/fetch";
import Query from '../components/query/index.vue';
import chartOption from './chartOption.js';
export default {
  components: {Query},
  data() {
    return {
      pageHeight:null,
      queryBoxHeight:20,
      loading:false,
      tableData:[],
      query:{},
      myChart:{},
      relativeArr:[{},
        {chartTitle:'办事处销售占比',tableTitle:'办事处',url:'/kasm/saleReport/findOrgSale',param:{}},
        {chartTitle:'分销商销售占比',tableTitle:'分销商',url:'/kasm/saleReport/findDealerSale',param:{}}, // orgNo
        {chartTitle:'零售商销售占比',tableTitle:'零售商',url:'/kasm/saleReport/findMarketSale',param:{}}, // dealerNo
        {chartTitle:'门店销售占比',tableTitle:'门店',url:'/kasm/saleReport/findStoreSale',param:{}},  // marketNo
      ],
      level:1, //1,2,3,4分别表示办事处/经销商/零售商/门店/
      columns:[
           {
            title: '',
            key: 'name',
            align:'center',
            minWidth:100,
          },
          {
            title: '数量',
            key: 'posSaleSum',
            align:'center',
            render: (h, params) => {
                if(!params.row.posSaleSum){
                  return h('span', {},0)
                }
                return h('span', {},params.row.posSaleSum.toFixed(2))
            }
          },
           {
            title: '占比',
            align:'center',
            render: (h, params) => {
              if(!params.row.posSaleRatio){
                return h('span', {},0)
              }
              return h('span', {},(params.row.posSaleRatio*100).toFixed(2)+'%')
            }
          },
      ],
    };
  },
  mounted() {
     // this.getPageData(this.relativeArr[this.level].url,this.relativeArr[this.level].param);
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
      this.$refs.wrap.style.height = this.pageHeight - 78 + "px";
    },
     getQuerySectionHeight(){
      if(this.$refs.querybox&&this.$refs.querybox.style && this.$refs.querybox.style.height){
        this.queryBoxHeight =  this.$refs.querybox.style.height;
      }
    },
    goback(){
      if(this.level-1 == 1 ){
           this.relativeArr[this.level-1].param = {};
        }
        if(this.level==1){
            return
        }
      this.getPageData(this.relativeArr[this.level-1].url,this.relativeArr[this.level-1].param);
    },
    search(){
      this.getPageData(this.relativeArr[this.level].url,this.relativeArr[this.level].param);
    },
    getPageData(url,param,){
        let flag = false;
        this.$refs.query.$refs.form.validate((valid)=>{
        	flag = !valid;
        });
        if(flag) return false;
        this.loading = true;
        let params =JSON.parse(JSON.stringify(this.query));
        if(params.beginYearMonth){
          let begin = new Date(params.beginYearMonth)
          params.beginYearMonth = begin.getFullYear() + '-' + (begin.getMonth()+1).toString().padStart(2,'0');
        }
        if(params.endYearMonth){
           let end = new Date(params.endYearMonth)
           params.endYearMonth = end.getFullYear() + '-' + ( end.getMonth()+1).toString().padStart(2,'0');
        }
        post(url,{...param,...params}).then(res=>{
            this.loading = false;
            if(res.code!==200){
                this.$Modal.warning({
                    title:'提示',
                    content:res.message
                  })
                return
            }
           this.tableData =JSON.parse(JSON.stringify(res.data));
           this.getQuerySectionHeight();
           this.level=res.data.length>0?res.data[0].level:1;
           res.data.map((item)=>{
               item.value = item.posSaleRatio;
               chartOption.legend.data.push(item.name);
           });
           chartOption.series[0].data = res.data;
           chartOption.series[0].data.splice(res.data.length-1,1)  //左边图表将总计去除
           this.columns[0].title =this.relativeArr[this.level].tableTitle;
           chartOption.title.text = this.relativeArr[this.level].chartTitle;
           if(this.level==4) return ;
           this.drawChart1();
        }).catch(error=>{
          this.loading = false;
           console.log('error',error)
          this.$Modal.warning({
            title:'提示',
            content:'连接服务失败!'
          })
        })
    },

    drawChart1() {
      // 基于准备好的dom，初始化echarts实例
      this.$nextTick(()=>{
         this.myChart = this.$echarts.init(this.$refs.myChart1); // 绘制图表
         this.myChart.setOption(chartOption);
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
      })
    },
  }
};
</script>
<style scoped lang="less">
    .wrapBox{
        overflow-y: auto;
    }


</style>

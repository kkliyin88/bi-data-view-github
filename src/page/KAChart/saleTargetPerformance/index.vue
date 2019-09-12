<template>
  <div ref="wrap" class='wrapBox' style='padding: 8px;'>
    <section  ref='querybox'>
       <Query ref='query' :query='query' >
         <span slot='after'>
           <FormItem :label-width='0' >
              <Button size='small' @click='search' :loading='loading'>查询</Button>
           </FormItem>
         </span>
       </Query>
    </section>
  <section>
     <Table :data='pageData' :show-header='pageData.length>0'  :loading='loading' :columns='columns'  :row-class-name="rowClassName" size='small' :maxHeight='pageHeight-queryBoxHeight-160'></Table>
  </section>
  </div>
</template>
<script>
import { post,get } from "@/axios/fetch";
import Query from '../components/query/index.vue';
export default {
  components: {Query},
  data() {
    return {
      loading:false,
      loading:false,
       query:{},
       pageHeight:200,
       queryBoxHeight:null,
       pageData:[],
       orgList:[],
       dealerList:[],
       marketList:[],
       storeList:[],
       columns:[
         { title:'名称', key:'name', align: 'center',minWidth:100, }, //fixed:'left'
         { title:'项目',  key:'type', align: 'center', minWidth:60,   },//fixed:'left'
       ],
      }
  },
  mounted() {
     this.getHeight();
     window.addEventListener("resize", this.getHeight);

  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
  methods: {
    getHeight() {
      //设置页面高度
      this.pageHeight = window.innerHeight;
      this.$refs.wrap.style.height = this.pageHeight - 70 + "px";
    },
    getQuerySectionHeight(){
      if(this.$refs.querybox&&this.$refs.querybox.style&&this.$refs.querybox.style.height){
        this.queryBoxHeight =  this.$refs.querybox.style.height;
      }
    },
    search(){
	  let flag = false;
	  this.$refs.query.$refs.form.validate((valid)=>{
	  	flag = !valid;
	  });
     if(flag) return false;
      let url='/kasm/saleReport/findOrgSaleTarget'; //返回办事处
       this.columns[0].title = '办事处';
      let params= JSON.parse(JSON.stringify(this.query));
      if(params.orgNo&&params.dealerNo&&params.marketNo){ //返回门店
         url='/kasm/saleReport/findStoreSaleTarget';
         this.columns[0].title = '门店';
      }else if(params.orgNo&&params.dealerNo&&!params.marketNo&&!params.storeNo){ //返回的是零售商
       url = '/kasm/saleReport/findMarketSaleTarget';
        this.columns[0].title = '零售商';
      }else if(params.orgNo&&!params.dealerNo&&!params.marketNo&&!params.storeNo){ //返回的是经销商
        url= '/kasm/saleReport/findDealerSaleTarget';
         this.columns[0].title = '经销商';
      }
     if(params.beginYearMonth){
       let begin = new Date(params.beginYearMonth)
       params.beginYearMonth = begin.getFullYear() + '-' + (begin.getMonth()+1).toString().padStart(2,'0');
     }
     if(params.endYearMonth){
        let end = new Date(params.endYearMonth)
        params.endYearMonth = end.getFullYear() + '-' + ( end.getMonth()+1).toString().padStart(2,'0');
     }
     this.loading = true;
      post(url,params).then(res=>{
          if(res.code!==200){
              this.$Modal.warning({
                  title:'提示',
                  content:res.message
                })
             this.loading = false;
              return
          }
         this.makeColumns(res.data);
         this.makePageData(res.data);
         this.getQuerySectionHeight();
        this.loading = false;
      }).catch(error=>{
        this.loading = false;
        this.$Modal.warning({
          title:'提示',
          content:'连接服务失败!'
        })
      })
    },
     makePageData(arr){
      this.pageData = [];
      arr.map((item)=>{
          item.data=[{type:'目标'},{name:item.name,type:'达成'},{type:'完成率',cellClassName:'same-period-analysis-cell1'}];
          item.list.map((item2)=>{
           item.data[0][item2.yearMonth]=item2.saleTarget==null?0:item2.saleTarget.toFixed(2); //目标
           item.data[1][item2.yearMonth]=item2.posSale==null?0:item2.posSale.toFixed(2); //达成
           item.data[2][item2.yearMonth]=item2.ratio==null?0:`${(item2.ratio*100).toFixed(2)}%`; //完成率
         })
        this.pageData.push(... item.data)
      })
    },
    rowClassName(row, index){
      let i = index + 1 ;
      if(i%3!==0){
        return
      }
      return 'same-period-analysis-row';
    },
    makeColumns(arr){
      let length =0;
      let columnsTemp=[];
      arr.map((item)=>{
        if(item.list.length>length){
          columnsTemp = item.list;
        };
      });
      let yearMonths = [];
      columnsTemp.map((item)=>{
        yearMonths.push(item.yearMonth);
      });
      yearMonths = Array.from(new Set(yearMonths))
      this.columns=this.columns.splice(0,2)
      yearMonths.map((item)=>{
        this.columns.push({
          title:item,
          key:item,
          align: 'center',
          minWidth:100,
        })
      })
    },


  }
};
</script>
<style scoped lang="less">
    .wrapBox{
        overflow-y: auto;
        background: #09153D;
    }
</style>

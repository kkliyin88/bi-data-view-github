<template>
  <div ref="wrap" class='wrapBox' style='padding: 8px;'>
    <section ref='querybox'>
       <Query ref='query' :query='query' >
         <span slot='after'>
             <FormItem label='人员' :label-width='40' style='width: 160px;'>
                <Input size='small' v-model='query.staffName' clearable> </Input>
             </FormItem>
             <FormItem :label-width='0' >
              <Button size='small' @click='search' :loading='loading'>查询</Button>
           </FormItem>
         </span>
       </Query>
    </section>
    <section ref='table' >
      <Table  :data='pageData' :show-header='pageData.length>0' :loading='loading' :columns='columns'  size='small' :maxHeight='pageHeight-queryBoxHeight-160'></Table>
    </section>
  </div>
</template>
<script>
import { post,get } from "@/axios/fetch";
import Query from '../components/query/index.vue';
export default {
   name:'costAnalysisReport',
  components: { Query },
  data() {
    return {
      pageHeight:null,
      queryBoxHeight:null,
      pageData:[],
      loading:false,
      query:{ },
      columns:[
        {
          title:'办事处',
          key:'name',
          align: 'center',
          minWidth:100,
        },
       {
         title:'费用',
         align: 'center',
         children:[
            { title:'进场费', key:'enterCost', align: 'center', minWidth:100},
            { title:'货架陈列费', key:'placementCost', align: 'center', minWidth:100},
            { title:'实际临促工资', key:'tempPromoter', align: 'center', minWidth:100},
            { title:'合计', key:'costTotal', align: 'center', minWidth:100},
          ]
       },
       {
         title:'销售',
         key:'posSale',
         align: 'center',
         minWidth:100,
       },
       {
         title:'费率',
         key:'rate',
         align: 'center',
         minWidth:100,
         render: (h, params) => {
          if(!params.row.rate){
            return
          }
          return h('span', {},(params.row.rate*100).toFixed(2)+'%')
        }
       },
      ],
    }
  },
  mounted() {
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
      this.$refs.wrap.style.height = this.pageHeight - 80 + "px";
       console.log('pageHeight_cost',this.pageHeight)
    },
     getQuerySectionHeight(){
      if(this.$refs.querybox&&this.$refs.querybox.style&&this.$refs.querybox.style.height){
        this.queryBoxHeight =  this.$refs.querybox.style.height;
      }
    },
    search(){
     let url='/kasm/costAnalysisReport/findCostAnalysis';
     let flag = false;
     this.$refs.query.$refs.form.validate((valid)=>{
     	flag = !valid;
     });
     if(flag) return false;
     let params= JSON.parse(JSON.stringify(this.query));
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
        };
        this.pageData = res.data.reportDetailVos;
        let total = {name:'总计',enterCost:res.data.totalEnterCost,placementCost:res.data.totalPlacementCost,tempPromoter:res.data.totalTempPromoter,
        costTotal:res.data.totalCostTotal,totalPosSale:res.data.totalPosSale};
        let perrate = {
          name:'费率占比',enterCost:`${(res.data.totalEnterCostRate*100).toFixed(2)}%`,placementCost:`${(res.data.totalPlacementCostRate*100).toFixed(2)}%`,
          tempPromoter:`${(res.data.totalTempPromoterRate*100).toFixed(2)}%`,costTotal:`${(res.data.totalCostTotalRate*100).toFixed(2)}%`,totalPosSale:`${(res.data.rate*100).toFixed(2)}%`
        }
        this.pageData.push(total);
        this.pageData.push(perrate);
        this.getQuerySectionHeight();
        this.loading = false;
      }).catch(error=>{
         this.loading = false;
         console.log('error',error)
        this.$Modal.warning({
          title:'提示',
          content:'连接服务失败!'
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

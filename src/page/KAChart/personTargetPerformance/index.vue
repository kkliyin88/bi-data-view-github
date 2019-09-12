<template>
  <div ref="wrap"  class='wrapBox' style='padding: 8px;'>
    <section  ref='querybox' >
       <Query ref='query' :query='query' >
          <span slot='after'>
           <FormItem label='角色' :label-width='40' style='width: 160px;'>
               <Select v-model='query.roleId' transfer size='small'>
                 <Option v-for='item in roleList' :value='item.roleId' :key='item.roleId' :label='item.roleName'></Option>{{}}
               </Select>
           </FormItem>
           <FormItem label='人员' :label-width='40' style='width: 160px;'>
              <Input size='small' clearable v-model='query.staffName'> </Input>
           </FormItem>
           <FormItem :label-width='0' >
              <Button size='small' @click='search' :loading='loading'>查询</Button>
           </FormItem>
         </span>
       </Query>
    </section>
   <section ref='table'>
      <Table  :data='pageData' :show-header='pageData.length>0' :loading='loading' :columns='columns' size='small' :max-height='pageHeight-queryBoxHeight-160'></Table>
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
        query:{},
        pageHeight:200,
        loading:false,
        queryBoxHeight:40,
        roleList:[],
        pageData:[],
        columns:[

          {
            title:'姓名',
            key:'staffName',
            align: 'center',
            minWidth:100,
            fixed:'left'
          },
          {
            title:'角色',
            key:'roleName',
            align: 'center',
            minWidth:100,
          },
        ],
      }
  },
  mounted() {
     this.getHeight();
     window.addEventListener("resize", this.getHeight);
     this.getRoleList();
  },
 destroyed() {
   window.removeEventListener("resize", this.getHeight);
 },
  methods: {
     getHeight() {
      //设置页面高度
      this.pageHeight = window.innerHeight;
      this.$refs.wrap.style.height = this.pageHeight - 80+ "px";
       console.log('pageHeight_person',this.pageHeight)
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
      let url = '/kasm/staffReport/findStaffSaleReport';
      let params= JSON.parse(JSON.stringify(this.query))
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
         console.log('error',error)
        this.$Modal.warning({
          title:'提示',
          content:'连接服务失败!'
        })
      })
    },
    makePageData(arr){
      this.pageData = [];
      arr.map((item)=>{
        let temp = {};
        if(item.staffInfoVo) delete item.staffInfoVo;
        item.staffReportVoList.map((item2)=>{
          temp[`posSale${item2.yearMonth}`] = item2.posSale;
          temp[`saleTarget${item2.yearMonth}`] = item2.saleTarget;
          temp[`ratio${item2.yearMonth}`] = item2.ratio;
          temp.roleName = item2.roleName;
          temp.staffName = item2.staffName;
        })
        item.data = temp
      });
      arr.map((item)=>{
        this.pageData.push(item.data)
      })
    },
    makeColumns(arr){
      let columnsOri = [];
      let length = 0;
      arr.map((item,i)=>{
        if( item.staffReportVoList.length>length){
          length = item.staffReportVoList.length
          columnsOri = item.staffReportVoList;
        }
      });
     let allMonths = [];
     columnsOri.map((item)=>{
       allMonths.push(item.yearMonth)
     });
     allMonths = Array.from(new Set(allMonths)) ;
	  this.columns = this.columns.splice(0,2);
      allMonths.map((item)=>{
        this.columns.push(
          {
            title:item,
            key:item,
            align: 'center',
            children:[
              {
                title:'实际',
                key:`posSale${item}`,
                align: 'center',
                minWidth:100,
              },
               {
                title:'目标',
                key:`saleTarget${item}`,
                align: 'center',
                minWidth:100,
              },
              {
                title:'达成率',
                key:`ratio${item}`,
                align: 'center',
                minWidth:100,
                render: (h, params) => {
                  if(!params.row[`ratio${item}`]){
                    return
                  }
                  return h('span', {},(params.row[`ratio${item}`]*100).toFixed(2)+'%')
                }
              }
            ],
          }
        )
      });
    },

   getRoleList(){
     let url ='/kasm/staffReport/findStaffRoleList';
     get(url).then(res=>{
         if(res.code!==200){
             this.$Modal.warning({
                 title:'提示',
                 content:res.message
               })
             return
         }
        this.roleList = res.data;
     }).catch(error=>{
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
        background: #09153D;
    }
</style>

<template>
  <div ref="wrap" class='wrapBox'>
   <section class='query'>
     <Form>
     <!-- <FormItem label='办事处:' class='formItem' >
         <Select v-model='query.orgNo' @on-change='getDealerNoList' size='small'>
            <Option v-for='item in orgNoList' :value='item.id' :label='item.orgName'></Option>
          </Select>
      </FormItem>
        <FormItem label='经销商:' class='formItem'>
         <Select v-model='query.dealerNo' @on-change='getStoreNoList' size='small'>
            <Option v-for='item in dealerNoList' :value='item.id' :label='item.dealerName'></Option>
          </Select>
       </FormItem>
      <FormItem label='零售商:' class='formItem'>
         <Select v-model='query.storeNo' size='small'>
            <Option v-for='item in storeNoList' :value='item.id' :label='item.marketName' ></Option>
          </Select>
       </FormItem> -->

      <!-- <FormItem label='开始时间:' class='formItem'>
          <DatePicker size='small' type='month' v-model='query.beginYearMonth' :options='{disabledDate:disableStartDate}' placeholder="开始月份"></DatePicker>
       </FormItem>
      <FormItem label='结束时间:' class='formItem'>
          <DatePicker size='small' type='month' v-model='query.endYearMonth' :options='{disabledDate:disableEndDate}' placeholder="截止月份"  ></DatePicker>
      </FormItem > -->
      <!-- <FormItem class='formItem'> -->
           <Button size='small' :loading='loading' @click='getPageData'>查询</Button>
     <!-- </FormItem>
 -->
     </Form>
   </section>
   <section ref='table'>
     <Table  :data='pageData' :loading='loading' :columns='columns' size='small' :height='500'></Table>
   </section>
  </div>
</template>
<script>
import { post,get } from "@/axios/fetch";
export default {
  components: {},
  data() {
    return {
      pageHeight:null,
      loading:false,
      pageData:[],
      orgNoList:[],
      dealerNoList:[],
      storeNoList:[],
      columns:[],
      loading:false,
        query:{
          // beginYearMonth: '',
          // endYearMonth: '',
          year:2018,
          orgNo: '',
          // dealerNo: '',
          // marketNo: '',
          // storeNo: '',
        },
      }

  },
  mounted() {
     this.getHeight();
     // this.getPageData();
     window.addEventListener("resize", this.getHeight);
     this.getOrgNoList();
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
  methods: {
    getHeight() {
      //设置页面高度
      this.pageHeight = window.innerHeight;
      this.$refs.wrap.style.height = this.pageHeight - 75 + "px";
    },
    getOrgNoList(){  //获取办事处列表
      let url ='/kasm/org/findOrgnizationList';
      get(url).then(res=>{
          if(res.code!==200){
              this.$Modal.warning({
                  title:'提示',
                  content:res.message
                })
              return
          }
         this.orgNoList = res.data;
      }).catch(error=>{
         console.log('error',error)
        this.$Modal.warning({
          title:'提示',
          content:'连接服务失败!'
        })
      })
    },
    getDealerNoList(){  //获取经销商列表
      let url ='/kasm/org/findDealerList?orgNo='+this.query.orgNo;
      get(url).then(res=>{
        console.log('res',res)
          if(res.code!==200){
              this.$Modal.warning({
                  title:'提示',
                  content:res.message
                })
              return
          }
         this.dealerNoList = res.data;
      }).catch(error=>{
         console.log('error',error)
        this.$Modal.warning({
          title:'提示',
          content:'连接服务失败!'
        })
      })
    },
    getStoreNoList(){
      let url ='/kasm/org/findMarketList?dealerNo='+this.query.dealerNo;
      get(url).then(res=>{
        console.log('res',res)
          if(res.code!==200){
              this.$Modal.warning({
                  title:'提示',
                  content:res.message
                })
              return
          }
         this.storeNoList = res.data;
      }).catch(error=>{
         console.log('error',error)
        this.$Modal.warning({
          title:'提示',
          content:'连接服务失败!'
        })
      })
    },
    getPageData(){
       let url = '/kasm/saleReport/findOrgSaleTarget';
       this.loading = true;
        post(url,this.query).then(res=>{
            if(res.code!==200){
                this.$Modal.warning({
                    title:'提示',
                    content:res.message
                  })
                return
            }
            console.log('res',res.data)

           this.loading = false;
        }).catch(error=>{
           console.log('error',error)
          this.$Modal.warning({
            title:'提示',
            content:'连接服务失败!'
          })
        })
    },
     operatorPageData(data){
      data.map((item,index)=>{
          this.pageData.push(item.staffInfoVo)
          item.staffReportVoList.map((item2)=>{
              delete item2.roleName;
              delete item2.staffName;
              for(let key in item2){
                  this.pageData[index][item2.yearMonth+key] = item2[key]
              }
          })
      })
      console.log('pageData',this.pageData)
    },
     getcolumns(data){ //拼接colum
      let maxlength = 0;
      let Item = {};
      data.map((item)=>{
        if(item.staffReportVoList.length>maxlength){
          maxlength = item.staffReportVoList.length;
          Item = item;
        }
      });
      this.columns = [
        { title: '员工', key: 'staffName',align:'center',width:120,fixed: 'left'},
        { title: '角色', key: 'roleName',align:'center',width:120 }
        ];
       let children=[];
     Item.staffReportVoList.map((item)=>{
         children = [
          {title: '目标', key:item.yearMonth+'saleTarget',align: 'center', width: 80},
          {title: '实际', key: item.yearMonth+'posSale',align: 'center', width: 80},
          {title: '达成率', key: item.yearMonth+'ratio',align: 'center', width: 80},
          ]
       this.columns.push( {title: item.yearMonth, key: item.yearMonth,align:'center',  width:120,children:children }) //横坐标参数
     });
    },
    disableStartDate(date){
    	if(this.query.endYearMonth){
    		return date > new Date(this.query.endYearMonth);
    	}else{
    		return date > new Date();
    	}
    },
    disableEndDate(date){
    	if(this.query.beginYearMonth){
    		return date < new Date(this.query.beginYearMonth);
    	}else{
    		return date >new Date();
    	}
    },
  }
};
</script>
<style scoped lang="less">
    .wrapBox{
        overflow-y: auto;
        background: #09153D;
    }
    .formitem{
      color: white;
    }
    .query{
        height: 80px;
        line-height: 80px;
    }
    .formItem{
      width: 150px;
      display: inline-block;
    }

</style>

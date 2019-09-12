<template>
  <section class='query'>
    <Form :model='query' :label-width='60' ref='form' inline :rules='rules'>
        <slot name='before'></slot>
     <FormItem label='开始月份' :label-width='80'  class='formwidth'  prop='beginYearMonth'>
        <DatePicker size='small' :options="{disabledDate:disableStartDate}" transfer v-model='query.beginYearMonth'  type='month' placeholder="选择年月" ></DatePicker>
      </FormItem>
      <FormItem label='结束月份' :label-width='80' class='formwidth'  prop='endYearMonth'>
        <DatePicker size='small' :options='{disabledDate:disableEndDate}' transfer v-model='query.endYearMonth'  type='month' placeholder="选择年月" ></DatePicker>
      </FormItem>
      <FormItem v-if='!disableOrg' label='办事处' class='formwidth' prop='orgNo'>
         <Select v-model='query.orgNo' transfer filterable clearable size='small'  @on-change='getDealerNoList(query.orgNo)'>
           <Option v-for='item in orgList' :value='item.orgNo'  :key='item.orgNo' :label='item.orgName'></Option>
         </Select>
      </FormItem>
       <FormItem label='经销商' v-if='query.orgNo' class='formwidth' >
          <Select v-model='query.dealerNo' transfer filterable clearable size='small'  @on-change='getMarketNoList(query.dealerNo)'>
            <Option v-for='item in dealerList' :value='item.dealerNo' :key='item.dealerNo' :label='item.dealerName'></Option>
          </Select>
      </FormItem>
      <FormItem label='零售商' v-if='query.dealerNo' class='formwidth'  >
          <Select v-model='query.marketNo' transfer filterable clearable size='small'  @on-change='getStoreNoList(query.marketNo)'>
            <Option v-for='item in marketList' :value='item.marketNo' :key='item.marketNo' :label='item.marketName'></Option>
          </Select>
      </FormItem>
      <FormItem label='门店' v-if='query.marketNo' class='formwidth' >
          <Select v-model='query.storeNo' transfer filterable clearable size='small'>
            <Option v-for='item in storeList' :value='item.storeNo' :key='item.storeNo' :label='item.storeName'></Option>
          </Select>
      </FormItem>
      <slot name='after'></slot>
    </Form>
  </section>
 </template>
<script>
    import { post,get } from "@/axios/fetch";
    export default {
        name: 'Query',
        props:{
          query:{
            type:Object,
            default:{},
          },
          disableOrg:{
            type:Boolean,
            default:false,
          }
        },
        data () {
            return {
              orgList:[],
              dealerList:[],
              marketList:[],
              storeList:[],
              rules:{
                beginYearMonth:{required:true,type:'date',message:'开始日期',trigger:'change'},
                endYearMonth: {required: true,type:'date',message: '结束日期',trigger: 'change'},
              },
            }
        },
      mounted(){
       this.getOrgNoList();
      },
      methods:{
       getOrgNoList(){  //获取办事处列表
         let url ='/kasm/org/findOrgnizationList';
         this.query.dealerNo = undefined;
         this.query.marketNo = undefined;
         this.query.storeNo = undefined;
         console.log()
         this.$forceUpdate('query00',this.query);
         get(url).then(res=>{
             if(res.code!==200){
                 this.$Modal.warning({
                     title:'提示',
                     content:res.message
                   })
                 return
             }
            this.orgList = res.data;

         }).catch(error=>{
            console.log('error',error)
           this.$Modal.warning({
             title:'提示',
             content:'连接服务失败!'
           })
         })
       },
       getDealerNoList(code){  //获取经销商列表
         let url ='/kasm/org/findDealerList?orgNo='+ code;
         this.query.dealerNo = undefined;
        this.query.marketNo = undefined;
        this.query.storeNo = undefined;
         this.$forceUpdate();
         get(url).then(res=>{
             if(res.code!==200){
                 this.$Modal.warning({
                     title:'提示',
                     content:res.message
                   })
                 return
             }
            this.dealerList = res.data;

         }).catch(error=>{
            console.log('error',error)
           this.$Modal.warning({
             title:'提示',
             content:'连接服务失败!'
           })
         })
       },
        getMarketNoList(code){
          this.query.marketNo = undefined;
          this.query.storeNo = undefined;
          this.$forceUpdate();
         let url ='/kasm/org/findMarketList?dealerNo=' + code;
         get(url).then(res=>{
             if(res.code!==200){
                 this.$Modal.warning({
                     title:'提示',
                     content:res.message
                   })
                 return
             }
            this.marketList = res.data;

         }).catch(error=>{
            console.log('error',error)
           this.$Modal.warning({
             title:'提示',
             content:'连接服务失败!'
           })
         })
       },
       getStoreNoList(code){
          this.$forceUpdate();
         let url ='/kasm/org/findStoreList?marketNo =' + code;
         get(url).then(res=>{
             if(res.code!==200){
                 this.$Modal.warning({
                     title:'提示',
                     content:res.message
                   })
                 return
             }
            this.storeList = res.data;
         }).catch(error=>{
            console.log('error',error)
           this.$Modal.warning({
             title:'提示',
             content:'连接服务失败!'
           })
         })
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
    }
</script>
<style scoped lang='less'>
  /* .query{
      height: 40px;
      line-height: 40px;
  } */
  .formwidth{
    width: 180px;
  }
</style>

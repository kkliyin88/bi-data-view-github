<template>
  <div >
     <Modal @on-ok='sumit' @on-visible-change='cancel' @on-cancel='cancel' :value='value' :title='MDmsg.title' :loading='loading'>
      <Transfer  :data='sourceData'  :target-keys='targetData' @on-change='handleChange' ></Transfer>
     </Modal>
  </div>
</template>
<script>
  import { post } from '@/axios/fetch';
  export default {
    props:['value','MDmsg'],
    data() {
      return {
        loading:false,
        sourceData:[],
        targetData:[],
      }
    },
    mounted(){
      this.getEditPageData();
    },
    methods: {
      handleChange(targetKeys, direction, moveKeys){
        this.targetData = targetKeys
      },
      getEditPageData(){
        let url = this.MDmsg.type=='D'?'/dimension/info/dimensionGetId/'  + this.MDmsg.id : '/measure/info/measureGetId/' + this.MDmsg.id;
        let params = {id:this.MDmsg.id}
        post(url,params).then(res=>{
          if(res.status == 200){
            this.sourceData = res.data.whole;
            this.sourceData.map((item)=>{
              item.label = item.name;
              item.key = item.id;
            })
            this.targetData = res.data.relation;
            let arr = [];
            this.targetData=this.targetData.map((item)=>{
               return item.key=item.id;
            })
          }
        }).catch(error=>{
          console.log('error:',error)
          this.$Modal.warning({
            title:'提示',
            content:'连接服务失败!'
          })
        })
      },
      sumit(){
        var temData = this.targetData.toString().length>0?this.targetData.toString():null;
        let params = this.MDmsg.id+'/'+temData;
        let url =this.MDmsg.type=='D'?'/event/dimension/insert/' + params:'/event/measure/insert/' + params;
        this.loading = true;
        post(url).then(res=>{
          this.loading = false;
          if(res.status == 200){
            this.$Message.success('success');
            this.$emit('getPageData');
            this.cancel();
            return;
          }
        }).catch(error=>{
          console.log('error:',error)
          this.loading = false;
          this.$Modal.warning({
            title:'提示',
            content:'连接服务失败!'
          })
        })
      },
      cancel(){
        this.$emit('input',false)
      }
    }
  };
</script>
<style scoped lang="less">
</style>

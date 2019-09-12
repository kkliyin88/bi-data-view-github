<template>
  <div >
      <Drawer :title='editMsg.title'  inner :value='value' @on-close='cancel' closable scrollable  draggable>
       <Form :model="editData" :label-width="80" class='edit'>
           <FormItem label="度量名称">
              <Input v-model="editData.name" > </Input>
          </FormItem>
           <FormItem label="度量编码">
              <Input v-model="editData.nameEn"  :disabled="editMsg.type=='edit'"></Input>
          </FormItem>
          <FormItem label="计算类型">
          <Select v-model="editData.calculationType"  style="width:100%" filterable clearble>
            <Option v-for="item in cityList" :value="item.value" :label='item.label' :key="item.value"></Option>
          </Select>
          </FormItem>
           <FormItem label="版本号">
              <Input v-model="editData.versions" >
              </Input>
          </FormItem>
           <FormItem label="备注">
              <Input v-model="editData.remark" >  </Input>
          </FormItem>
      </Form>
      <div class='ivu-drawer-footer'>
        <Button  @click='cancel'>取消</Button>
        <Button type="primary" @click='sumit' :loading='loading'>提交</Button>
      </div>
    </Drawer>
  </div>

</template>
<script>
  import { post } from '@/axios/fetch';
  export default {
    props:['editMsg','editData','value'],
    data() {
      return {
        loading:false,
        cityList:[
          {value: 'sum', label: '求和'},
          {value: 'avg', label: '品均值'},
          {value: 'min', label: '最小值'},
          {value: 'max', label: '最大值'},
          {value: 'push', label: '插入数组'},
          {value: 'addToSet', label: '插入数组2'},
          {value: 'first', label: '排序前'},
          {value: 'last', label: '排序后'},
          {value: 'count', label: '总数'}
        ],
        model11:''
      }
    },
    mounted(){
      this.selectAddPretend();
    },
    methods: {
      selectAddPretend(){
        let ele = document.getElementsByClassName('ivu-select-prefix')[0];
        ele.innerHTML='计算类型'
        console.log('ele',ele)
      },
      sumit(){
        let url = this.editMsg.type=='edit'?'/measure/info/updateByPrimaryKey':'/measure/info/insert';
        this.loading = true;
        let params = {
        name:this.editData.name,nameEn:this.editData.nameEn,calculationType:this.editData.calculationType,
        versions:this.editData.versions,remark:this.editData.remark};
        if(this.editMsg.type=='edit'){
          params.id = this.editData.id;
        }
        post(url,params).then(res=>{
          this.loading = false;
          if(res.code == 200){
            this.$Message.success('success');
            this.$emit('getPageData');
            this.cancel();
            return
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

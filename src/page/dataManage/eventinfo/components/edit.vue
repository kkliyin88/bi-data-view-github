<template>

     <Drawer :title='editMsg.title'  inner :value='value' @on-close='cancel' closable scrollable  draggable>
       <Form :model="editData" :label-width="80" class='edit'>
        <FormItem label="事件类型ID">
          <Select v-model="editData.eventTypeId" style="width: 204px" filterable>
            <Option v-for="item in cityList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
         <FormItem label="事件名称">
            <Input v-model="editData.name" :disabled="editMsg.type=='edit'"></Input>
        </FormItem>
         <FormItem label="事实表名">
            <Input :disabled="editData.type=='edit'" v-model="editData.factTable" ></Input>
        </FormItem>
         <FormItem label="版本号">
            <Input v-model="editData.versions" ></Input>
        </FormItem>
         <FormItem label="备注">
            <Input v-model="editData.remark" ></Input>
        </FormItem>
      </Form>
      <div class='ivu-drawer-footer'>
        <Button  @click='cancel'>取消</Button>
        <Button type="primary" @click='sumit' :loading='loading'>提交</Button>
      </div>
    </Drawer>

</template>
<script>
  import { post } from '@/axios/fetch';
  export default {
    props:['editMsg','editData','value','cityList'],
    data() {
      return {
        loading:false,
      }
    },
    mounted(){
    },
    methods: {
      sumit(){
        let url = this.editMsg.type=='edit'?'/event/info/updateByPrimaryKey':'/event/info/insert' ;
        this.loading = true;
        let params = {eventTypeId:this.editData.eventTypeId,
        name:this.editData.name,factTable:this.editData.factTable,
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

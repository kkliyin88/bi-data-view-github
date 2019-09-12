<template>
   <Drawer :title='editMsg.title'  inner :value='value' @on-close='cancel' closable scrollable  draggable>
       <Form :model="editData" :label-width="80" class='edit'>
           <FormItem label="维度名称">
              <Input v-model="editData.name" ></Input>
          </FormItem>
           <FormItem label="维度编码">
              <Input v-model="editData.nameEn" :disabled="editMsg.type=='edit'" ></Input>
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
  import {post} from '@/axios/fetch';
  export default {
    props:['editMsg','editData','value'],
    data() {
      return {
        loading:false,
      }
    },
    mounted(){
    },
    methods: {
      sumit(){
        let url = this.editMsg.type =='edit'?'/dimension/info/updateByPrimaryKey':'/dimension/info/insert' ;
        this.loading = true;
        let params = { name:this.editData.name,versions:this.editData.versions,remark:this.editData.remark};
        if(this.editMsg.type=='edit'){ //编辑的时候提交id
          params.id = this.editData.id;
        }
        if(this.editMsg.type=='add'){ //新增的时候提交编码
          params.nameEn = this.editData.nameEn;
        }
        post(url,params).then(res=>{
            console.log('res',res.data)
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

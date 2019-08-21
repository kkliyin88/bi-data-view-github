<template>
  <div >
     <Modal @on-visible-change='cancel' :value='value' :width='600' :title='editMsg.title' :loading='loading'>
       <Form :model="editData" :label-width="0">
         <Row>
             <Col span="11">
               <FormItem label="">
                  <Input v-model="editData.name" >
                     <span slot="prepend">度量名称</span>
                  </Input>
              </FormItem>
             </Col>
             <Col span="11" push=1>
               <FormItem label="">
                  <Input v-model="editData.nameEn"  :disabled="editMsg.type=='edit'">
                     <span slot="prepend">度量编码</span>
                  </Input>
              </FormItem>
             </Col>

         </Row>
          <Row>
            <Col span="11">
              <FormItem label="">
              <Select v-model="editData.calculationType" prefix="liyin" style="width:100%" filterable clearble>
                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              </FormItem>
            </Col>
             <Col span="11" push=1>
               <FormItem label="">

                  <Input v-model="editData.versions" >
                    <span slot="prepend">版本号</span>
                  </Input>
              </FormItem>
             </Col>

         </Row>
         <Row>
            <Col span="11" >
               <FormItem label="">

                  <Input v-model="editData.remark" >
                     <span slot="prepend">备注</span>
                  </Input>
              </FormItem>
            </Col>
         </Row>
      </Form>
      <div slot='footer'>
        <Button  @click='cancel'>取消</Button>
        <Button type="primary" @click='sumit' :loading='loading'>提交</Button>
      </div>
    </Modal>

  </div>

</template>
<script>
  import { post } from '@/axios/fetch';
  // import Select from '@/piugin/iview/src/components/select/index.js'
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

<template>
  <div >
    <Drawer :title='editMsg.title'  width='400' inner :value='value' @on-close='cancel' closable scrollable  draggable>
      <Form :model="editData" :label-width="80" class='edit'>
            <FormItem label="模板名称">
              <Input v-model="editData.name" clearable ></Input>
            </FormItem>
            <FormItem label="模板类型">
              <Select v-model="editData.type" clearable filterable>
                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="模板宽度">
              <Input v-model="editData.pattern" clearable></Input>
            </FormItem>
            <FormItem label="模板高度">
              <Input v-model="editData.height"  clearable></Input>
            </FormItem>
              <FormItem label="版本号">
              <Input v-model="editData.versions" clearable ></Input>
            </FormItem>
            <FormItem label="备注">
              <Input v-model="editData.remark" clearable ></Input>
            </FormItem>
        <FormItem label="图标地址">
          <Input v-model="editData.picUrl" type="textarea" :rows="2" clearable ></Input>
        </FormItem>
         <FormItem label="模板格式">
            <Input v-model="editData.h5TemplateCode" type="textarea" :autosize='{minRows:5,maxRows:10}' ></Input>
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
          {value: 'line', label: '折线图'}, {value: 'bar', label: '柱状图'},
          {value: 'pie', label: '饼图'}, {value: 'scatter', label: '散点图'},
          {value: 'effectScatter', label: '动态散点图'}, {value: 'radar', label: '雷达图'},
          {value: 'tree', label: '树图'}, {value: 'treemap', label: '矩形树图'},
          {value: 'sunburst', label: '旭日图'}, {value: 'boxplot', label: '盒须图'},
          {value: 'candlestick', label: 'K线图'},{value: 'funnel', label: '漏斗图'},
          {value: 'heatmap', label: '热力图'}, {value: 'map', label: '地图'},
          {value: 'parallel', label: '平行坐标系'}, {value: 'lines', label: '路径图'},
          {value: 'graph', label: '关系图'}, {value: 'sankey', label: '桑基图'},
          {value: 'gauge', label: '仪表盘'}, {value: 'pictorialBar', label: '象形柱图'},
          {value: 'themeRiver', label: '主题河流'}, {value: 'custom', label: '自定义'}
        ]
      }
    },
    mounted(){
    },
    methods: {
      sumit(){
        let url = this.editMsg.type =='edit'?'/graphTemplate/updateByPrimaryKey':'/graphTemplate/insert';
         this.loading = true;
        let params={name:this.editData.name,type:this.editData.type,picUrl:this.editData.picUrl
        ,h5TemplateCode:this.editData.h5TemplateCode.toString(),versions:this.editData.versions,remark:this.editData.remark,
        height:this.editData.height,pattern:this.editData.pattern};
        if(this.editMsg.type=='edit'){
          params.id = this.editData.id;
        };
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
        });

      },
      cancel(){
        this.$emit('input',false)
      }
    }
  };
</script>
<style scoped lang="less">
</style>

<template>
  <div >
     <Modal @on-visible-change='cancel'  title='数据详情' :value='value' :width='85' >
      <Table border :columns="columns"  :data="tableData"> </Table>
       <div slot='footer'>
        <Button type="primary" @click='sumit'>关闭</Button>
       </div>
     </Modal>
  </div>

</template>
<script>
  import { post } from '@/axios/fetch';
  export default {
    props:['value','chartDetailData'],
    data() {
      return {
        tableData:[{}],
        columns:[],
      }
    },
    mounted(){
      this.initTableData();
    },
    methods: {
      initTableData(){
        this.chartDetailData.chartJson.series[0].data.map((item,i)=>{
          this.columns.push({title: item.name,key:item.value,align:'center'});
        });
        this.columns.map((item,i)=>{
          this.tableData[0][item.key] = this.chartDetailData.chartJson.series[0].data[i].value
        })
      },
      sumit(){
        this.$emit('input',false);
      },
      cancel(){
        this.$emit('input',false);
      },
    }
  };
</script>
<style scoped lang="less">
</style>

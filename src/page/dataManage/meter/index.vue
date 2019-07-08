<template>
  <div class='event_wrap' ref='wrap'>
     <div class="addBTN">
      <Button  @click="showEdit('add')" type="info">添加</Button>
      <Button  @click="del" type="warning">删除</Button>
    </div>
    <div class='table_box'>
      <Table border ref="selection" :columns="columns"  @on-selection-change="selectionData"  :data="tableData" :height='pageHeight -210'> </Table>
    </div>
    <div class="pagesize_box">
       <Page :total='pageQuery.total' @on-change='changePageNum' @on-page-size-change='changePageSize' :page-size-opts='[10,20,30]' show-elevator show-sizer show-total />
    </div>
    <div  v-if='editFlag'>
      <Edit :editData='editData' @getPageData='getPageData'  v-model='editFlag' :editMsg='editMsg'> </Edit>
    </div>
  </div>
</template>
<script>
 import { post } from '@/axios/fetch';
  import Edit from './components/edit';
  export default {
    components: {
      Edit
    },
    data() {
      return {
        tableData: [],
        editData:{},
        editFlag:false,
        pageHeight:window.innerHeight,
        criteriaFieldDto:[{"key": "003", "type": "equel", "value": "2019"}],
        editTitle:{type:'update',value:'编辑'},
        checkData:[],
        pageQuery:{
          query:{ pageNum:1,pageSize:10},
          total:0,
        },
        columns:[
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '仪表名称',
            key: 'name',
            align:'center',
          },
          {
            title: '版本号',
            key: 'versions',
            align:'center',
          },
          {
            title: '创建人',
            key: 'creator',
            align:'center',
          },
          {
            title: '更新人',
            key: 'lastUpdateUser',
            align:'center',
          },
          {
            title: '更新时间',
            key: 'lastUpdateTime',
            align:'center',
            width: 180,
          },
          {
            title: '备注',
            key: 'remark',
            align:'center',
          },
          {
            title: '操作',
            width: 160,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'dashed'
                  },
                  on: {
                    click: () => {
                      this.showEdit('edit',params.row)
                    }
                  }
                }, '属性'),
                h('Button', {
                   props: {
                     type: 'dashed'
                  },
                  style: {
                    marginLeft: '5px'
                  },
                  on: {
                    click: () => {
                      window.open('#/dataManage/dataSearch?id='+params.row.id, '_blank')
                    }
                  }
                }, '编辑')
              ]);
            }
          }
        ],
      }
    },
    destroyed(){
      window.removeEventListener('resize', this.getHeight)
    },
    mounted(){
      this.getPageData();
      window.addEventListener('resize', this.getHeight);
      this.getHeight();
    },
    methods: {
      getHeight(){ //设置页面高度
        this.pageHeight=window.innerHeight;
        this.$refs.wrap.style.height = this.pageHeight -100 + 'px'
      },
      selectionData(data){
        this.checkData = [];
        data.map(item => {
          this.checkData.push(item.id);
        })
      },
      del(){
        let url='/dashboard/info/deleteByPrimaryKey';
        if (!this.checkData.length<=0){
          let params = {ids:this.checkData};
          post(url,params).then(res=>{
            if(res.status == 200){
              this.$Message.success('success');
              this.getPageData();
            }
          }).catch(error=>{
            this.loading = false;
            this.$Modal.warning({
              title:'提示',
              content:'连接服务失败!'
            })
          })
        }else {
          this.$message({showClose: true, message: '选择需要操作的仪表', type: 'error'});
        }
      },
      changePageNum(num){ //改变页码
        this.pageQuery.query.pageNum = num;
        this.getPageData();
      },
      changePageSize(num){ //改变每页显示条数
         this.pageQuery.query.pageSize = num;
         this.getPageData();
      },
      getPageData(){
         post('/dashboard/info/queryPageInfo',this.pageQuery.query).then(res=>{
          this.loading = false;
          if(res.status == 200){
            this.tableData = res.data.list;
            this.pageQuery.total = this.tableData.length <=0?0:this.tableData[0].total;
            this.tableData.map((item,i)=>{
              item.index = i+1;
            })
          }
        }).catch(error=>{
          this.loading = false;
          this.$Modal.warning({
            title:'提示',
            content:'连接服务失败!'
          })
        })
      },
      showEdit(type,data){
        this.editData = type =='edit'?JSON.parse(JSON.stringify(data)):{name:'',versions:'',remark:''};
        this.editMsg = {type:type,title:type=='edit'?'编辑':'新增'};
        this.editFlag = true;
      },
    }
  };
</script>
<style scoped lang="less">
  .event_wrap{
    border: 1px solid #EFEFEF;
    .addBTN{
      height: 50px;
      line-height: 50px;
    }
    .table_box{
      .operator{
        display: inline-block;
      }
    }
    .pagesize_box{
      position: absolute;
      bottom: 10px;
    }

  }
</style>

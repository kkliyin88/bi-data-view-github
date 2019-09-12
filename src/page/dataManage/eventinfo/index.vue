<template>
  <div class='event_wrap' ref='wrap'>
    <div class="search_box">
      <Button size='small' @click="showEdit('add')" type='primary'>添加</Button>
      <Button  size='small' icon="plus" @click="del" >删除</Button>
    </div>
    <div class='table_box'>
      <Table border ref="selection"  size='small' :columns="columns"  :loading='loading' @on-selection-change="selectionData" :data="tableData" :height='pageHeight -210'> </Table>
    </div>
    <div class="pagesize_box">
       <Page :total='pageQuery.total' :current='pageQuery.query.pageNum' :page-size='pageQuery.query.pageSize' size='small' @on-change='changePageNum' @on-page-size-change='changePageSize' :page-size-opts='[20,30,40,50]' show-elevator show-sizer show-total />
    </div>
    <div class='edit' v-if='editFlag'>
      <Edit :editData='editData':cityList='cityList' @getPageData='getPageData'  v-model='editFlag' :editMsg='editMsg'> </Edit>
    </div>
    <div class='editMD' v-if='editMDFlag'>
      <EditMD :editData='editData' @getPageData='getPageData'  v-model='editMDFlag' :MDmsg='MDmsg'> </EditMD>
    </div>
  </div>
</template>
<script>
 import { post } from '@/axios/fetch';
 import Edit from './components/edit';
  import EditMD from './components/editMD';
  export default {
    components: {
     Edit,EditMD
     },
    data() {
      return {
        tableData: [],
        editData:{},
        cityList:[],
        checkData:[],
        editFlag:false,
        loading:false,
        editMsg:{type:'edit',value:'编辑'},
        editMDFlag:false,
        MDmsg:{type:'M',title:'维度',id:''},
        pageQuery:{
          query:{
             pageNum:1, //第几页
             pageSize:20, //每页条数
          },
          total:0,
        },
        pageHeight:window.innerHeight,
        columns:[
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '事件名称',
            key: 'name',
            align:'center',
          },
           {
            title: '事实表名',
            key: 'factTable',
            align:'center',
          },
          {
            title: '版本号',
            key: 'versions',
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
              width: 220,
              align: 'center',
              render: (h, params) => {
                  return h('div', [
                      h('Button', {
                          props: {
                              size: 'small',
                               type:'text',
                          },
                          style: {
                            background:'#242E56',
                            color:'#CFD5E8',
                          },
                          on: {
                              click: () => {
                                 this.showEdit('edit',params.row)
                              }
                          }
                      }, '修改'),
                      h('Button', {
                          props: {
                              size: 'small',
                              type:'text',
                          },
                          style: {
                            marginLeft: '5px',
                            background:'#242E56',
                            color:'#CFD5E8',
                          },
                          on: {
                              click: () => {
                                this.showEditMD(params.row.id,'D','维度');
                              }
                          }
                      }, '编辑维度'),
                      h('Button', {
                          props: {
                              size: 'small',
                              type:'text',
                          },
                          style: {
                            marginLeft: '5px',
                            background:'#242E56',
                            color:'#CFD5E8',
                          },
                          on: {
                              click: () => {
                                 this.showEditMD(params.row.id,'M','度量');
                              }
                          }
                      }, '编辑度量')
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
      changePageNum(num){ //改变页码
        this.pageQuery.query.pageNum = num;
        this.getPageData();
      },
      changePageSize(num){ //改变每页显示条数
         this.pageQuery.query.pageSize = num;
         this.getPageData();
      },
      getPageData(){
        let params = this.pageQuery.query;
        this.loading = true;
        post('/event/info/queryPageInfo',params).then(res=>{
          this.loading = false;
          if(res.code == 200){
            this.tableData = res.data.list;
            this.tableData.map((item,index)=>{
              item.index = index+1
            })
            this.pageQuery.total = this.tableData.length <=0?0:this.tableData[0].total;
            return
          }
        }).catch(error=>{
          this.loading = false;
          this.$Modal.warning({
            title:'提示',
            content:'连接服务失败!'
          })
        })
      },
      del(){
        let url='/event/info/deleteByPrimaryKey';
        if (!this.checkData.length<=0){
          let params = {ids:this.checkData};
          post(url,params).then(res=>{
            if(res.code == 200){
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
          this.$message({showClose: true, message: '选择需要操作的事件', type: 'error'});
        }
      },
      showEditMD(id,type,title){
        this.MDmsg={id:id,type:type,title:title};
        this.editMDFlag = true;
      },
      showEdit(type,data){
        post('/event/type/find').then(res=>{
          if(res.code == 200){
            this.cityList = res.data;
          }
        }).catch(error=>{
          this.loading = false;
          this.$Modal.warning({
            title:'提示',
            content:'连接服务失败!'
          })
        })
        this.editData = type=='edit'?JSON.parse(JSON.stringify(data)):{eventTypeId:'',name:'',factTable:'',versions:'',remark:''};
        this.editMsg = {type:type,title:type=='edit'?'编辑':'新增'}
        this.editFlag = true;
      },
      selectionData(data){
        this.checkData = [];
        data.map(item => {
          this.checkData.push(item.id);
        })
      },
    }
  };
</script>
<style scoped lang="less">
  .event_wrap{
    .table_box{
      .operator{
        display: inline-block;
      }
    }
  }
</style>

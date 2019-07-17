<template>
  <div ref='wrap'>
    <section class='search_box'>
        <Button icon="plus" size='small' @click="showEdit('add')" type="info">添加</Button>
        <Button icon="plus" size='small'  @click="del" type="warning">删除</Button>
    </section>
    <div class='table_box'>
      <Table border ref="selection" :columns="columns"  :loading='loading' @on-selection-change="selectionData" :data="tableData" :height='pageHeight -210'> </Table>
    </div>
    <div class="pagesize_box">
       <Page :total='pageQuery.total' @on-change='changePageNum' @on-page-size-change='changePageSize' :page-size-opts='[10,20,30]' show-elevator show-sizer show-total />
    </div>
    <div v-if='editFlag'>
      <Edit :editData='editData' @getPageData='getPageData' v-model='editFlag' :editMsg='editMsg'> </Edit>
    </div>
  </div>
</template>
<script>
  import Edit from './components/edit';
  import { post } from '@/axios/fetch';
  export default {
    components: {
     Edit
     },
    data() {
      return {
        loading:false,
        tableData: [],
        checkData:[],
        pageHeight:window.innerHeight,
        pageQuery:{
          query:{ pageNum:1,pageSize:10},
          total:0,
        },
        model11:'',
        editFlag:false,
        editDate:{},
        editMsg:{title:'',type:''},
         columns:[
           {
              type: 'selection',
              width: 60,
              align: 'center'
          },
          {
            title: '度量名称',
            key: 'name',
            align:'center',
          },
          {
            title: '度量编码',
            key: 'nameEn',
            align:'center',
          },
          {
            title: '计算类型',
            key: 'calculationType',
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
            width:180,
          },
          {
            title: '备注',
            key: 'remark',
            align:'center',
          },
          {
              title: '操作',
              width: 100,
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
                      }, '编辑'),
                  ]);
              }
          }
        ]
      }
    },
    mounted(){
      this.getPageData();
      window.addEventListener('resize', this.getHeight);
      this.getHeight();
    },
     destroyed(){
      window.removeEventListener('resize', this.getHeight)
    },
    methods: {
      getHeight(){ //设置页面高度
        this.pageHeight=window.innerHeight;
        this.$refs.wrap.style.height = this.pageHeight -100 + 'px'
      },
      showEdit(type,data){ //type =>add/edit
        this.editMsg={title:type=='edit'?'编辑':'新增',type:type};
        this.editData = type=='edit'?JSON.parse(JSON.stringify(data)):{name:'',nameEn:'',calculationType:'',versions:'',remark:''};
        this.editFlag = true;
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
        this.loading = true;
        let params = this.pageQuery.query
        post('/measure/info/queryPageInfo',this.pageQuery.query).then(res=>{
          this.loading = false;
          if(res.code == 200){
            this.tableData = res.data.list;
//          this.pageQuery.query.pageNum = res.data.pageNum;
//          this.pageQuery.query.pageSize = res.data.pageSize;
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
      del(){
        let url='/measure/info/deleteByPrimaryKey';
        if (!this.checkData.length<=0){
          let params = {maps:this.checkData};
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
          this.$message({showClose: true, message: '选择需要操作的度量', type: 'error'});
        }
      },
      selectionData(data){
        this.checkData = [];
        data.map(item => {
          this.checkData.push({id:item.id,nameEn:item.nameEn});
        })
      },
    }
  };
</script>
<style scoped lang="less">
  .pagesize_box{
      position: absolute;
      bottom: 10px;
    }
</style>

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
    <div class='edit' v-if='editFlag'>
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
        editMsg:{type:'edit',title:'编辑'},
        checkData:[],
        pageQuery:{
          query:{
             pageNum:1, //第几页
             pageSize:10, //每页条数
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
            title: '名称',
            key: 'name',
            align:'center',
          },
          {
            title: '类型',
            key: 'type',
            align:'center',
          },
          {
            title: '模板图',
            align:'center',
            render: (h, params) => {
              return h('div', [
                h('img', {
                  attrs: {
                    src: params.row.picUrl
                  },
                  style: {
                    width: '45px',
                    height:'45px',
                    marginTop:'3px'
                  },
                  on: {
                    error: () => {
//                    this.showEdit('edit',params.row);
                    }
                  }
                })
              ]);
            }
          },
//        {
//          title: '模板格式',
//          key: '', // h5TemplateCode
//          align:'center',
//        },
          {
            title: '宽度',
            key: 'pattern',
            align:'center',
          },
          {
            title: '高度',
            key: 'height',
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
            width: 160,
          },
          {
            title: '备注',
            key: 'remark',
            align:'center',
          },
          {
            title: '操作',
            width: 90,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                   props: {
                     type: 'dashed'
                  },
                  on: {
                    click: () => {
                      this.showEdit('edit',params.row);
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
        let url='/graphTemplate/deleteByPrimaryKey';
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
          this.$message({showClose: true, message: '选择需要操作的模板', type: 'error'});
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
        post('/graphTemplate/queryPageInfo',{}).then(res=>{
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
      showEdit(type,data){
        this.editData = type=='edit'?JSON.parse(JSON.stringify(data)):{name:'',type:'',picUrl:'',h5TemplateCode:'',versions:'',remark:'',pattern:'',height:''};
        this.editMsg = {type:type,title:type=='edit'?'编辑':'新增'}
        this.editFlag = true;
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

<template>
  <div  ref='wrap'>
    <section class='search_box'>
      <Button icon="plus" size='small' @click="showEdit('add')" type="info">添加</Button>
      <Button icon="plus" size='small' @click="del" type="warning">删除</Button>
    </section>
    <div class='table_box'>
      <Table border ref="selection" size='small' :columns="columns"  :loading='loading' @on-selection-change="selectionData" :data="tableData" :maxheight='pageHeight -210'> </Table>
    </div>
    <div class="pagesize_box">
       <Page :total='pageQuery.total' size='small' @on-change='changePageNum' @on-page-size-change='changePageSize' :page-size-opts='[10,20,30]' show-elevator show-sizer show-total />
    </div>
    <div v-if='editFlag'>
      <Edit :editData='editData' @getPageData='getPageData' v-model='editFlag' :editMsg='editMsg'> </Edit>
    </div>
    <div class='editMD' v-if='editMDFlag'>
      <EditMD :editData='editData' @getPageData='getPageData'  v-model='editMDFlag' :MDmsg='MDmsg'> </EditMD>
    </div>
  </div>
</template>
<script>
  import Edit from './components/edit';
  import EditMD from './components/editMD';
  import {post} from '@/axios/fetch';

  export default {
    components: {
     Edit,EditMD
     },
    data() {
      return {
        loading:false,
        editFlag:false,
        editMDFlag:false,
        pageHeight:window.innerHeight,
        editData:{},
        checkData:[],
        editMsg:{title:'',type:''},
        MDmsg:{type:'',title:'',id:''},
        tableData: [],
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
            title: '维度名称',
            key: 'name',
            align:'center',
          },
          {
            title: '维度编码',
            key: 'nameEn',
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
              width: 200,
              align: 'center',
              render: (h, params) => {
                  return h('div', [
                      h('Button', {
                          props: {
                             size:'small',
                             type:'text',
                          },
                          style: {
                            background:'#242E56',
                            color:'#CFD5E8'
                          },
                          on: {
                              click: () => {
                                 this.showEdit('edit',params.row)
                              }
                          }
                      }, '编辑'),
                      h('Button', {
                        props: {
                          size:'small',
                          type:'text',
                        },
                        style: {
                          marginLeft: '5px',
                          background:'#242E56',
                          color:'#CFD5E8',
                        },
                        on: {
                          click: () => {
                            this.showEditMD(params.row.id,'D','运算符');
                          }
                        }
                      }, '编辑运算符')
                  ]);
              }
          }
        ],
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
      showEditMD(id,type,title){
        this.MDmsg={id:id,type:type,title:title};
        this.editMDFlag = true;
      },
      getHeight(){ //设置页面高度
        this.pageHeight=window.innerHeight;
        this.$refs.wrap.style.height = this.pageHeight -80 + 'px'
      },
      showEdit(type,data){ //type =>add/edit
        this.editMsg={title:type=='edit'?'编辑':'新增',type:type};
        this.editData = type=='edit'?JSON.parse(JSON.stringify(data)):{name:'',nameEn:'',versions:'',remark:''};
        this.editFlag = true;
      },
      getPageData(){
        let url='/dimension/info/queryPageInfo';
        post(url,this.pageQuery.query).then(res=>{
            console.log('res',res)
          this.loading = false;
          if(res.code == 200){
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
      changePageNum(num){ //改变页码
        this.pageQuery.query.pageNum = num;
        this.getPageData();
      },
      changePageSize(num){ //改变每页显示条数
         this.pageQuery.query.pageSize = num;
         this.getPageData();
      },
      del(){
        let url='/dimension/info/deleteByPrimaryKey';
        if (!this.checkData.length<=0){
          let params = {maps:this.checkData};
          post(url,params).then(res=>{
            if(data.code == 200){
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
          this.$message({showClose: true, message: '选择需要操作的维度', type: 'error'});
        }
      },
      selectionData(data){
        this.checkData = [];
        data.map(item => {
          this.checkData.push({id:item.id,nameEn:item.nameEn});
        })
      }
    }
  };
</script>
<style scoped>


</style>

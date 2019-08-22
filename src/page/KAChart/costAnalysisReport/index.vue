<template>
  <div ref="wrap" class='wrapBox'>
    <p>个人销售达成</p>
  </div>
</template>
<script>
import { post } from "@/axios/fetch";
export default {
  components: {},
  data() {
    return {
      pageHeight:null,
      loading:false,
      tableData:[],

      }

  },
  mounted() {
     this.getPageData(this.relativeArr[this.level].url,this.relativeArr[this.level].param);
     window.addEventListener("resize", this.getHeight);
     this.getHeight();
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
  methods: {
    getHeight() {
      //设置页面高度
      this.pageHeight = window.innerHeight;
      this.$refs.wrap.style.height = this.pageHeight - 75 + "px";
    },
    getPageData(url,param,){
        post(url,param).then(res=>{
            if(res.code!==200){
                this.$Modal.warning({
                    title:'提示',
                    content:res.message
                  })
                return
            }
           this.tableData = res.data;

        }).catch(error=>{
           console.log('error',error)
          this.$Modal.warning({
            title:'提示',
            content:'连接服务失败!'
          })
        })
    },

  }
};
</script>
<style scoped lang="less">

    .formitem{
      color: white;
    }
    .query{
        height: 50px;
        line-height: 50px;
    }
</style>

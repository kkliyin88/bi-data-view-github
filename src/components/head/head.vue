<template>
  <header class="head" style='margin-bottom: 10px;'>
    <!-- 折叠按钮 -->
   <div class="collapse-btn" @click="getCollapse">
       <img style='height: 28px;width:28px;margin-top:15px;marginRight:-10px;' src='../../../static/image/xitong2.png' />
    </div>
    <div class="logo" style="verticalAlign: center;">
        {{$t('h.system')}}
    </div>
    <div class="top-nav">
    </div>
  </header>
</template>
<script>
  import {mapState,mapActions} from 'vuex';
  import {getCompany} from '../../axios/api'
    export default {
        name: 'Head',
        data () {
            return {
              language: localStorage.getItem("lang") || "EN"
            }
        },
      mounted(){

      },
      computed: {
        ...mapState({
          companyValue:state=>state.companyValue,
        }),
      },
      methods:{
        ...mapActions(["getCollapse"]),//简写
//
      }
    }
</script>
<style scoped lang='less'>
 .head{
    background: rgba(45,55,90,1);
  }
 header{
    display: flex;
    position: relative;
    width: 100%;
    height: 60px;
    line-height:60px;
    font-size: 22px;
    color: #fff;
    background-color: #24292e;
    -webkit-transition: all .3s ;
    -moz-transition: all .3s ;
    transition:all .3s ;
  }
  .logo{
    color: #9AA2B5;
    font-size: 20px;

  }
  .lan {
    display: inline-block;
    cursor: pointer;
    width: 22px;
    height: 22px;
    font-size: 12px;
    line-height: 22px;
    text-align: center;
    background: #fff;
    border-radius: 50%;
    color: #24292e;
  }
</style>

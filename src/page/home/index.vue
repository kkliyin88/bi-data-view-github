<template>
    <div id="Home">
      <head-top></head-top>
      <div class="wrapper">
           <sidebar ></sidebar>
          <div class="main" :style="{left:slideflag?'160px':0}">
            <div class="container">
                <router-view></router-view>
            </div>
          </div>
        </div>
      </div>
</template>

<script>
  import {mapState} from 'vuex'
  import headTop from '@/components/head/head'
  import Sidebar from '@/components/sidebar/sidebar'
    export default {
      name: 'Home',
      components:{
        headTop,
        Sidebar,
      },
      data () {
        return {
            slideflag:true,
        }
      },
      mounted(){

      },
      computed:{
        ...mapState({
          collapse:store=>store.collapse
        }),
      },
      methods:{
      }
    }
</script>
<style scoped>
  .main{
  background: #f6f6f6;
  position: absolute;
  top: 60px;
  left: 160px;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  -webkit-transition: left .3s ease-in-out;
  -o-transition: left .3s ease-in-out;
  transition: left .3s ease-in-out;
}
.container>div{
  background: #000;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(26,26,26,.1);
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  padding:0 20px 10px;

}
</style>

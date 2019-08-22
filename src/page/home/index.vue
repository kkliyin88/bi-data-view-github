<template>
    <div id="Home">
      <head-top></head-top>
      <div class="wrapper" ref="wrapper">
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
        window.addEventListener("resize", this.getHeight);
        this.getHeight();
      },
      computed:{
        ...mapState({
          collapse:store=>store.collapse
        }),
      },
      methods:{
        getHeight() {
          //设置页面高度
          this.pageHeight = window.innerHeight;
          this.$refs.wrapper.style.height = this.pageHeight - 74 + "px";
        }
      }
    }
</script>

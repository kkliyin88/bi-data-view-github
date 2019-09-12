<template>
    <div id="Home">
      <head-top></head-top>
      <div class="wrapper">
           <sidebar ></sidebar>
          <div class="main" :style="{left:slideflag?'150px':0}">
            <transition name="fade" mode="out-in" appear>
              <keep-alive >
                <div class="container">
                    <router-view></router-view>
                </div>
             </keep-alive>
            </transition>
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
<style less='lange'>
   .fade-enter,.fade-leave-to{
          opacity:  0;/*透明度*/
          transition: all 2s ease;
        }
</style>

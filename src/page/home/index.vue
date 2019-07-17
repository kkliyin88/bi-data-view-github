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

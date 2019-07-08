<template>

      <div>
        <template>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="用户管理" name="first">
              <div class="chart">
                <div ref="myUser" :style="{width: '100%', height: '300px'}"></div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="配置管理" name="second">
              <!-- <div class="chart">
                <div ref="myUser" :style="{width: '100%', height: '300px'}"></div>
              </div> -->
            </el-tab-pane>
            <el-tab-pane label="角色管理" name="third">
              <!-- <div class="chart">
                <div ref="myUser" :style="{width: '100%', height: '300px'}"></div>
              </div> -->
            </el-tab-pane>

          </el-tabs>
        </template>
      </div>

</template>

<script>
  // 引入基本模板
  let echarts = require('echarts/lib/echarts')
  // 引入柱状图组件
  require('echarts/lib/chart/bar')

  // 引入提示框和title组件
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')


  export default {
        name: 'chart',
        data () {
            return {
              activeName: 'first'
            }
        },
      mounted(){
        this.drawLine();
      },
      components:{

      },
      methods:{
         handleClick(tab, event) {
            console.log(tab, event);
          },
        drawLine(){
          // 基于准备好的dom，初始化echarts实例
          let myUser = this.$echarts.init(this.$refs.myUser);
          // 绘制图表
           myUser.setOption({
            title: { text: '柱状图' },
            tooltip: {},
            xAxis: {
              data: ["数据一","数据二","数据三","数据四","数据五","数据六"]
            },
            yAxis: {},
            series: [{
              name: '销量',
              type: 'bar',
              data: [5, 20, 36, 10, 10, 20]
            }]
          });
        }
      }
    }
</script>
<style scoped>

</style>

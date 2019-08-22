<template>
  <div id="sidebar-left" ref="menu_left">
    <Menu width="160px" :open-names="[1]" text-color="#A4A6BE">
      <Submenu :name="index+1" v-for="(item,index) in menuData" :key="index">
        <template slot="title">
           <span>{{item.title}}</span>
        </template>
        <MenuItem  v-for="(item2,i) in item.sub"   :to="item2.index"  :key="i"  :name="item2.title">
         <img class='submMenuIcon' :src='item2.pic' />
         <span>{{item2.title}}</span>
        </MenuItem>
      </Submenu>
    </Menu>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "sidebar",
  data() {
    return {
      indexPath: [], //保存点击过的页面路由信息
      pageHeight: window.innerHeight,
      menuData: [
        {
          title: "数据维护",
          sub: [
            {
              pic:'../../../static/image/weidu@2x.png',
              index: "/dataManage/dimension",
              title: "维度"
            },
            {
              pic:'../../../static/image/duliang@2x.png',
              index: "/dataManage/measureinfo",
              title: "度量"
            },
            {
              pic:'../../../static/image/shijian@2x.png',
              index: "/dataManage/eventinfo",
              title: "事件"
            },
            {
              pic:'../../static/image/dashboard@2x.png',
              index: "/dataManage/meter",
              title: "仪表"
            },
            {  pic:'../../static/image/dashboard@2x.png',
              index: "/dataManage/template",
              title: "模板"
            },
            {
              pic:'../../static/image/yunsuankongjian@2x.png',
              index: "/dataManage/operation",
              title: "运算"
            },

            {
               pic:'../../static/image/leixing@2x.png',
              index: "/dataManage/eventType",
              title: "事件类型"
            }
          ]
        },
        {
          title: "KA图表",
          sub: [
              { pic:'',
                index: "/KAChart/sellPercentageAnalysis",
                title: "销售占比"
              },
            { pic:'',
              index:'/KAChart/samePeriodAnalysis',
              title:'销售同比'
            },
            {
              pic:'',
              index:'/KAChart/personTargetPerformance',
              title:'个人目标达成'
            },
             {
              pic:'',
              index:'/KAChart/saleTargetPerformance',
              title:'销售目标达成'
            },
            {
              pic:'',
              index:'/KAChart/costAnalysisReport',
              title:'费用分析报表'
            },

          ]
        },

      ]
    };
  },
  computed: {
    ...mapState({
      collapse: state => state.collapse
    })
  },
  mounted() {

  },
  methods: {
    
  }
};
</script>
<style scoped lang="less">
#sidebar-left {
  width: 170px;
  overflow-y: auto;
  overflow-x: hidden;
  background:rgba(45,55,90,1);

}
.submMenuIcon{
  width: 15px;
  height: 15px;
  margin-right: 8px;
  border:none;
}
</style>

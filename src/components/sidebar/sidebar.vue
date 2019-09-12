<template>
  <div id="sidebar-left" ref="menu_left">
    <Menu width="160px" accordion text-color="#A4A6BE" ><!-- :open-names="[1]" -->
      <Submenu :name="index+1" v-for="(item,index) in menuData" :key="index">
        <template slot="title">
           <span>{{item.title}}</span>
        </template>
        <MenuItem  v-for="(item2,i) in item.sub"   :to="item2.index"  :key="i"  :name="item2.title">
         <p @click='selectMenu(item2,item.sub)'>
           <img class='submMenuIcon' :src='item2.pic' />
           <span>{{item2.title}}</span>
         </p>
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
          title: "仪表盘",
          sub:[
             {
              pic1:'../../static/image/yibiao_menu/meter1.png',
              pic2:'../../static/image/yibiao_menu/meter2.png',
              index: "/dataManage/meter",
              title: "仪表"
            },
          ]
        },
        {
          title: "数据维护",
          sub: [
            {
              pic1:'../../../static/image/dataManage_menu/dimension1.png',
              pic2:'../../../static/image/dataManage_menu/dimension2.png',
              index: "/dataManage/dimension",
              title: "维度"
            },
            {
              pic1:'../../../static/image/dataManage_menu/measureinfo1.png',
              pic2:'../../../static/image/dataManage_menu/measureinfo2.png',
              index: "/dataManage/measureinfo",
              title: "度量"
            },
            {
              pic1:'../../../static/image/dataManage_menu/eventinfo1.png',
              pic2:'../../../static/image/dataManage_menu/eventinfo2.png',
              index: "/dataManage/eventinfo",
              title: "事件"
            },

            { pic1:'../../../static/image/dataManage_menu/template1.png',
              pic2:'../../../static/image/dataManage_menu/template2.png',
              index: "/dataManage/template",
              title: "模板"
            },
            {
              pic1:'../../../static/image/dataManage_menu/operation1.png',
              pic2:'../../../static/image/dataManage_menu/operation2.png',
              index: "/dataManage/operation",
              title: "运算"
            },

            {
               pic1:'../../../static/image/dataManage_menu/eventType1.png',
               pic2:'../../../static/image/dataManage_menu/eventType2.png',
              index: "/dataManage/eventType",
              title: "事件类型"
            }
          ]
        },
        {
          title: "KA图表",
          sub: [
              { pic1:'../../static/image/KA_menu/sellPercentageAnalysis1.png',
                pic2:'../../static/image/KA_menu/sellPercentageAnalysis2.png',
                index: "/KAChart/sellPercentageAnalysis",
                title: "销售占比"
              },
            { pic1:'../../static/image/KA_menu/samePeriodAnalysis1.png',
              pic2:'../../static/image/KA_menu/samePeriodAnalysis2.png',
              index:'/KAChart/samePeriodAnalysis',
              title:'销售同比'
            },
            {
              pic1:'../../static/image/KA_menu/personTargetPerformance1.png',
              pic2:'../../static/image/KA_menu/personTargetPerformance2.png',
              index:'/KAChart/personTargetPerformance',
              title:'个人目标达成'
            },
             {
              pic1:'../../static/image/KA_menu/personTargetPerformance1.png',
              pic2:'../../static/image/KA_menu/personTargetPerformance2.png',
              index:'/KAChart/saleTargetPerformance',
              title:'销售目标达成'
            },
            {
              pic1:'../../static/image/KA_menu/costAnalysisReport1.png',
              pic2:'../../static/image/KA_menu/costAnalysisReport2.png',
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
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
    this.img();
  },
  methods: {
    getHeight() {
      //设置页面高度
      this.pageHeight = window.innerHeight;
      this.$refs.menu_left.style.height = this.pageHeight - 60 + "px";
    },
    selectMenu(item,arr){
      arr.map((item2)=>{
         this.$set(item2,'pic',JSON.parse(JSON.stringify(item2.pic1)))
      });

      this.$set(item,'pic',JSON.parse(JSON.stringify(item.pic2)));
    },
    img(){
      this.menuData.map((item)=>{
        item.sub.map((item2)=>{
          this.$set(item2,'pic',JSON.parse(JSON.stringify(item2.pic1)))
        })
      })
    },
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

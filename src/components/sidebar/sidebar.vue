<template>
  <div id="sidebar-left" ref="menu_left">
    <Menu width="160px" :open-names="[1]" text-color="#A4A6BE">
      <Submenu :name="index+1" v-for="(item,index) in menuData" :key="index">
        <template slot="title">
          <Icon type="ios-paper" />
          {{item.title}}
        </template>
        <MenuItem
          v-for="(item2,i) in item.sub"
          :to="item2.index"
          :key="i"
          :name="item2.title"
        >{{item2.title}}</MenuItem>
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
              index: "/dataManage/dimension",
              title: "维度"
            },
            {
              index: "/dataManage/measureinfo",
              title: "度量"
            },
            {
              index: "/dataManage/eventinfo",
              title: "事件"
            },
            {
              index: "/dataManage/meter",
              title: "仪表"
            },
            {
              index: "/dataManage/template",
              title: "模板"
            },
            {
              index: "/dataManage/operation",
              title: "运算"
            },

            {
              index: "/dataManage/eventType",
              title: "事件类型"
            }
          ]
        },
        {
          title: "KA图表",
          sub: [
            {
              index: "/KAChart/sellPercentageAnalysis",
              title: "KA销售占比"
            },
			 {
			  index:'/KAChart/samePeriodAnalysis',
			  title:'销售同比分析'
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
  },
  methods: {
    getHeight() {
      //设置页面高度
      this.pageHeight = window.innerHeight;
      this.$refs.menu_left.style.height = this.pageHeight - 60 + "px";
    }
  }
};
</script>
<style scoped lang="less">
#sidebar-left {
  width: 170px;
  overflow-y: auto;
  overflow-x: hidden;

}
</style>

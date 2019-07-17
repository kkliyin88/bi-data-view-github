
import Vue from 'vue'
import Router from 'vue-router'
const Login = resolve => require(['@/page/login'], resolve)
const Home = resolve => require(['@/page/home'], resolve)
const User = resolve => require(['@/page/user/user'], resolve)

//菜单一
const Dimension = resolve => require(['@/page/dataManage/dimension'], resolve)
const dataSearch = resolve => require(['@/page/dataManage/dataSearch'], resolve)
const Measureinfo = resolve => require(['@/page/dataManage/measureinfo'], resolve)
const Eventinfo = resolve => require(['@/page/dataManage/eventinfo'], resolve)
const Meter = resolve => require(['@/page/dataManage/meter'], resolve)
const Template = resolve => require(['@/page/dataManage/template'], resolve)
const Operation = resolve => require(['@/page/dataManage/operation'], resolve)
// const chinaMap = resolve => require(['@/page/dataManage/chinaMap'], resolve)
const EventType = resolve => require(['@/page/dataManage/eventType'], resolve)
//菜单二
const sellPercentageAnalysis = resolve => require(['@/page/KAChart/sellPercentageAnalysis'], resolve)
const samePeriodAnalysis = resolve => require(['@/page/KAChart/samePeriodAnalysis'], resolve)

Vue.use(Router);
export default new Router({
  routes: [
    {
      path: '',
      redirect: '/login'
    },
    {
      path:'/home',
      component: Home,
      meta: { title: '自述文件' },
      children: [
        { //我的账户
          path: '/user',
          component: User,
          meta: { title: '我的账户' }
        },
      ]
    },
    {
      path: '/dataManage/dataSearch',
      component: dataSearch,
      name: dataSearch,
      meta: { title: '数据查询' }
    },
    {
      path:'/home',
      component: Home,
      meta: { title: '自述文件' },
      children: [
        {
          path: '/dataManage/dimension',
          component: Dimension,
          meta: { title: '维度' }
        },
         {
          path: '/dataManage/measureinfo',
          component: Measureinfo,
          meta: { title: '度量' }
        },
        {
          path: '/dataManage/eventinfo',
          component: Eventinfo,
          meta: { title: '事件' }
        },
          {
          path: '/dataManage/meter',
          component: Meter,
          meta: { title: '仪表' }
        },
        {
          path: '/dataManage/template',
          component: Template,
          meta: { title: '模板' }
        },
        {
          path: '/dataManage/operation',
          component: Operation,
          meta: { title: '运算' }
        },
         {
          path: '/dataManage/eventType',
          component: EventType,
          meta: { title: '事件类型' }
        },
        // {
        //   path: '/dataManage/chinaMap',
        //   component: chinaMap,
        //   meta: { title: '地图' }
        // },
         {
          path: '/KAChart/sellPercentageAnalysis',
          component: sellPercentageAnalysis,
          meta: { title: '销售占比分析' }
        },
        {
          path: '/KAChart/samePeriodAnalysis',
          component: samePeriodAnalysis,
          meta: { title: '销售同比分析' }
        },

      ]
    },
    {
      path: '/login',
      component: Login,
      meta: { title: '登录' }
    }
  ]
})

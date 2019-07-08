<template>
  <div class='wrap' :style="{height:pageHeight +'px'}" ref='wrap'>
    <div class='left' ref='leftBox'>
       <div class='chartModel'>
         <ul class='chartItemRow'>
         	<li v-for='(item,index) in modelList'  @mouseenter='showColumnItem(index)' @mouseleave='hideColumnItem(index)'>
         	   <span class='imgRow' @click='selectChartModel(item[0])'><img :src='item[0].picUrl' /></span>
         	  <ul v-if='showColumnItemIndex==index' class='chartItemColum' 
         	    @mouseenter='showColumnItem(index)' @mouseleave='hideColumnItem(index)'>
         	    	<li v-for="(item2,index2) in item" :key='index2' v-if='index2>0'>
         	    	  <span @click='selectChartModel(item2,index)'><img :src='item2.picUrl' /></span>
         	    	</li>
         	  </ul>
         	</li>
         </ul>
          <Button v-if='chartSort.length > 0' type='primary' @click="saveSort"  class="sortBTN">排序保存</Button>
       </div>
       <div class='chartBox' ref='chartBox' :style="{background:chartsList.length>0?'#FFF':'rgb(236,234,239)'}" >
         <img src="@/assets/computer.png" v-if='chartsList.length<1' />
        <Spin size="large" fix v-if='pageLoading'></Spin>
        <ul ref="parent" style="width:100%;">
          <li v-for="(item,index) in chartsList" :uuid='item.uuId' :class="{chartList:'true',chartActive:chartActiveMsg.uuId==item.uuId}" @click='selectChart(item)' 
              draggable="true" @dragstart="dragstart($event)" @dragover="dragover($event)" @drop="drop($event)" 
              @mouseenter="()=>{chartOverIndex=index}" @mouseleave="()=>{chartOverIndex=-1;chartSettingBoxIndex=-1}">
               <div class='echartsBox' style="width:100%;height:100%;"></div>
               <div class='back_btn' v-if='item.chartJson &&item.chartJson.toolbox &&item.chartJson.toolbox.feature&& item.chartJson.toolbox.feature.myTool&& item.chartJson.toolbox.feature.myTool.show' @click='goBack'><Icon type="ios-undo-outline" size='25'/></div>
               <div @click='()=>{chartSettingBoxIndex=index}' class='chartSetting_btn' v-if='chartOverIndex==index' >...</div>
               <div  class='chartSetting_box' v-if='chartSettingBoxIndex==index'>
                 <p @click='showchartData(item,index)'><span><Icon type="ios-paper-outline" /></span><span>数据</span></p>
                 <p @click='deleteChart(item,index)'><span><Icon type="md-close" /></span><span>删除</span></p>
               </div>
          </li>
        </ul>
      </div>
    </div>
   <!-- 右边栏条件区域-->
     <div class='right' >
      <div class='searchBox'>
         <section class='dimension' ref='dimension' type='dimension' :drapflag='true'
            draggable="false" @dragstart="dragstart($event)" @dragover="dragover($event)"@drop="drop($event)">
             <div class='line'></div>
           <p class='title'>维度</p>
           <ul>
             <li  class='empty' v-if= 'dimensionQueryList.length<1' style="border: none;">
               <span class='context'>双击或拖动数据字段至此处</span>
             </li>
             <li  v-for='(item,index) in dimensionQueryList' :key='index'>
              <span>{{item.name}}</span>
              <span @click="delItem(index,'dimension')">
                <i class="el-icon-close"></i>
              </span>
            </li>
          </ul>
        </section>
        <section class='measure' ref='measure'  type='measure'  :drapflag='true'
          draggable="false" @dragstart="dragstart($event)" @dragover="dragover($event)"@drop="drop($event)">
          <div class='line'></div>
          <p class='title'>度量</p>
          <ul>
            <li  class='empty' v-if='measureQueryList.length<1' style="border: none;">
              <span class='context'>双击或拖动数据字段至此处</span>
            </li>
            <li v-for='(item,index) in measureQueryList' :key='index'>
              <span>{{item.name}}</span>
              <span @click="delItem(index,'measure')">
                <i class="el-icon-close"></i>
              </span>
            </li>
          </ul>
        </section>
        <section class='btn'>
           <Button v-if='chartActiveMsg.uuId' style='width: 100%;' @click='showMoreCondition' type='primary' >条件筛选</Button>
           <Button v-if='!chartActiveMsg.uuId' style='width: 100%;' @click='tips'>条件筛选</Button>
        </section>
      </div>
      <div class='selectBox'>
        <section class="event">
          <Select v-model="selectEventItem" @on-change='selectEvent'>
             <Option v-for="(item,index) in eventList" :label='item.name' :value='item.id' :key='index'></Option>
          </Select>
        </section>
       
        <section class='dimension'>
          <div class='line' style='margin-top: 20px;'></div>
          <p class='title'>维度</p>
          <ul class='MD'>
            <li v-for='(item,index) in dimensionList'  @click="singleClick(index,'dimension')" @dblclick="addQuery(item,'dimension')">
               <span type='dimension' :idd='item.id' :name='item.name' 
                 draggable="true" @dragstart="dragstart($event)" @dragover="dragover($event)" @drop="drop($event)"
                 :class="{dimensionActive:index==dimensionClickIndex}">{{item.name}}</span>
            </li>
          </ul>
           <Spin fix v-if='MDLoading' style='background: rgba(63,71,94);opacity: 0.6;'></Spin>
        </section>
        <section class='measure'>
          <div class='line'></div>
          <p class='title'>度量</p>
          <ul  class='MD'>
            <li v-for='(item,index) in measureList'  @click="singleClick(index,'measure')" @dblclick="addQuery(item,'measure')">
               <span  :name='item.name' type='measure' :idd='item.id' 
              draggable="true" @dragstart="dragstart($event)" @dragover="dragover($event)" @drop="drop($event)"
              :class="{measureActive:index==measureClickIndex}">{{item.name}}</span>
            </li>
          </ul>
          <Spin fix v-if='MDLoading' style='background: rgba(63,71,94);opacity: 0.6;'></Spin>
        </section>
      </div>
     </div>
     <div class='chartDetail'  v-if='ChartDetailFlag' >
       <ChartDetail v-model='ChartDetailFlag' :chartDetailData='chartDetailData'></ChartDetail>
     </div>
     <div   v-if='moreConditionFlag' >
       <MoreCondition v-model='moreConditionFlag' :selectEventItem='selectEventItem' :dimensionQueryList='dimensionQueryList' :measureQueryList='measureQueryList' :chartActiveMsg='chartActiveMsg' @getPageData='getPageData'></MoreCondition>
     </div>
  </div>
</template>
<script>
  import { post } from '@/axios/fetch';
  import echarts from 'echarts';
  import ChartDetail from './components/chartDetail';
  import MoreCondition from './components/moreCondition';
  import provinceMap from "./province-map";
  import axios from "axios";
  export default {
    name: 'dataSearch',
    components: {
     ChartDetail,MoreCondition
     },
    data() {
      return {
        chartArr:[],//用于保存多个初始化的chart表
        moreConditionFlag:false, //筛选条件diag
        loading:false,
        measureQueryList:[],
        dimensionQueryList:[],
        pageLoading:false, //页面图标的加载
        measureList:[], //[{name:'度量1',id:1,type:'measure'},{name:'度量2',id:2,type:'measure'},{name:'度量3',id:3,type:'measure'}],
        dimensionList:[], //[{name:'维度1',id:1,type:'dimension'},{name:'维度2',id:2,type:'dimension'},{name:'维度3',id:3,type:'dimension'}],
        modelList:[],  //模板样式数据
        measureClickIndex:null,
        dimensionClickIndex:null,
        chartActiveMsg:{},
        showColumnItemIndex:-1,
        eventList:[],
        selectEventItem:'',
        MDLoading:false, //选择事件的时候加载
        ChartDetailFlag:false, //显示数据对话框
        chartsList:[], //{id:1,name:'box1'},{id:2,name:'box2'}
        chartOverIndex:-1,//用于判断鼠标划过那个chart
        chartSettingIndex:-1, //显示当前chart的设置按钮
        chartSettingBoxIndex:-1, //显示当前chart的设置菜单
        chartDetailData:{},
         moveDom:"",
         startX:0,
         startY:0,
         changeDom:"",
         endX:0,
         pageHeight:'',
         option1: {},
        chartSort:[], //图表排序传给后台
      }
     
    },
    mounted(){
      this.getEventList();
      this.getPageData();
      this.getModelData();
      this.getHeight();
      window.addEventListener('resize', this.getHeight);
     
    },
    destroyed(){
      window.removeEventListener('resize', this.getHeight)
    },
    methods: {
      goBack(){
        this.getPageData();
      },
       async onProvinceClick(e) {
        let index = null;
        this.chartsList.map((item,i)=>{
          if(item.chartJson.series&&item.chartJson.series.length>0&&item.chartJson.series[0].type=='map'){
            index = i
          }
        })
      this.chartArr[index].showLoading();
      let name = e.batch[0].name;
      let pinyinName = provinceMap[name]
      let mapJson = await axios.get(     
          `/static/province/${pinyinName}.json`      
      );
      this.chartArr[index].hideLoading();
      echarts.registerMap(pinyinName, mapJson.data);
      this.chartsList[index].chartJson.series[0].mapType = pinyinName;
      this.chartsList[index].chartJson.toolbox.feature.myTool.show = true;
      this.chartsList[index].chartJson.title.text = e.batch[0].name;
      this.chartArr[index].setOption(this.chartsList[index].chartJson);
    },
      saveSort(){
        let url = '/dashboard/event/coordinateSave';
        let params = {eventDtoList:this.chartSort};
        post(url,params).then(res=>{ //JSON.stringify(params)
          if(res.status == 200){
            this.$Message.success('success');
            this.chartSort = [];
            this.getPageData();
          }
        }).catch(error=>{
          console.log('error:',error)
          this.$Modal.warning({
            title:'提示',
            content:'连接服务失败!'
          })
        })
      },
      tips(){
       this.$message.warning('请先选择图表');
      },
      showMoreCondition(){
        this.moreConditionFlag = true;
      },
      getPageData(){
        this.pageLoading = true;
        let url ='/remote/findByDay/'+this.$route.query.id;
        this.chartActiveMsg = {};
        this.dimensionList =[];
        this.measureList =[];
        this.dimensionQueryList =[];
        this.measureQueryList = [];
        this.selectEventItem ='';
//      this.chartsList.map((item,i)=>{
//        if(item.uuId==this.chartActiveMsg.uuId){
//          this.chartsList[i].chartJson ={toolbox:{feature:{myTool:{show:false}}}};
//        }
//      })
        post(url).then(res=>{ //JSON.stringify(params)
          this.pageLoading = false;
          if(res.status == 200){
            this.chartsList=res.data.map;
            this.chartsList.map((item,index)=>{
              item.chartJson = JSON.parse(item.chartJson);
            });
            
            this.initChart();
          }
        }).catch(error=>{
          console.log('error:',error)
          this.pageLoading = false;
          this.$Modal.warning({
            title:'提示',
            content:'连接服务失败!'
          })
        })
      },
     async initChart(){
       let mapJson = await axios.get('/static/china.json');  
        this.$nextTick(()=>{
          let chartsli=document.querySelectorAll('.chartList'); //外层li
          let chartLists=document.querySelectorAll('.echartsBox'); //图标的box;
          for(let i=0;i<chartsli.length;i++){
             chartsli[i].style.width= this.chartsList[i].pattern-3+'%'; //设置高度
             chartsli[i].style.height= this.chartsList[i].height+'px';  //设置宽度
          };
            this.chartArr = [];
           for(let i=0;i<chartLists.length;i++){  //初始化图标
              this.chartArr.push(null)
              this.chartArr[i] = echarts.getInstanceByDom(chartLists[i])||echarts.init(chartLists[i]);
              if(this.chartsList[i].chartJson.series&&this.chartsList[i].chartJson.series.length>0&&this.chartsList[i].chartJson.series[0].type=='map'){
                 echarts.registerMap("china", mapJson.data);
                 this.chartArr[i].on("mapselectchanged", this.onProvinceClick);//对省的监听
              }
              this.chartArr[i].resize();
              this.chartArr[i].setOption(this.chartsList[i].chartJson,true);
          }
        })
        
      },
      showchartData(item,index){ //查看数据对话框
        this.chartDetailData = item;
        this.ChartDetailFlag = true;
      },
      deleteChart(item){ //删除echart
        let url = '/dashboard/event/deleteByPrimaryKey/'+item.uuId
        post(url).then(res=>{ 
          if(res.status == 200){
           this.$Message.success('success');
           this.getPageData();
          }
        }).catch(error=>{
          console.log('error:',error)
          this.$Modal.warning({
            title:'提示',
            content:'连接服务失败!'
          })
        })
      },
      getHeight(){
        this.pageHeight=window.innerHeight; //如果存在tabs，总高度减去30px
       },
      getEventList(){ //获取事件列表
        let url = '/event/info/eventQuery';
        post(url,).then(res=>{ //JSON.stringify(params)
          if(res.status == 200){
            this.eventList = res.data;
          }
        }).catch(error=>{
          console.log('error:',error)
          this.$Modal.warning({
            title:'提示',
            content:'连接服务失败!'
          })
        })
        
      },
      dragstart(e){
         var eo = e || event;
         this.moveDom = eo.currentTarget;
         this.startX = eo.clientX;
         this.startY = eo.clientY;
      },
      dragover(e){
        var eo = e || event;
        eo.preventDefault();
        this.changeDom = eo.currentTarget;
        this.endX = eo.clientX;
        this.endY = eo.clientY;
        //划过的时候设置背景
        if(this.moveDom.getAttribute('type')==eo.currentTarget.getAttribute('type')&&eo.currentTarget.getAttribute('drapFlag')){
          let type = eo.currentTarget.getAttribute('type')
          this.$refs[type].style.background = 'rgb(83,90,110)';
        }
      },
    drop(e){
      const that = this;
      var eo = e || event;
      eo.preventDefault();
      //针对右边栏的拖动
       this.$refs.dimension.style.background = 'rgb(63,71,94)';
       this.$refs.measure.style.background = 'rgb(63,71,94)';
      if(this.moveDom.getAttribute('type') == eo.currentTarget.getAttribute('type') &&eo.currentTarget.getAttribute('drapFlag')){
        let type = this.moveDom.getAttribute('type')
        for(let i=0;i<this[`${type}`+'QueryList'].length;i++){ //不添加重复的
          if(this[`${type}`+'QueryList'][i].id==this.moveDom.getAttribute('idd')){
             return false;
          }
        }
        this[`${type}`+'QueryList'].push({name:this.moveDom.getAttribute('name'),id:this.moveDom.getAttribute('idd'),type:this.moveDom.getAttribute('type')})
        return;
      }
      //针对左边栏的拖动
      
      this.changeDom = eo.currentTarget;
      this.endX = eo.clientX;
      if(this.endX - this.startX >= 0){
        this.$refs.parent.insertBefore(this.moveDom,this.changeDom.nextSibling);
      }else{
        this.$refs.parent.insertBefore(this.moveDom,this.changeDom);
      }
      
      if(!this.moveDom.getAttribute('uuid')){ //针对左边图标的排序传给后台
        return
      }
      this.chartSort = [] ;
      for(let i=0;i<this.$refs.parent.childNodes.length;i++){
        this.chartSort.push({tabSort:i+1,uuId:this.$refs.parent.childNodes[i].getAttribute('uuid')})
      }
    },
    showColumnItem(index){ //显示隐藏那个下拉菜单
      this.showColumnItemIndex = index;
    },
    hideColumnItem(item){
      this.showColumnItemIndex = -1;
    },
    selectChartModel(item){ //选择了某个模板类型
      let chartLists=document.getElementsByClassName('chartList');
      item.uuId=new Date().getTime();
      this.chartsList.push({...item});
      this.selectChart(item);
      this.$nextTick(()=>{
        chartLists[chartLists.length-1].style.width= item.pattern-3+'%';
        this.$refs.chartBox.scrollTop = this.$refs.chartBox.scrollHeight;
      })
      this.measureList = [];  //新增模板之后,重置事件
      this.dimensionList = []; ///新增模板之后,重置事件
      this.showColumnItemIndex = -1;
    },
    selectChart(item){
      this.chartActiveMsg=item;
      this.selectEventItem =item.eventInfoEntityList?this.chartActiveMsg.eventInfoEntityList[0].id:'';
      this.selectEvent(this.selectEventItem);
      this.dimensionQueryList = [];
      this.measureQueryList = [];
      this.chartActiveMsg.dimensionInfoEntityList&&this.chartActiveMsg.dimensionInfoEntityList.map((item,i)=>{ //已选择的维度
        this.dimensionQueryList.push({id:item.id,name:item.name})
      });
      this.chartActiveMsg.measureInfoEntityList&&this.chartActiveMsg.measureInfoEntityList.map((item,i)=>{ //已选择的量度
        this.measureQueryList.push({id:item.id,name:item.name})
      });
    },
    selectEvent(eventId){ //根据选择的表名获取维度和度量
      if(eventId== ''||eventId== null){
        return false;
      }
      this.selectEventItem  = eventId;
      this.measureQueryList = [];
      this.dimensionQueryList = [];
      this.MDLoading = true;
      let url = '/event/info/factTableQuery/'+eventId
      post(url).then(res=>{ 
          this.MDLoading = false;
          if(res.status == 200){
          this.measureList = res.data.measure;
          this.dimensionList = res.data.dimension;
          }
        }).catch(error=>{
          console.log('error:',error);
          this.MDLoading = false;
          this.$Modal.warning({
            title:'提示',
            content:'连接服务失败!'
          })
        })
    },
    singleClick(index,type){ //单击添加class
      this[type + 'ClickIndex'] = index
    },
    delItem(index,type){ //删除条件
      this[type + 'QueryList'].splice(index,1);
    },
    addQuery(item,type){ //双击选择此项
      let flag=true;
      if(type=='measure'){
        for(let i=0;i<this.measureQueryList.length;i++){
          if(this.measureQueryList[i].id==item.id){
           return false;
          }
        }
        this.measureQueryList.push(item);
      }else if(type=='dimension'){
         for(let i=0;i<this.dimensionQueryList.length;i++){
          if(this.dimensionQueryList[i].id==item.id){
           return false;
          }
        }
        this.dimensionQueryList.push(item)
      }
    },
    getArry(arr){//根据对象属性将一维数组转换为二维数组
      if(arr.length<1){
        return [];
      }
      let  arrayTwo = Object.values(arr.reduce((res, item) => {
        res[item.type] ? res[item.type].push(item) : res[item.type] = [item];
        return res;
      }, {}));
      return arrayTwo
    },
      getModelData(){ //echar按钮模板数据
        let url = '/graphTemplate/queryPageInfo'
        post(url,{}).then(res=>{
          this.pageLoading = false;
          if(res.status == 200){
            this.modelList=this.getArry(res.data.list)
          }
        }).catch(error=>{
          console.log('error:',error)
          this.pageLoading = false;
          this.$Modal.warning({
            title:'提示',
            content:'连接服务失败!'
          })
        })
      },
    }
  };
</script>
<style scoped lang='less'>
   @import "./index.less";
   .ivu-select-default{
     background: #00BFFF;
   }
   .sortBTN{
     position: absolute;
     right: 2px;
     top:3px;
   }
</style>

<template>
  <div >
     <Modal  :value='value' width='700' @on-visible-change='cancel' scrollable title='筛选条件'>
       <div class='wrap'>
         <div class='date'>
           <span class='title'>选择日期:</span>
             <section class='date_box' fix>
               <Tooltip :content="dateTypeContent.value=='self'?'静态时间':dateTypeContent.name" placement="right-start">
                <Button @click='()=>{showDateBoxFlag=true}'>{{dateTypeContent.value==''||dateTypeContent.value=='self'?dateTypeContent.name:startDate+' ~ '+endDate}}</Button> 
               </Tooltip>
               <ul v-if='showDateBoxFlag' @mouseleave="()=>{showDateBoxFlag=false}" class='dateul'>
                 <li v-for='(item,i) in dateTypeList' @click="selectDate(item)" :class='{half:item.half}'><span>{{item.name}}</span></li>
               </ul>
             </section>
             <DatePicker class='datePicker' :options="{disabledDate:disableStartDate}"  v-if="dateTypeContent.value=='self'" v-model='startDate' type="date" placeholder="开始时间" style='margin-left: 180px;'></DatePicker>
             <DatePicker class='datePicker' :options="{disabledDate:disableEndDate}" v-if="dateTypeContent.value=='self'" v-model='endDate' type="date" placeholder="结束时间" ></DatePicker>
        </div>
         <div class='condition'>
           <p class='addCondition'>
             <Button @click="addCondition('dimension')" type='primary' ><Icon type="md-add" /> 添加维度筛选条件</Button>
             <Button @click="addCondition('measure')" type='primary' ><Icon type="md-add" /> 添加量度筛选条件</Button>
           </p>
             <ul class='conditionListUl' @mouseleave="()=>{conditionOverIndex=-1}">
               <li v-for='(item,i) in conditionList' @mouseenter="()=>{conditionOverIndex=i}">
                 <Form :model="item" :rules='rules' :ref="'formValidate'+i">
                   <Row :gutter="6">
                     <Col span="6">
                       <FormItem prop="key" > 
                         <Select  @on-change='(value)=>{getEquStyle(value,i,item.category)}' v-model='item.key' v-if="item.category=='dimension'" clearable> 
                          <Option v-for='(item2,index) in dimensionList' :disabled='item2.disabled' :key='index' :value='item2.nameEn' :label='item2.name'>
                         <span><Icon type="ios-pulse" /></span><span style='margin-left: 15px;'>{{item2.name}}</span>
                          </Option>
                         </Select>
                         <Select  @on-change='(value)=>{getEquStyle(value,i,item.category)}' v-model='item.key' v-if="item.category=='measure'"> 
                          <Option v-for='(item2,index) in measureList' :disabled='item2.disabled' :key='index' :value='item2.nameEn' :label='item2.name'>
                             <span><Icon type="ios-stats-outline" /></span><span style='margin-left: 15px;'>{{item2.name}}</span>
                          </Option>
                         </Select>
                       </FormItem >
                     </Col>
                     <Col span="4">
                       <FormItem prop="type">
                         <Select v-model='item.type' fix >{{item.type}}
                            <Option v-for='(itemType,index) in  item.operationInfoVos' :key='index' :label='itemType.name' :value='itemType.nameEn'></Option>
                         </Select>
                       </FormItem >
                     </Col>
                     
                     <Col span="6">
                       <FormItem  prop="value1" v-if="item.category=='measure'"> 
                        <Input v-model.number='item.value1' placeholder="请输入数字类型"></Input> 
                       </FormItem >
                       <FormItem prop="value" v-if="item.category=='dimension'">
                        <Input v-model='item.value'></Input> 
                       </FormItem >
                     </Col>
                     <Col span="2">
                        <span @click="delectCondition(i)" class='close' v-if='i==conditionOverIndex'> <Icon type="md-close" size='18'/></span>
                     </Col>
                   </Row>
                 </Form>
               </li>
             </ul>
         </div>
       </div>
       <div slot='footer'>
       	<Button  @click='cancel'>取消</Button>
       	<Button type="primary" @click='sumit' :loading='loading'>提交</Button>
       </div>
    </Modal>
  </div>

</template>
<script>
  import { post } from '@/axios/fetch';
  import {formatDate,getLastday,getToday,getMonthStartDate,getNearStartDay,getWeekStartDate,getWeekEndDate,getLastWeekStartDate,
    getLastWeekEndDate,getMonthEndDate,getLastMonthStartDate,getLastMonthEndDate,getSomeDay} from '@/common/date';
  export default {
    props:['value','selectEventItem','chartActiveMsg','dimensionQueryList','measureQueryList'],
    data() {
      return {
        loading:false,
        startDate:getNearStartDay(-7),
        rules:{
          'key':[{required:true,trigger:'change',message:'请选择'}],
          'type':[{required:true,trigger:'change',message:'请输入'}],
          'value':[{required:true,trigger:'change',message:'请输入'}], //transform(value) {return value.toString()}
          'value1':[{type:'number',required:true,trigger:'change',message:'请输入数字'}],
        },
        endDate:getToday(),
        dimensionList:[],
        measureList:[],
        conditionList:[],
        showDateBoxFlag:false,
        conditionOverIndex:-1,
        dateTypeContent:{name:getNearStartDay(-7) + '~' + getToday() ,value:'near7',name:'最近7天'}, //默认最近七天
        dateTypeList:[
        {value:'self',name:'自定义时间',half:false},
        {value:'yestoday',name:'昨天',half:true},
        {value:'today',name:'今天',half:true},
        {value:'lastweek',name:'上周',half:true},
        {value:'thisweek',name:'本周',half:true},
        {value:'lastmonth',name:'上月',half:true},
        {value:'thismonth',name:'本月',half:true},
        {value:'near7',name:'最近7天',half:false},
        {value:'near30',name:'最近30天',half:false},
       ]
      }
    },
    mounted(){
      this.selectEvent(this.selectEventItem);
      this.initDate();
      this.initConditionData();
    },
     destroyed(){
      this.$emit('input',false)
    },
    methods: {
      initConditionData(){
        this.conditionList = this.chartActiveMsg.criteriaFieldDto==null?[]:JSON.parse(JSON.stringify(this.chartActiveMsg.criteriaFieldDto)) ; //将条件赋值
        this.conditionList.map((item,i)=>{
            item.value1 = JSON.parse(JSON.stringify(item.value))
        });
      },
      initDate(){
        this.startDate = this.chartActiveMsg.startDate?formatDate(this.chartActiveMsg.startDate):getNearStartDay(-7); //设置默认日期
        this.endDate = this.chartActiveMsg.endDate?formatDate(this.chartActiveMsg.endDate):getToday();
        this.dateTypeContent.value = this.chartActiveMsg.dateType;
        if(this.dateTypeContent.dateType!='self'){
          this.selectDate({value:this.chartActiveMsg.dateType})
        }
      },
      disableStartDate(data){
       let endDate = getSomeDay(this.endDate,0);
        return data > new Date(endDate);
      },
      disableEndDate(data){
        let startDate = getSomeDay(this.startDate,-1);
        return data < new Date(startDate);
      },
      getId(arr){
        if(arr.length<1){
          return ''
        }
        let idArr=arr.map((item)=>{
          return item.id
        }).toString();
        return idArr
      },
      sumit(){
        let condition=JSON.parse(JSON.stringify(this.conditionList));
         //表单验证
         let validateFlag = true;
         condition.map((item,i)=>{
          this.$refs[`formValidate${i}`][0].validate((valid)=>{
             validateFlag = validateFlag && valid
           })
          if(item.category == 'measure'){
            item.value = item.value1 +0
          }
          delete item.value1;
         })
         if(!validateFlag){
           return false;
         }
        condition.map((item,i)=>{ //将选项信息删除
          if(item.operationInfoVos){
            delete item.operationInfoVos
          }
        })
         let parent = this.$parent.$refs.parent.childNodes;
        let  params = {eventId:this.selectEventItem,dashboardId:this.$parent.$route.query.id,
           dimensionIds:this.getId(this.dimensionQueryList),measureIds:this.getId(this.measureQueryList),dateType:this.dateTypeContent.value,
           uuId:this.chartActiveMsg.uuId.toString(), graphTemplateId:this.chartActiveMsg.id,criteriaFieldDto:condition
         } 
         this.loading = true;
        post('/dashboard/event/insert/'+formatDate(this.startDate)+'/'+formatDate(this.endDate),{...params}).then((res)=>{
          this.loading = false;
          if(res&&res.code == 200) {
            setTimeout(()=>{
             this.$emit('getPageData');
             this.$Message.success('success');
             this.cancel();
           },100)
          }
        }).catch((err) => {
          this.loading = false;
          console.log('err',err);
        })
      },
      addCondition(type){
        this.conditionList.push({key:null,type:null,value:null,value1:null,category:type,operationInfoVos:[]}); //value用于demi value1用于measure
      },
      delectCondition(i){
        this.conditionList.splice(i,1);
      },
      selectEvent(eventId){ //根据选择的表名获取维度和度量
        if(eventId== ''||eventId== null){
          return false;
        }
        let url = '/event/info/factTableQuery/'+eventId
        post(url).then((res)=>{
          if(res.code == 200) {
            this.dimensionList = res.data.dimension;
            this.measureList = res.data.measure;
            this.disableItem();
          }
        }).catch(err => {
          console.log('err',err);
          this.$message({
            showClose: true,
            message: '系统错误！',
            type: 'error'
          });
        })
    },
    disableItem(){ //已选的选项不能重复选
      this.dimensionList.map(item=>{
        item.disabled = false;
        for(let a=0;a<this.conditionList.length;a++){
          if(this.conditionList[a].key == item.nameEn){
            item.disabled = true;
          }
        }
      });
      this.measureList.map(item2=>{
        item2.disabled = false;
        for(let b=0;b<this.conditionList.length;b++){
          if(this.conditionList[b].key == item2.nameEn){
            item2.disabled = true;
          }
        }
      });
    },
    getEquStyle(value,index,type){ 
      if(type == 'dimension'){
        this.dimensionList.map((item)=>{
         if(item.nameEn == value){
           this.conditionList[index].operationInfoVos = item.operationInfoVos
         }
        })
      }
      if(type == 'measure'){
        this.measureList.map((item)=>{
         if(item.nameEn == value){
           this.conditionList[index].operationInfoVos = item.operationInfoVos
         }
        })
      }
      this.disableItem();
    },
    cancel(){
      this.$emit('input',false);
    },
      selectDate(item){
        item
        if(item.value==null){ //针对新建的模板,默认获取最近7天的数据
          item = {value:'near7',name:'最近7天'}
        }
        this.dateTypeContent = item;
        switch(item.value){
          case 'yestoday':
            this.startDate = getLastday();
            this.endDate = getLastday();
            this.dateTypeContent.name = '昨天';
            break;
          case 'today':
            this.startDate = getToday();
            this.endDate = getToday();
            this.dateTypeContent.name = '今天';
            break;
          case 'lastweek':
            this.startDate = getWeekStartDate();
            this.endDate = getWeekEndDate();
            this.dateTypeContent.name = '上周';
            break;
          case 'thisweek':
            this.startDate = getWeekStartDate();
            this.endDate = getToday();
            this.dateTypeContent.name = '本周';
            break;
          case 'lastmonth':
            this.startDate = getLastMonthStartDate();
            this.endDate = getLastMonthEndDate();
            this.dateTypeContent.name = '上月';
            break;
          case 'thismonth':
            this.startDate = getMonthStartDate();
            this.endDate = getToday();
            this.dateTypeContent.name = '本月';
            break;
          case 'near7':
            this.startDate = getNearStartDay(-7);
            this.endDate = getToday();
            this.dateTypeContent.name = '最近7天';
            break;
          case 'near30':
            this.startDate = getNearStartDay(-30);
            this.endDate = getToday();
            this.dateTypeContent.name = '最近30天';
            break;
           case 'self':
            this.dateTypeContent.name = '自定义时间';
            break;
        }
        this.showDateBoxFlag = false;
      },
    }
  };
</script>
<style scoped lang="less">
.title{
  font-size: 14px;
  margin-right: 8px;
}
.date{
  position: relative;
  padding-left: 10px;
  height: 50px;
  line-height: 50px;
  .datePicker{
    margin-left: 10px;
    z-index: 999;
  }
  .datePicker:first-child{
    margin-left: 180px;
  }
  p{
    height:50px;
    line-height: 50px;
  }
  .dateTitle{
    display: inline-block;
    margin-right: 10px;
    font-size: 14px;
  }
}
.date_box{
  width: 180px;
  display: inline-block;
  position: absolute;
  z-index:888;
  background: #FFF;
  ul.dateul{
     width:100%;
     display: flex;
     flex-direction: row;
     flex-wrap: wrap;
    li{
      list-style: none;
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      span{
        width: 95%;
        display: inline-block;
        margin: 0 5px;
        height: 30px;
        line-height: 30px;
        color:dodgerblue ;
        background: #EFEFEF;
        border-radius: 2px;
        font-size: 14px;
      }
      span:hover{
        background: deepskyblue;
        color: #FFF;
      }
    }
    li.half{
      width: 50%;
    }
  }
}
.collection{
  height: 50px;
  line-height: 50px;
}
.condition{
  margin-top: 20px;
  p.addCondition span{
    font-size: 16px;
    color:dodgerblue;
    cursor: pointer;
  }
  p.addCondition span:hover{
    font-size: 16px;
    color:rgb(109,165,235);
  }
  ul.conditionListUl{
    margin-top: 15px;
    padding-left: 20px;
    padding-top: 5px;
    padding-bottom: 10px;
    li{
      list-style: none;
      position: relative;
      span.close{
        display: inline-block;
        cursor: pointer;
         height: 35px;
         line-height: 35px;
        width: 30px;
        position: absolute;
        right: 20px;
        text-align: center;
      }
    }
  }
}
</style>

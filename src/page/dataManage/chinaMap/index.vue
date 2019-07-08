<template>
  <div  ref='wrap'>
    <div ref='map' style="width: 100%;height:400px;border: 1px solid green;"> <!--width: 500px;height: 500px;-->
      111
    </div>
  </div>
</template>
<script>
  import echarts from "echarts";
  import axios from "axios";
  import { post } from '@/axios/fetch';
   import CityMap from "./city-map";
   import provinceMap from "./province-map";
  export default {
    data() {
      return {
        chart:null,
        option: {
          title: {
            text: "全国地图"
          },
          tooltip:{
            trigger:'item',
            formatter:function(value){  //鼠标滑过时显示设置
              return value.value;
            },
            backgroundColor:'#FFF',
            textStyle:{
              color:'blue',
              fontSize:12,
              padding:[6,10,6,10],
              height:30,
              lineHeight:30,
            },
          },
          series: [
            {
              type: "map",
              mapType: "china",
              selectedMode: "single",
              roam:true, //放大缩小
              label:{
                emphasis:{
                  show:true,
                },
                normal:{
                  show:true,
                },
              },
              data:[
                  {
                    name: "广东",
                    value: 60,
                    itemStyle: {
                     normal: {
                      areaColor: '#D9EDE1'
                      },
                   }
                },
                {
                    name: "北京",
                    value: 16,
                    itemStyle: {
                      normal: {
                          areaColor: '#D9EDE1'
                     }
                  }
                },
                {
                    name: "广西",
                    value: 108,
                    itemStyle: {
                      normal: {
                          areaColor: 'green'
                     }
                  }
                },
                 {
                    name: "深圳市",
                    value: 108,
                    itemStyle: {
                      normal: {
                          areaColor: 'green'
                     }
                  }
                },
                 {
                    name: "广州市",
                    value: 108,
                    itemStyle: {
                      normal: {
                          areaColor: 'green'
                     }
                  }
                },
               ]
            }
          ]
        }
      }
    },
    destroyed(){
    },
    mounted(){
        this.initChart();
        this.chart.on("mapselectchanged", this.onProvinceClick);
    },
    methods: {
      async initChart(){
        this.chart = echarts.init(this.$refs.map); 
        let mapJson = await axios.get( '/static/china.json' );    
         echarts.registerMap("china", mapJson.data);
         this.chart.setOption(this.option);
      },
       async onProvinceClick(e) {
      this.chart.showLoading();
      let name = e.batch[0].name;
      let pinyinName = provinceMap[name]
      let mapJson = await axios.get(     
          `/static/province/${pinyinName}.json`      
      );
      echarts.registerMap(pinyinName, mapJson.data);
      this.option.series[0].mapType = pinyinName;
      this.chart.setOption(this.option);
      this.chart.off("mapselectchanged", this.onProvinceClick);
      this.chart.hideLoading();
    },
    async onCityClick(e) {
      this.chart.showLoading();
      let name = e.batch[0].name;
      var cityCode = CityMap[name];
      let mapJson = await axios.get(
        `/static/citys/${cityCode}.json`
      );
      echarts.registerMap(cityCode, mapJson.data);
      this.option.series[0].mapType = cityCode;
      this.chart.setOption(this.option);
      this.chart.off("mapselectchanged", this.onCityClick);
      this.chart.hideLoading();
    }
    }
  };
</script>
<style scoped lang="less">
</style>

const  chartOption = {
          backgroundColor: '#09153D',
          title: {
            text: "",
            x: 'left',
            textStyle:{
              color:'gray',
              fontSize:18,
              fontWeight:500,

            }
          },
          tooltip: {
              trigger: 'axis',
              formatter:function(data,index){
                let temp='';
                data.map((item,index)=>{
                  temp = temp+item.seriesName +':'
                  if(Number(item.value)>=10000&&Number(item.value)<100000){
                    item.tipValue = (Number(item.value)/10000).toFixed(2) +'k'
                  }else if(Number(item.value)>=100000){
                    item.tipValue = (Number(item.value)/100000).toFixed(2) +'w'
                  }else{
                    item.tipValue =Number(item.value).toFixed(2)
                  }
                  if(index==2){
                    item.tipValue = `${(Number(item.value)*100).toFixed(2)}%`
                  }
                  temp = temp + item.tipValue + '<br/>'
                })
                return temp;
              },
              axisPointer: {
                  type: 'cross',
                  crossStyle: {
                      color: '#999'
                  }
              },
          },
          legend: {
               textStyle:{
                color:'#fff'
              },
              bottom:'5',
              left:'center',
              data:[,,'同比率']
          },
          xAxis:
              {
                  type: 'category',
                  data: [],
                  axisPointer: {
                      type: 'shadow'
                  },
                  axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff',
                        fontSize:'16'
                    }
                  },
                  splitLine: {
                      show: false,
                      //  改变轴线颜色
                      lineStyle: {
                          // 使用深浅的间隔色
                          // color: ['blue','green']
                      }
                  },
                  // x轴的颜色和宽度
                  axisLine:{
                      // lineStyle:{
                      //     color:'#fff',
                      //       width:1,   //这里是坐标轴的宽度,可以去掉
                      // }
                  }
              }
          ,
          yAxis: [
              {
                  type: 'value',
                  name: '销售额',
                  color:'#FFF',
                  axisLabel: {
                    formatter: (value,index)=>{
                      if(value>=10000&&value<100000){
                          return value/10000 +'k'
                      }else if(value>=100000){
                           return value/100000 +'w'
                      }else {
                        return value
                      }
                    },
                    textStyle: {
                      color:'#FFF'
                    },
                  },
              },
              {
                  type: 'value',
                  name: '同比率',
                  interval: 0.2,
                  axisLabel: {
                     formatter: '{value}%',
                      textStyle: {
                      color:'#FFF'
                    },
                  }
              }
          ],
          series: [
              {
                  name:'',
                  type:'bar',
                  data:[],
                  itemStyle:{
                    normal:{
                      color:'#EA7D58',
                    },
                  },
              },
              {
                  name:'',
                  type:'bar',
                  data:[],
                   itemStyle:{
                    normal:{
                      color:'#4A90E2',
                    },
                  },
              },
              {
                  name:'同比率',
                  type:'line',
                  yAxisIndex: 1,
                  data:[],
                  itemStyle:{
                    normal:{
                     color:'rgba(229,208,72,1)',
                    },
                  },
              }
          ]
      };
export default chartOption;

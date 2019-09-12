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
          trigger: "item",
          formatter: "{a} <br/>{b} : {d}%"
        },
        legend: {
          orient: "horizontal",
          x: "center",
          y: "bottom",
          data: [],
          textStyle:{
            color:'#fff'
          }
        },
        calculable: true,
        color:['rgba(10,58,108,1)', 'rgba(28,89,152,1)','rgba(65,133,189,1)','rgba(75,155,220,1)','rgba(116,184,239,1)','rgba(143,170,210,1)',
        ,'rgba(175,196,216,1)','rgba(251,204,183,1)','rgba(235,186,172,1)','rgba(217,144,140,1)','rgba(217,112,93,1)','rgba(202,78,67,1)','rgba(158,21,41,1)','rgba(222,222,222,1)'],

        series: [
          {
            type: "pie",
            radius: "55%",
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },
              normal: {
                label: {
                  show: false,
                  formatter: "{b} : ({d}%)"
                },
              }
            }
          }
        ]
      };
export default chartOption;

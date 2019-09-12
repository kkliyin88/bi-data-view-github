<template>
  <div  ref='wrap'>

     <div id="labelManage">
        <div id="main">
          <div class="flowchart-demo" id="flowchart-demo">
            <div class="window" id="flowchartWindow1">1  </div>
            <div class="window" id="flowchartWindow2">2  </div>
            <div class="window" id="flowchartWindow3">3  </div>
            <div class="window" id="flowchartWindow4">4   </div>
          </div>
        </div>
      </div>


  </div>
</template>
<script>
  // import 'https://cdn.jsdelivr.net/npm/jsplumb@2.8.0/dist/js/jsplumb.min.js';
  import {post} from '@/axios/fetch';

  export default {

    data() {
      return {

      }
    },
     mounted(){
      window.addEventListener('resize', this.getHeight);
      this.getHeight();
       this.jsPlumb();
    },
     destroyed(){
      window.removeEventListener('resize', this.getHeight)
    },
    methods: {
      getHeight(){ //设置页面高度
        this.pageHeight=window.innerHeight;
        this.$refs.wrap.style.height = this.pageHeight -100 + 'px'
      },
        jsPlumb(){
          jsPlumb.ready(function () {
            /*
           connect表示 建立连线
            source 起始节点
            target 目标节点
            endpoint  端点类型，形状
             */
            jsPlumb.connect({  //连线
              source: 'flowchartWindow1',
              target: 'flowchartWindow2',
              connector: ['Flowchart'], //贝塞尔：Bezier 90度：Flowchart  状态机:StateMachine 直线:Straight
              endpoint: 'Dot' // Dot(表示圆形断电)  Rectangle（方形原点）
            })

            jsPlumb.draggable('flowchartWindow1') //可以拖动
            jsPlumb.draggable('flowchartWindow2') //可以拖动

          })
        }

    }
  };
</script>
<style scoped lang="less">
  .flowchart-demo {
    width: 800px;
    height: 600px;
    border: 1px solid #000;
    position: relative;
  }
  .flowchart-demo .window {
    border: 1px solid #346789;
    box-shadow: 2px 2px 19px #aaa;
    -o-box-shadow: 2px 2px 19px #aaa;
    -webkit-box-shadow: 2px 2px 19px #aaa;
    -moz-box-shadow: 2px 2px 19px #aaa;
    -moz-border-radius: 0.5em;
    border-radius: 0.5em;
    opacity: 0.5;
    filter: alpha(opacity=80);
    text-align: center;
    position: absolute;
    background-color: #eeeeef;
    color: black;
    font-family: helvetica;
    font-size: 0.9em;
    line-height: 60px;
    width: 60px;
    height: 60px;
  }
  .flowchart-demo .window:hover {
    box-shadow: 2px 2px 19px #444;
    -o-box-shadow: 2px 2px 19px #444;
    -webkit-box-shadow: 2px 2px 19px #444;
    -moz-box-shadow: 2px 2px 19px #444;
    opacity: 0.6;
    filter: alpha(opacity=60);
  }
  .flowchart-demo .active {
    border: 1px dotted green;
  }
  .flowchart-demo .hover {
    border: 1px dotted red;
  }

  #flowchartWindow1 {
    top: 34em;
    left: 5em;
  }
  #flowchartWindow2 {
    top: 7em;
    left: 36em;
  }
  #flowchartWindow3 {
    top: 27em;
    left: 48em;
  }
  #flowchartWindow4 {
    top: 23em;
    left: 22em;
  }
</style>

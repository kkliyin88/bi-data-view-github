<template>
  <header class="head">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="getCollapse">
      <Icon type="md-apps" />
    </div>
    <div class="logo">{{$t('h.system')}}</div>
    <div class="top-nav">
      <!--退出or设置-->
      <Dropdown style="margin-left: 20px">
        <span>
           <Icon type="ios-settings-outline" :size='30' />
        </span>
        <DropdownMenu slot="list">
            <DropdownItem>关于我</DropdownItem>
            <DropdownItem>设置</DropdownItem>
            <DropdownItem>退出</DropdownItem>
        </DropdownMenu>
     </Dropdown>

      <template>
        <div class="full" @click="changeLangEvent()">
          <span class="lan">{{language}}</span>
        </div>
      </template>

    </div>
  </header>
</template>
<script>
  import {mapState,mapActions} from 'vuex';
  import {getCompany} from '../../axios/api'
    export default {
        name: 'Head',
        data () {
            return {
              language: localStorage.getItem("lang") || "EN"
            }
        },
      mounted(){

      },
      computed: {
        ...mapState({
          companyValue:state=>state.companyValue,
        }),
      },
      methods:{
        ...mapActions(["getCollapse"]),//简写
         changeLangEvent() {
              // this.baseLan()
              if (this.language == "EN") {
                localStorage.setItem("locale", "zh");
                this.$i18n.locale = localStorage.getItem("locale");
                this.$message({
                  message: "切换为中文！",
                  type: "success"
                });
                localStorage.setItem("lang", "ZH");
                this.language = "ZH";
                location.reload();
              } else if (this.language == "ZH") {
                localStorage.setItem("locale", "en");
                this.$i18n.locale = localStorage.getItem("locale");
                this.$message({
                  message: "Switch to English!",
                  type: "success"
                });
                localStorage.setItem("lang", "EN");
                this.language = "EN";
                location.reload();
              }
          }
      }
    }
</script>
<style scoped lang='less'>
  /*.head{
    background: #FFFFFF;
  }*/
  .lan {
    display: inline-block;
    cursor: pointer;
    width: 22px;
    height: 22px;
    font-size: 12px;
    line-height: 22px;
    text-align: center;
    background: #fff;
    border-radius: 50%;
    color: #24292e;
  }
</style>

<template>
  <div ref="wrap" class="wrap">
    <div>
        <Form :model="query" :label-width="60" inline>
          <FormItem label="开始月份">
            <DatePicker
              size="small"
              transfer
              v-model="query.beginYearMonth"
              type="month"
              placeholder="选择年月"
            ></DatePicker>
          </FormItem>
          <FormItem label="结束月份">
            <DatePicker
              size="small"
              transfer
              v-model="query.endYearMonth"
              type="month"
              placeholder="选择年月"
            ></DatePicker>
          </FormItem>
          <FormItem label="办事处">
            <Select
              v-model="query.orgNo"
              transfer
              size="small"
              @on-change="getDealerNoList(query.orgNo)"
            >
              <Option
                v-for="item in orgList"
                :value="item.orgNo"
                :key="item.orgNo"
                :label="item.orgName"
              ></Option>
              {{}}
            </Select>
          </FormItem>
          <FormItem label="经销商" v-if="query.orgNo">
            <Select
              v-model="query.dealerNo"
              transfer
              size="small"
              @on-change="getMarketNoList(query.dealerNo)"
            >
              <Option
                v-for="item in dealerList"
                :value="item.dealerNo"
                :key="item.dealerNo"
                :label="item.dealerName"
              ></Option>
              {{}}
            </Select>
          </FormItem>
          <FormItem label="零售商" v-if="query.dealerNo">
            <Select
              v-model="query.marketNo"
              transfer
              size="small"
              @on-change="getStoreNoList(query.marketNo)"
            >
              <Option
                v-for="item in marketList"
                :value="item.marketNo"
                :key="item.marketNo"
                :label="item.marketName"
              ></Option>
              {{}}
            </Select>
          </FormItem>
          <FormItem label="门店" v-if="query.marketNo">
            <Select v-model="query.storeNo" transfer size="small">
              <Option
                v-for="item in storeList"
                :value="item.storeNo"
                :key="item.storeNo"
                :label="item.storeName"
              ></Option>
              {{}}
            </Select>
          </FormItem>
          <FormItem label="角色" :label-width="40" style="width: 160px;">
            <Select v-model="query.storeNo" transfer size="small">
              <Option
                v-for="item in roleList"
                :value="item.roleId"
                :key="item.roleId"
                :label="item.roleName"
              ></Option>
              {{}}
            </Select>
          </FormItem>
          <FormItem label="人员" :label-width="40" style="width: 160px;">
            <Input size="small" v-model="query.staffName"></Input>
          </FormItem>
          <FormItem :label-width="0">
            <Button size="small" @click="search" :loading="loading">查询</Button>
          </FormItem>
        </Form>
    </div>
    <div class="adddd">
      <Table :data="pageData1" :loading="loading" :columns="columns1" size="small"></Table>
    </div>
  </div>
</template>
<script>
import { post, get } from "@/axios/fetch";
export default {

  data() {
    return {
      query: {
        beginYearMonth: undefined,
        endYearMonth: undefined,
        orgNo: undefined,
        dealerNo: undefined,
        marketNo: undefined,
        storeNo: undefined,
        roleId: undefined,
        staffName: undefined
      },
      pageHeight: 200,
      loading: false,
      orgList: [],
      dealerList: [],
      marketList: [],
      storeList: [],
      roleList: [],
      pageData: [],
      columns: [
        {
          type: "index",
          align: "center",
          minWidth: 80
        },
        {
          title: "姓名",
          key: "staffName",
          align: "center",
          minWidth: 100
        },
        {
          title: "角色",
          key: "roleName",
          align: "center",
          minWidth: 100
        }
      ],
      columns1: [],
      pageData1: [{}]
    };
  },
  mounted() {
    this.getOrgNoList();
    this.getDealerNoList(this.query.orgNo);
    this.getRoleList();
    this.test();
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
  methods: {
    test() {
      for (let i = 0; i < 20; i++) {
        this.columns1.push({
          title: `test${i}`,
          key: `name${i}`,
          align: "center",
          minWidth: 100
        });
        this.pageData1[0][`name${i}`] = i;
      }
    },
    search() {
      let url = "/kasm/staffReport/findStaffSaleReport";
      let params = JSON.parse(JSON.stringify(this.query));
      if (params.beginYearMonth) {
        let begin = new Date(params.beginYearMonth);
        params.beginYearMonth =
          begin.getFullYear() + "-" + (begin.getMonth() + 1);
      }
      if (params.endYearMonth) {
        let end = new Date(params.endYearMonth);
        params.endYearMonth = end.getFullYear() + "-" + (end.getMonth() + 1);
      }
      this.loading = true;
      post(url, {})
        .then(res => {
          if (res.code !== 200) {
            this.$Modal.warning({
              title: "提示",
              content: res.message
            });
            this.loading = false;
            return;
          }
          // this.pageData = res.data;

          setTimeout(() => {
            this.makeColumns(res.data);
          }, 1);
          setTimeout(() => {
            this.makePageData(res.data);
          });
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          console.log("error", error);
          this.$Modal.warning({
            title: "提示",
            content: "连接服务失败!"
          });
        });
    },
    makePageData(arr) {
      arr.map(item => {
        let temp = {};
        item.staffReportVoList.map(item2 => {
          temp[`posSale${item2.yearMonth}`] = item2.posSale;
          temp[`saleTarget${item2.yearMonth}`] = item2.saleTarget;
          temp[`ratio${item2.yearMonth}`] = item2.ratio;
          temp.roleName = item2.roleName;
          temp.staffName = item2.staffName;
        });
        item.data = temp;
      });
      arr.map(item => {
        this.pageData.push(item.data);
      });
      console.log("pageData", this.pageData);
    },
    makeColumns(arr) {
      let columnsOri = [];
      let length = 0;
      arr.map(item => {
        if (item.staffReportVoList.length > length) {
          length = item.staffReportVoList.length;
          columnsOri = item.staffReportVoList;
        }
      });
      columnsOri.map(item => {
        this.columns.push({
          title: item.yearMonth,
          key: item.yearMonth,
          align: "center",
          // minWidth:200,
          children: [
            {
              title: "实际",
              key: `posSale${item.yearMonth}`,
              align: "center",
              minWidth: 80
            },
            {
              title: "达成",
              key: `saleTarget${item.yearMonth}`,
              align: "center",
              minWidth: 80
            },
            {
              title: "达成率",
              key: `ratio${item.yearMonth}`,
              align: "center",
              minWidth: 80
            }
          ]
        });
      });
    },
    getRoleList() {
      let url = "/kasm/staffReport/findStaffRoleList";
      get(url)
        .then(res => {
          if (res.code !== 200) {
            this.$Modal.warning({
              title: "提示",
              content: res.message
            });
            return;
          }
          this.roleList = res.data;
        })
        .catch(error => {
          console.log("error", error);
          this.$Modal.warning({
            title: "提示",
            content: "连接服务失败!"
          });
        });
    },
    getOrgNoList() {
      //获取办事处列表
      let url = "/kasm/org/findOrgnizationList";
      get(url)
        .then(res => {
          if (res.code !== 200) {
            this.$Modal.warning({
              title: "提示",
              content: res.message
            });
            return;
          }
          this.orgList = res.data;
          this.query.dealerNo = undefined;
          this.query.marketNo = undefined;
          this.query.storeNo = undefined;
        })
        .catch(error => {
          console.log("error", error);
          this.$Modal.warning({
            title: "提示",
            content: "连接服务失败!"
          });
        });
    },
    getDealerNoList(code) {
      //获取经销商列表
      let url = "/kasm/org/findDealerList?orgNo=" + code;
      get(url)
        .then(res => {
          console.log("res", res);
          if (res.code !== 200) {
            this.$Modal.warning({
              title: "提示",
              content: res.message
            });
            return;
          }
          this.dealerList = res.data;
          this.query.marketNo = undefined;
          this.query.storeNo = undefined;
        })
        .catch(error => {
          console.log("error", error);
          this.$Modal.warning({
            title: "提示",
            content: "连接服务失败!"
          });
        });
    },
    getMarketNoList(code) {
      let url = "/kasm/org/findMarketList?dealerNo=" + code;
      get(url)
        .then(res => {
          console.log("res", res);
          if (res.code !== 200) {
            this.$Modal.warning({
              title: "提示",
              content: res.message
            });
            return;
          }
          this.marketList = res.data;
        })
        .catch(error => {
          console.log("error", error);
          this.$Modal.warning({
            title: "提示",
            content: "连接服务失败!"
          });
        });
    },
    getStoreNoList(code) {
      let url = "/kasm/org/findStoreList?marketNo =" + code;
      get(url)
        .then(res => {
          console.log("res", res);
          if (res.code !== 200) {
            this.$Modal.warning({
              title: "提示",
              content: res.message
            });
            return;
          }
          this.storeList = res.data;
          this.query.storeNo = undefined;
        })
        .catch(error => {
          console.log("error", error);
          this.$Modal.warning({
            title: "提示",
            content: "连接服务失败!"
          });
        });
    },

    getOrgList() {}
  }
};
</script>
<style scoped lang="less">
.pagesize_box {
  position: absolute;
  bottom: 10px;
}
.wrap{
  overflow: hidden;
}
</style>

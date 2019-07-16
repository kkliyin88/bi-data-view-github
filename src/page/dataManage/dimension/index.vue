<template>
  <Table :columns="columns1" :data="data1" border></Table>
</template>
<script>
export default {
  data() {
    return {
      columns1: [
        {
          width: "200",
          align: "center",
          title: "物品名称",
          ellipsis: true,
          key: "name"
        },
        {
          width: "100",
          align: "center",
          title: "数量",
          ellipsis: true,
          key: "purchaseAmount"
        },
        {
          width: "166",
          align: "center",
          title: "lyy369",
          ellipsis: true,
          key: "supplier_11113173785",
          children: [
            {
              width: "100",
              align: "center",
              title: "单价(元)",
              ellipsis: true,
              key: "quoteUnitPrice_11113173785"
            },
            {
              width: "100",
              align: "center",
              title: "总计(元)",
              ellipsis: true,
              key: "quoteTotalPrice_11113173785"
            }
          ]
        },
        {
          width: "166",
          align: "center",
          title: "私人定制",
          ellipsis: true,
          key: "supplier_11113173838",
          children: [
            {
              width: "100",
              align: "center",
              title: "单价(元)",
              ellipsis: true,
              key: "quoteUnitPrice_11113173838"
            },
            {
              width: "100",
              align: "center",
              title: "总计(元)",
              ellipsis: true,
              key: "quoteTotalPrice_11113173838"
            }
          ]
        }
      ],
      data1: [
        {
          name: "手动添加",

          purchaseAmount: "9887.00",

          quoteTotalPrice_11113173785: "494350.00",

          supplierId_11113173785: "11113173785",

          quoteAmount_11113173785: "9887.0000",

          quoteUnitPrice_11113173785: "50.0000",

          quoteTotalPrice_11113173838: "988700.00",

          supplierId_11113173838: "11113173838",

          quoteAmount_11113173838: "9887.0000",

          quoteUnitPrice_11113173838: "100.0000"
        },

        {
          name: "2018年7月9日",

          purchaseAmount: "1.00",

          quoteTotalPrice_11113173785: "50.00",

          supplierId_11113173785: "11113173785",

          quoteAmount_11113173785: "1.0000",

          quoteUnitPrice_11113173785: "50.0000",

          quoteTotalPrice_11113173838: "100.00",

          supplierId_11113173838: "11113173838",

          quoteAmount_11113173838: "1.0000",

          quoteUnitPrice_11113173838: "100.0000"
        },

        {
          name: " 中国移动取消流量“漫游”费",

          purchaseAmount: "563.00",

          quoteTotalPrice_11113173785: "28150.00",

          supplierId_11113173785: "11113173785",

          quoteAmount_11113173785: "563.0000",

          quoteUnitPrice_11113173785: "50.0000"
        },

        {
          name: " 中国移动取消流量“漫游”费",

          purchaseAmount: "23.00",

          quoteTotalPrice_11113173785: "1150.00",

          supplierId_11113173785: "11113173785",

          quoteAmount_11113173785: "23.0000",

          quoteUnitPrice_11113173785: "50.0000",

          quoteTotalPrice_11113173838: "2300.00",

          supplierId_11113173838: "11113173838",

          quoteAmount_11113173838: "23.0000",

          quoteUnitPrice_11113173838: "100.0000"
        },
        {
          // 每一条，表示有一行

          total: "合计", // 展示的数据

          key: "total", // 表头的key

          align: "center",

          ellipsis: true,

          colspan: "2", // 需要计算合并列的个数

          tableBody: [
            // tableBody.length 表示有多少个值

            {
              total_11113173785: "523700.00",

              key: "total_11113173785",

              colspan: "2",

              align: "center",

              ellipsis: true
            },

            {
              total_11113173838: "991100.00",

              key: "total_11113173838",

              colspan: "2",

              align: "center",

              ellipsis: true
            }
          ]
        }
      ]
    };
  }
};
</script>

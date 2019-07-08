/*****
 * 获取数据get + 对应路由名称
 * 向后台传数据 store + 对应路由名称
 * 驼峰命名
 * *****/


import { fetch } from "./fetch"; //引用fetch.js
import api from './url'; //引用url.js

//查看用户
export const lookOption = (shopCode,groupName) => fetch({
  url: api.Hallowmas,
  method: 'post',
  params:{
    shopCode:shopCode,
    groupName:groupName
  }
});
//查询仪表
export const meterQuery = (pageNum,pageSize) => fetch({
  url: api.MeterQuery,
  method: 'post',
  params:{
    pageNum:pageNum,
    pageSize:pageSize
  }
});

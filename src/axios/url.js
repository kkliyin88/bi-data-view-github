
var baseUrl = process.env.API_ROOT;//dev和build环境这个变量(域名)不一样

export default {
  //接口配置
  Hallowmas:baseUrl+'/mock/68/mpc/commoGroup/query',
  //仪表查询
  MeterQuery:baseUrl+'/dashboard/info/queryPageInfo',
}

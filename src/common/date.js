/**
 * 获取本周、本季度、本月、上月的开始日期、结束日期
 */
var now = new Date(); //当前日期
var nowDayOfWeek = now.getDay(); //今天本周的第几天
var nowDay = now.getDate(); //当前日
var nowMonth = now.getMonth(); //当前月
var nowYear = now.getYear(); //当前年
nowYear += (nowYear < 2000) ? 1900 : 0; //
var lastMonthDate = new Date(); //上月日期
lastMonthDate.setDate(1);
lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
var lastYear = lastMonthDate.getYear();
var lastMonth = lastMonthDate.getMonth();
//格式化日期：yyyy-MM-dd

// formatDate getLastDate getMonthDays getWeekStartDate getWeekEndDate 
// getLastWeekStartDate getLastWeekEndDate getMonthEndDate getMonthEndDate getLastMonthStartDate getLastMonthEndDate
export function formatDate(d) {
    let date=new Date(d)
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();
    if (mymonth < 10) {
        mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
        myweekday = "0" + myweekday;
    }
    let ddate = (myyear + "-" + mymonth + "-" + myweekday).toString();
    return  ddate
}
//获取某个日期的某天,如2019/5/21的前一天
export function getSomeDay(date,num){
  let d = new Date(date).getTime();
  let n = num*86400000;
  let newdate = d + n;
  return formatDate(new Date(newdate))
} 

export function getNearStartDay(num){
  let today = new Date().getTime();
  let s = num*3600*24*1000;
  let nearDay = today+s;
  return formatDate(new Date(nearDay))
} 
//获取昨天日期
export function getLastday(){
  let lastDay = new Date(nowYear,nowMonth,nowDay-1)
  return formatDate(lastDay)
}
export function getToday(){
  let today = new Date(nowYear,nowMonth,nowDay)
  return formatDate(today)
}

//获得某月的天数
export function getMonthDays(myMonth) {
    let  monthStartDate = new Date(nowYear, myMonth, 1);
    let monthEndDate = new Date(nowYear, myMonth + 1, 1);
    let  days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
    return days;
}

//获得本季度的开始月份
export function getQuarterStartMonth() {
    let quarterStartMonth = 0;
    if (nowMonth < 3) {
        quarterStartMonth = 0;
    }
    if (2 < nowMonth && nowMonth < 6) {
        quarterStartMonth = 3;
    }
    if (5 < nowMonth && nowMonth < 9) {
        quarterStartMonth = 6;
    }
    if (nowMonth > 8) {
        quarterStartMonth = 9;
    }
    return quarterStartMonth;
}

//获得本周的开始日期
export function getWeekStartDate() {
    let  weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
    return formatDate(weekStartDate);
}
//获得本周的结束日期
export function getWeekEndDate() {
    let weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
    return formatDate(weekEndDate);
}
//获得上周的开始日期
export function getLastWeekStartDate() {
    let weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 7);
    return formatDate(weekStartDate);
}
//获得上周的结束日期
export function getLastWeekEndDate() {
    let weekEndDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 1);
    return formatDate(weekEndDate);
}
//获得本月的开始日期
export function getMonthStartDate() {
    let monthStartDate = new Date(nowYear, nowMonth, 1);
    return formatDate(monthStartDate);
}
//获得本月的结束日期
export function getMonthEndDate() {
    let monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
    return formatDate(monthEndDate);
}
//获得上月开始时间
export function getLastMonthStartDate() {
    let lastMonthStartDate = new Date(nowYear, lastMonth, 1);
    return formatDate(lastMonthStartDate);
}
//获得上月结束时间
export function getLastMonthEndDate() {
    let lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
    return formatDate(lastMonthEndDate);
}
//获得本季度的开始日期
export function getQuarterStartDate() {
    let quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1);
    return formatDate(quarterStartDate);
}
//或的本季度的结束日期
export function getQuarterEndDate() {
    let quarterEndMonth = getQuarterStartMonth() + 2;
    let quarterStartDate = new Date(nowYear, quarterEndMonth,
            getMonthDays(quarterEndMonth));
    return formatDate(quarterStartDate);
} 



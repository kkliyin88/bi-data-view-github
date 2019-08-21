
import axios from 'axios';//引入axios
import baseUrl from './baseUrl';//引入axios
//设置token
//axios.defaults.headers.post['Content-type'] = "application/json";
axios.defaults.headers.common['token'] = "afsd20190425";//获取token 每次访问接口都带

export function fetch(options){
  return axios(options);
}

export function post(path,data,options={}){
  let pathIsJson = /\.json$/.test(path);
  if(pathIsJson){
    return get(path,data,options)
  }
  if(path.indexOf('http://') == -1){
    path = baseUrl + path;
  }
  return new Promise((resolve,reject)=>{
    axios.post(path,data,options).then((res)=>{
      resolve(res.data);
    }).catch((err)=>{
      reject(err);
      console.log(err,err);
    })
  }).catch((err)=>{
      console.log(err,err);
    })
}

export function get(path,data,options={}){

let pathIsJson = /\.json$/.test(path);
  if(path.indexOf('http://') == -1 && !pathIsJson){
    path = baseUrl + path;
  }
  return new Promise(function(resolve,reject){
    axios.get(path,data,options).then((res)=>{
      resolve(res.data);
    }).catch((err)=>{
      reject(err);
      console.log(err,err);
    })
  }).catch((err)=>{
     console.log(err,err);
    })
}

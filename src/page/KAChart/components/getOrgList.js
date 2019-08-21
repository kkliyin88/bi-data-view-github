 import { post,get } from "@/axios/fetch";
 export function getOrgNoList(arr){  //获取办事处列表
      let url ='/kasm/org/findOrgnizationList';
      get(url).then(res=>{
          if(res.code!==200){
              this.$Modal.warning({
                  title:'提示',
                  content:res.message
                })
              return
          }
         console.log('res',res.data)
       return res.data;
      }).catch(error=>{
         console.log('error',error)
        this.$Modal.warning({
          title:'提示',
          content:'连接服务失败!'
        })
      })
    }
export function getDealerNoList(code){  //获取经销商列表
    let url ='/kasm/org/findDealerList?orgNo=' + code
    get(url).then(res=>{
        if(res.code!==200){
            this.$Modal.warning({
                title:'提示',
                content:res.message
              })
            return
        }
      return res.data;
    }).catch(error=>{
       console.log('error',error)
      this.$Modal.warning({
        title:'提示',
        content:'连接服务失败!'
      })
    })
  }
export function getStoreNoList(code){
  let url ='/kasm/org/findMarketList?dealerNo=' + code;
  get(url).then(res=>{
      if(res.code!==200){
          this.$Modal.warning({
              title:'提示',
              content:res.message
            })
          return
      }
     return res.data;
  }).catch(error=>{
     console.log('error',error)
    this.$Modal.warning({
      title:'提示',
      content:'连接服务失败!'
    })
  })
}

//引入axios
import axios from 'axios'
import router from './../../router'


let cancel ,promiseArr = {}
const CancelToken = axios.CancelToken;
//请求拦截器
axios.interceptors.request.use(config => {
    //发起请求时，取消掉当前正在进行的相同请求
    // if (promiseArr[config.url]) {
    //     promiseArr[config.url]('操作取消')
    //     promiseArr[config.url] = cancel
    // } else {
    //     promiseArr[config.url] = cancel
    // }
    // config.headers['Content-Type'] = 'application/json; charset=utf-8'
      return config
}, error => {
    return Promise.reject(error)
})

//响应拦截器即异常处理
axios.interceptors.response.use(response => {
    return response
}, err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '错误请求'
          break;
        case 401:
          err.message = '未授权，请重新登录'
          // router.push({path: '/login'});
          break;
        case 403:
          err.message = '拒绝访问'
          break;
        case 404:
          err.message = '请求错误,未找到该资源'
          break;
        case 405:
          err.message = '请求方法未允许'
          break;
        case 408:
          err.message = '请求超时'
          break;
        case 500:
          err.message = '服务器端出错'
          break;
        case 501:
          err.message = '网络未实现'
          break;
        case 502:
          err.message = '网络错误'
          break;
        case 503:
          err.message = '服务不可用'
          break;
        case 504:
          err.message = '网络超时'
          break;
        case 505:
          err.message = 'http版本不支持该请求'
          break;
        default:
          err.message = `连接错误${err.response.status}`
      }
    } else {
      err.message = "连接到服务器失败"
    }
    console.log(err.message)
    return Promise.resolve(err.response)
})

const getSessionStorage = function(){
  if (!sessionStorage.getItem('access_token')) {
    return ''
  }
  return sessionStorage.getItem('access_token');
}

const stuGetSessionStorage = function(){
  if (!sessionStorage.getItem('access_token')) {
    return ''
  }
  return sessionStorage.getItem('access_token');
}

axios.defaults.baseURL = ''
//设置默认请求头
axios.defaults.headers = {
  'X-Requested-With': 'XMLHttpRequest',
}
axios.defaults.timeout = 10000



const get = function (url,param) {
      return new Promise((resolve,reject) => {
        axios({
          method: 'get',
          url,
          headers:{'Authorization':'Bearer '+getSessionStorage()},
          params: param,
          cancelToken: new CancelToken(c => {
            cancel = c
          })
        }).then(res => {
          resolve(res.data)
        })
      })
    };
  //post请求
  const post = function (url,param) {
    return new Promise((resolve,reject) => {
      axios({
        method: 'post',
        url,
        headers:{'Authorization':'Bearer '+getSessionStorage()},
        params: param,
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res.data)
      })
    })
   }

  //download
  const download = function (url,param) {
    return new Promise((resolve,reject) => {
      axios({
        method: 'get',
        url,
        headers:{'Authorization':'Bearer '+getSessionStorage()},
        params: param,
        //responseType:'blob',
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res.data)
      })
    })
   }

  const download1 = function (url,data) {
    return new Promise((resolve,reject) => {
      axios({
        method: 'post',
        url,
        data: data,
        responseType:'blob',
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res.data)
      })
    })
   }

   const download2 = function (url,data) {
    return new Promise((resolve,reject) => {
      axios({
        method: 'post',
        headers:{'Authorization':'Bearer '+getSessionStorage()},
        url,
        data: data,
        responseType:'blob',
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res.data)
      })
    })
   }

   const resBody = function (method,url,data) {
    return new Promise((resolve,reject) => {
      axios({
        method: method,
        url,
        headers:{'Authorization':'Bearer '+getSessionStorage(),'Content-Type':'application/json; charset=utf-8'},
        data: data,
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res.data)
      })
    })
   }

    const resBody1 = function (method,url,data) {
    return new Promise((resolve,reject) => {
      axios({
        method: method,
        url,

        headers:{'Authorization':'Bearer '+getSessionStorage(),'Content-Type':'application/json; charset=utf-8'},
        data: data,
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res.data)
      })
    })
   }

   const resBody2 = function (method,url,data) {
    return new Promise((resolve,reject) => {
      axios({
        method: method,
        url,
        data: data,
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res.data)
      })
    })
   }

  //res请求
  const res1 = function (method,url,param) {
    return new Promise((resolve,reject) => {
      axios({
        method: method,
        url,
        headers:{'Authorization':'Bearer '+getSessionStorage(),'Content-Type':'application/json; charset=utf-8'},
        params: param,
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res.data)
      })
    })
   }

    //res请求
  const res = function (method,url,param) {
    return new Promise((resolve,reject) => {
      axios({
        method: method,
        url,

        headers:{'Authorization':'Bearer '+getSessionStorage(),'Content-Type':'application/json; charset=utf-8'},
        params: param,
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res.data)
      })
    })
   }

   const res2 = function (method,url,param) {
    return new Promise((resolve,reject) => {
      axios({
        method: method,
        url,
        params: param,
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res.data)
      })
    })
   }





   const stuGet = function (url,param) {
    return new Promise((resolve,reject) => {
      axios({
        method: 'get',
        url,
        headers:{'Authorization':'Bearer '+stuGetSessionStorage()},
        params: param,
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res.data)
      })
    })
  };
//post请求
const stuPost = function (url,param) {
  return new Promise((resolve,reject) => {
    axios({
      method: 'post',
      url,
      headers:{'Authorization':'Bearer '+stuGetSessionStorage()},
      params: param,
      cancelToken: new CancelToken(c => {
        cancel = c
      })
    }).then(res => {
      resolve(res.data)
    })
  })
 }


 const stuResBody = function (method,url,data) {
  return new Promise((resolve,reject) => {
    axios({
      method: method,
      url,
      headers:{'Authorization':'Bearer '+stuGetSessionStorage(),'Content-Type':'application/json; charset=utf-8'},
      data: data,
      cancelToken: new CancelToken(c => {
        cancel = c
      })
    }).then(res => {
      resolve(res.data)
    })
  })
 }

  const stuResBody1 = function (method,url,data) {
  return new Promise((resolve,reject) => {
    axios({
      method: method,
      url,
      data: data,
      cancelToken: new CancelToken(c => {
        cancel = c
      })
    }).then(res => {
      resolve(res.data)
    })
  })
 }

//res请求
const stuRes1 = function (method,url,param) {
  return new Promise((resolve,reject) => {
    axios({
      method: method,
      url,
      headers:{'Authorization':'Bearer '+stuGetSessionStorage(),'Content-Type':'application/json; charset=utf-8'},
      params: param,
      cancelToken: new CancelToken(c => {
        cancel = c
      })
    }).then(res => {
      resolve(res.data)
    })
  })
 }

  //res请求
const stuRes = function (method,url,param) {
  return new Promise((resolve,reject) => {
    axios({
      method: method,
      url,
      params: param,
      cancelToken: new CancelToken(c => {
        cancel = c
      })
    }).then(res => {
      resolve(res.data)
    })
  })
 }

 //download
const stuDownload = function (url,param) {
  return new Promise((resolve,reject) => {
    axios({
      method: 'get',
      url,
      // headers:{'Authorization':'Bearer '+getSessionStorage()},
      params: param,
      //responseType:'blob',
      cancelToken: new CancelToken(c => {
        cancel = c
      })
    }).then(res => {
      resolve(res.data)
    })
  })
 }   

const uploadImg = function (url, data) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url,
      headers: { 'Content-Type': 'multipart/form-data' },
      data: data,
      cancelToken: new CancelToken(c => {
        cancel = c
      })
    }).then(res => {
      resolve(res.data)
    })
  })
}  
export  {
  //get请求
  get,post,resBody,resBody1,resBody2,res,res1,res2,download,download1,download2,stuGet,stuPost,stuResBody,stuResBody1,stuRes,stuRes1,stuDownload,uploadImg
    
  }
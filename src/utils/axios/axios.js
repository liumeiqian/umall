// 引入核心仓库
import axios from 'axios'

import router from '../../router'

// 重新创建一个接口
const http = axios.create({
  baseURL: '/api'
})

// 请求拦截
http.interceptors.request.use(req => {
  let userInfo = sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : {}
  req.headers.authorization = userInfo.token
  return req
})
// 响应拦截
http.interceptors.response.use(res => {
  if (res.data.code == 500) {
    alert(res.data.msg)
    router.push('/login')
    return res
  } else if (res.data.code == 403) {
    alert(res.data.msg)
    router.push('/login')
    return res
  }else {
    return res
  }
})

export default http
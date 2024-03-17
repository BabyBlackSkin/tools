import axios from 'axios'
import qs from 'qs'
import merge from 'lodash/merge'
import { Message } from 'element-ui'

const http = axios.create({
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  const res = response.data
  // E00000 请求成功
  if (res.code === 200) {
    return res
  }
  Message({
    message: res.msg,
    type: 'error',
    duration: 1.5 * 1000,
    customClass: 'element-error-message-zindex'
  })
  return Promise.reject(res)
}, error => {
  return Promise.reject(res)
})

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = (actionName) => {
  return process.env.VUE_APP_BASE_API + actionName;
}

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefultParams = true) => {
  var defaults = {
    't': new Date().getTime()
  }
  let tempParams = Object.assign(
    {
      // 将当前页的属性名转化为pageNum，默认为：1
      pageNum: params.currentPage ? params.currentPage : 1,
      // 将每页个数的属性名转换为pageSize，默认为：10，最大为100
      pageSize: params.pageSize && params.pageSize < 1000 ? params.pageSize : 10
    },
    params
  )
  return openDefultParams ? merge(defaults, tempParams) : tempParams
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
  var defaults = {
    't': new Date().getTime()
  }
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

export default http

/**
 * 封装的get
 * @param {*} url
 * @param {*} params
 * @param config
 */
export function get (url, params = {}, config) {
  // FIXME 后续优化
  url = http.adornUrl(url)
  return new Promise((resolve, reject) => {
    // console.log("执行get", url)
    let requestConfig = config
    if (config) {
      requestConfig.params = params
    } else {
      requestConfig = {
        params: http.adornParams(params)
      }
    }
    http.get(url, requestConfig)
      .then(response => {
        // console.log("success", response)
        resolve(response.data)
      })
      .catch(err => {
        console.log('err', err)
        reject(err)
      })
  })
}

/**
 * POST 封装
 * @param {*} url
 * @param {*} data
 * @param config
 */
export function post (url, data = {}, config) {
  // FIXME 后续优化
  url = http.adornUrl(url)
  let body = http.adornData(data)
  return new Promise((resolve, reject) => {
    http.post(url, body, config).then(
      response => {
        resolve(response.data)
      },
      err => {
        reject(err)
      }
    )
  })
}

/**
 * patch 请求
 * @param {*} url
 * @param {*} data
 * @param config
 */
export function patch (url, data = {}, config) {
  // FIXME 后续优化
  url = http.adornUrl(url)
  return new Promise((resolve, reject) => {
    http.patch(url, data, config).then(
      response => {
        resolve(response.data)
      },
      err => {
        reject(err)
      }
    )
  })
}

/**
 * put 请求
 * @param {*} url
 * @param {*} data
 * @param config
 */
export function put (url, data = {}, config) {
  // FIXME 后续优化
  url = http.adornUrl(url)
  return new Promise((resolve, reject) => {
    http.put(url, data, config).then(
      response => {
        resolve(response.data)
      },
      err => {
        reject(err)
      }
    )
  })
}

/**
 * del 请求
 * @param {*} url
 * @param params
 * @param config
 * @param {*} data
 * {params: params}url传参  {data: params}传值body
 */
export function del (url, config) {
  // FIXME 后续优化
  url = http.adornUrl(url)
  return new Promise((resolve, reject) => {
    http.delete(url, config).then(
      response => {
        resolve(response.data)
      },
      err => {
        reject(err)
      }
    )
  })
}

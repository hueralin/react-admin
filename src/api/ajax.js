/**
 * 导出一个能发送ajax请求的函数模块
 * 1、封装axios
 * 2、返回Promise对象
 * 3、统一处理请求异常
 * 4、统一resolve(res.data)
 */
import axios from 'axios'
import { message } from 'antd'

export default function ajax(url, data = {}, method = 'GET') {
    return new Promise((resolve, reject) => {
        let promise
        // 1、执行异步请求
        if (method === 'GET') {
            promise = axios.get(url, {
                params: data
            })
        } else {
            promise = axios.post(url, data)
        }
        // 2、请求成功，执行resolve
        promise.then((res) => {
            resolve(res.data)
        }).catch((err) => {
        // 3、请求失败，不执行reject，要给用户显示错误信息，而不是在控制台报错
            // reject(err) // 需要try-catch捕捉
            message.error(err.message)
        })
    })
}

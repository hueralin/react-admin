/**
 * 导出一个能发送ajax请求的函数模块
 * 1、封装axios
 * 2、返回Promise对象
 */
import axios from 'axios'

export default function ajax(url, data = {}, method = 'GET') {
    if (method === 'GET') {
        return axios.get(url, {
            params: data
        })
    } else {
        return axios.post(url, data)
    }
}

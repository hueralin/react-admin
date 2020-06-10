/**
 * !!! 
 * 包含n个接口请求函数的模块
 * 每个函数返回Promise
 * 目的：让用户调用更加方便，只关注可变的部分
 * 因为对于一个特定的接口，url和method是固定的，不需要用户手动设置，只有参数是可变的
 */

import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'

// 统一暴露
// export default { xxx() {}, yyy() {} }

// 分别暴露

/**
 * 登录接口
 * @param {string} username 用户名
 * @param {string} password 密码
 */
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST')

/**
 * 添加用户接口
 * @param {object} user { username, password, phone, email, role_id }
 */
export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST')

/**
 * 获取天气信息的接口
 */
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        const url = `http://wthrcdn.etouch.cn/weather_mini?city=${city}`
        jsonp(url, {}, (err, res) => {
            if (!err && res.status === 1000) {
                const { low, high, type } = res.data.forecast[0]
                resolve({ low, high, type })
            } else {
                message.error('请求天气信息失败！')
            }
        })
    })
}
// export const reqWeather = (city) => ajax('http://wthrcdn.etouch.cn/weather_mini', { city }, 'GET')

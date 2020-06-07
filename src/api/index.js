/**
 * !!! 
 * 包含n个接口请求函数的模块
 * 每个函数返回Promise
 * 目的：让用户调用更加方便，只关注可变的部分
 * 因为对于一个特定的接口，url和method是固定的，不需要用户手动设置
 */

import ajax from './ajax'

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

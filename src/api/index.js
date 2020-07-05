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

/**
 * 查询一级/二级分类列表
 */
export const reqCategories = (parentId) => ajax('/manage/category/list', { parentId })

// 根据分类ID，请求分类信息
export const reqCategory = (categoryId) => ajax('/manage/category/info', { categoryId })

/**
 * 添加一级/二级分类
 */
export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add', { categoryName, parentId }, 'POST')

/**
 * 修改一级/二级分类
 */
export const reqUpdateCategory = (categoryId, categoryName) => ajax('/manage/category/update', { categoryId, categoryName }, 'POST')

/**
 * 获取商品分页列表
 * @param {number} pageNum 
 * @param {number} pageSize 
 */
export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', { pageNum, pageSize })

/**
 * 分页搜索商品
 * @param {number} pageNum 
 * @param {number} pageSize 
 * @param {string} searchName 搜索关键字
 * @param {string} searchType 关键字类型：productName，productDesc
 */
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax('/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName
})

/**
 * 更新商品的状态（上架/下架）
 * @param {number} productId 
 * @param {number} status 
 */
export const reqUpdateStatus = (productId, status) => ajax('/manage/product/updateStatus', { productId, status }, 'POST')

/**
 * 删除已上传的图片
 * @param {string} name 图片名
 */
export const reqDeleteImg = (name) => ajax('/manage/img/delete', { name }, 'POST')

/**
 * 添加/更新商品
 * @param {object} product 商品对象
 */
export const reqAddOrUpdateProduction = (product) => ajax('/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

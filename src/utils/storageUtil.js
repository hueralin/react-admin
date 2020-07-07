/**
 * 功能：storage数据存储管理
 */

import store from 'store'
const USER_KEY = 'USER_KEY'

export default {
    // 保存user
    saveUser(userInfo) {
        // localStorage.setItem(USER_KEY, JSON.stringify(userInfo))
        store.set(USER_KEY, userInfo)
    },
    // 读入user
    getUser() {
        // return JSON.parse(localStorage.getItem(USER_KEY || '{}'))
        return store.get(USER_KEY) || {}
    },
    // 删除user
    removeUser() {
        // localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }
}

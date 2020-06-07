/**
 * 后台管理的路由组件
 */
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import memoryUtil from '../../utils/memoryUtil'

export default class Admin extends Component {
    render() {
        const { userInfo } = memoryUtil
        if (!userInfo || !userInfo._id) {
            // 未登录
            return <Redirect to='/login' />
        }
        return (
            <div>
                Hello { userInfo.username } !
            </div>
        )
    }
}

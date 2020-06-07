/**
 * 后台管理的路由组件
 */
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import memoryUtil from '../../utils/memoryUtil'
import { Layout } from 'antd'
import Header from '../../components/header'
import LeftNav from '../../components/left-nav'

const { Footer, Sider, Content } = Layout

export default class Admin extends Component {
    render() {
        // const { userInfo } = memoryUtil
        // if (!userInfo || !userInfo._id) {
        //     // 未登录
        //     return <Redirect to='/login' />
        // }
        // return (
        //     <div>
        //         Hello { userInfo.username } !
        //     </div>
        // )
        return (
            <Layout style={{ height: '100%' }}>
                <Sider>
                    <LeftNav></LeftNav>
                </Sider>
                <Layout>
                    <Header>头部</Header>
                    <Content style={{ backgroundColor: '#fff' }}>主体</Content>
                    <Footer style={{ textAlign: 'center', color: '#aaa' }}>&copy;版权所有</Footer>
                </Layout>
            </Layout>
        )
    }
}

/**
 * 后台管理的路由组件
 */
import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Layout } from 'antd'
import Header from '../../components/header'
import LeftNav from '../../components/left-nav'
import Home from '../home'
import Product from '../product'
import Category from '../category'
import User from '../user'
import Role from '../role'
import Bar from '../chart/Bar'
import Line from '../chart/Line'
import Pie from '../chart/Pie'

const { Footer, Sider, Content } = Layout

export default class Admin extends Component {
    render() {
        return (
            <Layout style={{ height: '100%' }}>
                <Sider>
                    <LeftNav />
                </Sider>
                <Layout>
                    <Header>头部</Header>
                    <Content style={{ backgroundColor: '#fff' }}>
                        <Switch>
                            {/* Admin的二级路由 */}
                            <Route path='/home' component={Home}></Route>
                            <Route path='/category' component={Category}></Route>
                            <Route path='/product' component={Product}></Route>
                            <Route path='/user' component={User}></Route>
                            <Route path='/role' component={Role}></Route>
                            <Route path='/chart/bar' component={Bar}></Route>
                            <Route path='/chart/line' component={Line}></Route>
                            <Route path='/chart/pie' component={Pie}></Route>
                            <Redirect to='/home' />
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: 'center', color: '#aaa' }}>&copy;版权所有</Footer>
                </Layout>
            </Layout>
        )
    }
}

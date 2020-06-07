import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'antd'
import './style.less'
import logo from '../../assets/imgs/logo.png'

const SubMenu = Menu.SubMenu

export default class LeftNav extends Component {
    render() {
        return (
            <div className="left-nav">
                <Link to='/'>
                    <header className="left-nav-header">
                        <img src={logo} alt="logo"/>
                    </header>
                </Link>
                <Menu theme='dark' 
                    // 默认选中
                    defaultSelectedKeys={['1']}
                    // 子菜单垂直收缩
                    mode='inline'>
                    <Menu.Item key='1'>
                        <span>首页</span>
                    </Menu.Item>
                    <SubMenu key='goods' title='商品'>
                        <Menu.Item key='goods-1'>
                            <span>品类管理</span>
                        </Menu.Item>
                        <Menu.Item key='goods-2'>
                            <span>商品管理</span>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key='3'>
                        <span>用户管理</span>
                    </Menu.Item>
                    <Menu.Item key='4'>
                        <span>角色管理</span>
                    </Menu.Item>
                    <SubMenu key='graph' title='图形图表'>
                        <Menu.Item key='graph-1'>
                            <span>柱形图</span>
                        </Menu.Item>
                        <Menu.Item key='graph-2'>
                            <span>折线图</span>
                        </Menu.Item>
                        <Menu.Item key='graph-3'>
                            <span>饼图</span>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </div>
        )
    }
}

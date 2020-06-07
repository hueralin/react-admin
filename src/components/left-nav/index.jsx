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
                        <Link to='/'>
                            <span>首页</span>
                        </Link>
                    </Menu.Item>
                    <SubMenu key='goods' title='商品'>
                        <Menu.Item key='goods-1'>
                            <Link to='/category'>
                                <span>品类管理</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key='goods-2'>
                            <Link to='/product'>
                                <span>商品管理</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key='3'>
                        <Link to='/user'>
                            <span>用户管理</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key='4'>
                        <Link to='/role'>
                            <span>角色管理</span>
                        </Link>
                    </Menu.Item>
                    <SubMenu key='graph' title='图形图表'>
                        <Menu.Item key='graph-1'>
                            <Link to='/chart/bar'>
                                <span>柱形图</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key='graph-2'>
                            <Link to='/chart/line'>
                                <span>折线图</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key='graph-3'>
                            <Link to='/chart/pie'>
                                <span>饼图</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </div>
        )
    }
}

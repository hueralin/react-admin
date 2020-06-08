import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd'
import menuList from '../../config/menuConf'
import './style.less'
import logo from '../../assets/imgs/logo.png'

const SubMenu = Menu.SubMenu

// 动态渲染菜单列表（map + 递归）
function renderMenu_map(menuList) {
    // 返回数组
    return menuList.map(item => {
        if (!item.children) {
            return (
                <Menu.Item key={item.key.slice(1)}>
                    <Link to={item.key}>
                        <span>{item.title}</span>
                    </Link>
                </Menu.Item>
            )
        }
        return <SubMenu key={item.key.slice(1)} title={item.title}>
            { renderMenu_map(item.children) }
        </SubMenu>
    })
}

class LeftNav extends Component {

    // 动态渲染菜单列表（reduce + 递归）
    renderMenu_reduce = (menuList) => {
        // 返回数组
        return menuList.reduce((prev, item) => {
            if (!item.children) {
                prev.push((
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                ))
            } else {
                const { pathname } = this.props.location
                const cItem = item.children.find(cItem => cItem.key === pathname )
                if (cItem) {
                    this.openKey = item.key
                }
                prev.push((
                    <SubMenu key={item.key} title={item.title}>
                        { this.renderMenu_reduce(item.children) }
                    </SubMenu>
                ))
            }
            return prev
        }, [])
    }

    componentWillMount() {
        this.menuList = this.renderMenu_reduce(menuList)
    }

    render() {
        const { pathname } = this.props.location
        return (
            <div className="left-nav">
                <Link to='/'>
                    <header className="left-nav-header">
                        <img src={logo} alt="logo"/>
                    </header>
                </Link>
                <Menu theme='dark' 
                    // 默认选中
                    selectedKeys={[pathname]}
                    // 子菜单垂直收缩
                    mode='inline'
                    // 展开子菜单
                    defaultOpenKeys={[this.openKey]}
                >
                    { this.menuList }
                </Menu>
            </div>
        )
    }
}

// 使非路由组件带有 history、location、match 属性
export default withRouter(LeftNav)

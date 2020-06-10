import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal, Button } from 'antd'
import { formatDate } from '../../utils/dataUtil'
import { reqWeather } from '../../api'
import memoryUtil from '../../utils/memoryUtil'
import storageUtil from '../../utils/storageUtil'
import menuList from '../../config/menuConf'
import './style.less'

const confirm = Modal.confirm

class Header extends Component {
    state = {
        currentTime: formatDate(Date.now()),    // 当前时间
        low: '',    // 最低气温
        high: '',   // 最高气温
        type: ''    // 天气类型
    }
    getTitle = () => {
        let title = ''
        let path = this.props.location.pathname
        menuList.forEach(item => {
            if (item.key === path) {
                title = item.title
            } else if(item.children) {
                let res = item.children.find(cItem => cItem.key === path)
                if (res) title = res.title
            }
        })
        return title
    }
    logout = () => {
        confirm({
            content: '确定要退出？',
            onOk: () => {
                // 清除userInfo
                memoryUtil.userInfo = {}
                storageUtil.removeUser()
                // 跳转到登录页
                this.props.history.replace('/login')
            }
        })
    }
    getTime = () => {
        this.timerId = setInterval(() => {
            let currentTime = formatDate(Date.now())
            this.setState({ currentTime })
        }, 1000)
    }
    getWeather = async () => {
        const { low, high, type } = await reqWeather('济宁')
        this.setState({ low, high, type })
    }
    componentWillMount() {
        this.getTime()
        this.getWeather()
    }
    componnetWillUnmount() {
        clearInterval(this.timerId)
    }
    render() {
        const { currentTime, low, high, type } = this.state
        const { username } = memoryUtil.userInfo
        const title = this.getTitle()
        return (
            <div className="header">
                <div className="header-top">
                <span>欢迎，{ username }</span>
                    <Button type='link' onClick={this.logout}>退出</Button>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{ title }</div>
                    <div className="header-bottom-right">
                        <span>{ currentTime }</span>
                        <span className='temp'>{ `${low} - ${high}` }</span>
                        <span>{ type }</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)

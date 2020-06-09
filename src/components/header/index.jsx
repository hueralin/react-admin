import React, { Component } from 'react'
import './style.less'

export default class Header extends Component {
    render() {
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，admin</span>
                    <a href="javascript:">退出</a>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">首页</div>
                    <div className="header-bottom-right">
                        <span>2020.06.09 18:03:54</span>
                        <img src="http://www.weather.com.cn/m/i/icon_weather/42x30/d07.gif" alt=""/>
                        <span>晴</span>
                    </div>
                </div>
            </div>
        )
    }
}

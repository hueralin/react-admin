import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Login from './pages/login/Login'
import Admin from './pages/admin/Admin'

export default class App extends Component {
    render() {
        return (
            // 设置路由映射
            <BrowserRouter>
                <Switch>
                    {/* 一级路由 */}
                    <Route path="/" component={Admin}></Route>
                    <Route path="/login" component={Login}></Route>
                </Switch>
            </BrowserRouter>
        )
    }
}

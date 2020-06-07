/**
 * 登录的路由组件
 */
import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
import './style.less'
/**
 * 1. 收集表单数据
 * 2. 表单验证
 */
export default class Login extends Component {
    onFinish = valus => {
        console.log(valus)
    }
    render() {
        return (
            <div className="login">
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form onFinish={this.onFinish}
                        initialValues={{
                            username: 'admin'
                        }}
                    >
                        <Form.Item 
                            // label="用户名"
                            name="username"
                            // 输入时验证
                            rules={[
                                { required: true, message: '用户名必须输入' },
                                { pattern: /^\w+$/, message: '只允许数字字母下划线' }
                            ]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            // label="密码"
                            // 没有设置name，就不会验证
                            name="password"
                            rules={[
                                { required: true, message: '密码必须输入' },
                                { min: 6, message: '密码最少6位' },
                                { max: 16, message: '密码最长16位' }
                            ]}>
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
                        </Form.Item>
                        </Form>
                </section>
            </div>
        )
    }
}

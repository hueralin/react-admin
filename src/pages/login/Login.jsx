/**
 * 登录的路由组件
 */
import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd'
import { Redirect } from 'react-router-dom'
import { reqLogin } from '../../api'
import memoryUtil from '../../utils/memoryUtil'
import storageUtil from '../../utils/storageUtil'
import './style.less'
/**
 * 1. 收集表单数据
 * 2. 表单验证
 */
export default class Login extends Component {
    onFinish = async values => {
        const { username, password } = values
        // 每次都写try-catch，麻烦！
        // try {
        //     const res = await reqLogin(username, password)
        //     console.log(res.data)
        // } catch(err) {
        //     alert('Error: ', err.message)
        // }
        const result = await reqLogin(username, password)
        if (result.status === 0) {
            // 将用户信息保存至内存
            memoryUtil.userInfo = result.data
            // 将用户信息保存至storage
            storageUtil.saveUser(result.data)
            message.success('登录成功')
            // 跳转到管理主页，使用replace而不是push
            // 是因为登录后不可以通过后退按钮回到登录页
            this.props.history.replace('/')
        } else {
            message.error(result.msg)
        }
    }
    render() {
        // 如果已经登录，强制跳转到主页
        if (memoryUtil.userInfo._id) {
            return <Redirect to='/' />
        }
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
                                { min: 4, message: '密码最少6位' },
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

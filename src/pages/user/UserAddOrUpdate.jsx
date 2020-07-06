import React from 'react'
import { Form, Input, Select } from 'antd'
import PropTypes from 'prop-types'

const { Item } = Form
const { Option } = Select
const Layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
}

export default class UserAddOrUpdate extends React.PureComponent {

    static propTypes = {
        setForm: PropTypes.func.isRequired,
        roles: PropTypes.array.isRequired,
        user: PropTypes.object
    }

    componentDidMount() {
        this.props.setForm(this.refs.form)
    }

    render() {

        // 父组件做了层判断，user要么为user，要么为{}
        // 所以大胆使用 initialValue
        const { roles, user } = this.props
        console.log('child', user)

        return (
            <Form ref='form' {...Layout} >
                <Item label='用户名' name='username' initialValue={user.username} rules={[ { required: true, message: '用户名不能为空' } ]}>
                    <Input placeholder='请输入用户名'/>
                </Item>
                {
                    // 更新时不更新密码
                    user._id ? null :
                    <Item label='密码' name='password' rules={[ { required: true, message: '密码不能为空' } ]}>
                        <Input placeholder='请输入密码'/>
                    </Item>
                }
                <Item label='手机号' name='phone' initialValue={user.phone} rules={[ { required: true, message: '手机号不能为空' } ]}>
                    <Input placeholder='请输入手机号'/>
                </Item>
                <Item label='邮箱' name='email' initialValue={user.email} rules={[ { required: true, message: '邮箱不能为空' } ]}>
                    <Input placeholder='请输入邮箱'/>
                </Item>
                <Item label='角色' name='role_id' initialValue={user.role_id} rules={[ { required: true, message: '角色不能为空' } ]}>
                    <Select placeholder='请选择角色'>
                        {
                            roles.map(role => <Option key={role._id} value={role._id}>{ role.name }</Option>)
                        }
                    </Select>
                </Item>
            </Form>
        )
    }
}

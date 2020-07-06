import React, { Component } from 'react'
import { Card, Table, Button, Modal, Input, message } from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
import AuthTree from './AuthTree'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import memoryUtil from '../../utils/memoryUtil'
import storageUtil from '../../utils/storageUtil'
import { formatDate } from '../../utils/dataUtil'

export default class Role extends Component {
    state = {
        loading: false,
        // 角色列表
        roles: [],
        // 选中的role
        role: {},
        // 控制“添加角色Modal”的显示
        showAddRole: false,
        // 控制“修改权限Modal”的显示
        showAuthTree: false,
        // 角色名
        roleName: ''
    }

    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: formatDate
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formatDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            }
        ]
    }

    authTreeRef = React.createRef()

    // 选中行
    onRow = role => {
        return {
            onClick: event => {
                this.setState({ role })
            }
        }
    }

    // 获取角色列表
    getRoles = async () => {
        this.setState({ loading: true })
        const result = await reqRoles()
        this.setState({ loading: false })
        if (result.status === 0) {
            const roles = result.data
            this.setState({ roles })
        }
    }

    // 隐藏“Modal”
    hideModal = () => {
        this.setState({ showAddRole: false, roleName: '', showAuthTree: false })
    }

    // 受控组件
    handleChange = (event) => {
        this.setState({ roleName: event.target.value })
    }

    // 添加角色
    addRole = async () => {
        // 收集数据
        const roleName = this.state.roleName
        // 校验
        if (!roleName) {
            message.error('角色名不能为空')
            return
        }
        // 请求
        const res = await reqAddRole(roleName)
        // 显示请求结果
        if (res.status === 0) {
            message.success('添加成功')
            // 重新请求列表（不这么做）
            // this.getRoles()
            // 换成这个做法（直接修改roles，毕竟角色数量不多，又是前端分页）
            const role = res.data
            this.setState(state => ({
                roles: [...state.roles, role],
                showAddRole: false,
                roleName: ''
            }))
        } else {
            message.error(res.msg)
        }
    }

    // 修改角色权限
    updateRole = async () => {
        this.setState({ showAuthTree: false })
        const { role } = this.state
        // 获取勾选后的权限信息
        const menus = this.authTreeRef.current.getCheckedKeys()
        // 发起请求
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = memoryUtil.userInfo.username
        const res = await reqUpdateRole(role)
        // 根据结果显示
        if (res.status === 0) {
            // 如果更新的是自己角色的权限，则强制退出
            if (role._id === memoryUtil.userInfo.role_id) {
                memoryUtil.userInfo = {}
                storageUtil.removeUser()
                message.success('当前用户角色权限更改，请重新登录')
                this.props.history.replace('/login')
            } else {
                message.success('更新成功')
                // 更新下 roles
                this.setState({ roles: [...this.state.roles] })
            }
        } else {
            message.error('更新失败')
        }
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getRoles()
    }

    render() {
        const { roles, role, loading, showAddRole, roleName, showAuthTree } = this.state
        const title = (
            <>
                <Button type='primary' onClick={() => this.setState({ showAddRole: true })}>添加角色</Button>&nbsp;
                <Button type='primary' onClick={() => this.setState({ showAuthTree: true })} disabled={ !role._id }>修改角色权限</Button>
            </>
        )
        return (
            <Card title={title}>
                <Table
                    loading={loading}
                    bordered
                    rowKey='_id'
                    columns={this.columns}
                    dataSource={roles}
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        // 前端分页不需要监听
                        // onChange: () => {}
                    }}
                    // 表格行可单选，selectedRowKey 表示选中的行的 rowKey，即选中样式由 rowKey 决定
                    rowSelection={{ type: 'radio', selectedRowKeys: [role._id] }}
                    // 事件监听
                    onRow={this.onRow}
                />
                <Modal title='添加角色' visible={showAddRole} onCancel={this.hideModal} onOk={this.addRole}>
                    <Input value={roleName} placeholder='请输入角色名' onChange={this.handleChange} />
                </Modal>
                <Modal title='修改权限' visible={showAuthTree} onCancel={this.hideModal} onOk={this.updateRole}>
                    <AuthTree ref={this.authTreeRef} role={role} />
                </Modal>
            </Card>
        )
    }
}

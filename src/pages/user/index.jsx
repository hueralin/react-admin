import React, { Component } from 'react'
import { Card, Table, Button, Modal, message } from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from '../../api' 
import UserAddOrUpdate from './UserAddOrUpdate'
import { formatDate } from '../../utils/dataUtil'

export default class User extends Component {

    state = {
        users: [],
        roles: [],
        user: {},
        loading: false,
        isShowAddOrUpdate: false
    }

    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },
            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formatDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: role_id => this.roleNames[role_id]
            },
            {
                title: '操作',
                render: (user) => (<>
                    <Button type='link' onClick={() => this.showAddOrUpdate(user)}>修改</Button>
                    <Button type='link' onClick={() => this.deleteUser(user)}>删除</Button></>
                )
            }
        ]
    }

    initRoleNames = (roles) => {
        this.roleNames = roles.reduce((prev, role) => {
            prev[role._id] = role.name
            return prev
        }, {})
    }

    showAddOrUpdate = user => {
        this.setState({ isShowAddOrUpdate: true, user: user || {} })
    }

    getUsers = async () => {
        const res = await reqUsers()
        if (res.status === 0) {
            this.initRoleNames(res.data.roles)
            this.setState({
                users: res.data.users,
                roles: res.data.roles
            })
        } else {
            message.error(res.msg)
        }
    }

    deleteUser = (user) => {
        Modal.confirm({
            title: `确定要删除${user.username}吗？`,
            onOk: async () => {
                const res = await reqDeleteUser(user._id)
                if (res.status === 0) {
                    message.success('删除成功')
                    this.getUsers()
                } else {
                    message.error(res.msg)
                }
            }
        })
    }

    addOrUpdateUser = () => {
        this.form.validateFields().then(async user => {
            // 1、收集数据并校验（user）
            if (this.user) {
                // 更新时要传 user ID
                user._id = this.user._id
            }
            // 2、发请求
            const res = await reqAddOrUpdateUser(user)
            // 3、根据请求结果显示反馈信息
            if (res.status === 0) {
                message.success(`${this.user ? '更新' : '添加'}成功`)
                this.getUsers()
            } else {
                message.error(res.msg)
            }
            this.closeModal()
        }).catch(err => {
            message.error(`${this.user ? '更新' : '添加'}用户失败`)
        })
    }

    closeModal = () => {
        this.form.resetFields()
        this.setState({ isShowAddOrUpdate: false })
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getUsers()
    }

    render() {
        const { loading, users, roles, user, isShowAddOrUpdate } = this.state
        console.log('render user', user)
        const title = <Button type='primary' onClick={() => this.showAddOrUpdate()}>添加用户</Button>

        return (
            <Card title={title}>
                <Table
                    rowKey='_id'
                    loading={loading}
                    columns={this.columns}
                    dataSource={users}
                    pagination={{
                        defaultPageSize: PAGE_SIZE
                    }}
                />
                <Modal
                    title={ user._id ? '更新用户' : '添加用户' }
                    visible={isShowAddOrUpdate}
                    onOk={this.addOrUpdateUser}
                    onCancel={this.closeModal}
                >
                    <UserAddOrUpdate setForm={form => this.form = form} roles={roles} user={user} />
                </Modal>
            </Card>
        )
    }
}

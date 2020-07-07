import React, { Component } from 'react'
import { Card, Table, Button, message, Modal } from 'antd'
import { reqCategories, reqUpdateCategory, reqAddCategory } from '../../api'
import AddForm from './AddForm'
import UpdateForm from './UpdateForm'
import './style.less'

export default class Category extends Component {

    state = {
        loading: false,
        // 一级分类列表
        categories: [],
        // 二级分类列表
        subCategories: [],
        parentId: '0',
        parentName: '',
        showStatus: 0,  // 0：都不显示，1：显示新增窗口，2：显示更新窗口
    }

    // 初始化Tabel的列
    initTableColumns = () => {
        this.columns = [
            {
                title: '分类名称',
                // 对应数据源中数据对象的某个属性
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '操作',
                width: 250,
                render: (category) => (
                <>
                    <Button type='link' onClick={() => this.showUpdateForm(category)}>修改分类</Button>
                    { category.parentId === '0' ? <Button type='link' onClick={() => this.showSubCategories(category)}>查看子分类</Button> : null }
                </>
                )
            }
        ]
    }

    // 获取一级/二级分类
    getCategories = async (parentId) => {
        this.setState({ loading: true })
        parentId = parentId || this.state.parentId
        let res = await reqCategories(parentId)
        if (res.status === 0) {
            if (parentId === '0') {
                this.setState({ categories: res.data, loading: false })
            } else {
                this.setState({ subCategories: res.data, loading: false })
            }
        } else {
            message.error('获取分类失败！')
            this.setState({ loading: false })
        }
    }

    // 获取一级分类列表
    showCategories = () => {
        // 更新显示为一级列表的状态
        this.setState({ 
            parentId: '0',
            parentName: '',
            subCategories: []
        })
    }

    // 获取指定parentId的二级分类列表
    showSubCategories = (category) => {
        // 先将状态修改为二级分类的模式
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {
            // 获取二级分类列表
            this.getCategories()
        })
    }

    // 显示更新分类的Form
    showUpdateForm = (category) => {
        // 保存当前选中的category
        this.category = category
        // 更新状态，显示Form
        this.setState({ showStatus: 2 })
    }

    // 新增分类
    addCategory = () => {
        this.addForm.validateFields().then(async values => {
            // 先关闭掉Modal
            this.setState({ showStatus: 0 })
            // 再获取表单数据
            let { categoryId, categoryName } = values
            // 然后发请求（在categoryId下新增categoryName分类）
            const res = await reqAddCategory(categoryId, categoryName)
            // 再次获取分类列表
            if (res.status === 0) {
                message.success('添加分类成功！')
                // 如果是在当前分类下添加商品，那么就重新请求一遍该分类下的商品分类
                if (categoryId === this.state.parentId) {
                    this.getCategories()
                } else if (categoryId === '0') {
                    // 如果在当前分类下添加一级分类，那么也要重新获取一级分类列表
                    this.getCategories('0')
                }
                // 否则不重新请求，没必要
            } else {
                message.error('添加分类失败！')
            }
        }).catch(errorInfo => {
            let [ err ] = errorInfo.errorFields
            message.error(err.errors)
        })
    }

    // 修改分类
    updateCategory = () => {
        // 先校验
        this.updateForm.validateFields().then(async values => {
            // 隐藏Modal
            this.setState({ showStatus: 0 })
            // 准备数据
            let _name = values.categoryName
            let _id = this.category._id
            console.log('id : name ', _id, _name)
            // 发送请求
            let res = await reqUpdateCategory(_id, _name)
            // 刷新列表
            if (res.status === 0) {
                message.success('修改分类成功！')
                this.getCategories()
            } else {
                message.error('修改分类失败！')
            }
        }).catch(errorInfo => {
            let [ err ] = errorInfo.errorFields
            message.error(err.errors)
        })
    }

    // 关闭窗口
    handleCancel = () => {
        this.setState({ showStatus: 0 })
    }

    // 为第一次render做准备
    componentWillMount() {
        this.initTableColumns()
    }
    // 执行异步操作
    componentDidMount() {
        // 获取一级分类列表
        this.getCategories()
    }

    render() {
        const { categories, subCategories, loading, parentId, parentName, showStatus } = this.state
        const extra = (<Button type='primary' onClick={() => this.setState({ showStatus: 1 })}>添加</Button>)
        const title = parentId === '0' ? '一级分类列表' : (
            <>
                <Button type='link' onClick={this.showCategories}>一级分类列表</Button>
                <span>{ parentName }</span>
            </>
        )
        // 防止第一次渲染时不报错
        const category = this.category || {}
          
        return (
            <div>
                <Card title={title} extra={extra}>
                    <Table
                        dataSource={ parentId === '0' ? categories : subCategories }
                        columns={this.columns} 
                        rowKey='_id'
                        bordered
                        pagination={{
                            defaultPageSize: 5,
                            showQuickJumper: true
                        }}
                        loading={loading}
                    />
                </Card>
                {/* 这些Modal一开始是隐藏的，并没有创建组件。
                第一次显示时才会创建组件，再次隐藏仅仅是隐藏，不会卸载组件 */}
                <Modal
                    title="添加分类"
                    visible={ showStatus === 1 }
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                    >
                    <AddForm 
                        categories={categories}
                        parentId={parentId}
                        setForm={form => this.addForm = form}
                    />
                </Modal>
                <Modal
                    title="修改分类"
                    visible={ showStatus === 2 }
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                    >
                    <UpdateForm setForm={form => this.updateForm = form} categoryName={category.name || ''} />
                </Modal>
            </div>
        )
    }
}

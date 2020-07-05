import React, { Component } from 'react'
import { Card, Table, Input, Select, Button, message } from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
const Option = Select.Option

/**
 * ProductHome：Product路由组件的默认页面（子路由组件）
 */

export default class ProductHome extends Component {

    state = {
        products: [],
        total: 0,
        loading: false,
        // 受控组件
        searchName: '',
        searchType: 'productName'
    }

    // 初始化表格的列
    initColumns() {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
                key: 'desc'
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: price => '￥' + price
            },
            {
                width: 100,
                title: '状态',
                render: product => {
                    const { _id, status } = product
                    return (
                        <>
                            <Button type='primary' 
                                onClick={() => this.updateStatus(_id, status === 1 ? 2 : 1)}
                            >
                                { status === 1 ? '下架' : '上架' }
                            </Button>
                            { status === 1 ? '在售' : '下架' }
                        </>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                render: product => (
                    <>
                        <Button type='link' onClick={() => this.props.history.push('/product/detail', { product })}>详情</Button>
                        <Button type='link' onClick={() => this.props.history.push('/product/addupdate', product)}>修改</Button>
                    </>
                )
            }
        ]
    }

    getProducts = async (pageNum) => {
        // 保存下pageNum
        this.pageNum = pageNum
        // 显示loading动画
        this.setState({ loading: true })
        const { searchName, searchType } = this.state
        let res
        // 如果输入了关键字，则表明是搜索数据
        if (searchName) {
            // 搜索数据
            res = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
        } else {
            // 请求数据
            res = await reqProducts(pageNum, PAGE_SIZE)
        }
        // 关闭loading动画
        this.setState({ loading: false })
        // 判断是否请求成功
        if (res.status === 0) {
            // 拿到请求的数据，修改状态
            let { list, total } = res.data
            this.setState({ products: list, total })
        } else {
            message.error('商品请求失败！')
        }
    }

    // 上架/下架
    updateStatus = async (_id, status) => {
        const res = await reqUpdateStatus(_id, status)
        if (res.status === 0) {
            message.success('商品状态更新成功！')
            // 获取状态更新后的列表
            // this.pageNum 代表当前页码
            this.getProducts(this.pageNum)
        } else {
            message.error('商品状态更新失败！')
        }
    }
    
    componentWillMount() {
        // 初始化表格的列
        this.initColumns()
    }

    componentDidMount() {
        this.getProducts(1)
    }

    render() {
        const { products, total, loading, searchName, searchType } = this.state
        const title = (
            <>
                <Select value={searchType} style={{ width: 150 }}
                    // 受控组件
                    onChange={value => this.setState({ searchType: value })}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input placeholder='请输入关键字' style={{ width: 150, margin: '0 10px' }}
                    value={searchName}
                    // 受控组件
                    onChange={ev => this.setState({ searchName: ev.target.value })}
                />
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
            </>
        )
        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>添加商品</Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    loading={loading}
                    dataSource={products}
                    columns={this.columns}
                    rowKey='_id'
                    bordered
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        total,
                        showQuickJumper: true,
                        // 页码变化时的回调函数，参数为page和pageSize
                        onChange: this.getProducts
                    }}
                />
            </Card>
        )
    }
}

import React, { Component } from 'react'
import { Card, Cascader, Form, Input, Button, message } from 'antd'
import { reqCategories, reqAddOrUpdateProduction } from '../../api'
import PicturesWall from './PicturesWall'
import RichTextEditor from './RichTextEditor'
const Item = Form.Item
const TextArea = Input.TextArea

/**
 * ProductAddAndUpdate：Product路由组件的子路由组件，负责商品的添加和修改
 */

export default class ProductAddAndUpdate extends Component {

    state = {
        // 存放级联的列表
        options: []
    }

    formRef = React.createRef()

    picWall = React.createRef()

    editor = React.createRef()

    // 初始化options
    initOptions = async (categories) => {
        // 将数组转化为Antd规定的格式
        let options = categories.map(item => ({
            label: item.name,
            value: item._id,
            isLeaf: false
        }))
        // 如果是更新商品，需要显示商品当前的分类
        const { isUpdate, product } = this
        const { pCategoryId } = product
        // 是更新，且是二级分类
        if (isUpdate && pCategoryId !== '0') {
            // 拿到和当前分类同级下的二级分类
            const subCategories = await this.getCategories(pCategoryId)
            // 生成二级分类的options
            const children = subCategories.map(item => ({
                label: item.name,
                value: item._id,
                isLeaf: true
            }))
            // 找到当前选中的一级分类
            const targetOption = options.find(option => option.value === pCategoryId)
            // 将该分类的二级分类options关联到一级分类的option上
            targetOption.children = children
        }
        // 修改状态
        this.setState({ options })
    }

    // 获取商品分类
    getCategories = async (categoryId) => {
        const res = await reqCategories(categoryId)
        if (res.status === 0) {
            if (categoryId === '0') {
                // 如果是一级分类，则初始化级联表
                this.initOptions(res.data)
            } else {
                // 否则是二级分类，返回二级分类列表
                return res.data     // Promise成功的结果
            }
        }
    }

    // 点击某一分类，加载下级分类的方法
    loadData = async selectedOptions => {
        // 获取选中项
        const targetOption = selectedOptions[0]
        // 显示加载loading动画
        targetOption.loading = true

        // 根据选中项的分类ID，获取选中分类下的二级分类
        const subCategories = await this.getCategories(targetOption.value)
        // 关闭加载loading动画
        targetOption.loading = false
        if (subCategories && subCategories.length > 0) {
            // 生成一个二级列表的options
            const childOptions = subCategories.map(item => ({
                label: item.name,
                value: item._id,
                isLeaf: true
            }))
            // 关联到当前选中的分类上，children就是下一级
            targetOption.children = childOptions
        } else {
            // 没有二级分类，那么说明当前选中的一级分类是叶子
            targetOption.isLeaf = true
        }
        // 更新Options状态（不更新不会显示二级分类）
        this.setState({ options: [...this.state.options] })
    }

    // 获取上传的图片名数组（父子组件通信）
    // getImages = (imgs) => {
    //     this.imgs = imgs
    // }

    // 表单提交
    submit = () => {
        // 先验证
        this.formRef.current.validateFields().then(async values => {
            // 1、收集数据，并封装成 product 对象
            const { name, desc, price, categoryIds } = values

            let pCategoryId, categoryId
            // 若只有一个ID
            if (categoryIds.length === 1) {
                // 则是一级分类
                pCategoryId = '0'
                categoryId = categoryIds[0]
            } else {
                pCategoryId = categoryIds[0]
                categoryId = categoryIds[1]
            }

            const imgs = this.picWall.current.getImages()
            const detail = this.editor.current.getContent()

            const product = { pCategoryId, categoryId, name, desc, price, imgs, detail }
            // 如果是更新
            if (this.isUpdate) product._id = this.product._id

            // 2、调用接口添加/更新
            const result = await reqAddOrUpdateProduction(product)

            // 3、根据结果提示
            if (result.status === 0) {
                message.success(`${ this.isUpdate ? '更新' : '添加' }商品成功`)
                this.props.history.goBack()
            } else {
                message.error(`${ this.isUpdate ? '更新' : '添加' }商品失败`)
            }
        })
    }

    componentWillMount() {
        // 重点，用来区分当前组件是用来添加还是更新
        // 根据是否传递state来判断当前是新增还是更新
        const product = this.props.location.state
        this.isUpdate = !!product
        this.product = product || {}
    }

    componentDidMount() {
        this.getCategories('0')
    }

    render() {
        const title= (
            <>
                <Button type='link' onClick={() => this.props.history.goBack()}>回退</Button>
                <span>{ this.isUpdate ? '修改商品' : '添加商品' }</span>
            </>
        )
        // 指定Item布局的配置项
        const layout = {
            labelCol: { span: 1.5 },
            wrapperCol: { span: 8 }
        }
        // 如果是更新，则从product里面取出商品数据
        const { pCategoryId, categoryId, name, desc, price, imgs, detail } = this.product
        let categoryIds = []
        // 显示当前商品的分类
        if (this.isUpdate) {
            // 该商品属于一级分类
            if (pCategoryId === '0') {
                categoryIds.push(categoryId)
            } else {
                // 该商品属于二级分类
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }
        return (
            <Card title={title}>
                <Form { ...layout } ref={this.formRef}>
                    <Item label='商品名称' name='name' initialValue={name}
                        rules={[ { required: true, message: '必须输入商品名称' } ]}
                    >
                        <Input placeholder='请输入商品名称' />
                    </Item>
                    <Item label='商品描述' name='desc' initialValue={desc}
                        rules={[ { required: true, message: '请输入商品描述' } ]}
                    >
                        <TextArea placeholder='请输入商品描述' autosize={{ minRows: 2, maxRows: 6 }} />
                    </Item>
                    <Item label='商品价格' name='price' initialValue={price}
                        rules={[ 
                            {
                                required: true,
                                validator: (_, value) => {
                                    if (!value || value < 0) {
                                        return Promise.reject('请输入有效价格')
                                    } else {
                                        return Promise.resolve()
                                    }
                                }
                            }
                        ]}
                    >
                        <Input type='number' placeholder='请输入商品价格' addonAfter='元' />
                    </Item>
                    <Item label='商品分类' name='categoryIds' initialValue={categoryIds} rules={[ { required: true, message: '请选择商品分类' } ]}>
                        <Cascader
                            // 初始时的下拉列表
                            options={this.state.options}
                            // 动态获取下拉列表（当点击时）
                            loadData={this.loadData}
                            placeholder='请选择商品分类'
                        />
                    </Item>
                    <Item label='商品图片' name='pictures' initialValue={price}>
                        {/* <PicturesWall getImages={this.getImages} /> */}
                        <PicturesWall ref={this.picWall} imgs={imgs} />
                    </Item>
                    <Item label='商品详情' name='detail' initialValue={price} wrapperCol={{ span: 12 }}>
                        <RichTextEditor ref={this.editor} detail={detail} />
                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}

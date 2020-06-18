// 添加分类的组件
import React, { Component } from 'react'
import { Form, Select, Input } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option

export default class AddForm extends Component {

    static propTypes = {
        parentId: PropTypes.string.isRequired,
        categories: PropTypes.array.isRequired,
        setForm: PropTypes.func.isRequired
    }

    formRef = React.createRef()

    componentDidMount() {
        this.props.setForm(this.formRef.current)
    }

    render() {
        const { parentId, categories } = this.props
        return (
            <Form ref={this.formRef} initialValues={{ categoryId: parentId, categoryName: '' }}>
                <Item label='分类' name='categoryId' rules={[{ required: true, message: '请选择分类' }]}>
                    <Select>
                        <Option value='0'>一级分类</Option>
                        {
                            categories.map(item => {
                                return <Option key={item._id} value={item._id}>{item.name}</Option>
                            })
                        }
                    </Select>
                </Item>
                <Item label='名称' name='categoryName' rules={[{ required: true, message: '分类名不能为空' }]}>
                    <Input placeholder='请输入分类名称' />
                </Item>
            </Form>
        )
    }
}

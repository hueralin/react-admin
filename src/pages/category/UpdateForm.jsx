// 更新分类的组件
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'

const Item = Form.Item

export default class UpdateForm extends Component {
    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }
    
    formRef = React.createRef()

    componentDidMount() {
        // 将form实例传递给父组件
        this.props.setForm(this.formRef.current)
    }

    render() {
        // initialValue 只在组件挂载时执行一次
        return (
            <Form ref={this.formRef} initialValues={{ categoryName: this.props.categoryName }}>
                <Item label='名称' name='categoryName' rules={[{ required: true, message: '分类名不能为空' }]}>
                    <Input placeholder='请输入分类名称' />
                </Item>
            </Form>
        )
    }
}

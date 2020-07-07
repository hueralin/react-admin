import React, { Component } from 'react'
import { Card, List, Button } from 'antd'
import { reqCategory } from '../../api'
import './style.less'
const Item = List.Item

/**
 * ProductDetail：Product路由组件的子路由组件，查看商品的详情
 */

export default class ProductDetail extends Component {

    state = {
        cName1: '', // 一级分类名称
        cName2: ''  // 二级分类名称
    }

    async componentDidMount() {
        const { pCategoryId, categoryId } = this.props.location.state.product
        // 如果父分类的ID为0，说明该商品属于一级分类
        if (pCategoryId === '0') {
            const res = await reqCategory(categoryId)
            const cName1 = res.data.name
            this.setState({ cName1 })
        } else {    // 二级分类名称
            // 依次发送两个请求
            // const res1 = await reqCategory(pCategoryId)
            // const res2 = await reqCategory(categoryId)
            // const cName1 = res1.data.name
            // const cName2 = res2.data.name
            // this.setState({ cName1, cName2 })
            
            // 同时发送两个请求
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            this.setState({ cName1, cName2 })
        }
    }

    render() {
        const title = (
            <>
                <Button type='link' onClick={() => this.props.history.goBack()}>回退</Button>
                <span>商品详情</span>
            </>
        )
        const { name, desc, price, detail, imgs } = this.props.location.state.product
        const { cName1, cName2 } = this.state
        return (
            <Card title={title} className='product-detail'>
                <List bordered>
                    <Item>
                        <span className="left">商品名称：</span>
                        <span>{ name }</span>
                    </Item>
                    <Item>
                        <span className="left">商品描述：</span>
                        <span>{ desc }</span>
                    </Item>
                    <Item>
                        <span className="left">商品价格：</span>
                        <span>{ price }</span>
                    </Item>
                    <Item>
                        <span className="left">所属分类：</span>
                        <span>{ cName1 } { cName2 ? '--> ' + cName2 : '' }</span>
                    </Item>
                    <Item>
                        <span className="left">商品图片：</span>
                        <span>
                            {
                                imgs.map(img => (<img className='product-img' src={`/upload/${img}`} alt={name} key={img} />))
                            }
                        </span>
                    </Item>
                    <Item>
                        <span className="left">商品详情：</span>
                        <span dangerouslySetInnerHTML={{ __html: detail }}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}

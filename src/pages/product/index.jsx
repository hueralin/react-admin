import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import ProductHome from './ProductHome'
import ProductAddAndUpdate from './ProductAddAndUpdate'
import ProductDetail from './ProductDetail'

export default class Product extends Component {
    render() {
        return (
            <Switch>
                <Route path='/product' component={ProductHome} exact />
                <Route path='/product/addupdate' component={ProductAddAndUpdate} />
                <Route path='/product/detail' component={ProductDetail} />
                <Redirect to='/product' />
            </Switch>
        )
    }
}

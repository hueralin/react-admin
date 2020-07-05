import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Tree, Divider } from 'antd'
import menuList from '../../config/menuConf'

const { TreeNode } = Tree

export default class AuthTree extends Component {

    static propTypes = {
        role: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props)
        this.state = {
            checkedKeys: props.role.menus
        }
    }

    // 初始化 Tree，暂时不需要了
    initTreeNode = (menuList) => {
        return menuList.reduce((prev, item) => {
            prev.push(
                <TreeNode title={item.title} key={item.key}>
                    { item.children ? this.initTreeNode(item.children) : null }
                </TreeNode>
            )
            return prev
        }, [])
    }

    // 勾选 TreeNode 时的回调
    onCheck = checkedKeys => {
        this.setState({ checkedKeys })
    }

    // 向父组件提供选中的 checkedKeys
    getCheckedKeys = () => this.state.checkedKeys

    componentWillReceiveProps(nextProps) {
        this.setState({ checkedKeys: nextProps.role.menus })
    }

    render() {
        const { role } = this.props
        const { checkedKeys } = this.state
        return (
            <div>
                <Input value={role.name} disabled />
                <Divider />
                <Tree
                    checkable   // 可勾选
                    defaultExpandAll    // 默认展开所有
                    checkedKeys={checkedKeys}    // 匹配选中项（自动勾选）
                    onCheck={this.onCheck}
                    // 方法二：直接传递数组（{key, title, children}）
                    treeData={menuList}
                >
                    {/* 方法一：手动构建 TreeNode */}
                    {/* <TreeNode title='平台建设' key='all'>
                        { this.initTreeNode(menuList) }
                    </TreeNode> */}
                </Tree>
            </div>
        )
    }
}

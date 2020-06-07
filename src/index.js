import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import memoryUtil from './utils/memoryUtil'
import storageUtil from './utils/storageUtil'

// 从storage里面读取userInfo，保存进内存
memoryUtil.userInfo = storageUtil.getUser()

ReactDOM.render(<App/>, document.getElementById('root'))

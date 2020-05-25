const { override, fixBabelImports } = require('customize-cra')

module.exports = override(
    // 针对antd，根据import进行按需打包（babel-plugin-import）
    fixBabelImports('import', { // babel-plugin-import
        libraryName: 'antd', 
        libraryDirectory: 'es', 
        style: 'css',   // 自动打包相关的样式
    })
)

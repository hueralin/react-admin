/**
 * 导航
 */

const menuList = [
    {
        title: '主页',
        key: '/home',
        icon: '',
        isPublic: true
    },
    {
        title: '商品',
        key: '/products',
        icon: '',
        children: [
            {
                title: '品类管理',
                key: '/category',
                icon: ''
            },
            {
                title: '商品管理',
                key: '/product',
                icon: ''
            }
        ]
    },
    {
        title: '用户管理',
        key: '/user',
        icon: ''
    },
    {
        title: '角色管理',
        key: '/role',
        icon: ''
    },
    {
        title: '图形图标',
        key: '/chart',
        icon: '',
        children: [
            {
                title: '柱状图',
                key: '/chart/bar',
                icon: ''
            },
            {
                title: '折线图',
                key: '/chart/line',
                icon: ''
            },
            {
                title: '饼图',
                key: '/chart/pie',
                icon: ''
            }
        ]
    }
]

export default menuList

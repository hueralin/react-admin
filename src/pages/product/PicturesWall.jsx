import React from 'react'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { reqDeleteImg } from '../../api'
import { BASE_IMG_URL } from '../../utils/constants'
import PropTypes from 'prop-types'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {

    static propTypes = {
        imgs: PropTypes.array
    }

    constructor(props) {
        super(props)
        let fileList = []
        const { imgs } = props
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((name, index) => ({
                uid: -index,
                name,
                status: 'done',
                url:  `${BASE_IMG_URL}/${name}`
            }))
        }
        this.state = {
            // 标志是否显示大图预览Modal
            previewVisible: false,
            previewImage: '',
            previewTitle: '',
            // 已上传的图片列表
            fileList
        };
    }

  // 关闭大图预览Modal
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

    // file：当前操作的文件图片（上传/删除），重点
    // fileList：所有已上传的图片文件对象的列表
    handleChange = async ({ file, fileList }) => {
        if (file.status === 'done') {
            const result = file.response
            if (result.status === 0) {
                const { name, url } = result.data
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
                message.success('图片上传成功')
                // const imgs = fileList.map(item => {
                //     return item.name
                // })
                // // 将图片名称数组绑定到父组件上
                // this.props.getImages(imgs)
            } else {
                message.error('图片上传失败')
            }
        } else if (file.status === 'removed') {
            const result = await reqDeleteImg(file.name)
            if (result.status === 0) {
                message.success('图片删除成功')
            } else {
                message.error('图片删除失败')
            }
        }
        this.setState({ fileList })
    };

    // 获取图片名称列表
    getImages = () => {
        return this.state.fileList.map(item => item.name)
    }

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        // 上传按钮
        const uploadButton = (
            <div>
            <PlusOutlined />
            <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    // 图片上传地址
                    action="/manage/img/upload"
                    // 接收文件的类型
                    accept='image/*'
                    // 发送到后台的字段名（参数名）
                    name='image'
                    // 上传列表的内联样式
                    listType="picture-card"
                    // 所有已上传的文件对象的列表
                    fileList={fileList}
                    // 点击预览按钮的处理函数
                    onPreview={this.handlePreview}
                    // 上传中、上传完成、上传失败的回调
                    onChange={this.handleChange}
                >
                    {/* 限制上传数量 */}
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

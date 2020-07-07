import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import PropTypes from 'prop-types'

export default class RichTextEditor extends Component {

  static propTypes = {
    detail: PropTypes.string
  }

  constructor(props) {
    super(props);
    const html = props.detail;
    if (html) {
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.state = { editorState }
      }
    } else {
        this.state = {
          // 创建空的 editorState
          editorState: EditorState.createEmpty(),
        }
    }
  }

  // 返回编辑器的内容
  getContent = () => {
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  render() {
    const { editorState } = this.state;
    return (
      <Editor
          editorState={editorState}
          editorStyle={{ border: '1px solid black', minHeight: 200, padding: '0 10px' }}
          onEditorStateChange={this.onEditorStateChange}
      />
    );
  }
}

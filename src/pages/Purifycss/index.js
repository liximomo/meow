import React, { Component } from 'react';
import style from './style.scss';
import debounce from '../../utils/debounce';

const purifycss = require('electron').remote.require('purify-css')

class Purifycss extends Component {
  state = {
    content: '',
    css: '',
    output: '',
  };

  purify = debounce(() => {
    const {
      content,
      css,
    } = this.state;
    if (content.trim() === '' || css.trim() === '') {
      return;
    }

    purifycss(content, css, (purified) => {
      this.setState({
        output: purified,
      });
    });
  }, 300, {
    leading: false,
  })

  onContentChange = (event) => {
    this.setState({
      content: event.target.value
    });
    this.purify();
  }

  onCssChange = (event) => {
    this.setState({
      css: event.target.value
    });
    this.purify();
  }

  render() {
    

    return (
      <div className={style.wrap}>
        <div
          className={style.left}
        >
          <div className={style.cell}>
            <textarea className={style.textarea} placeholder="内容" value={this.state.content} onChange={this.onContentChange}/>
          </div>
          <div className={style.cell}>
            <textarea className={style.textarea}  placeholder="css" value={this.state.css} onChange={this.onCssChange}/>
          </div>
        </div>
        <div
          className={style.right}
        >
        <textarea className={style.textarea} placeholder="输出" value={this.state.output}></textarea>
        </div>
      </div>
    );
  }
}

export default Purifycss;
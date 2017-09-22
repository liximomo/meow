import React, { Component } from 'react';
import { Card } from 'antd';

import * as path from '../../path';

import style from './style.scss';

const CardItem = (props) => {
  const {
    title,
    children,
  } = props;
  
  return (
    <Card title={title}>
      {children}
    </Card>
  );
};

class Tools extends Component {

  constructor(props) {
    super(props);
    this.tools = [{
      path: path.purifyCss(),
      name: 'purifycss',
      describe: '去除无用的 css',
    }];

    this.gotoPage = this.tools.reduce((result, tool) => {
      result[tool.name] = () => {
        this.props.history.push(tool.path);
      };
      return result;
    }, {});
  }

  render() {
    return (
      <div className={style.wrap}>
        {
          this.tools.map(tool => (
            <div className={style.toolItem} key={tool.name} onClick={this.gotoPage[tool.name]}>
              <CardItem title="purifycss" >
                <p>{tool.describe}</p>
              </CardItem>
            </div>
          ))
        }
      </div>
    );
  }
}

export default Tools;
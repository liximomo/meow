import React from 'react';

import ExpandablePanel from '../ExpandablePanel';

// 父容器必须是 flex
class SplitView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: props.height,
      expand: props.expand !== undefined ? props.expand : true,
    };
  }

  componentDidMount() {
    this.adjustHeight();
  }

  componentDidUpdate() {
    this.adjustHeight();
  }

  adjustHeight() {
    if (this.state.expand) {
      const { height } = this.node.getBoundingClientRect();
      this.node.style.height = `${height}px`;
    } else {
      this.node.style.height = '';
    }
  }

  handleEpandChange = isExpand => {
    this.setState({
      expand: isExpand,
    });
  };

  setNode = node => {
    this.node = node;
  };

  render() {
    const { collapseHeight, expandHeight, children, ...rest } = this.props;
    const { expand } = this.state;
    const height = expand ? expandHeight : collapseHeight;
    let flex = `0 0 ${height}`;
    let maxHeight = undefined;
    let minHeight = undefined;
    if (height === 'auto') {
      minHeight = 0;
      flex = `1 1 auto`;
      maxHeight = undefined;
    } else if (height === 'content') {
      flex = `0 0 auto`;
      maxHeight = undefined;
    } else {
      maxHeight = height;
    }

    return (
      <div
        style={{
          flex,
          minHeight,
          maxHeight,
        }}
        ref={this.setNode}
      >
        <ExpandablePanel {...rest} expand={expand} onExpandChange={this.handleEpandChange}>
          {children}
        </ExpandablePanel>
      </div>
    );
  }
}

export default SplitView;

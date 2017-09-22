import { Icon } from 'antd';

import style from './style.scss';

class IconAction extends React.Component {
  static defaultProps = {
    active: false,
  };

  onActiveChange = event => {
    const { active, onActiveChange, onClick } = this.props;
    if (onClick) {
      onClick(event);
    }
    if (onActiveChange) {
      onActiveChange(!active);
    }
  };

  render() {
    const { icon, name, style: cssStyle, active } = this.props;
    return (
      <div className={style.action} title={name} onClick={this.onActiveChange}>
        <Icon
          type={icon}
          style={{
            ...cssStyle,
            color: active ? '#02b875' : 'rgba(0, 0, 0, 0.65)',
          }}
        />
      </div>
    );
  }
}

export default IconAction;

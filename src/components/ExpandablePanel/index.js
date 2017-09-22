import { Icon } from 'antd';
import style from './style.scss';

class ExpandablePanel extends React.Component {
  static defaultProps = {
    expand: true,
    onExpandChange: a => null,
  };

  componentDidMount() {
    this.props.onExpandChange(this.props.expand);
  }

  toggleExpand = _ => {
    const { onExpandChange, expand } = this.props;
    onExpandChange(!expand);
  };

  render() {
    const { title, children, titleRight, expand } = this.props;
    return (
      <div
        className={cn(style.panel, {
          [style.isExpand]: expand,
        })}
      >
        <div className={style.titleBar} onClick={this.toggleExpand}>
          <span className={style.titleLeft}>
            <Icon
              type="caret-right"
              style={{
                fontSize: '12px',
              }}
            />
          </span>
          <h5 className={style.title}>
            {title}
          </h5>
          <span className={style.titleRight} onClick={event => event.stopPropagation()}>
            {titleRight}
          </span>
        </div>
        <div className={style.content}>
          {children}
        </div>
      </div>
    );
  }
}

export default ExpandablePanel;

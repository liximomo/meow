import { Icon, Dropdown } from 'antd';
import style from './style.scss';
/* <Icon type="play-circle" /> */

class ProjectItem extends React.Component {
  constructor(props) {
    super(props);
    const { runProject, id } = props;
    this.develop = () => runProject(id, 'start');
    this.build = () => runProject(id, 'build');
  }

  actions = () => {
    const { stopProject, running, onRemove } = this.props;
    return (
      <div className={style.actionWrapper}>
        {running
          ? <span key="stop" className={style.action} onClick={stopProject}>
            停止
          </span>
          : [
          <span key="dev" className={style.action} onClick={this.develop}>
            开发
          </span>,
          <span key="build" className={style.action} onClick={this.build}>
            构建
          </span>]}
        <span className={style.action} onClick={onRemove}>
          删除
        </span>
      </div>
    );
  };

  render() {
    const { name } = this.props;
    return (
      <div className={style.project}>
        <span className={style.left}>
          {name}
        </span>
        <span className={style.right}>
          <Dropdown overlay={this.actions()} placement="bottomRight" trigger={['click']}>
            <Icon
              type="ellipsis"
              style={{
                fontSize: '16px',
                transform: 'rotate(90deg) scale(1.5)',
                cursor: 'pointer',
              }}
            />
          </Dropdown>
        </span>
      </div>
    );
  }
}

export default ProjectItem;

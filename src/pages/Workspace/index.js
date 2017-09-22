import Explorer from './Explorer';
import Work from './Work';
import style from './style.scss';

export default class Workspace extends React.Component {
  render() {
    // const { props } = this.props;

    return (
      <div className={style.wrap}>
        <div
          className={style.left}
        >
          <Explorer />
        </div>
        <div
          className={style.right}
        >
          <Work/>
        </div>
      </div>
    );
  }
}


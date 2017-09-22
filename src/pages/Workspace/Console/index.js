import { connect } from 'react-redux';
import { getLogs } from '../../../modules/logs';
import LogItem from './LogItem';

import style from './style.scss';

class Console extends React.Component {
  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.scrollNode.scrollTop = this.scrollNode.scrollHeight;
  }

  setScrollNode = node => {
    this.scrollNode = node;
  };

  render() {
    return (
      <div className={style.console} ref={this.setScrollNode}>
        {this.props.logs.map(log =>
          <div key={log.id} className={style.logWrapper}>
            <LogItem {...log} />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  logs: getLogs(state),
});

export default connect(mapStateToProps)(Console);

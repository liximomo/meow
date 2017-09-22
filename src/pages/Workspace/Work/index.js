import { connect } from 'react-redux';

import Panel from '../../../components/Panel';
import Action from '../../../components/IconAction';
import { getActiveProject, updateProject } from '../../../modules/projects';
import Project from '../Project';
import Console from '../Console';
import style from './style.scss';

const consoleHeight = '200px';

class Work extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showConsole: false,
    };
  }

  actions() {
    const { showConsole } = this.state;
    return (
      <div className={style.actions}>
        <div className={style.actionWrapper}>
          <Action
            active={showConsole}
            name="控制台"
            icon="code-o"
            style={{ fontSize: '16px' }}
            onActiveChange={active => {
              this.setState({
                showConsole: active,
              });
            }}
          />
        </div>
      </div>
    );
  }

  handleProjectChange = updatedValue => {
    this.props.dispatch(updateProject(this.props.project.id, updatedValue));
  };

  render() {
    const { project } = this.props;
    const { showConsole } = this.state;
    if (!project) {
      return null;
    }

    return (
      <Panel title={project.name} titleRight={this.actions()}>
        <div className={style.viewsContainer}>
          <div
            style={{
              height: showConsole ? `calc(100% - ${consoleHeight})` : '100%',
            }}
          >
            <div className={style.view}>
              <Project data={project} onChange={this.handleProjectChange} />
            </div>
          </div>
          {showConsole
            ? <div
                style={{
                  height: consoleHeight,
                }}
              >
                <Panel title="CONSOLE">
                  <div className={style.viewConsole}>
                    <Console />
                  </div>
                </Panel>
              </div>
            : null}
        </div>
      </Panel>
    );
  }
}

const mapStateToProps = state => ({
  project: getActiveProject(state),
});

export default connect(mapStateToProps)(Work);

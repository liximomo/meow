import { connect } from 'react-redux';
// import Split from 'split.js'

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

  setProjectNode = (node) => {
    this.projectNode = node;
  }

  setConsoleNode = (node) => {
    this.consoleNode = node;
  }

  componentDidMount() {
    // this.split = Split([this.projectNode, this.consoleNode], {
    //   sizes: [70, 30],
    //   minSize: 100,
    //   gutterSize: 5,
    //   snapOffset: 4,
    //   direction: 'vertical',
    // });
  }

  componentWillUnmount() {
    // this.split.destroy();
  }

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
            ref={this.setProjectNode}
          >
            <div className={style.view}>
              <Project data={project} onChange={this.handleProjectChange} />
            </div>
          </div>
            <div
              style={{
                height: consoleHeight,
                display: showConsole ? 'block' : 'none',
              }}
              ref={this.setConsoleNode}
            >
              <Panel title="CONSOLE">
                <div className={style.viewConsole}>
                  { showConsole ? <Console /> : null}
                </div>
              </Panel>
            </div>
        </div>
      </Panel>
    );
  }
}

const mapStateToProps = state => ({
  project: getActiveProject(state),
});

export default connect(mapStateToProps)(Work);

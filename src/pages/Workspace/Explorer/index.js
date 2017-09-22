import { Button, message } from 'antd';
import { connect } from 'react-redux';

import { Input } from 'antd';
import {
  getProjectsListView,
  addProject,
  changeActiveProject,
  runProject,
  stopProject,
  delProject,
} from '../../../modules/projects';
import Panel from '../../../components/Panel';
import SplitView from '../../../components/SplitView';
import ProjectItem from './ProjectItem';
import style from './style.scss';
// import { run } from '../../../service/project';

class Explorer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCreate: false,
      collapseView: false,
    };
  }

  componentDidMount() {
    this.scrollToActive();
    // run(this.props.projects[0]);
  }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.activeId !== this.props.activeId) {
  //     this.scrollToActive();
  //   }
  // }

  scrollToActive() {
    if (!this.props.activeId) {
      return;
    }

    const activeNode = document.querySelector(`[data-id="${this.props.activeId}"]`);
    this.projectsListNode.scrollTop = activeNode.offsetTop - 40;
  }

  actions() {
    return (
      <div className={style.actions}>
        <div className={style.action} title="新建项目">
          <Button
            disabled={this.state.isCreate}
            type="primary"
            shape="circle"
            icon="plus"
            size="small"
            onClick={this.enterCreateMode}
          />
        </div>
      </div>
    );
  }

  createNewProject = async _ => {
    const value = this.state.createInputValue;
    if (value) {
      const result = await this.props.dispatch(addProject(value));
      if (result.error) {
        message.error(result.payload.message);
      }
    }
    this.exitCreateMode();
  };

  enterCreateMode = () => {
    if (this.state.isCreate) {
      return;
    }

    this.projectsListNode.scrollTop = 0;
    this.setState({
      isCreate: true,
      createInputValue: null,
    });
  };

  exitCreateMode = () => {
    if (!this.state.isCreate) {
      return;
    }

    this.setState({
      isCreate: false,
    });
  };

  handleCreateInputValueChange = event => {
    this.setState({
      createInputValue: event.target.value,
    });
  };

  createBox() {
    return (
      <div className={style.createPorjectBox}>
        <Input
          autoFocus
          placeholder="输入项目名称"
          onBlur={this.exitCreateMode}
          value={this.state.createInputValue}
          onChange={this.handleCreateInputValueChange}
          onPressEnter={this.createNewProject}
        />
      </div>
    );
  }

  handleProjectRun = (project, scriptName) => {
    this.props.dispatch(runProject(project, scriptName));
  };

  handleProjectStop = project => {
    this.props.dispatch(stopProject(project));
  };

  handleProjectRemove = project => {
    this.props.dispatch(delProject(project));
  };

  projectItem = (project, index) => {
    const { activeId, projectInfos } = this.props;
    const { id } = project;
    return (
      <div
        key={id}
        className={activeId === id ? style.projectItemActive : style.projectItem}
        data-id={id}
        onClick={_ => this.props.dispatch(changeActiveProject(id))}
      >
        <ProjectItem
          {...project}
          {...projectInfos[id]}
          runProject={this.handleProjectRun}
          stopProject={_ => this.handleProjectStop(project)}
          onRemove={_ => this.handleProjectRemove(project)}
        />
      </div>
    );
  };

  runningItem = (project, index) => {
    const { projectInfos } = this.props;
    const { id } = project;
    return (
      <div key={id} className={style.projectItem}>
        <ProjectItem
          {...project}
          {...projectInfos[id]}
          runProject={_ => this.handleProjectRun(project)}
          stopProject={_ => this.handleProjectStop(project)}
        />
      </div>
    );
  };

  setProjectsListNode = node => {
    this.projectsListNode = node;
  };

  render() {
    const { isCreate } = this.state;
    const { projects, runningProjects } = this.props;

    return (
      <Panel title="EXPLORER">
        <div className={style.projects} ref={this.setProjectsListNode}>
          <SplitView title="运行中" collapseHeight="content" expandHeight="120px">
            {runningProjects.map(this.runningItem)}
          </SplitView>
          <SplitView
            title="PAGES"
            collapseHeight="auto"
            expandHeight="auto"
            titleRight={this.actions()}
          >
            {isCreate ? this.createBox() : null}
            {projects.map(this.projectItem)}
          </SplitView>
        </div>
      </Panel>
    );
  }
}

const mapStateToProps = getProjectsListView;

export default connect(mapStateToProps)(Explorer);

import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';
import { Spin } from 'antd';
import Workstation from './pages/Workstation';
import TitleBar from './components/TitleBar';
import Search from './components/Search';
import { initApp, isInit } from './modules/app';
import { retriveProjects } from './modules/projects';

const fetch = require('electron').remote.require('isomorphic-fetch');

class App extends React.Component {
  componentWillMount() {
    if (!this.props.isInit) {
      this.props.dispatch(initApp());
    }
  }

  handleSearch = value => {
    this.previousSearch = value;
    const trimValue = value.trim();

    if (/https?:\/\//i.test(trimValue)) {
      const magicRegex = /<!--\s*?magic:\s*?(\d*)\s*-->?/i;
      fetch(value)
        .then(resp => resp.text())
        .then((html) => {
          // 搜索值变了，取消上次搜索机制
          if (this.previousSearch !== value) {
            return;
          }
  
          const eigenStr = html.substr(0, 40);
          const match = eigenStr.match(magicRegex);
          if (match) {
            this.props.dispatch(retriveProjects({
              id: match[1],
            }));
          }
        });
      return;
    }

    const searchPair = trimValue.split(':');
    if (searchPair.length < 2) {
        searchPair.unshift('name');
    }

    if (searchPair[0] === 'magic') {
      searchPair[0] = 'id';
    }
    const search = {
      [searchPair[0]]: searchPair[1],
    };
    this.props.dispatch(retriveProjects(search));
  };

  render() {
    return (
      <Spin spinning={!this.props.isInit} tip="初始化 app...">
        <TitleBar>
          <Search onSearch={this.handleSearch} />
        </TitleBar>
        <Route path="/" component={Workstation} />
      </Spin>
    );
  }
}

const mapStateToProps = state => ({
  isInit: isInit(state),
});

export default withRouter(connect(mapStateToProps)(App));

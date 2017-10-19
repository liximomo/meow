import { Icon } from 'antd';
import { Switch, Redirect, NavLink, Route } from 'react-router-dom';
import Workspace from '../Workspace';
import Tools from '../Tools';
import Purifycss from '../Purifycss';
import ColumnsLayout from '../../layouts/Columns';
import * as path from '../../path';
import style from './style.scss';

export default class Workstation extends React.Component {
  menu() {
    const iconStyle = {
      fontSize: '32px'
    };

    return (
      <div className={cn(style.nav, 'u-paddingTop10')}>
        <div className={style.navItem} title="浏览">
          <NavLink exact to={path.worksapce()}>
            <Icon type="folder" style={iconStyle} />
          </NavLink>
        </div>
        <div className={style.navItem} title="浏览">
          <NavLink exact to={path.tools()}>
            <Icon type="tool" style={iconStyle} />
          </NavLink>
        </div>
      </div>
    );
  }

  mainView() {
    return (
      <div className="u-fillParent">
        <Switch>
          <Route exact path={path.worksapce()} component={Workspace}/>
          <Route exact path={path.tools()} component={Tools}/>
          <Route exact path={path.purifyCss()} component={Purifycss}/>
          <Redirect to={path.worksapce()} />
        </Switch>
      </div>
    );
  }

  render() {
    // const { props } = this.props;

    return (
      <ColumnsLayout nav={this.menu()} detail={this.mainView()} />
    );
  }
}

import { Input } from 'antd';
import debounce from '../../utils/debounce';
import style from './style.scss';

class Search extends React.Component {
  onInput = debounce(this.props.onSearch, 300);

  render() {
    return (
      <div className={style.container}>
        <Input.Search
          placeholder="搜一搜"
          onInput={event => this.onInput(event.target.value)}
          onSearch={this.onInput}
        />
      </div>
    );
  }
}

export default Search;

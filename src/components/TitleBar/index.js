import Controls from './Controls';
import style from './style.scss';

const TitleBar = props => {
  const { cssStyle, children } = props;
  return (
    <div style={cssStyle} className={style.titleBar}>
      <div className={style.controls}>
        <Controls />
      </div>
      <div className={style.content}>
        {children}
      </div>
    </div>
  );
};

export default TitleBar;

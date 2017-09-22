import style from './style.scss';

const LogItem = props => {
  const { level, msg } = props;
  return (
    <div className={cn(style.log, style[level])}>
      {msg}
    </div>
  );
};

export default LogItem;

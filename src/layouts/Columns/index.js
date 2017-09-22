import style from './style.scss';

export default function Columns(props) {
  const { nav, detail } = props;

  return (
    <div className={style.layout}>
      <div className={style.colLeft}>
        {nav}
      </div>
      <div className={style.colRight}>
        {detail}
      </div>
    </div>
  );
}

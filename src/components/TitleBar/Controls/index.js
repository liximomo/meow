import style from './style.scss';

const { remote } = require('electron');

class Controls extends React.Component {
  closeWindow = _ => {
    remote.getCurrentWindow().close();
  };

  minimize = _ => {
    remote.getCurrentWindow().minimize();
  };

  maximize = _ => {
    let window = remote.getCurrentWindow();

    if (window.isMaximized()) window.unmaximize();
    else window.maximize();
    this.forceUpdate();
  };

  render() {
    let window = remote.getCurrentWindow();
    const isMaximized = window.isMaximized();

    return (
      <ul className={style.controls}>
        <li onClick={() => this.closeWindow()} className={style.closeButton}>
          <svg
            className={style.label}
            fill="#000000"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </li>
        <li onClick={() => this.minimize()} className={style.minButton}>
          <svg
            className={style.label}
            fill="#000000"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 13H5v-2h14v2z" />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </li>
        <li onClick={() => this.maximize()} className={style.maxButton}>
          {isMaximized
            ? <svg
                className={style.label}
                fill="#000000"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
              </svg>
            : <svg
                className={style.label}
                fill="#000000"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>}
        </li>
      </ul>
    );
  }
}

export default Controls;

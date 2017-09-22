import React from 'react';
import PropTypes from 'prop-types';

import style from './style.scss';

const Panel = props => {
  const { title, children, titleRight } = props;
  const widthBar = title || titleRight;
  return (
    <div
      className={cn(style.panel, {
        [style.panelWithoutBar]: !widthBar,
      })}
    >
      {widthBar
        ? <div className={style.titleBar}>
            <h5 className={style.title}>
              {title}
            </h5>
            <span className={style.titleRight}>
              {titleRight}
            </span>
          </div>
        : null}
      <div className={style.content}>
        {children}
      </div>
    </div>
  );
};

Panel.propTypes = {
  title: PropTypes.string,
};

export default Panel;

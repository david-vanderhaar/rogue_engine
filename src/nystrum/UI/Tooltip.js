import React from 'react';

function Tooltip ({title = 'Effect', text = '', children}) {
  return (
    <div className="Tooltip">
      {children}
      <div className="bottom">
        <strong>{title}</strong>
        {
          text != '' && (
            <>
              <hr />
              <p>{text}</p>
            </>
          )
        }
      </div>
    </div>
  )
}

export default Tooltip;

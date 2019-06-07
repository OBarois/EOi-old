import React from 'react';
import './Earth.css';

function Earth(props) {
  return (
    <div className="Earth">
      {'Earth: ' + props.viewdate.toJSON()}
    </div>
  );
}

export default Earth

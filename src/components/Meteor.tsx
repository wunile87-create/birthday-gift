import React from 'react';
import '../styles/Meteor.css';

function Meteor() {
  return (
    <div className="meteor-stage">
      <div className="center-meteor"></div>
      <div className="boom-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="particle" style={{ '--i': i } as React.CSSProperties}></div>
        ))}
      </div>
    </div>
  );
}

export default Meteor;
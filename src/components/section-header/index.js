import React from 'react';
import './style.scss';

function SectionHeader({ title }) {
  return (
    <div className="section-header-wrapper flex-center">
      <div className="section-header text-2xl">
        <h2>{title}</h2>
      </div>
    </div>
  );
}

export default SectionHeader;

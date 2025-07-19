import React from 'react';
import './style.scss';

function CategoryPageHeader({ title, subtitle }) {
  return (
    <div className="category-page-header-wrapper flex-center">
      <div className="category-page-title text-3xl">{title}</div>
      <div className="category-page-subtitle text-xl">{subtitle}</div>
    </div>
  );
}

export default CategoryPageHeader;

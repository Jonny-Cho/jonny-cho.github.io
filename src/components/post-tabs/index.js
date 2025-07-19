import React, { useMemo } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import PostCardColumn from '../post-card-column';
import './style.scss';

function PostTabs({ tabIndex, onChange, tabs, posts, showMoreButton }) {
  const tabPosts = useMemo(() => {
    if (tabs[tabIndex] === 'All') return posts;
    return posts.filter((post) => post.categories.includes(tabs[tabIndex]));
  }, [posts, tabs, tabIndex]);

  const handleSelectChange = (event) => {
    const newIndex = event.target.value;
    onChange(event, newIndex);
  };

  return (
    <div className="post-tabs-wrapper flex-center">
      <div className="post-category-selector flex-center">
        <FormControl className="category-select-form">
          <InputLabel id="category-select-label">카테고리</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={tabIndex}
            label="카테고리"
            onChange={handleSelectChange}
            className="category-select"
          >
            {tabs.map((title, index) => (
              <MenuItem key={index} value={index} className="category-menu-item">
                <Box display="flex" alignItems="center" gap={1}>
                  <span>{title}</span>
                  <span className="post-count">
                    ({title === 'All' ? posts.length : posts.filter(post => post.categories.includes(title)).length})
                  </span>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <PostCardColumn
        posts={showMoreButton ? tabPosts.slice(0, 4) : tabPosts}
        showMoreButton={showMoreButton && tabPosts.length > 4}
        moreUrl={`posts/${tabIndex === 0 ? '' : tabs[tabIndex]}`}
      />
    </div>
  );
}
export default PostTabs;

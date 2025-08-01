import React from 'react';
import { navigate } from 'gatsby';
import { Autocomplete, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/SearchOutlined';
import './style.scss';

function PostSearch({ posts }) {
  return (
    <div className="search-input-wrapper">
      <Autocomplete
        disableClearable
        options={posts}
        onInputChange={(event, value, reason) => {
          if (reason === 'reset' && value) {
            const item = posts.find((item) => item.title === value);
            if (!item) return;
            navigate(item.slug);
          }
        }}
        filterOptions={(options, { inputValue }) =>
          options.filter(
            ({ title, categories }) => title.includes(inputValue) || categories.includes(inputValue),
          )
        }
        getOptionLabel={(option) => option.title}
        renderInput={(params) => (
          <TextField
            {...params}
            id="post-search-input"
            name="search"
            label="포스트 검색"
            className="search-input"
            variant="standard"
            size="medium"
            InputProps={{
              ...params.InputProps,
              endAdornment: <SearchIcon className="search-icon" />,
            }}
          />
        )}
        noOptionsText="해당하는 글이 없습니다."
      />
    </div>
  );
}
export default PostSearch;

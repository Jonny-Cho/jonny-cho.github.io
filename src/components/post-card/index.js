import { Link, navigate } from 'gatsby';
import React from 'react';
import './style.scss';

function PostCard({ post }) {
  const { id, slug, title, excerpt, date, categories } = post;
  return (
    <div className="post-card-wrapper flex-center">
      <Link className="post-card flex-column rounded-md p-15" key={id} to={slug}>
        <div className="title text-lg">{title}</div>
        <p className="description text-sm" dangerouslySetInnerHTML={{ __html: excerpt }} />
        <div className="info flex-between">
          <div className="date text-md">{date}</div>
          <div className="categories flex">
            {categories.map((category) => (
              <span 
                className="category" 
                key={category}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/posts/${category}`);
                }}
                style={{ cursor: 'pointer' }}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default PostCard;

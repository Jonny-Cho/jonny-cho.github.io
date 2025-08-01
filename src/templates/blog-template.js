import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../layout';
import Seo from '../components/seo';
import PostHeader from '../components/post-header';
import PostNavigator from '../components/post-navigator';
import Post from '../models/post';
import PostContent from '../components/post-content';
import Utterances from '../components/utterances';
import TableOfContents from '../components/table-of-contents';
import './blog-template.scss';

function BlogTemplate({ data }) {
  const curPost = new Post(data.cur);
  const prevPost = data.prev && new Post(data.prev);
  const nextPost = data.next && new Post(data.next);
  const { comments } = data.site?.siteMetadata;
  const utterancesRepo = comments?.utterances?.repo;
  
  // Check if TOC should be shown (default to true if not specified)
  const showToc = data.cur.frontmatter.toc !== false;

  return (
    <>
      <Seo title={curPost?.title} description={curPost?.excerpt} />
      <Layout>
        <PostHeader post={curPost} />
        <PostContent html={curPost.html} />
        <PostNavigator prevPost={prevPost} nextPost={nextPost} />
        {utterancesRepo && <Utterances repo={utterancesRepo} path={curPost.slug} />}
      </Layout>
      {showToc && (
        <aside className="blog-post-toc">
          <TableOfContents html={curPost.html} />
        </aside>
      )}
    </>
  );
}

export default BlogTemplate;

export const pageQuery = graphql`
  query($slug: String, $nextSlug: String, $prevSlug: String) {
    cur: markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      excerpt(pruneLength: 500, truncate: true)
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        categories
        toc
      }
      fields {
        slug
      }
    }

    next: markdownRemark(fields: { slug: { eq: $nextSlug } }) {
      id
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        categories
      }
      fields {
        slug
      }
    }

    prev: markdownRemark(fields: { slug: { eq: $prevSlug } }) {
      id
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        categories
      }
      fields {
        slug
      }
    }

    site {
      siteMetadata {
        siteUrl
        comments {
          utterances {
            repo
          }
        }
      }
    }
  }
`;

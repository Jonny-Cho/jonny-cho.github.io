import { useStaticQuery, graphql } from 'gatsby';
import React from 'react';
import { Helmet } from 'react-helmet';

function Seo({ description, title }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author {
              name
            }
            ogImage
          }
        }
      }
    `,
  );

  const metaDescription = description || site.siteMetadata.description;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": site.siteMetadata.title,
    "description": site.siteMetadata.description,
    "url": site.siteMetadata.siteUrl,
    "author": {
      "@type": "Person",
      "name": site.siteMetadata.author.name
    },
    "inLanguage": "ko-KR",
    "publisher": {
      "@type": "Organization",
      "name": site.siteMetadata.title,
      "logo": {
        "@type": "ImageObject",
        "url": `${site.siteMetadata.siteUrl}${site.siteMetadata.ogImage}`
      }
    }
  };

  return (
    <Helmet
      htmlAttributes={{ lang: 'ko' }}
      title={title}
      defaultTitle={site.siteMetadata.title}
      meta={[
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:site_title`,
          content: title,
        },
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: 'og:author',
          content: site.siteMetadata.author.name,
        },
        {
          property: 'og:image',
          content: site.siteMetadata.ogImage,
        },

        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:locale`,
          content: `ko_KR`,
        },
        {
          name: `google-site-verification`,
          content: ``, // Google Search Console 인증 시 추가 필요
        },
        {
          name: `google-adsense-account`,
          content: `ca-pub-6754483654653335`,
        },
      ]}
    >
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}

export default Seo;

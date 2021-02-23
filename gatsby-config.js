module.exports = {
  siteMetadata: {
    title: `zoomkoding.dev`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `zoomkoding`,
    social: {
      github: `https://github.com/zoomKoding`,
      linkedIn: `https://www.linkedin.com/in/jinhyeok-jeong-800871192`,
    },
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown-pages`,
        path: `${__dirname}/src/markdown-pages`,
      },
    },
    `gatsby-transformer-remark`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-sass`,
    `gatsby-theme-material-ui`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `zoomkoding-dev-blog`,
        short_name: `zoomkoding.dev`,
        start_url: `/`,
        icon: `src/images/favicon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-mdx`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
};
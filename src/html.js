import React from "react"
import PropTypes from "prop-types"

export default function HTML(props) {
  return (
    <html {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="google-site-verification" content="ZK7amPAGlFg8qypWpF_Oh5eENxdUfpQ1cAN-ydiek4A" />
        {props.headComponents}
        <script src="/sw-unregister.js"></script>
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <div
          key={`body`}
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {props.postBodyComponents}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Hydration error debugging
              if (typeof window !== 'undefined') {
                // Catch hydration errors
                const originalError = console.error;
                console.error = function(...args) {
                  // Check for React hydration errors
                  if (args[0] && (
                    args[0].toString().includes('hydrat') || 
                    args[0].toString().includes('418') ||
                    args[0].toString().includes('Minified React error')
                  )) {
                    console.log('🔥 HYDRATION ERROR DETECTED:', ...args);
                    console.log('🔍 Stack trace:', new Error().stack);
                  }
                  originalError.apply(console, args);
                };
                
                // Handle ChunkLoadError
                window.addEventListener('unhandledrejection', function(event) {
                  if (event.reason && event.reason.name === 'ChunkLoadError') {
                    console.log('ChunkLoadError detected, reloading...');
                    window.location.reload(true);
                  }
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
}
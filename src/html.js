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
              // Force reload on cache mismatch
              if (typeof window !== 'undefined') {
                // Handle ChunkLoadError
                window.addEventListener('unhandledrejection', function(event) {
                  if (event.reason && event.reason.name === 'ChunkLoadError') {
                    console.log('ChunkLoadError detected, reloading...');
                    window.location.reload(true);
                  }
                });
                
                // Override console.error to catch chunk load errors
                const originalError = console.error;
                console.error = function(...args) {
                  if (args[0] && args[0].toString().includes('Loading chunk')) {
                    console.log('Chunk loading error detected, reloading...');
                    window.location.reload(true);
                    return;
                  }
                  originalError.apply(console, args);
                };
                
                // Catch webpack chunk errors
                window.addEventListener('error', function(event) {
                  if (event.message && event.message.includes('Loading chunk')) {
                    console.log('Webpack chunk error detected, reloading...');
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
require('typeface-montserrat');

export const onClientEntry = () => {
  const script = document.createElement('script');
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6754483654653335';
  script.async = true;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
};

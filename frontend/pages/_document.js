import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="theme-color" content="#f59e0b" />
        <meta name="apple-mobile-web-app-title" content="GW2Style" />
        <meta name="application-name" content="GW2Style" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'
import React from 'react'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)

    return initialProps
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="description" content="Corona heute" />
          <meta name="keywords" content="Corona, Zahlen" />
          <link rel="manifest" href="/manifest.json" />
          <link href="/images/icons/icon-72x72.png" rel="icon" type="image/png" sizes="72x72" />
          <link href="/images/icons/icon-144x144.png" rel="icon" type="image/png" sizes="144x144" />
          <link rel="apple-touch-icon" href="/images/icons/icon-192x192.png"></link>
          <meta name="theme-color" content="#FFF" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument

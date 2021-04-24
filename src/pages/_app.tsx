import * as React from 'react'

import { ChakraProvider } from '@chakra-ui/react'
import { AppComponent, AppProps } from 'next/dist/next-server/lib/router/router'
import { Header } from 'components/header'
import { DataReference } from 'components/data-reference'
import { css } from '@emotion/react'

export default function MyApp({
  Component,
  pageProps,
}: {
  Component: AppComponent
  pageProps: AppProps
}) {
  return (
    <ChakraProvider>
      <div>
        <Header />
        <main css={styles.main}>
          <Component {...pageProps} />
        </main>
        <DataReference />
      </div>
    </ChakraProvider>
  )
}

const styles = {
  main: css`
    min-height: 100vh;
  `,
}

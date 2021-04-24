import { ChakraProvider, theme } from '@chakra-ui/react'
import { css } from '@emotion/react'
import { DataReference } from 'components/data-reference'
import { Header } from 'components/header'
import { useCurrentRKIData } from 'hooks/use-current-rki-data'
import { AppComponent, AppProps } from 'next/dist/next-server/lib/router/router'
import * as React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { mediaQueryValues } from 'style/media-query'

const queryClient = new QueryClient()

export default function MyApp(props: { Component: AppComponent; pageProps: AppProps }) {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <MainContent {...props} />
      </QueryClientProvider>
    </ChakraProvider>
  )
}

function MainContent({ Component, pageProps }: { Component: AppComponent; pageProps: AppProps }) {
  const { isLoading } = useCurrentRKIData()

  return (
    <div>
      <Header />
      <main css={styles.main}>{isLoading ? null : <Component {...pageProps} />}</main>
      <DataReference />
    </div>
  )
}

const styles = {
  main: css`
    min-height: 100vh;
    padding-top: ${theme.space[5]};
    max-width: ${mediaQueryValues.md}px;
    margin: 0 auto;
  `,
}

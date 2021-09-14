import { Center, ChakraProvider, Spinner, theme } from '@chakra-ui/react'
import { css } from '@emotion/react'
import { DataReference } from 'components/data-reference'
import { Header } from 'components/header'
import { useCurrentRKIData } from 'hooks/use-current-rki-data'
import { QueryClient, QueryClientProvider } from 'react-query'
import { mediaQueryValues } from 'style/media-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { AppComponent, AppProps } from 'next/dist/shared/lib/router/router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 60000,
      refetchOnWindowFocus: false,
      retryDelay: 5000,
    },
  },
})

export default function MyApp(props: { Component: AppComponent; pageProps: AppProps }) {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <MainContent {...props} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ChakraProvider>
  )
}

function MainContent({ Component, pageProps }: { Component: AppComponent; pageProps: AppProps }) {
  const { isLoading } = useCurrentRKIData()

  return (
    <div>
      <Header />
      <main css={styles.main}>
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <Component {...pageProps} />
        )}
      </main>
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

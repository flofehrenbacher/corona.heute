import * as React from 'react'

import { ChakraProvider } from '@chakra-ui/react'
import { AppComponent, AppProps } from 'next/dist/next-server/lib/router/router'

export default function MyApp({
  Component,
  pageProps,
}: {
  Component: AppComponent
  pageProps: AppProps
}) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

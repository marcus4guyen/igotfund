import { Provider } from 'react-redux'
import { ChakraProvider } from '@chakra-ui/react'
import { useStore } from '../redux/store'

import Layout from '../components/ui/Layout'

function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState)

  return (
    <Provider store={store}>
      <ChakraProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp

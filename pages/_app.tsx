import { AppProps } from 'next/app'
import { CssBaseline, GeistProvider, Themes } from '@geist-ui/react'
import { ErrorContextProvider } from '@/lib/handleError'

import 'tailwindcss/tailwind.css'

const theme = Themes.createFromLight({
  type: 'custom',
  palette: {
    success: '#46b767',
  },
})

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <GeistProvider themes={[theme as any]} themeType="custom">
      <CssBaseline />
      <ErrorContextProvider>
        <Component {...pageProps} />
      </ErrorContextProvider>

      <style global jsx>{`
        .with-label {
          --input-height: auto !important;
        }
      `}</style>
    </GeistProvider>
  )
}

export default App

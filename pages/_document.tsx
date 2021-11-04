import NextDocument, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentInitialProps,
} from 'next/document'
import type { DocumentContext } from 'next/document'
import { CssBaseline } from '@geist-ui/react'

class Document extends NextDocument {
  static getInitialProps = async (
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> => {
    const initialProps = await NextDocument.getInitialProps(ctx)
    const styles = CssBaseline.flush()

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {styles}
        </>
      ),
    }
  }

  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default Document

import Head from 'next/head';
import '../styles/global.css';

interface IProps {
  Component: any;
  pageProps: Record<string, any>;
}

const App = ({ Component, pageProps }: IProps) => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
      <title>Kurentochat</title>
    </Head>
    <Component {...pageProps} />
  </>
);

export default App;

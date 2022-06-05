import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
    <title>NewComponents</title>
    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

      <Component {...pageProps} />
    </>
    
  )
}

export default MyApp

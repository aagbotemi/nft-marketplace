import '../styles/globals.css'

import Footer from '../components/Footer'
import Header from '../components/Header'


function MyApp({ Component, pageProps }) {
  

  return (
    <div className="flex flex-col">
      <Header />
      <div className="main">
        <Component {...pageProps} />
      </div>
      <Footer />
    </div>
  )
}

export default MyApp

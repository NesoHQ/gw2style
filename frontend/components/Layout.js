import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children, title, description, fullWidth = false }) {
  return (
    <div className="site-container">
      <Head>
        <title>{title ? `${title} - GW2Style` : 'GW2Style'}</title>
        <meta
          name="description"
          content={
            description || 'Share and discover Guild Wars 2 character styles'
          }
        />
      </Head>

      <Header />

      <main className="site-main">
        {fullWidth ? children : <div className="page-container">{children}</div>}
      </main>

      <Footer />
    </div>
  );
}

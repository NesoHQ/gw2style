import '@styles/globals.css';
import '../styles/logo-options.css';
import { UserProvider } from '../context/UserContext';

function Application({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default Application;


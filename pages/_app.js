import { ChatAppProvider } from "../contexts/ChatApp.context";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  return getLayout(<Component {...pageProps} />);
}

export default MyApp;

import { ChatAppProvider } from "../contexts/ChatApp.context";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }) {
  return (
    <ChatAppProvider>
      <Component {...pageProps} />
    </ChatAppProvider>
  );
}

export default MyApp;

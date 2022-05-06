import Navbar from "../Navigation/Navbar";
import Footer from "../Navigation/Footer";

export default function NavLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

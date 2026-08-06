import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

const PublicLayout = () => (
  <>
    <ScrollToTop />
    <Navbar />
    <div className="page-enter min-h-[60vh] bg-white dark:bg-stone-900">
      <Outlet />
    </div>
    <Footer />
  </>
);

export default PublicLayout;

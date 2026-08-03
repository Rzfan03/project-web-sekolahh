import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PublicLayout = () => (
  <>
    <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400" />
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

export default PublicLayout;

import Header from "@/components/Header";
import { Outlet } from "react-router-dom";
import Footer1 from "@/components/Footer1";

const Layout = () => {
  return (
    <>
      <Header />

      <main className="pt-20 min-h-screen">
        <Outlet />
      </main>

      <Footer1 />
    </>
  );
};

export default Layout;
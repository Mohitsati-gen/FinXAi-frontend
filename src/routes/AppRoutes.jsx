import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import MainLayout from "@/Layouts/MainLayout";
import Signin from "@/pages/Signin";
import Signup from "@/pages/Signup";
import AuthLayout from "@/Layouts/AuthLayout";
import Accountpage from "@/pages/Accountpage";
import AddTransaction from "@/pages/AddTransaction";
import Layout from "@/Layouts/Layout";
import PrivacyPolicy from "@/pages/Privacypolicy";
import TermsOfService from "@/pages/Termsofservice";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Main Website Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          
        </Route>

        <Route element={<Layout />}>
                     <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/account/:id"
            element={<Accountpage/>}
            />

          <Route
            path="/transaction/add"
            element={<AddTransaction/>}
            />
            
        </Route>
            <Route path="/privacypolicy" element={<PrivacyPolicy/>}/>
            <Route path="/termsofservice" element={<TermsOfService/>}/>
        {/* Auth Pages Layout */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/sign-up" element={<Signup />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
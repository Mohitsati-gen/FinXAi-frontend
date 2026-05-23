import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <>

      <main className="pt-30 pb-16 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default AuthLayout;
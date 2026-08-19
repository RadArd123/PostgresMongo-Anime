import { useState } from "react";
import SidebarApp from "../components/myComponents/AnimeSidebarApp";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(true); // Start collapsed by default so it doesn't cover too much at first

  return (
    <>
      {/* Sidebar Area - FLOATING OVER CONTENT */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] pointer-events-none`}
      >
        <div className={`h-full pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          collapsed ? "w-[100px]" : "w-[300px]"
        }`}>
          <SidebarApp collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="h-full">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import SidebarApp from "../components/myComponents/AnimeSidebarApp";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/myComponents/Navbar";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarSize, setSidebarSize] = useState(6); // % lățime

  const COLLAPSE_AT = 10;

  return (
    <>
      <Navbar />
      <ResizablePanelGroup
        direction="horizontal"
        className="fixed inset-y-0 left-0 w-full z-50 flex pointer-events-none"
      >
        <ResizablePanel
          defaultSize={sidebarSize}
          minSize={6}
          maxSize={22}
          onResize={(size) => {
            setSidebarSize(size);
            setCollapsed(size <= COLLAPSE_AT);
          }}>
          <div className="h-full" />
        </ResizablePanel>

        
        <ResizableHandle className="bg-transparent cursor-col-resize pointer-events-auto" />

        <ResizablePanel
          defaultSize={100 - sidebarSize}
          className="pointer-events-none"
        >
          <div className="h-full" />
        </ResizablePanel>
      </ResizablePanelGroup>


      <div
        className="fixed inset-y-0 left-0 z-40"
        style={{ width: `${sidebarSize}%` }}
      >
        <SidebarApp collapsed={collapsed} />
      </div>

      <div className="h-full">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;


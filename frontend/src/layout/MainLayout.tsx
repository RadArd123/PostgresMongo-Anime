import { lazy, Suspense, useState, useEffect } from "react";
import SidebarApp from "../components/myComponents/AnimeSidebarApp";
import { Outlet, useLocation } from "react-router-dom";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";

const AnimeFooter = lazy(() => import("../components/myComponents/AnimeFooter"));

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* ─── FLOATING MOBILE MENU BUTTON ─── */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-white hover:text-blue-400 hover:bg-black/60 shadow-lg transition-all"
      >
        <MenuIcon className="size-6" />
      </button>

      {/* ─── MOBILE OFFCANVAS SIDEBAR ─── */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 bg-transparent border-none w-[320px] max-w-[85vw]">
          <SidebarApp collapsed={false} setCollapsed={() => {}} />
        </SheetContent>
      </Sheet>

      {/* ─── DESKTOP FLOATING SIDEBAR ─── */}
      <div
        className={`hidden md:block fixed inset-y-0 left-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] pointer-events-none`}
      >
        <div className={`h-full pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          collapsed ? "w-[110px]" : "w-[300px]"
        }`}>
          <SidebarApp collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>
      </div>

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="min-h-screen flex flex-col transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
        <div className="flex-1 flex flex-col min-h-[calc(100vh-200px)] relative">
          <Outlet />
        </div>
        <div className="px-4 md:pr-16">
          <Suspense fallback={null}>
            <AnimeFooter />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default MainLayout;

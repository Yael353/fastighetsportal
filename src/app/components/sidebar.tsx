"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { logout } from "@/features/slices/authSlice";
import { AppDispatch } from "@/features/store/store";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const sidebarItems = [{ name: "Översikt", href: "/dashboard" }];

export function AppSidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Sidebar
      variant="floating"
      collapsible="none"
      className="bg-gradient-to-l from-midNightBlue to-darkBg flex flex-col outline-none border-r border-neonBlue"
    >
      {/* Header */}
      <SidebarHeader className="flex justify-center items-center border-b border-neonBlue mx-4 p-4">
        <img
          src="/images/logo.jpg"
          alt="logo"
          className="w-36 h-32 rounded-full border-2 border-neonBlue"
        />
        <h2 className="w-full flex justify-center px-4 py-3 text-lg font-semibold tracking-wide text-neonBlue bg-gradient-from-r from-midNightBlue to-darkBg">
          Tornets Portal
        </h2>
      </SidebarHeader>

      {/* Menu */}
      <SidebarContent className="text-white">
        <SidebarMenu className="flex flex-col gap-2 p-4">
          {sidebarItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link
                  className={`block w-full px-4 py-3 rounded-lg transition-all border border-neonBlue  shadow-neonBlue/50 ${
                    pathname === item.href
                      ? "bg-neonBlue text-darkBg font-semibold"
                      : "bg-darkBg/80 text-white hover:bg-gray-700"
                  }`}
                  href={item.href}
                >
                  {item.name}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* Logout Button */}
      <div className="mt-auto p-4 border-t border-neonBlue">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full text-white bg-gray-700 border border-neonBlue shadow-sm shadow-neonBlue/50 hover:bg-gray-600"
        >
          Logga ut
        </Button>
      </div>

      <SidebarRail />
    </Sidebar>
  );
}

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
      collapsible="offcanvas"
      className="bg-darkBg border-r border-neonBlue shadow-sm shadow-neonBlue/50 flex flex-col"
    >
      {/* Header */}
      <SidebarHeader className="flex justify-center items-center border-b border-neonBlue">
        <h2 className="w-full flex justify-center px-4 py-2 text-lg font-semibold tracking-tight text-neonBlue bg-darkBg">
          Tornets Portal
        </h2>
      </SidebarHeader>

      {/* Menu */}
      <SidebarContent className="text-white">
        <SidebarMenu className="flex flex-col gap-2 px-4 py-4">
          {sidebarItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link
                  className={`block w-full px-4 py-3 rounded-lg transition-all border border-neonBlue shadow-md shadow-neonBlue/50 ${
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
          className="w-full text-white bg-gray-700 border border-neonBlue shadow-md shadow-neonBlue/50 hover:bg-gray-600"
        >
          Logga ut
        </Button>
      </div>

      <SidebarRail />
    </Sidebar>
  );
  return (
    <Sidebar
      variant="floating"
      collapsible="offcanvas"
      className="bg-darkBg border-r border-neonBlue shadow-lg shadow-neonBlue/50 flex flex-col"
    >
      {/* Header */}
      <SidebarHeader className="flex justify-center items-center border-b border-neonBlue">
        <h2 className="w-full flex justify-center px-4 py-2 text-lg font-semibold tracking-tight text-neonBlue bg-darkBg">
          Tornets Portal
        </h2>
      </SidebarHeader>

      {/* Menu */}
      <SidebarContent className="text-white">
        <SidebarMenu className="flex flex-col gap-2 px-4 py-4">
          {sidebarItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link
                  className={`block w-full px-4 py-3 rounded-lg transition-all border border-neonBlue shadow-md shadow-neonBlue/50 ${
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

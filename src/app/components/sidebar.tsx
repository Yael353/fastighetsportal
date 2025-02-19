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

const sidebarItems = [
  { name: "Översikt", href: "/dashboard" },
  { name: "Fastigheter", href: "/dashboard/properties" },
  { name: "Rapporter", href: "/dashboard/reports" },
  { name: "Inställningar", href: "/dashboard/settings" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Sidebar className=" bg-gray-900">
      <SidebarHeader className="pt-0 px-0 bg-gray-900 ">
        <h2 className=" w-full px-4 py-1 text-lg font-semibold tracking-tight text-white bg-gray-900">
          Tornets Portal
        </h2>
      </SidebarHeader>
      <SidebarContent className="text-white">
        <SidebarMenu>
          {sidebarItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link className="hover:bg-gray-700 text-white" href={item.href}>
                  {item.name}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <div className="mt-auto p-4">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full text-white bg-gray-700 border-none"
        >
          Logga ut
        </Button>
      </div>
      <SidebarRail />
    </Sidebar>
  );
}

"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  User,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { Session } from "next-auth";

const data = {
  navMain: [
    {
      title: "Registrations",
      url: "#",
      icon: User,
      items: [
        {
          title: "Attendee",
          url: "/dashboard/attendee",
        },
        {
          title: "Sponsor",
          url: "/dashboard/sponsor",
        },
        {
          title: "Volunteer",
          url: "/dashboard/volunteer",
        },
      ],
    },
    {
      title: "Checkin",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Search",
          url: "/dashboard/check-in/search",
        },
        {
          title: "Scan",
          url: "/dashboard/check-in/scan",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Accounts",
          url: "/dashboard/accounts",
        },
        {
          title: "Invite",
          url: "/dashboard/accounts/invite",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "mailto:support@straqa.com",
      icon: LifeBuoy,
    },
  ],
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & Pick<Session, "user">) {
  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link href='/'>
                <Image
                  src='/assets/KMC-logo-light.png'
                  alt='logo'
                  width={100}
                  height={100}
                  className='h-16 object-contain'
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name ?? "Admin",
            email: user?.email ?? "",
            avatar: user?.image ?? "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}

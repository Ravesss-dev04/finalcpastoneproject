"use client"
import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from 'next/image';
import { Book, Compass, LayoutDashboard, PencilRulerIcon} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SideBarOptions=[
  {
    title: 'Dashboard',
    icon:LayoutDashboard,
    path: '/workspace'
  },
  {
    title: 'My courses',
    icon:Book,
    path: '/workspace/my-courses'
  },
  {
    title: 'Lessons & materials',
    icon:Book,
    path: '/workspace/lesson-materials'
  },
  {
    title: 'Quizzes & Assessment',
    icon:PencilRulerIcon,
    path: '/workspace/quizzes-assessment'
  },
  {
    title: 'Study plan',
    icon:Book,
    path: '/workspace/study-plan'
  },
  {
    title: 'Analytics',
    icon:Compass,
    path: '/workspace/analytics'
  },
  {
    title: 'AI tutor',
    icon:PencilRulerIcon,
    path: '/workspace/ai-tutor'
  }
]

function AppSidebar() {
  const path = usePathname();
  
  const handleLinkClick = () => {
    // Close sidebar by adding a CSS class or using data attributes
    if (window.innerWidth < 768) {
      // Method 1: Using data attributes
      const sidebar = document.querySelector('[data-sidebar]');
      if (sidebar) {
        sidebar.setAttribute('data-state', 'closed');
      }
      
      // Method 2: Using CSS classes
      const sidebarElement = document.querySelector('.sidebar');
      if (sidebarElement) {
        sidebarElement.classList.add('hidden', 'md:flex');
      }
      
      // Method 3: Trigger custom event
      window.dispatchEvent(new CustomEvent('close-sidebar'));
    }
  };

  const isActive = (itemPath) => {
    if (itemPath === '/workspace') {
      return path === '/workspace';
    }
    return path.startsWith(itemPath);
  };

  return (
    <Sidebar data-sidebar="true" className="sidebar">
      <SidebarHeader className={'p-4 bg-[#0D1117]'}>
        <div className="flex items-center justify-start md:justify-start">
          <Image
            src="/plmunlogo.png"
            alt="logo"
            width={70}
            height={70}
            className="mx-auto md:mx-0"
          />
          <span className="ml-2 text-lg font-semibold hidden md:inline-block ">
            <span className="text-white" > PLMun AI Tutor </span>
          </span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-[#0D1117]">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {SideBarOptions.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild className={'p-5'}>
                    <Link  
                      href={item.path} 
                      onClick={handleLinkClick}
                      className={`text-[15px] text-white ${isActive(item.path) ? 'text-primary ' : ''}`}
                    >
                      <item.icon className='h-7 w-7' />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="bg-[#0D1117]"/>
    </Sidebar>
  )
}

export default AppSidebar
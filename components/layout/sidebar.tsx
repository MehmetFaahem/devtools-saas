'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Bug,
  Github,
  Home,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Settings,
  Terminal,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const routes = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    variant: 'default',
  },
  {
    title: 'Onboarding',
    icon: Users,
    href: '/dashboard/onboarding',
    variant: 'ghost',
  },
  {
    title: 'Metrics',
    icon: BarChart3,
    href: '/dashboard/metrics',
    variant: 'ghost',
  },
  {
    title: 'Error Logs',
    icon: Bug,
    href: '/dashboard/logs',
    variant: 'ghost',
  },
  {
    title: 'GitHub',
    icon: Github,
    href: '/dashboard/github',
    variant: 'ghost',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
    variant: 'ghost',
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        'relative flex h-full flex-col border-r bg-card py-4 transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-[80px]' : 'w-[240px]'
      )}
    >
      <div className="flex items-center px-4 py-2">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <Terminal className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">DevTools</h1>
          </Link>
        )}
        {isCollapsed && (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link href="/" className="flex items-center justify-center">
                <Terminal className="h-6 w-6 text-primary" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-4">
              DevTools
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <Separator className="my-4" />
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          {routes.map((route) => (
            route.title === 'Dashboard' ? (
              <Link key={route.title} href={route.href}>
                <div
                  className={cn(
                    'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                    pathname === route.href ? 'bg-accent text-accent-foreground' : 'transparent',
                    isCollapsed ? 'justify-center' : 'justify-start'
                  )}
                >
                  <route.icon className={cn('h-5 w-5', isCollapsed ? 'mr-0' : 'mr-2')} />
                  {!isCollapsed && <span>{route.title}</span>}
                  {isCollapsed && (
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger className="hidden h-0 w-0" />
                      <TooltipContent side="right" className="flex items-center gap-4">
                        {route.title}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </Link>
            ) : (
              <Link key={route.title} href={route.href}>
                <div
                  className={cn(
                    'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                    pathname === route.href ? 'bg-accent text-accent-foreground' : 'transparent',
                    isCollapsed ? 'justify-center' : 'justify-start'
                  )}
                >
                  <route.icon className={cn('h-5 w-5', isCollapsed ? 'mr-0' : 'mr-2')} />
                  {!isCollapsed && <span>{route.title}</span>}
                  {isCollapsed && (
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger className="hidden h-0 w-0" />
                      <TooltipContent side="right" className="flex items-center gap-4">
                        {route.title}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </Link>
            )
          ))}
        </div>
      </ScrollArea>
      <div className="mt-auto px-3 py-2">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start',
            isCollapsed ? 'justify-center px-2' : 'px-3'
          )}
        >
          <LogOut className={cn('h-5 w-5', isCollapsed ? 'mr-0' : 'mr-2')} />
          {!isCollapsed && <span>Logout</span>}
          {isCollapsed && (
            <Tooltip delayDuration={0}>
              <TooltipTrigger className="hidden h-0 w-0" />
              <TooltipContent side="right" className="flex items-center gap-4">
                Logout
              </TooltipContent>
            </Tooltip>
          )}
        </Button>
      </div>
    </div>
  );
}
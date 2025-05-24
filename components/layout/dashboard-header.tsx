'use client';

import { useState } from 'react';
import { Bell, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ModeToggle } from '@/components/mode-toggle';
import { Sidebar } from '@/components/layout/sidebar';
import { UserNav } from '@/components/layout/user-nav';

interface DashboardHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function DashboardHeader({ isCollapsed, onToggle }: DashboardHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0">
          <Sidebar isCollapsed={false} onToggle={() => {}} />
        </SheetContent>
      </Sheet>
      <Button 
        variant="ghost" 
        size="icon" 
        className="hidden md:flex" 
        onClick={onToggle}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
      <div className="flex w-full items-center justify-between gap-4">
        <h1 className="text-lg font-semibold md:text-xl">DevTools Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
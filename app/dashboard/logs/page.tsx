'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ErrorLogTable } from '@/components/dashboard/logs/error-log-table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon, Download, FileDown, Search, Sparkles } from 'lucide-react';
import { mockErrorLogs } from '@/lib/mock-data';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function LogsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [aiSummaryOpen, setAiSummaryOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold tracking-tight">Error Logs</h1>
        <div className="flex flex-wrap items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'LLL dd, y') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Dialog open={aiSummaryOpen} onOpenChange={setAiSummaryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Sparkles className="h-4 w-4" />
                AI Summary
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>AI-Generated Error Summary</DialogTitle>
                <DialogDescription>
                  Analysis of recent error patterns and suggested solutions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <h3 className="mb-2 font-medium">Primary Issues Identified</h3>
                  <ul className="ml-6 list-disc text-sm">
                    <li className="mb-2">
                      <span className="font-medium">Memory leak in E-commerce API</span>: Multiple instances of out-of-memory errors during batch operations, suggesting inefficient resource management.
                    </li>
                    <li className="mb-2">
                      <span className="font-medium">Authentication token expiration</span>: Several JWT verification failures indicating that tokens may be expiring too quickly or renewal process is failing.
                    </li>
                    <li className="mb-2">
                      <span className="font-medium">Frontend data handling</span>: Consistent pattern of TypeError errors when attempting to access undefined properties, suggesting inconsistent API responses.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 font-medium">Recommended Actions</h3>
                  <ol className="ml-6 list-decimal text-sm">
                    <li className="mb-2">Review the batch update process in the e-commerce API, particularly the memory handling in the product search function.</li>
                    <li className="mb-2">Increase JWT token lifespan or implement a more robust renewal mechanism.</li>
                    <li className="mb-2">Add null checks to frontend code when processing API responses, especially in the Dashboard component.</li>
                  </ol>
                </div>
                <div>
                  <h3 className="mb-2 font-medium">Related GitHub Issues</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        #238
                      </span>
                      <a href="#" className="text-primary hover:underline">
                        Fix memory leak in product search endpoint
                      </a>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        #156
                      </span>
                      <a href="#" className="text-primary hover:underline">
                        Improve error handling in frontend components
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAiSummaryOpen(false)}>
                  Close
                </Button>
                <Button>
                  <FileDown className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search error messages..."
            className="h-9"
          />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue placeholder="App" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Apps</SelectItem>
              <SelectItem value="ecommerce">E-commerce API</SelectItem>
              <SelectItem value="marketing">Marketing Dashboard</SelectItem>
              <SelectItem value="mobile">Mobile App Backend</SelectItem>
              <SelectItem value="internal">Internal Tools</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="frontend">Frontend</SelectItem>
              <SelectItem value="backend">Backend</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6">
        <ErrorLogTable logs={mockErrorLogs} />
      </div>
    </DashboardLayout>
  );
}
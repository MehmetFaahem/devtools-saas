'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatCard } from '@/components/dashboard/metrics/stat-card';
import { ChartContainer } from '@/components/dashboard/metrics/chart-container';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Calendar as CalendarIcon, Clock, Download, Gauge, Server, Users } from 'lucide-react';
import { mockPerformanceData, mockErrorsOverTime } from '@/lib/mock-data';
import { format } from 'date-fns';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function MetricsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <DashboardLayout>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold tracking-tight">Performance Metrics</h1>
        <div className="flex items-center gap-4">
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
          <Select defaultValue="7d">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-4">
        <StatCard
          title="Avg Response Time"
          value="87ms"
          description="API response time"
          icon={<Clock className="h-4 w-4" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Requests"
          value="2.5M"
          description="API requests"
          icon={<Activity className="h-4 w-4" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Error Rate"
          value="0.12%"
          description="Request failures"
          icon={<Activity className="h-4 w-4" />}
          trend={{ value: 3, isPositive: true }}
        />
        <StatCard
          title="Active Users"
          value="12.8K"
          description="Unique users"
          icon={<Users className="h-4 w-4" />}
          trend={{ value: 14, isPositive: true }}
        />
      </div>
      
      <div className="mt-6">
        <Select defaultValue="all">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select app" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Applications</SelectItem>
            <SelectItem value="ecommerce">E-commerce API</SelectItem>
            <SelectItem value="marketing">Marketing Dashboard</SelectItem>
            <SelectItem value="mobile">Mobile App Backend</SelectItem>
            <SelectItem value="internal">Internal Tools</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="api">API Performance</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="users">User Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ChartContainer
              title="Response Time Trends"
              description="Average response time (ms) over time"
              data={mockPerformanceData}
              type="line"
              categories={['apiResponseTime']}
              colors={['hsl(var(--chart-1))']}
            />
            <ChartContainer
              title="Request Volume"
              description="Number of requests processed per month"
              data={mockPerformanceData}
              type="bar"
              categories={['totalRequests']}
              colors={['hsl(var(--chart-2))']}
            />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <ChartContainer
              title="Error Distribution"
              description="Frontend vs Backend errors over time"
              data={mockErrorsOverTime}
              type="bar"
              categories={['frontend', 'backend']}
              colors={['hsl(var(--chart-3))', 'hsl(var(--chart-4))']}
            />
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>
                  Current status of key system components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">API Servers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                      <span className="text-sm text-muted-foreground">Healthy</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Database Clusters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                      <span className="text-sm text-muted-foreground">Healthy</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Cache Servers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
                      <span className="text-sm text-muted-foreground">Degraded</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Authentication</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                      <span className="text-sm text-muted-foreground">Healthy</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">CPU Utilization</span>
                    </div>
                    <div className="w-24 text-right text-sm text-muted-foreground">
                      48%
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Memory Usage</span>
                    </div>
                    <div className="w-24 text-right text-sm text-muted-foreground">
                      62%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="api">
          <div className="mt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <ChartContainer
                title="API Response Time Breakdown"
                description="Response time by service component (ms)"
                data={mockPerformanceData}
                type="line"
                categories={['apiResponseTime', 'databaseQueryTime']}
                colors={['hsl(var(--chart-1))', 'hsl(var(--chart-2))']}
              />
              <ChartContainer
                title="API Request Methods"
                description="Distribution of request methods"
                data={[
                  { name: 'GET', value: 65 },
                  { name: 'POST', value: 20 },
                  { name: 'PUT', value: 10 },
                  { name: 'DELETE', value: 5 },
                ]}
                type="bar"
                categories={['value']}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="database">
          <div className="mt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <ChartContainer
                title="Database Query Performance"
                description="Average query execution time (ms)"
                data={mockPerformanceData}
                type="line"
                categories={['databaseQueryTime']}
                colors={['hsl(var(--chart-2))']}
              />
              <Card>
                <CardHeader>
                  <CardTitle>Top Queries</CardTitle>
                  <CardDescription>
                    Most time-consuming database operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-xs">SELECT * FROM users WHERE...</div>
                        <div className="text-sm font-medium">145ms</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-chart-1" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-xs">SELECT * FROM products JOIN...</div>
                        <div className="text-sm font-medium">125ms</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-chart-1" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-xs">UPDATE orders SET status...</div>
                        <div className="text-sm font-medium">95ms</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-chart-1" style={{ width: '55%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-xs">SELECT COUNT(*) FROM events...</div>
                        <div className="text-sm font-medium">82ms</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-chart-1" style={{ width: '48%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="users">
          <div className="mt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <ChartContainer
                title="Active Users"
                description="Daily active users over time"
                data={[
                  { name: 'Mon', value: 8200 },
                  { name: 'Tue', value: 9100 },
                  { name: 'Wed', value: 9800 },
                  { name: 'Thu', value: 10200 },
                  { name: 'Fri', value: 11500 },
                  { name: 'Sat', value: 8900 },
                  { name: 'Sun', value: 7800 },
                ]}
                type="line"
                categories={['value']}
                colors={['hsl(var(--chart-5))']}
              />
              <ChartContainer
                title="User Distribution"
                description="Users by device type"
                data={[
                  { name: 'Desktop', value: 45 },
                  { name: 'Mobile', value: 40 },
                  { name: 'Tablet', value: 15 },
                ]}
                type="bar"
                categories={['value']}
                colors={['hsl(var(--chart-3))']}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
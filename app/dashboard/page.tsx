'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatCard } from '@/components/dashboard/metrics/stat-card';
import { ChartContainer } from '@/components/dashboard/metrics/chart-container';
import { AppCard } from '@/components/dashboard/onboarding/app-card';
import { ErrorLogTable } from '@/components/dashboard/logs/error-log-table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Activity, ArrowUpRight, BarChart3, Bug, Clock, DivideIcon as LucideIcon, Plus, Zap } from 'lucide-react';
import { mockApps, mockErrorLogs, mockPerformanceData, mockErrorsOverTime } from '@/lib/mock-data';

export default function DashboardPage() {
  const recentErrors = mockErrorLogs.slice(0, 3);
  const recentApps = mockApps.slice(0, 2);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New App
        </Button>
      </div>
      
      <div className="mt-6 grid gap-6 md:grid-cols-4">
        <StatCard
          title="Total Apps"
          value={mockApps.length}
          description="Active applications being monitored"
          icon={<Zap className="h-4 w-4" />}
          trend={{ value: 25, isPositive: true }}
        />
        <StatCard
          title="Total Requests"
          value="2.5M"
          description="API requests in the last 30 days"
          icon={<Activity className="h-4 w-4" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Avg Response Time"
          value="87ms"
          description="Average API response time"
          icon={<Clock className="h-4 w-4" />}
          trend={{ value: 18, isPositive: true }}
        />
        <StatCard
          title="Active Errors"
          value={mockErrorLogs.length}
          description="Errors logged in the last 24 hours"
          icon={<Bug className="h-4 w-4" />}
          trend={{ value: 8, isPositive: false }}
        />
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  System activity over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  title=""
                  data={mockPerformanceData}
                  type="line"
                  categories={['totalRequests']}
                  height={250}
                />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Apps</CardTitle>
                <CardDescription>
                  Your most recently added applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentApps.map((app) => (
                    <div key={app.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{app.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {app.metrics?.requestsTotal.toLocaleString()} requests
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" size="sm">
                    View All Apps
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <h2 className="mb-4 text-xl font-semibold">Recent Errors</h2>
            <ErrorLogTable logs={recentErrors} />
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">
                View All Errors
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ChartContainer
              title="API Response Time"
              description="Average response time (ms) over time"
              data={mockPerformanceData}
              type="line"
              categories={['apiResponseTime', 'databaseQueryTime']}
              colors={['hsl(var(--chart-1))', 'hsl(var(--chart-2))']}
            />
            <ChartContainer
              title="Total Requests"
              description="Number of requests processed per month"
              data={mockPerformanceData}
              type="bar"
              categories={['totalRequests']}
            />
          </div>
        </TabsContent>
        <TabsContent value="errors" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ChartContainer
              title="Errors by Source"
              description="Frontend vs Backend errors over time"
              data={mockErrorsOverTime}
              type="bar"
              categories={['frontend', 'backend']}
              colors={['hsl(var(--chart-3))', 'hsl(var(--chart-4))']}
            />
            <Card>
              <CardHeader>
                <CardTitle>Error Breakdown</CardTitle>
                <CardDescription>
                  Distribution of errors by severity and source
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-sm font-medium">By Severity</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-muted p-3">
                        <div className="text-2xl font-bold text-destructive">42%</div>
                        <div className="text-xs text-muted-foreground">Critical</div>
                      </div>
                      <div className="rounded-lg bg-muted p-3">
                        <div className="text-2xl font-bold text-primary">35%</div>
                        <div className="text-xs text-muted-foreground">Error</div>
                      </div>
                      <div className="rounded-lg bg-muted p-3">
                        <div className="text-2xl font-bold text-chart-4">15%</div>
                        <div className="text-xs text-muted-foreground">Warning</div>
                      </div>
                      <div className="rounded-lg bg-muted p-3">
                        <div className="text-2xl font-bold text-muted-foreground">8%</div>
                        <div className="text-xs text-muted-foreground">Info</div>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="mb-2 text-sm font-medium">By Source</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-muted p-3">
                        <div className="text-2xl font-bold text-blue-500">62%</div>
                        <div className="text-xs text-muted-foreground">Frontend</div>
                      </div>
                      <div className="rounded-lg bg-muted p-3">
                        <div className="text-2xl font-bold text-purple-500">38%</div>
                        <div className="text-xs text-muted-foreground">Backend</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
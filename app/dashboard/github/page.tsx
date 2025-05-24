'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { IssueCard } from '@/components/dashboard/github/issue-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, Bot, Github, Webhook } from 'lucide-react';
import { mockGitIssues } from '@/lib/mock-data';

export default function GitHubPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold tracking-tight">GitHub Integration</h1>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Repository" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Repositories</SelectItem>
              <SelectItem value="ecommerce">ecommerce-api</SelectItem>
              <SelectItem value="marketing">marketing-dashboard</SelectItem>
              <SelectItem value="mobile">mobile-backend</SelectItem>
              <SelectItem value="internal">internal-tools</SelectItem>
            </SelectContent>
          </Select>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>
                <Webhook className="mr-2 h-4 w-4" /> Configure Webhook
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Configure GitHub Webhook</AlertDialogTitle>
                <AlertDialogDescription>
                  Add this webhook URL to your GitHub repository settings to enable
                  automatic issue tracking and commit analysis.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex items-center space-x-2">
                <Input
                  value="https://api.devtools.example.com/webhooks/github/events"
                  readOnly
                  className="font-mono text-xs"
                />
                <Button variant="outline" size="sm">
                  Copy
                </Button>
              </div>
              <div className="mt-4 rounded-md border bg-muted p-3">
                <h4 className="mb-2 text-sm font-medium">Webhook Settings</h4>
                <ul className="ml-6 list-disc text-sm">
                  <li>Content type: <span className="font-mono">application/json</span></li>
                  <li>Secret: <span className="font-mono">********</span></li>
                  <li>Events: Issues, Push, Pull request</li>
                </ul>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Copy and Close</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-5">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>AI-Generated Insights</CardTitle>
            <CardDescription>
              Automated analysis of recent GitHub activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Bug Pattern Detected</h3>
                  <p className="text-sm text-muted-foreground">
                    Multiple memory-related issues have been reported across your
                    repositories. Consider reviewing your memory management practices,
                    especially in the product search functionality.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">High Priority Issues</h3>
                  <p className="text-sm text-muted-foreground">
                    3 high-priority issues remain unassigned across your repositories.
                    The most critical is issue #238 which is affecting production systems.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Code Quality</h3>
                  <p className="text-sm text-muted-foreground">
                    Recent commits have improved error handling in the API layer, but
                    test coverage has decreased by 4%. Consider adding more tests to
                    the authentication module.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Repository Status</CardTitle>
            <CardDescription>
              Overview of your connected repositories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">ecommerce-api</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
                  <span className="text-sm text-muted-foreground">
                    3 open issues
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">marketing-dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                  <span className="text-sm text-muted-foreground">
                    1 open issue
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">mobile-backend</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                  <span className="text-sm text-muted-foreground">
                    7 open issues
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">internal-tools</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                  <span className="text-sm text-muted-foreground">
                    0 open issues
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="issues" className="mt-6">
        <TabsList>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="issues" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockGitIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Repository Activity</CardTitle>
              <CardDescription>
                Recent commits and pull requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Github className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">sam-dev</span>
                      <span className="text-sm text-muted-foreground">
                        pushed to <span className="font-mono">main</span>
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-sm">
                      fix: Optimize memory usage in product search (#238)
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      2 hours ago in <span className="font-medium">ecommerce-api</span>
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Github className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">jane-dev</span>
                      <span className="text-sm text-muted-foreground">
                        created pull request
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-sm">
                      feat: Add multi-tenant support to analytics dashboard (#152)
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      5 hours ago in <span className="font-medium">marketing-dashboard</span>
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Github className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">alex-product</span>
                      <span className="text-sm text-muted-foreground">
                        opened issue
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-sm">
                      API rate limiting not working correctly for authenticated users (#423)
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      1 day ago in <span className="font-medium">mobile-backend</span>
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
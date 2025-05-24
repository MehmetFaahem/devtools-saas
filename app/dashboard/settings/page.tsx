'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Bot, Check, Github, Key, RefreshCw, Save, Trash, User, Webhook } from 'lucide-react';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>

      <Tabs defaultValue="general" className="mt-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Manage your account settings and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue="john@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" defaultValue="Acme Inc." />
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="mb-4 text-lg font-medium">Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email alerts for critical errors
                      </p>
                    </div>
                    <Switch id="notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="analytics">Usage Analytics</Label>
                      <p className="text-sm text-muted-foreground">
                        Share anonymous usage data to improve the product
                      </p>
                    </div>
                    <Switch id="analytics" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing">Marketing Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about new features and offers
                      </p>
                    </div>
                    <Switch id="marketing" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
              <CardDescription>
                Manage your organization settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input id="org-name" defaultValue="Acme Inc." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="org-plan">Current Plan</Label>
                <Select defaultValue="pro">
                  <SelectTrigger id="org-plan">
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>GitHub Integration</CardTitle>
              <CardDescription>
                Connect your GitHub repositories for enhanced error tracking.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Github className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">GitHub</h3>
                    <p className="text-sm text-muted-foreground">
                      Connected to 4 repositories
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                  <span className="text-sm text-muted-foreground">Connected</span>
                </div>
              </div>
              <div className="rounded-md border bg-muted/50 p-3">
                <h4 className="mb-2 text-sm font-medium">Webhook URL</h4>
                <div className="flex items-center gap-2">
                  <Input
                    value="https://api.devtools.example.com/webhooks/github/events"
                    readOnly
                    className="h-8 font-mono text-xs"
                  />
                  <Button variant="outline" size="sm">
                    Copy
                  </Button>
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-medium">Connected Repositories</h4>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50">
                    <span className="text-sm">company/ecommerce-api</span>
                    <Button variant="ghost" size="sm">
                      <Trash className="mr-2 h-3 w-3" />
                      Remove
                    </Button>
                  </li>
                  <li className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50">
                    <span className="text-sm">company/marketing-dashboard</span>
                    <Button variant="ghost" size="sm">
                      <Trash className="mr-2 h-3 w-3" />
                      Remove
                    </Button>
                  </li>
                  <li className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50">
                    <span className="text-sm">company/mobile-backend</span>
                    <Button variant="ghost" size="sm">
                      <Trash className="mr-2 h-3 w-3" />
                      Remove
                    </Button>
                  </li>
                  <li className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50">
                    <span className="text-sm">company/internal-tools</span>
                    <Button variant="ghost" size="sm">
                      <Trash className="mr-2 h-3 w-3" />
                      Remove
                    </Button>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Github className="mr-2 h-4 w-4" />
                Add Repository
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>OpenAI Integration</CardTitle>
              <CardDescription>
                Connect OpenAI to enable AI-powered error analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">OpenAI</h3>
                    <p className="text-sm text-muted-foreground">
                      Using GPT-4o for error analysis
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                  <span className="text-sm text-muted-foreground">Connected</span>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="openai-key">API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="openai-key"
                    type="password"
                    value="sk-•••••••••••••••••••••••••••••••"
                    readOnly
                    className="font-mono"
                  />
                  <Button variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Update
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="openai-model">Model</Label>
                <Select defaultValue="gpt-4o">
                  <SelectTrigger id="openai-model">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-analysis">Automatic Analysis</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically analyze errors as they occur
                  </p>
                </div>
                <Switch id="auto-analysis" defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Disconnect</Button>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage access to your organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">John Doe</h3>
                      <p className="text-sm text-muted-foreground">
                        john@example.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      Admin
                    </span>
                    <Button variant="ghost" size="sm">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Jane Smith</h3>
                      <p className="text-sm text-muted-foreground">
                        jane@example.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      Developer
                    </span>
                    <Button variant="ghost" size="sm">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Sam Johnson</h3>
                      <p className="text-sm text-muted-foreground">
                        sam@example.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      Viewer
                    </span>
                    <Button variant="ghost" size="sm">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <User className="mr-2 h-4 w-4" />
                Invite Team Member
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
              <CardDescription>
                Manage access levels for your team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-medium">Admin</h3>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      Full access
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Can manage all aspects of the organization, including billing,
                    team members, and settings.
                  </p>
                </div>
                <div className="rounded-md border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-medium">Developer</h3>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      Standard access
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Can view and manage apps, logs, and metrics, but cannot modify
                    billing or team settings.
                  </p>
                </div>
                <div className="rounded-md border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-medium">Viewer</h3>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      Read-only access
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Can view apps, logs, and metrics, but cannot make changes to
                    any settings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage API keys for accessing the DevTools API.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-md border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Key className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Production API Key</h3>
                    <p className="font-mono text-xs text-muted-foreground">
                      dt_•••••••••••••••••••••••••••••••
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Copy
                  </Button>
                  <Button variant="destructive" size="sm">
                    Revoke
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Key className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Development API Key</h3>
                    <p className="font-mono text-xs text-muted-foreground">
                      dt_dev_•••••••••••••••••••••••••••
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Copy
                  </Button>
                  <Button variant="destructive" size="sm">
                    Revoke
                  </Button>
                </div>
              </div>
              <div className="rounded-md border-2 border-dashed p-4">
                <div className="flex flex-col items-center justify-center text-center">
                  <Key className="mb-2 h-8 w-8 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Generate New API Key</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Create a new API key for accessing the DevTools API
                  </p>
                  <Button className="mt-4">
                    <Key className="mr-2 h-4 w-4" />
                    Generate API Key
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>
                Access resources to help you integrate with the DevTools API.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <h3 className="text-sm font-medium">REST API Documentation</h3>
                    <p className="text-sm text-muted-foreground">
                      Complete reference for the DevTools REST API
                    </p>
                  </div>
                  <Button variant="outline">
                    View Docs
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <h3 className="text-sm font-medium">API Changelog</h3>
                    <p className="text-sm text-muted-foreground">
                      Updates and changes to the API
                    </p>
                  </div>
                  <Button variant="outline">
                    View Changelog
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <h3 className="text-sm font-medium">SDK Documentation</h3>
                    <p className="text-sm text-muted-foreground">
                      Documentation for client SDKs
                    </p>
                  </div>
                  <Button variant="outline">
                    View Docs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
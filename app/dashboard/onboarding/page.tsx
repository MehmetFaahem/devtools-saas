'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { AppCard } from '@/components/dashboard/onboarding/app-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Github, Plus, Upload } from 'lucide-react';
import { mockApps } from '@/lib/mock-data';
import { useState } from 'react';

export default function OnboardingPage() {
  const [open, setOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">App Onboarding</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Register New App
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Register a new application</DialogTitle>
              <DialogDescription>
                Fill in the details to generate an API key and register your application.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="app-name">Application Name</Label>
                <Input id="app-name" placeholder="My Awesome App" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Briefly describe what this application does"
                />
              </div>
              <div className="grid gap-2">
                <Label>Type</Label>
                <RadioGroup defaultValue="api">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="api" id="app-type-api" />
                    <Label htmlFor="app-type-api">API / Backend</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="frontend" id="app-type-frontend" />
                    <Label htmlFor="app-type-frontend">Frontend / Web</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mobile" id="app-type-mobile" />
                    <Label htmlFor="app-type-mobile">Mobile App</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid gap-2">
                <Label>GitHub Repository</Label>
                <div className="flex gap-2">
                  <Input placeholder="username/repository" />
                  <Button variant="outline" type="button">
                    <Github className="mr-2 h-4 w-4" />
                    Connect
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setOpen(false);
                  // Would handle app registration here
                }}
              >
                Register App
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="mt-6">
        <TabsList>
          <TabsTrigger value="all">All Apps</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="error">Error</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockApps
              .filter((app) => app.status === 'active')
              .map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="inactive" className="mt-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockApps
              .filter((app) => app.status === 'inactive')
              .map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="error" className="mt-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockApps
              .filter((app) => app.status === 'error')
              .map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-10">
        <h2 className="mb-6 text-xl font-semibold">Getting Started Guide</h2>
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              1
            </div>
            <div>
              <h3 className="text-lg font-medium">Register Your Application</h3>
              <p className="text-sm text-muted-foreground">
                Create a new application entry and generate an API key
              </p>
            </div>
          </div>
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              2
            </div>
            <div>
              <h3 className="text-lg font-medium">Connect Your GitHub Repository</h3>
              <p className="text-sm text-muted-foreground">
                Link your codebase to enable issue tracking and commit analysis
              </p>
            </div>
          </div>
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              3
            </div>
            <div>
              <h3 className="text-lg font-medium">Install the SDK</h3>
              <p className="text-sm text-muted-foreground">
                Add our lightweight SDK to your application to track errors and performance
              </p>
              <div className="mt-2 rounded-md bg-muted p-3 font-mono text-sm">
                npm install @devtools/sdk
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              4
            </div>
            <div>
              <h3 className="text-lg font-medium">Initialize and Configure</h3>
              <p className="text-sm text-muted-foreground">
                Add a few lines of code to start capturing errors and metrics
              </p>
              <div className="mt-2 rounded-md bg-muted p-3 font-mono text-sm">
                import &#123; DevTools &#125; from &apos;@devtools/sdk&apos;;<br />
                <br />
                const devtools = new DevTools(&#123;<br />
                &nbsp;&nbsp;apiKey: &apos;your-api-key&apos;,<br />
                &nbsp;&nbsp;appName: &apos;Your App Name&apos;,<br />
                &#125;);<br />
                <br />
                devtools.init();
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
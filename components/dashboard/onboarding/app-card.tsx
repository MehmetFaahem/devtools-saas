import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Copy, Github as GitHub, MoreHorizontal } from 'lucide-react';

interface AppCardProps {
  app: {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'inactive' | 'error';
    createdAt: Date;
    apiKey: string;
    githubRepo?: string;
  };
}

export function AppCard({ app }: AppCardProps) {
  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-base font-medium">{app.name}</CardTitle>
          <div className="mt-1 flex items-center gap-2">
            <Badge
              variant={
                app.status === 'active'
                  ? 'default'
                  : app.status === 'inactive'
                  ? 'secondary'
                  : 'destructive'
              }
              className="px-1 py-0 text-xs"
            >
              {app.status}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Created {formatDistanceToNow(app.createdAt)} ago
            </span>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{app.description}</p>
        <div className="mt-4">
          <div className="flex items-center justify-between rounded-md border bg-muted/50 p-2 text-xs">
            <code className="truncate">{app.apiKey}</code>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Copy className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Copy API key</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        {app.githubRepo ? (
          <Button variant="outline" size="sm" className="gap-1">
            <GitHub className="h-3 w-3" />
            <span>View Repo</span>
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="gap-1">
            <GitHub className="h-3 w-3" />
            <span>Connect GitHub</span>
          </Button>
        )}
        <Button size="sm">Manage</Button>
      </CardFooter>
    </Card>
  );
}
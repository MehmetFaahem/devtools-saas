import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GitIssue } from '@/lib/types';

interface IssueCardProps {
  issue: GitIssue;
}

export function IssueCard({ issue }: IssueCardProps) {
  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium">
            <a
              href={issue.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {issue.title}
            </a>
          </CardTitle>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge
              variant={issue.state === 'open' ? 'default' : 'secondary'}
              className="px-1 py-0 text-xs"
            >
              {issue.state}
            </Badge>
            <span className="text-xs text-muted-foreground">
              #{issue.number} opened {formatDistanceToNow(issue.createdAt)} ago
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {issue.body}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={issue.user.avatarUrl} alt={issue.user.login} />
              <AvatarFallback>{issue.user.login.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {issue.user.login}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {issue.labels.map((label) => (
              <Badge
                key={label.id}
                variant="outline"
                style={{
                  borderColor: `#${label.color}`,
                  color: `#${label.color}`,
                }}
                className="px-1 py-0 text-xs"
              >
                {label.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
'use client';

import { formatDistanceToNow } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ErrorLog } from '@/lib/types';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface ErrorLogTableProps {
  logs: ErrorLog[];
}

export function ErrorLogTable({ logs }: ErrorLogTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead>Error</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>App</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <>
              <TableRow key={log.id} className="group">
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => toggleRow(log.id)}
                  >
                    {expandedRows[log.id] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {log.message.length > 40
                    ? `${log.message.substring(0, 40)}...`
                    : log.message}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      log.source === 'frontend'
                        ? 'border-blue-500 text-blue-500'
                        : 'border-purple-500 text-purple-500'
                    }
                  >
                    {log.source}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      log.severity === 'critical'
                        ? 'destructive'
                        : log.severity === 'warning'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {log.severity}
                  </Badge>
                </TableCell>
                <TableCell>{log.appName}</TableCell>
                <TableCell>
                  {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="invisible group-hover:visible"
                  >
                    Resolve
                  </Button>
                </TableCell>
              </TableRow>
              {expandedRows[log.id] && (
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell colSpan={6}>
                    <div className="space-y-2 py-2">
                      <div>
                        <h4 className="font-medium">Full Message</h4>
                        <pre className="mt-1 rounded bg-muted p-2 text-xs">
                          {log.message}
                        </pre>
                      </div>
                      <div>
                        <h4 className="font-medium">Stack Trace</h4>
                        <pre className="mt-1 rounded bg-muted p-2 text-xs">
                          {log.stackTrace}
                        </pre>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-medium">Browser</h4>
                          <p className="text-sm text-muted-foreground">
                            {log.metadata.browser}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium">OS</h4>
                          <p className="text-sm text-muted-foreground">
                            {log.metadata.os}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium">User ID</h4>
                          <p className="text-sm text-muted-foreground">
                            {log.metadata.userId || 'Anonymous'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
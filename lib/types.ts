export interface ErrorLog {
  id: string;
  message: string;
  stackTrace: string;
  source: 'frontend' | 'backend';
  severity: 'info' | 'warning' | 'error' | 'critical';
  appName: string;
  timestamp: Date;
  metadata: {
    browser?: string;
    os?: string;
    userId?: string;
    url?: string;
    [key: string]: any;
  };
}

export interface App {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'error';
  createdAt: Date;
  apiKey: string;
  githubRepo?: string;
  metrics?: {
    requestsTotal: number;
    errorsTotal: number;
    avgResponseTime: number;
  };
}

export interface GitIssue {
  id: string;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  url: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    login: string;
    avatarUrl: string;
  };
  labels: {
    id: string;
    name: string;
    color: string;
  }[];
}

export interface Metric {
  name: string;
  value: number;
  previous?: number;
}
import { ErrorLog, App, GitIssue } from './types';

// Mock Apps
export const mockApps: App[] = [
  {
    id: '1',
    name: 'E-commerce API',
    description: 'Backend API for the e-commerce platform',
    status: 'active',
    createdAt: new Date('2025-01-15'),
    apiKey: 'sk_live_51XYZ123abc456def789ghi',
    githubRepo: 'company/ecommerce-api',
    metrics: {
      requestsTotal: 1245789,
      errorsTotal: 28,
      avgResponseTime: 87,
    },
  },
  {
    id: '2',
    name: 'Marketing Dashboard',
    description: 'Analytics dashboard for marketing campaigns',
    status: 'active',
    createdAt: new Date('2025-02-05'),
    apiKey: 'sk_live_51ABC987zyx654wvu321tsr',
    githubRepo: 'company/marketing-dashboard',
    metrics: {
      requestsTotal: 378452,
      errorsTotal: 5,
      avgResponseTime: 124,
    },
  },
  {
    id: '3',
    name: 'Mobile App Backend',
    description: 'Backend services for iOS and Android apps',
    status: 'error',
    createdAt: new Date('2025-03-10'),
    apiKey: 'sk_live_51DEF456ghi789jkl012mno',
    githubRepo: 'company/mobile-backend',
    metrics: {
      requestsTotal: 892317,
      errorsTotal: 127,
      avgResponseTime: 201,
    },
  },
  {
    id: '4',
    name: 'Internal Tools',
    description: 'Internal tooling for developer productivity',
    status: 'inactive',
    createdAt: new Date('2025-03-20'),
    apiKey: 'sk_live_51GHI789jkl012mno345pqr',
    metrics: {
      requestsTotal: 45863,
      errorsTotal: 2,
      avgResponseTime: 65,
    },
  },
];

// Mock Error Logs
export const mockErrorLogs: ErrorLog[] = [
  {
    id: '1',
    message: 'TypeError: Cannot read property "data" of undefined',
    stackTrace: `TypeError: Cannot read property "data" of undefined
    at processResponse (app.js:125:23)
    at async fetchData (app.js:67:12)
    at async Component (Dashboard.jsx:42:5)`,
    source: 'frontend',
    severity: 'error',
    appName: 'E-commerce API',
    timestamp: new Date('2025-04-01T14:32:15'),
    metadata: {
      browser: 'Chrome 112.0.5615.121',
      os: 'Windows 11',
      userId: 'user_123456',
      url: '/dashboard/metrics',
    },
  },
  {
    id: '2',
    message: 'Request failed with status code 500',
    stackTrace: `Error: Request failed with status code 500
    at createError (axios.js:123:15)
    at settle (axios.js:467:12)
    at handleResponse (axios.js:187:9)`,
    source: 'frontend',
    severity: 'warning',
    appName: 'Marketing Dashboard',
    timestamp: new Date('2025-04-01T12:17:34'),
    metadata: {
      browser: 'Firefox 98.0.2',
      os: 'macOS 14.3.1',
      userId: 'user_789012',
      url: '/campaigns/active',
    },
  },
  {
    id: '3',
    message: 'Database connection timeout after 30000ms',
    stackTrace: `Error: Database connection timeout after 30000ms
    at Pool.handleConnectionTimeout (pool.js:312:19)
    at Timeout.handleTimeout [as _onTimeout] (pool.js:164:17)
    at listOnTimeout (internal/timers.js:557:17)
    at processTimers (internal/timers.js:500:7)`,
    source: 'backend',
    severity: 'critical',
    appName: 'Mobile App Backend',
    timestamp: new Date('2025-04-01T08:45:22'),
    metadata: {
      endpoint: '/api/v1/users',
      method: 'GET',
      query: { limit: 50, offset: 0 },
    },
  },
  {
    id: '4',
    message: 'JWT verification failed: token has expired',
    stackTrace: `JsonWebTokenError: jwt expired
    at Verify.verify (jwt.js:152:19)
    at /app/middleware/auth.js:24:16
    at processTicksAndRejections (internal/process/task_queues.js:95:5)`,
    source: 'backend',
    severity: 'warning',
    appName: 'Internal Tools',
    timestamp: new Date('2025-04-01T06:12:45'),
    metadata: {
      endpoint: '/api/admin/settings',
      method: 'PUT',
      userId: 'admin_45678',
    },
  },
  {
    id: '5',
    message: 'Memory limit exceeded: process terminated',
    stackTrace: `Fatal Error: JavaScript heap out of memory
    at process.emit (events.js:314:20)
    at killProcess (child_process.js:861:15)
    at ChildProcess._handle.onexit (child_process.js:854:5)`,
    source: 'backend',
    severity: 'critical',
    appName: 'E-commerce API',
    timestamp: new Date('2025-04-01T02:34:17'),
    metadata: {
      endpoint: '/api/v1/products/batch-update',
      method: 'POST',
      memoryUsage: '2.34 GB',
    },
  },
];

// Mock GitHub Issues
export const mockGitIssues: GitIssue[] = [
  {
    id: 'issue_1',
    number: 238,
    title: 'Fix memory leak in product search endpoint',
    body: 'The product search endpoint is leaking memory when processing large result sets. This is causing the service to crash after extended periods of use. We need to optimize the search function and implement proper garbage collection.',
    state: 'open',
    url: 'https://github.com/company/ecommerce-api/issues/238',
    createdAt: new Date('2025-03-28'),
    updatedAt: new Date('2025-04-01'),
    user: {
      login: 'jane-dev',
      avatarUrl: 'https://avatars.githubusercontent.com/u/12345678',
    },
    labels: [
      { id: 'label_1', name: 'bug', color: 'ff0000' },
      { id: 'label_2', name: 'high-priority', color: 'ff9900' },
    ],
  },
  {
    id: 'issue_2',
    number: 152,
    title: 'Add multi-tenant support to analytics dashboard',
    body: 'We need to implement multi-tenant support for the analytics dashboard to allow our enterprise customers to manage multiple accounts from a single dashboard. This will require changes to the authentication system and database schema.',
    state: 'open',
    url: 'https://github.com/company/marketing-dashboard/issues/152',
    createdAt: new Date('2025-03-15'),
    updatedAt: new Date('2025-03-30'),
    user: {
      login: 'alex-product',
      avatarUrl: 'https://avatars.githubusercontent.com/u/87654321',
    },
    labels: [
      { id: 'label_3', name: 'enhancement', color: '0075ca' },
      { id: 'label_4', name: 'feature', color: '7057ff' },
    ],
  },
  {
    id: 'issue_3',
    number: 423,
    title: 'API rate limiting not working correctly for authenticated users',
    body: 'The rate limiting system is not applying the correct limits for authenticated users. They are being limited to the same rate as unauthenticated users (100 req/min) instead of their allocated 1000 req/min.',
    state: 'open',
    url: 'https://github.com/company/mobile-backend/issues/423',
    createdAt: new Date('2025-03-30'),
    updatedAt: new Date('2025-04-01'),
    user: {
      login: 'sam-dev',
      avatarUrl: 'https://avatars.githubusercontent.com/u/23456789',
    },
    labels: [
      { id: 'label_5', name: 'bug', color: 'ff0000' },
      { id: 'label_6', name: 'security', color: 'd73a4a' },
    ],
  },
  {
    id: 'issue_4',
    number: 86,
    title: 'Implement dark mode for internal tools',
    body: 'Add dark mode support to improve developer experience when using our internal tools. This should include all UI components and follow the design system guidelines.',
    state: 'closed',
    url: 'https://github.com/company/internal-tools/issues/86',
    createdAt: new Date('2025-02-10'),
    updatedAt: new Date('2025-03-20'),
    user: {
      login: 'taylor-ui',
      avatarUrl: 'https://avatars.githubusercontent.com/u/34567890',
    },
    labels: [
      { id: 'label_7', name: 'ui', color: '0e8a16' },
      { id: 'label_8', name: 'enhancement', color: '0075ca' },
    ],
  },
];

// Mock Performance Metrics
export const mockPerformanceData = [
  {
    name: 'Jan',
    apiResponseTime: 120,
    databaseQueryTime: 45,
    totalRequests: 125000,
  },
  {
    name: 'Feb',
    apiResponseTime: 115,
    databaseQueryTime: 42,
    totalRequests: 142000,
  },
  {
    name: 'Mar',
    apiResponseTime: 118,
    databaseQueryTime: 47,
    totalRequests: 168000,
  },
  {
    name: 'Apr',
    apiResponseTime: 107,
    databaseQueryTime: 40,
    totalRequests: 195000,
  },
  {
    name: 'May',
    apiResponseTime: 95,
    databaseQueryTime: 35,
    totalRequests: 230000,
  },
  {
    name: 'Jun',
    apiResponseTime: 87,
    databaseQueryTime: 32,
    totalRequests: 245000,
  },
];

export const mockErrorsOverTime = [
  { name: 'Jan', frontend: 54, backend: 23 },
  { name: 'Feb', frontend: 48, backend: 19 },
  { name: 'Mar', frontend: 65, backend: 31 },
  { name: 'Apr', frontend: 42, backend: 15 },
  { name: 'May', frontend: 37, backend: 21 },
  { name: 'Jun', frontend: 30, backend: 12 },
];
// DevTools SaaS JavaScript SDK
// Usage example for developers to integrate error logging and performance tracking

class DevToolsSaaS {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl = "http://localhost:3000") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  private async makeRequest(endpoint: string, data: any) {
    try {
      const response = await fetch(`${this.baseUrl}/api/trpc/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("DevTools SaaS SDK Error:", error);
      throw error;
    }
  }

  // Log an error
  async logError(error: {
    message: string;
    stackTrace?: string;
    source: "frontend" | "backend";
    severity: "info" | "warning" | "error" | "critical";
    metadata?: Record<string, any>;
    tags?: string[];
  }) {
    return this.makeRequest("logs.logError", {
      ...error,
      timestamp: new Date(),
    });
  }

  // Log performance data
  async logPerformance(performance: {
    endpoint: string;
    method: string;
    responseTime: number;
    statusCode: number;
    metadata?: Record<string, any>;
  }) {
    return this.makeRequest("logs.logPerformance", {
      ...performance,
      timestamp: new Date(),
    });
  }

  // Automatic error catching for frontend
  setupErrorHandler() {
    if (typeof window !== "undefined") {
      // Catch unhandled errors
      window.addEventListener("error", (event) => {
        this.logError({
          message: event.message,
          stackTrace: event.error?.stack,
          source: "frontend",
          severity: "error",
          metadata: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            browser: navigator.userAgent,
            url: window.location.href,
          },
        });
      });

      // Catch unhandled promise rejections
      window.addEventListener("unhandledrejection", (event) => {
        this.logError({
          message: event.reason?.message || "Unhandled Promise Rejection",
          stackTrace: event.reason?.stack,
          source: "frontend",
          severity: "error",
          metadata: {
            reason: event.reason,
            browser: navigator.userAgent,
            url: window.location.href,
          },
        });
      });
    }
  }

  // Performance monitoring helper
  startPerformanceMonitoring() {
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      // Monitor navigation timing
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === "navigation") {
            const navEntry = entry as PerformanceNavigationTiming;
            this.logPerformance({
              endpoint: window.location.pathname,
              method: "GET",
              responseTime: navEntry.loadEventEnd - navEntry.fetchStart,
              statusCode: 200,
              metadata: {
                type: "navigation",
                domContentLoaded:
                  navEntry.domContentLoadedEventEnd - navEntry.fetchStart,
                firstPaint: navEntry.loadEventEnd - navEntry.fetchStart,
              },
            });
          }
        });
      });

      observer.observe({ entryTypes: ["navigation"] });
    }
  }
}

// Usage examples:

// Initialize the SDK
const devtools = new DevToolsSaaS("your-api-key-here");

// Set up automatic error handling
devtools.setupErrorHandler();

// Start performance monitoring
devtools.startPerformanceMonitoring();

// Manual error logging
try {
  // Your code here
  throw new Error("Something went wrong");
} catch (error) {
  const err = error as Error;
  devtools.logError({
    message: err.message,
    stackTrace: err.stack,
    source: "frontend",
    severity: "error",
    metadata: {
      userId: "user123",
      feature: "checkout",
    },
    tags: ["checkout", "payment"],
  });
}

// Manual performance logging
const startTime = performance.now();
fetch("/api/data").then((response) => {
  const endTime = performance.now();
  devtools.logPerformance({
    endpoint: "/api/data",
    method: "GET",
    responseTime: endTime - startTime,
    statusCode: response.status,
    metadata: {
      userId: "user123",
      dataSize: response.headers.get("content-length"),
    },
  });
});

export default DevToolsSaaS;

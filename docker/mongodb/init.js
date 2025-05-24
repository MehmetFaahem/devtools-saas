// MongoDB initialization script for DevTools SaaS
// This script runs when the MongoDB container is first created

// Switch to the logs database
db = db.getSiblingDB("devtools_saas_logs");

// Create collections with validation schemas
db.createCollection("error_logs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "appId",
        "message",
        "source",
        "severity",
        "timestamp",
        "resolved",
      ],
      properties: {
        appId: { bsonType: "string" },
        message: { bsonType: "string" },
        stackTrace: { bsonType: "string" },
        source: { enum: ["frontend", "backend"] },
        severity: { enum: ["info", "warning", "error", "critical"] },
        metadata: { bsonType: "object" },
        timestamp: { bsonType: "date" },
        resolved: { bsonType: "bool" },
        resolvedAt: { bsonType: "date" },
        resolvedBy: { bsonType: "string" },
        tags: { bsonType: "array" },
      },
    },
  },
});

db.createCollection("performance_logs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "appId",
        "endpoint",
        "method",
        "responseTime",
        "statusCode",
        "timestamp",
      ],
      properties: {
        appId: { bsonType: "string" },
        endpoint: { bsonType: "string" },
        method: { bsonType: "string" },
        responseTime: { bsonType: "number" },
        statusCode: { bsonType: "number" },
        timestamp: { bsonType: "date" },
        metadata: { bsonType: "object" },
      },
    },
  },
});

db.createCollection("api_requests", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "appId",
        "apiKey",
        "endpoint",
        "method",
        "statusCode",
        "responseTime",
        "timestamp",
        "ip",
      ],
      properties: {
        appId: { bsonType: "string" },
        apiKey: { bsonType: "string" },
        endpoint: { bsonType: "string" },
        method: { bsonType: "string" },
        statusCode: { bsonType: "number" },
        responseTime: { bsonType: "number" },
        timestamp: { bsonType: "date" },
        ip: { bsonType: "string" },
        userAgent: { bsonType: "string" },
        requestSize: { bsonType: "number" },
        responseSize: { bsonType: "number" },
        metadata: { bsonType: "object" },
      },
    },
  },
});

db.createCollection("github_events", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["teamId", "event", "repository", "timestamp", "processed"],
      properties: {
        teamId: { bsonType: "string" },
        event: { bsonType: "string" },
        repository: { bsonType: "string" },
        action: { bsonType: "string" },
        payload: { bsonType: "object" },
        timestamp: { bsonType: "date" },
        processed: { bsonType: "bool" },
        processedAt: { bsonType: "date" },
        aiSummary: { bsonType: "string" },
      },
    },
  },
});

// Create indexes for better performance
// Error logs indexes
db.error_logs.createIndex({ appId: 1, timestamp: -1 });
db.error_logs.createIndex({ severity: 1, timestamp: -1 });
db.error_logs.createIndex({ source: 1, timestamp: -1 });
db.error_logs.createIndex({ resolved: 1, timestamp: -1 });
db.error_logs.createIndex({ timestamp: -1 });
db.error_logs.createIndex({ tags: 1 });

// Performance logs indexes
db.performance_logs.createIndex({ appId: 1, timestamp: -1 });
db.performance_logs.createIndex({ endpoint: 1, timestamp: -1 });
db.performance_logs.createIndex({ method: 1, timestamp: -1 });
db.performance_logs.createIndex({ statusCode: 1, timestamp: -1 });
db.performance_logs.createIndex({ responseTime: 1 });

// API requests indexes
db.api_requests.createIndex({ appId: 1, timestamp: -1 });
db.api_requests.createIndex({ apiKey: 1, timestamp: -1 });
db.api_requests.createIndex({ endpoint: 1, timestamp: -1 });
db.api_requests.createIndex({ ip: 1, timestamp: -1 });

// GitHub events indexes
db.github_events.createIndex({ teamId: 1, timestamp: -1 });
db.github_events.createIndex({ event: 1, timestamp: -1 });
db.github_events.createIndex({ repository: 1, timestamp: -1 });
db.github_events.createIndex({ processed: 1, timestamp: -1 });

// Create a user for the application (optional, can use connection string auth)
// db.createUser({
//   user: 'devtools',
//   pwd: 'password',
//   roles: [
//     { role: 'readWrite', db: 'devtools_saas_logs' }
//   ]
// });

print("MongoDB initialization completed for DevTools SaaS");
print(
  "Collections created: error_logs, performance_logs, api_requests, github_events"
);
print("Indexes created for optimal query performance");

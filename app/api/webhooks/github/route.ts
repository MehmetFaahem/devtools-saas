import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import { env } from "@/lib/env";
import { githubEventsCollection } from "@/lib/db/mongodb/connection";
import { db } from "@/lib/db/postgres/connection";
import { githubIntegrations } from "@/lib/db/postgres/schema";
import { eq } from "drizzle-orm";

function verifySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload);
  const digest = `sha256=${hmac.digest("hex")}`;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(req: NextRequest) {
  try {
    const headersList = headers();
    const signature = headersList.get("x-hub-signature-256");
    const githubEvent = headersList.get("x-github-event");
    const deliveryId = headersList.get("x-github-delivery");

    if (!signature || !githubEvent) {
      return NextResponse.json(
        { error: "Missing required headers" },
        { status: 400 }
      );
    }

    const payload = await req.text();

    // Verify webhook signature
    if (!verifySignature(payload, signature, env.GITHUB_WEBHOOK_SECRET)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const data = JSON.parse(payload);

    // Extract repository information
    const repository = data.repository?.full_name;
    if (!repository) {
      return NextResponse.json(
        { error: "No repository information" },
        { status: 400 }
      );
    }

    // Find the team that has this repository configured
    const integrations = await db
      .select()
      .from(githubIntegrations)
      .where(eq(githubIntegrations.isActive, true));

    let targetTeamId: number | null = null;

    for (const integration of integrations) {
      if (integration.repos.includes(repository)) {
        targetTeamId = integration.teamId;
        break;
      }
    }

    if (!targetTeamId) {
      // Repository not configured for any team, ignore silently
      return NextResponse.json({ message: "Repository not configured" });
    }

    // Store the event in MongoDB
    const githubEventDoc = {
      teamId: targetTeamId.toString(),
      event: githubEvent,
      repository,
      action: data.action,
      payload: data,
      timestamp: new Date(),
      processed: false,
    };

    await githubEventsCollection().insertOne(githubEventDoc);

    // Handle specific events
    switch (githubEvent) {
      case "issues":
        if (data.action === "opened" || data.action === "reopened") {
          // Issue opened/reopened - could trigger AI analysis
          console.log(`New issue in ${repository}: ${data.issue.title}`);
        }
        break;

      case "push":
        if (data.commits) {
          // New commits - could analyze commit messages for bug fixes
          console.log(
            `New commits in ${repository}: ${data.commits.length} commits`
          );
        }
        break;

      case "pull_request":
        if (data.action === "opened") {
          console.log(`New PR in ${repository}: ${data.pull_request.title}`);
        }
        break;

      default:
        console.log(`Received ${githubEvent} event for ${repository}`);
    }

    return NextResponse.json({
      message: "Webhook processed successfully",
      event: githubEvent,
      repository,
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle GET requests (for webhook URL verification)
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const hubChallenge = searchParams.get("hub.challenge");

  if (hubChallenge) {
    return new NextResponse(hubChallenge);
  }

  return NextResponse.json({ message: "GitHub webhook endpoint" });
}

import OpenAI from "openai";
import { env } from "../env";

let openai: OpenAI | null = null;

// Initialize OpenAI client
function getOpenAIClient() {
  if (!openai) {
    try {
      openai = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
      });
    } catch (error) {
      console.error("Failed to initialize OpenAI client:", error);
      return null;
    }
  }
  return openai;
}

export interface BugReportContext {
  issueTitle?: string;
  issueBody?: string;
  errorLogs?: Array<{
    message: string;
    stackTrace?: string;
    source: string;
    severity: string;
    timestamp: Date;
  }>;
  commitMessages?: string[];
  repository?: string;
}

export async function generateBugReportSummary(
  context: BugReportContext
): Promise<string | null> {
  const client = getOpenAIClient();
  if (!client) {
    return null;
  }

  try {
    const prompt = buildBugReportPrompt(context);

    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert software engineer and bug triager. Your job is to analyze GitHub issues, error logs, and commit messages to generate concise, actionable bug reports. Focus on:
1. Root cause analysis
2. Impact assessment
3. Suggested next steps
4. Priority level

Keep your response under 200 words and format it clearly.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 300,
      temperature: 0.3,
    });

    return completion.choices[0]?.message?.content || null;
  } catch (error) {
    console.error("OpenAI API error:", error);
    return null;
  }
}

export async function analyzeErrorPattern(
  errorLogs: Array<{
    message: string;
    stackTrace?: string;
    source: string;
    severity: string;
    timestamp: Date;
  }>
): Promise<string | null> {
  const client = getOpenAIClient();
  if (!client) {
    return null;
  }

  try {
    const errorSummary = errorLogs
      .slice(0, 10) // Limit to 10 most recent errors
      .map(
        (error) =>
          `[${error.severity.toUpperCase()}] ${error.source}: ${error.message}`
      )
      .join("\n");

    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert at analyzing error patterns. Analyze the given error logs and provide insights about:
1. Common patterns or root causes
2. Frequency and severity trends
3. Potential fixes or mitigation strategies
4. Whether errors are related

Keep your response concise and actionable.`,
        },
        {
          role: "user",
          content: `Analyze these error logs:\n\n${errorSummary}`,
        },
      ],
      max_tokens: 250,
      temperature: 0.3,
    });

    return completion.choices[0]?.message?.content || null;
  } catch (error) {
    console.error("OpenAI API error:", error);
    return null;
  }
}

export async function suggestErrorResolution(
  errorMessage: string,
  stackTrace?: string,
  context?: Record<string, any>
): Promise<string | null> {
  const client = getOpenAIClient();
  if (!client) {
    return null;
  }

  try {
    const contextInfo = context
      ? `\nAdditional context: ${JSON.stringify(context, null, 2)}`
      : "";
    const stackInfo = stackTrace ? `\nStack trace:\n${stackTrace}` : "";

    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert developer assistant. Analyze the given error and provide specific, actionable solutions. Include:
1. Likely cause of the error
2. Step-by-step resolution
3. Prevention strategies
4. Related documentation if applicable

Be concise and practical.`,
        },
        {
          role: "user",
          content: `Error: ${errorMessage}${stackInfo}${contextInfo}`,
        },
      ],
      max_tokens: 300,
      temperature: 0.3,
    });

    return completion.choices[0]?.message?.content || null;
  } catch (error) {
    console.error("OpenAI API error:", error);
    return null;
  }
}

function buildBugReportPrompt(context: BugReportContext): string {
  let prompt = "Please analyze this bug report and provide a summary:\n\n";

  if (context.issueTitle) {
    prompt += `**Issue Title:** ${context.issueTitle}\n\n`;
  }

  if (context.issueBody) {
    prompt += `**Issue Description:**\n${context.issueBody}\n\n`;
  }

  if (context.errorLogs && context.errorLogs.length > 0) {
    prompt += `**Related Error Logs:**\n`;
    context.errorLogs.slice(0, 5).forEach((log, index) => {
      prompt += `${index + 1}. [${log.severity.toUpperCase()}] ${log.source}: ${
        log.message
      }\n`;
    });
    prompt += "\n";
  }

  if (context.commitMessages && context.commitMessages.length > 0) {
    prompt += `**Recent Commit Messages:**\n`;
    context.commitMessages.slice(0, 3).forEach((commit, index) => {
      prompt += `${index + 1}. ${commit}\n`;
    });
    prompt += "\n";
  }

  if (context.repository) {
    prompt += `**Repository:** ${context.repository}\n\n`;
  }

  return prompt;
}

export const openaiService = {
  generateBugReportSummary,
  analyzeErrorPattern,
  suggestErrorResolution,
};

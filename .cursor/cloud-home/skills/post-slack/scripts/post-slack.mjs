#!/usr/bin/env node

/**
 * Post a Slack Incoming Webhook message.
 *
 * Usage:
 *   node "$HOME/.cursor/skills/post-slack/scripts/post-slack.mjs" "Hello from CI"
 *   echo "Hello from CI" | node "$HOME/.cursor/skills/post-slack/scripts/post-slack.mjs"
 *
 * SLACK_WEBHOOK_URL is a Runtime Secret. Read it from the environment only —
 * never log, print, or commit the value.
 */

const webhookUrl = process.env.SLACK_WEBHOOK_URL;

function redact(value) {
  const text = typeof value === "string" ? value : String(value ?? "");
  if (!webhookUrl) return text;
  return text.split(webhookUrl).join("[REDACTED]");
}

async function readStdin() {
  if (process.stdin.isTTY) return "";
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function main() {
  if (!webhookUrl) {
    console.error("Missing SLACK_WEBHOOK_URL environment variable (secret).");
    process.exit(1);
  }

  const fromArgs = process.argv.slice(2).join(" ").trim();
  const message = fromArgs || (await readStdin()).trim();

  if (!message) {
    console.error(
      'Usage: node "$HOME/.cursor/skills/post-slack/scripts/post-slack.mjs" <message>',
    );
    console.error(
      '   or: echo <message> | node "$HOME/.cursor/skills/post-slack/scripts/post-slack.mjs"',
    );
    process.exit(1);
  }

  let response;
  try {
    response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message }),
    });
  } catch (error) {
    const detail = redact(error instanceof Error ? error.message : error);
    console.error(`Failed to post to Slack: ${detail}`);
    process.exit(1);
  }

  const body = await response.text();
  if (!response.ok) {
    console.error(`Slack webhook returned ${response.status}: ${redact(body)}`);
    process.exit(1);
  }
}

await main();

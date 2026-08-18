---
name: post-slack
description: Posts a message to Slack via Incoming Webhook using the SLACK_WEBHOOK_URL Runtime Secret. Use when sending Slack notifications, posting CI or agent results to Slack, or running post-slack.mjs.
---

# Post to Slack

Run the script from the Cloud Agent home directory. Do not copy it into the date-fns library tree.

```sh
node "$HOME/.cursor/skills/post-slack/scripts/post-slack.mjs" "message"
echo "message" | node "$HOME/.cursor/skills/post-slack/scripts/post-slack.mjs"
```

`SLACK_WEBHOOK_URL` is a Runtime Secret. Read it from the environment only. Never log, print, or commit the value.

The script POSTs `{"text": message}` to the webhook.

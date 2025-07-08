#!/usr/bin/env bash

set -euo pipefail

# Parse inputs
TYPE="${TYPE}"
TITLE="${TITLE}"
PR_URL="${PR_URL}"
WEBHOOK="${WEBHOOK}"

AVATAR_URL="${AVATAR_URL:-}"
AUTHOR="${AUTHOR:-}"
MERGER="${MERGER:-}"
REVIEWER="${REVIEWER:-}"
REVIEW_STATE="${REVIEW_STATE:-}"  # "approved", "changes_requested", etc.

# Compute color depending on review state if relevant
if [[ "$TYPE" == "reviewed" ]]; then
  case "$REVIEW_STATE" in
    approved) CARD_COLOR="#36A64F" ;;            # Green
    changes_requested) CARD_COLOR="#E03E2F" ;;   # Red
    *) CARD_COLOR="#808080" ;;                   # Gray (neutral)
  esac
else
  CARD_COLOR="#0078D4"  # Default blue for Teams
fi

# Compose message body based on type
BODY_TEXT=""

case "$TYPE" in
  opened)
    BODY_TEXT="**Author:** \`$AUTHOR\`\n\n**Status:** Opened"
    ;;
  closed)
    BODY_TEXT="**Merger:** \`$MERGER\`\n\n**Status:** Merged"
    ;;
  review_requested)
    BODY_TEXT="**Requested:** \`$REVIEWER\`\n\n**By:** \`$AUTHOR\`"
    ;;
  reviewed)
    BODY_TEXT="**Reviewer:** \`$REVIEWER\`\n\n**Status:** \`$REVIEW_STATE\`"
    ;;
  *)
    echo "Unsupported notification type: $TYPE"
    exit 1
    ;;
esac

# Build Adaptive Card JSON
cat <<EOF > card.json
{
  "type": "message",
  "attachments": [
    {
      "contentType": "application/vnd.microsoft.card.adaptive",
      "content": {
        "\$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "type": "AdaptiveCard",
        "version": "1.5",
        "body": [
          {
            "type": "ColumnSet",
            "columns": [
              {
                "type": "Column",
                "width": "auto",
                "items": [
                  {
                    "type": "Image",
                    "url": "$AVATAR_URL",
                    "size": "Small",
                    "style": "Person"
                  }
                ]
              },
              {
                "type": "Column",
                "width": "stretch",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "$TITLE",
                    "wrap": true,
                    "weight": "Bolder",
                    "size": "Medium",
                    "color": "Accent"
                  },
                  {
                    "type": "TextBlock",
                    "text": "$BODY_TEXT",
                    "wrap": true,
                    "separator": true,
                    "color": "$CARD_COLOR"
                  }
                ]
              }
            ]
          }
        ],
        "actions": [
          {
            "type": "Action.OpenUrl",
            "title": "View Pull Request",
            "url": "$PR_URL"
          }
        ]
      }
    }
  ]
}
EOF

# Send the message
curl -s -X POST -H "Content-Type: application/json" -d @card.json "$WEBHOOK"

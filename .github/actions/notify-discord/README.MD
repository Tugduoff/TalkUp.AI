# Dsicord notifications Action

This custom GitHub Action is designed to send notifications to a Discord channel. It can be used to inform about various events such as build completions, test results, or deployment statuses.

## Features

This action performs the following:
- **Discord Notifications**: Sends messages to a specified Discord channel using a webhook URL.
- **Customizable Messages**: Allows customization of the message content, including title, description, and color.

## Usage
To use this action, you can include it as follows:

```yaml
name: Notify Discord
on:
  push:
    branches:
      - main
jobs:
    notify:
        runs-on: ubuntu-latest
        steps:
        - name: Notify Discord
            uses: ./.github/actions/notify-discord
            with:
                webhook: ${{ secrets.DISCORD_WEBHOOK_URL }}
                title: 'Build Notification'
                description: 'The build has completed successfully.'
                color: '3066993' # Optional, default is 3066993 (blue)
                usernames: 'BhuvanArn' # Opional, it is used to mention users in the Discord channel
```

Be aware to use 'if' condition if you want to use it for a specific event, such as PR merge...

# Teams notifications Action

This custom GitHub Action is designed to send notifications to a Microsoft Teams channel. It can be used to inform about various events such as build completions, test results, or deployment statuses.

## Features

This action performs the following:
- **Teams Notifications**: Sends messages to a specified Microsoft Teams channel using a webhook URL.
- **Customizable Messages**: Allows customization of the message content, including title, description, and color.

## Usage
To use this action, you can include it as follows:

```yaml
name: Notify Teams
on:
  push:
    branches:
      - main
jobs:
    notify:
        runs-on: ubuntu-latest
        steps:
        - name: Notify Teams
            uses: ./.github/actions/notify-teams
            with:
                webhook: ${{ secrets.TEAMS_WEBHOOK_URL }}
                title: 'Pull Request Merged'
                description: 'A pull request has been merged successfully.'
                merger: ${{ github.actor }}
                type: 'closed'
                author: ${{ github.event.pull_request.user.login }}
                avatar_url: ${{ github.actor.avatar_url }}
                pr_url: ${{ github.event.pull_request.html_url }}
```

Be aware to use 'if' condition if you want to use it for a specific event, such as PR merge...

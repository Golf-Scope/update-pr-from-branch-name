# Update Pull Request from Branch Name

## Overview

The **Update Pull Request from Branch** GitHub Action is designed to automatically update the title and body of a pull request (PR) based on the branch name. This action is especially useful when working with PRs that follow a specific naming convention, containing an issue ticket number and a summary.

**Authors**: kigary + seankarson

### Features

- Automatically updates the PR title and body based on the branch name.
- Configurable issue ticket regex for matching issue ticket numbers.

## Inputs

This action requires the following inputs:

- `repo-token`: The `GITHUB_TOKEN` secret for making GitHub API requests. It should have write access to the repository.
- `issue-ticket-regex`: A regular expression to match and extract the issue ticket number from the branch name.

## Outputs

This action sets the following outputs that can be used in subsequent workflow steps:

- `issue-ticket-number`: The extracted issue ticket number from the branch name.
- `pull-request-title`: The updated PR title.
- `pull-request-body`: The updated PR body.

## Usage

To use this GitHub Action in your workflow, create a YAML file (e.g., `.github/workflows/update-pr.yml`) in your repository with the following configuration:

```yaml
name: Update PR

on:
  pull_request:
    types:
      - opened

jobs:
  update_pr:
    runs-on: ubuntu-latest

    steps:
      - name: Check out code
        uses: actions/checkout@v2

      - name: Update PR
        id: update_pr
        uses: Golf-Scope/update-pr-from-branch-name@v1.1.2
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          issue-ticket-regex: '(GOLF-\d+)'
```

In this example, the action will trigger when a pull request is opened. Customize the inputs to match your repository's naming conventions and requirements.

## Behavior

1. The action extracts the issue ticket number from the branch name using the specified `issue-ticket-regex`.
2. The PR title is prepended with the issue ticket number like `[GOLF-123]`
3. The action appends an issue ticket link to the PR body.

## Deploying
```bash
npm i -g @vercel/ncc
npm install
ncc build index.js
git commit -a -m "Commit message" 
git tag -a -m "Tag description" v1.1.3
git push --follow-tags
# Update references to the action version in other repositories 
```
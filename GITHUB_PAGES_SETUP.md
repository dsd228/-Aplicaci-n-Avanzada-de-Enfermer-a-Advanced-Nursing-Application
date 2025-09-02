# GitHub Pages Setup Instructions

This document provides step-by-step instructions to complete the GitHub Pages deployment setup after the workflow changes have been applied.

## Required Repository Settings Changes

### 1. Enable GitHub Pages with GitHub Actions

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Save the changes

### 2. Configure Workflow Permissions

1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select **Read and write permissions**
3. Check **Allow GitHub Actions to create and approve pull requests** (if needed)
4. Click **Save**

### 3. Verify Environment Settings (Optional)

1. Go to **Settings** → **Environments**
2. If `github-pages` environment doesn't exist, it will be created automatically
3. You can add protection rules if needed (e.g., required reviewers)

## Workflow Features

The updated workflow includes:

- ✅ Support for multiple branches (`main`, `app3`, and `copilot/**` branches)
- ✅ Manual workflow triggering via `workflow_dispatch`
- ✅ Proper permissions for GitHub Pages deployment
- ✅ Uses latest GitHub Pages actions for better reliability
- ✅ Automatic `gh-pages` branch creation (no manual creation needed)
- ✅ Static site deployment (no build process required)

## Testing the Deployment

1. After applying the repository settings above, push a commit to any of the supported branches
2. Check the **Actions** tab to see the workflow run
3. Once completed, your site will be available at: `https://dsd228.github.io/-Aplicaci-n-Avanzada-de-Enfermer-a-Advanced-Nursing-Application/`

## Troubleshooting

If you encounter issues:

1. **Check workflow runs** in the Actions tab for error details
2. **Verify permissions** are set correctly as described above
3. **Ensure GitHub Pages source** is set to "GitHub Actions"
4. **Check branch protection rules** that might prevent deployment

## Changes Made

- Removed redundant `deploy.yml` workflow file
- Updated `pages.yml` to use modern GitHub Pages actions
- Added proper permissions configuration
- Configured support for multiple branches
- Added manual workflow triggering capability
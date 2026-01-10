# 🔄 GitHub Actions CI/CD Guide

## What is GitHub Actions?

GitHub Actions is a **CI/CD (Continuous Integration/Continuous Deployment)** platform built into GitHub. It automatically runs workflows when certain events happen in your repository.

---

## 🤔 Why GitHub Actions is Important

### Without CI/CD

```
Developer pushes code → Manual testing → Manual deployment → Hope nothing breaks!

Problems:
❌ Bugs reach production
❌ Inconsistent testing
❌ Slow deployments
❌ Human errors
```

### With GitHub Actions

```
Developer pushes code → Automatic tests → Automatic deployment → Confidence!

Benefits:
✅ Every change is tested automatically
✅ Bugs caught before reaching production
✅ Fast, consistent deployments
✅ No manual intervention needed
```

---

## 📁 Workflow Files in This Project

Located in `.github/workflows/`:

| Workflow               | Purpose                        | Trigger                         |
| ---------------------- | ------------------------------ | ------------------------------- |
| `ci.yml`               | Run tests on all apps/services | Pull requests, pushes to main   |
| `publish-packages.yml` | Publish npm packages           | Push to main (packages changed) |
| `deploy-vercel.yml`    | Deploy to Vercel               | Push to main                    |
| `deploy-storybook.yml` | Deploy Storybook docs          | Push to main                    |

---

## 🏗️ CI/CD Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEVELOPER WORKFLOW                            │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     1. GIT PUSH                                  │
│           Developer pushes code to GitHub                        │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  2. GITHUB ACTIONS TRIGGERED                     │
│                                                                  │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│   │   ci.yml    │  │  publish-   │  │   deploy-   │             │
│   │   (Tests)   │  │ packages.yml│  │  vercel.yml │             │
│   └─────────────┘  └─────────────┘  └─────────────┘             │
│         │                │                │                      │
│         ▼                ▼                ▼                      │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│   │ Run Jest/   │  │ Build &     │  │ Deploy to   │             │
│   │ Vitest tests│  │ Publish npm │  │ Vercel      │             │
│   └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     3. RESULTS                                   │
│                                                                  │
│   ✅ All tests pass → Merge allowed, Deploy triggered           │
│   ❌ Tests fail → PR blocked, Developer notified                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Workflow Explained: ci.yml

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  # Detect which files changed
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      admin-app: ${{ steps.changes.outputs.admin-app }}
      seller-app: ${{ steps.changes.outputs.seller-app }}
      storefront-app: ${{ steps.changes.outputs.storefront-app }}
      # ... more outputs
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v2
        id: changes
        with:
          filters: |
            admin-app:
              - 'apps/admin-app/**'
            seller-app:
              - 'apps/seller-app/**'
            # ... more filters

  # Test Admin App (only if changed)
  test-admin-app:
    needs: detect-changes
    if: needs.detect-changes.outputs.admin-app == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Build shared packages
        run: |
          yarn workspace @3asoftwares/types build
          yarn workspace @3asoftwares/utils build
          yarn workspace @3asoftwares/ui build:lib

      - name: Run tests
        run: yarn workspace @3asoftwares/admin-app test --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  # Similar jobs for other apps/services...
```

---

## 📋 Workflow Explained: publish-packages.yml

```yaml
name: Publish Packages

on:
  push:
    branches: [main]
    paths:
      - 'packages/**'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Build packages
        run: |
          yarn workspace @3asoftwares/types build
          yarn workspace @3asoftwares/utils build
          yarn workspace @3asoftwares/ui build:lib

      - name: Publish to npm
        run: |
          cd packages/types && npm publish --access public
          cd ../utils && npm publish --access public
          cd ../ui-library && npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 📋 Workflow Explained: deploy-vercel.yml

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy-auth-service:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_AUTH_SERVICE_ID }}
          working-directory: ./services/auth-service

  # Similar jobs for other services...
```

---

## 🔐 Required Secrets

Set these in GitHub → Repository → Settings → Secrets:

| Secret                | Purpose                      |
| --------------------- | ---------------------------- |
| `NPM_TOKEN`           | Publish packages to npm      |
| `VERCEL_TOKEN`        | Deploy to Vercel             |
| `VERCEL_ORG_ID`       | Vercel organization ID       |
| `VERCEL_*_PROJECT_ID` | Project IDs for each service |
| `CODECOV_TOKEN`       | Upload test coverage         |

---

## 🎯 Smart Change Detection

The CI workflow uses **path filtering** to only run tests for changed code:

```yaml
# If only admin-app changed:
✅ test-admin-app runs
❌ test-seller-app skipped (saves time!)
❌ test-storefront-app skipped
❌ test-services skipped
```

This makes CI **faster and cheaper** by not running unnecessary tests.

---

## 📊 Workflow Status Badges

Add to README.md:

```markdown
![CI](https://github.com/3asoftwares/E-Commerce/actions/workflows/ci.yml/badge.svg)
![Publish](https://github.com/3asoftwares/E-Commerce/actions/workflows/publish-packages.yml/badge.svg)
![Deploy](https://github.com/3asoftwares/E-Commerce/actions/workflows/deploy-vercel.yml/badge.svg)
```

---

## 💡 Benefits Summary

| Benefit                    | Description                               |
| -------------------------- | ----------------------------------------- |
| **🔍 Early Bug Detection** | Catch issues before they reach production |
| **⚡ Fast Feedback**       | Know within minutes if code is broken     |
| **🤖 Automation**          | No manual testing or deployment needed    |
| **📊 Visibility**          | Everyone sees build status                |
| **🛡️ Quality Gate**        | PRs can't merge if tests fail             |
| **📈 Consistency**         | Same process every time                   |

---

## 🔧 Troubleshooting

### Common Issues

| Issue                | Solution                                 |
| -------------------- | ---------------------------------------- |
| Workflow not running | Check trigger conditions (branch, paths) |
| Tests failing        | View logs in Actions tab                 |
| Secrets not working  | Verify secret names match exactly        |
| npm publish fails    | Check NPM_TOKEN is valid                 |
| Vercel deploy fails  | Verify project IDs and token             |

### View Workflow Logs

1. Go to GitHub repository
2. Click "Actions" tab
3. Select the workflow run
4. Click on the failed job
5. Expand steps to see detailed logs

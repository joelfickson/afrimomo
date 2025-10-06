# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the Afrimomo monorepo.

## Available Workflows

### SDK Release

**File**: `release.yml`
**Trigger**: Manual (workflow_dispatch)
**Purpose**: Release the Afrimomo SDK package

**Usage**:
1. Go to Actions tab in GitHub
2. Select "Release" workflow
3. Click "Run workflow"
4. Choose release type:
   - `major` - Breaking changes (1.0.0 → 2.0.0)
   - `minor` - New features (1.0.0 → 1.1.0)
   - `patch` - Bug fixes (1.0.0 → 1.0.1)
   - `beta` - Pre-release (1.0.0 → 1.0.1-beta.1)

**What it does**:
- Bumps version in `packages/sdk/package.json`
- Builds the SDK
- Updates CHANGELOG.md
- Publishes to npm with appropriate tag
- Creates GitHub release with tag `v{version}`

---

### MCP Release

**File**: `release-mcp.yml`
**Trigger**: Manual (workflow_dispatch)
**Purpose**: Release the Afrimomo MCP Server package

**Usage**:
1. Go to Actions tab in GitHub
2. Select "Release MCP" workflow
3. Click "Run workflow"
4. Choose release type:
   - `major` - Breaking changes (1.0.0 → 2.0.0)
   - `minor` - New features (1.0.0 → 1.1.0)
   - `patch` - Bug fixes (1.0.0 → 1.0.1)
   - `beta` - Pre-release (1.0.0 → 1.0.1-beta.1)

**What it does**:
- Bumps version in `packages/afrimomo-mcp/package.json`
- Builds the MCP server
- Updates CHANGELOG.md
- Publishes to npm with appropriate tag
- Creates GitHub release with tag `afrimomo-mcp-v{version}`

---

### SDK Pull Request

**File**: `pr.yml`
**Trigger**: Automatic on PRs to `main` branch
**Purpose**: Validate SDK changes before merging

**What it does**:
- Installs dependencies with pnpm
- Runs type checking (build)
- Runs linting
- Runs tests

---

### MCP Pull Request

**File**: `pr-mcp.yml`
**Trigger**: Automatic on PRs to `main` branch affecting MCP package
**Purpose**: Validate MCP Server changes before merging

**What it does**:
- Installs dependencies with npm
- Builds the TypeScript project
- Validates build output
- Tests package installation
- Checks for required files
- Validates package.json format

## Release Process

### First-Time Setup

Before releasing, ensure you have:

1. **NPM_TOKEN secret** configured in GitHub repository settings
   - Go to Settings → Secrets and variables → Actions
   - Add `NPM_TOKEN` with your npm access token

2. **Permissions** set correctly (already configured in workflows):
   - contents: write
   - packages: write
   - pull-requests: write
   - issues: write

### Release Checklist

#### For SDK Releases:

- [ ] All changes are merged to main branch
- [ ] Tests are passing
- [ ] Documentation is updated
- [ ] Run "Release" workflow with appropriate release type
- [ ] Verify release on npm: https://www.npmjs.com/package/afrimomo-sdk
- [ ] Verify GitHub release is created

#### For MCP Releases:

- [ ] All changes are merged to main branch
- [ ] Build is successful
- [ ] Documentation is updated (README, INSTALLATION)
- [ ] Run "Release MCP" workflow with appropriate release type
- [ ] Verify release on npm: https://www.npmjs.com/package/afrimomo-mcp
- [ ] Verify GitHub release is created
- [ ] Test installation: `npx afrimomo-mcp@latest`

### Version Management

The workflows automatically handle versioning:

**For non-beta releases**:
- Fetches latest published version from npm
- Increments according to release type (major/minor/patch)

**For beta releases**:
- Finds latest beta version
- Increments beta number (e.g., 1.0.0-beta.1 → 1.0.0-beta.2)
- If no beta exists, creates first beta from next patch version

### Tagging Strategy

**SDK Tags**: `v{version}`
- Example: `v0.0.1`, `v1.0.0`, `v1.0.1-beta.1`

**MCP Tags**: `afrimomo-mcp-v{version}`
- Example: `afrimomo-mcp-v0.0.1`, `afrimomo-mcp-v1.0.0`

This allows both packages to have independent versioning in the same repository.

## Troubleshooting

### Release Workflow Fails

**Issue**: Version bump fails
- **Cause**: Version might already exist on npm
- **Solution**: Check npm for published versions, adjust if needed

**Issue**: npm publish fails with 403
- **Cause**: NPM_TOKEN is invalid or missing
- **Solution**: Update NPM_TOKEN secret in GitHub settings

**Issue**: GitHub release creation fails
- **Cause**: Tag already exists
- **Solution**: Delete the tag and re-run workflow

### PR Workflow Fails

**Issue**: Build fails in PR
- **Cause**: TypeScript errors or missing dependencies
- **Solution**: Run `npm run build` locally and fix errors

**Issue**: Package installation test fails
- **Cause**: Missing files or incorrect package.json
- **Solution**: Ensure all files in `files` array exist and are built

## Development

### Testing Workflows Locally

You can test parts of the workflow locally:

**SDK**:
```bash
cd packages/sdk
pnpm install
pnpm build
pnpm test
```

**MCP**:
```bash
cd packages/afrimomo-mcp
npm install
npm run build
npm pack  # Test packaging
```

### Modifying Workflows

When modifying workflows:

1. Test syntax with `actionlint` or GitHub's workflow editor
2. Create a PR to test PR workflows
3. Use workflow_dispatch for manual testing
4. Check workflow runs in Actions tab

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)


# Available Scripts Documentation

This document provides detailed information about all available npm/yarn scripts in the Wang Sammo project, including their purpose, usage, and expected output.

## 📋 Table of Contents

- [Development Scripts](#development-scripts)
- [Build Scripts](#build-scripts)
- [Quality Assurance Scripts](#quality-assurance-scripts)
- [Database Scripts](#database-scripts)
- [Utility Scripts](#utility-scripts)
- [Deployment Scripts](#deployment-scripts)

---

## 🔧 Development Scripts

### `npm run dev`

**Purpose**: Starts the development server with hot module replacement (HMR).

**Usage**:
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

**Expected Output**:
```
  VITE v5.0.0  ready in 1234 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: http://192.168.1.100:8080/
  ➜  press h + enter to show help
```

**Common Use Cases**:
- Primary development workflow
- Local testing and debugging
- Hot reloading during development

**Environment Variables Required**:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**Configuration**:
- Server runs on port 8080
- Accessible on all network interfaces (`::`)
- Configured in `vite.config.ts`

---

### `npm run preview`

**Purpose**: Preview the production build locally before deployment.

**Usage**:
```bash
npm run build && npm run preview
```

**Expected Output**:
```
  ➜  Local:   http://localhost:4173/
  ➜  Network: http://192.168.1.100:4173/
```

**Common Use Cases**:
- Testing production build locally
- Performance testing
- Final QA before deployment

**Prerequisites**:
- Must run `npm run build` first
- Production environment variables

---

## 🏗 Build Scripts

### `npm run build`

**Purpose**: Creates an optimized production build of the application.

**Usage**:
```bash
npm run build
```

**Expected Output**:
```
vite v5.0.0 building for production...
✓ 1234 modules transformed.
dist/index.html                  1.23 kB │ gzip:  0.76 kB
dist/assets/index-abc123.css     12.34 kB │ gzip:  3.45 kB
dist/assets/index-def456.js     123.45 kB │ gzip: 45.67 kB
✓ built in 5.67s
```

**Output Directory**: `dist/`

**Common Use Cases**:
- Production deployment preparation
- Performance optimization
- Static file generation

**Build Optimizations**:
- Code splitting
- Tree shaking
- Asset optimization
- Bundle compression

**Environment Variables Required**:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

### `npm run build:analyze`

**Purpose**: Analyze the bundle size and composition.

**Usage**:
```bash
npm run build:analyze
```

**Expected Output**:
- Interactive bundle analyzer in browser
- Detailed breakdown of chunk sizes
- Dependency analysis

**Configuration**:
```javascript
// Add to package.json
"build:analyze": "vite build --mode analyze"
```

---

## ✅ Quality Assurance Scripts

### `npm run lint`

**Purpose**: Run ESLint to check code quality and style consistency.

**Usage**:
```bash
npm run lint
```

**Expected Output**:
```bash
# No issues
✓ No ESLint warnings or errors

# With issues
src/components/Example.tsx
  10:5  error  'React' is defined but never used  @typescript-eslint/no-unused-vars
  15:3  warn   Missing return type annotation     @typescript-eslint/explicit-function-return-type

✖ 2 problems (1 error, 1 warning)
```

**Common Use Cases**:
- Pre-commit code quality checks
- Continuous integration
- Code review preparation

**Configuration File**: `eslint.config.js`

---

### `npm run lint:fix`

**Purpose**: Automatically fix ESLint issues that can be resolved automatically.

**Usage**:
```bash
npm run lint:fix
```

**Expected Output**:
```bash
✓ 15 problems fixed automatically
⚠ 3 problems require manual attention
```

**Configuration**:
```json
{
  "scripts": {
    "lint:fix": "eslint . --fix --ext ts,tsx"
  }
}
```

---

### `npm run type-check`

**Purpose**: Run TypeScript type checking without emitting files.

**Usage**:
```bash
npm run type-check
```

**Expected Output**:
```bash
# Success
✓ TypeScript compilation completed successfully

# With errors
src/types/index.ts(15,3): error TS2322: Type 'string' is not assignable to type 'number'.
```

**Common Use Cases**:
- Type safety validation
- Pre-build verification
- IDE integration

**Configuration**:
```json
{
  "scripts": {
    "type-check": "tsc --noEmit"
  }
}
```

---

### `npm run format`

**Purpose**: Format code using Prettier for consistent styling.

**Usage**:
```bash
npm run format
```

**Expected Output**:
```bash
✓ 42 files formatted
```

**Configuration**:
```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\""
  }
}
```

---

### `npm run test`

**Purpose**: Run the test suite using Vitest.

**Usage**:
```bash
npm run test
```

**Expected Output**:
```bash
 ✓ src/components/Button.test.tsx (3)
 ✓ src/utils/validation.test.ts (5)
 ✓ src/hooks/useAuth.test.tsx (4)

 Test Files  3 passed (3)
      Tests  12 passed (12)
   Start at  10:30:15
   Duration  1.23s
```

**Common Use Cases**:
- Unit testing
- Integration testing
- Continuous integration

---

### `npm run test:watch`

**Purpose**: Run tests in watch mode for development.

**Usage**:
```bash
npm run test:watch
```

**Expected Output**:
```bash
 RERUN  src/components/Button.test.tsx x1

 ✓ src/components/Button.test.tsx (3)

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  10:30:15
   Duration  234ms

 Watching for file changes...
```

---

### `npm run test:coverage`

**Purpose**: Generate test coverage reports.

**Usage**:
```bash
npm run test:coverage
```

**Expected Output**:
```bash
 % Coverage report from c8
-----------------------|---------|----------|---------|---------|
File                   | % Stmts | % Branch | % Funcs | % Lines |
-----------------------|---------|----------|---------|---------|
All files              |   85.45 |    78.23 | 90.12   | 85.45   |
 src/components        |   92.15 |    85.67 | 95.23   | 92.15   |
 src/utils            |   78.45 |    65.23 | 82.15   | 78.45   |
-----------------------|---------|----------|---------|---------|
```

---

## 🗄 Database Scripts

### `npm run db:generate-types`

**Purpose**: Generate TypeScript types from Supabase schema.

**Usage**:
```bash
npm run db:generate-types
```

**Expected Output**:
```bash
✓ Generated types for project: your-project-id
✓ Types written to src/integrations/supabase/types.ts
```

**Prerequisites**:
- Supabase CLI installed
- Authenticated with Supabase
- Project linked

**Configuration**:
```json
{
  "scripts": {
    "db:generate-types": "supabase gen types typescript --project-id your-project-id > src/integrations/supabase/types.ts"
  }
}
```

---

### `npm run db:reset`

**Purpose**: Reset local database to match remote schema.

**Usage**:
```bash
npm run db:reset
```

**Expected Output**:
```bash
✓ Database reset completed
✓ Migrations applied: 3
✓ Seed data loaded
```

**Warning**: ⚠️ This will destroy all local data!

---

### `npm run db:migrate`

**Purpose**: Apply pending database migrations.

**Usage**:
```bash
npm run db:migrate
```

**Expected Output**:
```bash
✓ Migration 001_complaints_system.sql applied
✓ Migration 002_add_indexes.sql applied
✓ All migrations completed successfully
```

---

## 🛠 Utility Scripts

### `npm run clean`

**Purpose**: Clean build artifacts and dependencies.

**Usage**:
```bash
npm run clean
```

**Expected Output**:
```bash
✓ Removed dist/ directory
✓ Removed node_modules/ directory
✓ Removed package-lock.json
✓ Clean completed
```

**Configuration**:
```json
{
  "scripts": {
    "clean": "rm -rf dist node_modules package-lock.json"
  }
}
```

---

### `npm run deps:update`

**Purpose**: Update dependencies to latest versions.

**Usage**:
```bash
npm run deps:update
```

**Expected Output**:
```bash
✓ Updated 15 dependencies
⚠ 3 dependencies have breaking changes
ℹ Run npm install to apply changes
```

**Configuration**:
```json
{
  "scripts": {
    "deps:update": "npx npm-check-updates -u"
  }
}
```

---

### `npm run analyze:bundle`

**Purpose**: Analyze bundle size and dependencies.

**Usage**:
```bash
npm run analyze:bundle
```

**Expected Output**:
- Opens bundle analyzer in browser
- Shows interactive treemap of bundle contents
- Identifies large dependencies

---

## 🚀 Deployment Scripts

### `npm run deploy:staging`

**Purpose**: Deploy to staging environment.

**Usage**:
```bash
npm run deploy:staging
```

**Expected Output**:
```bash
✓ Building for staging...
✓ Uploading to staging server...
✓ Deployment completed: https://staging.wangsammo.app
```

**Environment Variables Required**:
- `STAGING_DEPLOY_TOKEN`
- `STAGING_SERVER_URL`

---

### `npm run deploy:production`

**Purpose**: Deploy to production environment.

**Usage**:
```bash
npm run deploy:production
```

**Expected Output**:
```bash
✓ Building for production...
✓ Running production tests...
✓ Uploading to production server...
✓ Deployment completed: https://wangsammo.app
```

**Prerequisites**:
- All tests must pass
- Production environment variables configured
- Manual approval (if configured)

---

## 📊 Performance Scripts

### `npm run perf:audit`

**Purpose**: Run performance audits using Lighthouse.

**Usage**:
```bash
npm run perf:audit
```

**Expected Output**:
```bash
Running Lighthouse audit...
✓ Performance: 95/100
✓ Accessibility: 98/100
✓ Best Practices: 92/100
✓ SEO: 89/100
```

---

### `npm run perf:monitor`

**Purpose**: Start performance monitoring in development.

**Usage**:
```bash
npm run perf:monitor
```

**Expected Output**:
- Real-time performance metrics
- Bundle size tracking
- Memory usage monitoring

---

## 🔧 Custom Script Configuration

### Adding New Scripts

To add new scripts to the project, update `package.json`:

```json
{
  "scripts": {
    "custom:script": "your-command-here",
    "custom:complex": "command1 && command2 || command3"
  }
}
```

### Script Composition

Scripts can be composed for complex workflows:

```json
{
  "scripts": {
    "full-check": "npm run lint && npm run type-check && npm run test && npm run build",
    "prepare-release": "npm run full-check && npm run test:coverage && npm run perf:audit"
  }
}
```

### Environment-Specific Scripts

Configure different scripts for different environments:

```json
{
  "scripts": {
    "dev:local": "VITE_ENV=local npm run dev",
    "dev:staging": "VITE_ENV=staging npm run dev",
    "build:staging": "VITE_ENV=staging npm run build",
    "build:production": "VITE_ENV=production npm run build"
  }
}
```

---

## 🔍 Troubleshooting Scripts

### Common Script Issues

1. **Permission Errors**
   ```bash
   chmod +x ./scripts/deploy.sh
   ```

2. **Environment Variable Issues**
   ```bash
   # Check if variables are loaded
   npm run env:check
   ```

3. **Dependency Issues**
   ```bash
   npm run clean && npm install
   ```

### Debug Scripts

```json
{
  "scripts": {
    "debug:dev": "DEBUG=vite:* npm run dev",
    "debug:build": "DEBUG=* npm run build",
    "debug:test": "DEBUG=vitest:* npm run test"
  }
}
```

---

## 📝 Script Best Practices

1. **Use descriptive names**: `test:unit` instead of `test1`
2. **Group related scripts**: Use prefixes like `build:`, `test:`, `deploy:`
3. **Chain commands carefully**: Use `&&` for required success, `||` for fallbacks
4. **Document complex scripts**: Add comments in package.json
5. **Use cross-platform commands**: Avoid OS-specific commands when possible

---

**For more information about specific scripts or to request new scripts, please check the project documentation or create an issue.**

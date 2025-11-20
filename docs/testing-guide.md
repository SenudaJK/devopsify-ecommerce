# Testing & Quality Assurance Guide

## 📋 Overview

DevOpsify E-Commerce has comprehensive testing coverage across multiple layers:

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and data flows
- **End-to-End Tests**: Test complete user workflows
- **Security Scans**: Automated vulnerability detection
- **Code Quality**: Linting, type checking, and formatting

## 🧪 Backend Testing

### Running Tests

```bash
cd src/backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run integration tests only
npm run test:integration

# Run in watch mode
npm test:watch

# Run all tests with verbose output
npm run test:all
```

### Test Structure

```
src/backend/src/__tests__/
├── unit/
│   ├── health.test.ts          # Health endpoint tests
│   └── utils.test.ts           # Utility function tests
├── integration/
│   ├── products.integration.test.ts   # Product API tests
│   ├── auth.integration.test.ts       # Authentication tests
│   └── cart.integration.test.ts       # Shopping cart tests
```

### Integration Test Coverage

#### Products API (`products.integration.test.ts`)
- ✅ GET /api/products - List all products
- ✅ GET /api/products/:id - Get single product
- ✅ Product data integrity validation
- ✅ Error handling (404, 500)
- ✅ Performance tests (response time < 1000ms)
- ✅ Concurrent request handling

#### Authentication API (`auth.integration.test.ts`)
- ✅ POST /api/auth/login - User login
- ✅ POST /api/auth/register - New user registration
- ✅ JWT token generation and validation
- ✅ Password security (no exposure in responses)
- ✅ SQL injection prevention
- ✅ Rate limiting tests
- ✅ Token-based authentication

#### Cart API (`cart.integration.test.ts`)
- ✅ GET /api/cart - Retrieve cart
- ✅ POST /api/cart/items - Add items
- ✅ PUT /api/cart/items/:id - Update quantity
- ✅ DELETE /api/cart/items/:id - Remove items
- ✅ Cart total calculation
- ✅ Quantity validation
- ✅ Rapid update handling

### Test Configuration

```json
// jest.config.js
{
  "testEnvironment": "node",
  "collectCoverageFrom": [
    "src/**/*.ts",
    "!src/**/*.test.ts"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 70,
      "functions": 70,
      "lines": 70,
      "statements": 70
    }
  }
}
```

## 🎭 Frontend Testing

### Running Tests

```bash
cd src/frontend

# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed

# Debug E2E tests
npm run test:e2e:debug

# View E2E test report
npm run test:e2e:report
```

### E2E Test Structure

```
src/frontend/tests/e2e/
├── auth.spec.ts        # Authentication flow tests
├── products.spec.ts    # Product browsing tests
└── cart.spec.ts        # Shopping cart tests
```

### E2E Test Coverage

#### Authentication Flow (`auth.spec.ts`)
- ✅ Display login form
- ✅ Login with valid credentials
- ✅ Show errors for invalid credentials
- ✅ Email format validation
- ✅ Logout functionality
- ✅ Session persistence after reload
- ✅ Network error handling
- ✅ Keyboard navigation
- ✅ ARIA accessibility labels

#### Product Browsing (`products.spec.ts`)
- ✅ Display product list
- ✅ Show product details (name, price, image)
- ✅ Filter by category
- ✅ Search functionality
- ✅ Handle empty search results
- ✅ Navigate to product details
- ✅ Lazy load images
- ✅ Loading states
- ✅ Responsive design (mobile)
- ✅ Performance (< 3s load time)

#### Shopping Cart (`cart.spec.ts`)
- ✅ Open cart modal/page
- ✅ Show empty cart message
- ✅ Add items to cart
- ✅ Display correct item details
- ✅ Update item quantity
- ✅ Remove items
- ✅ Calculate total price
- ✅ Persist cart after reload
- ✅ Cart item count badge
- ✅ Prevent negative quantities
- ✅ Handle checkout flow

### Playwright Configuration

```typescript
// playwright.config.ts
{
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium' },
    { name: 'firefox' },
    { name: 'webkit' },
    { name: 'Mobile Chrome' },
    { name: 'Mobile Safari' },
  ],
}
```

## 🔒 Security Testing

### Automated Security Scans

Our CI/CD pipeline includes:

1. **Trivy Vulnerability Scanner**
   - Scans filesystem for vulnerabilities
   - Scans Docker images
   - Checks for CRITICAL and HIGH severity issues

2. **NPM Audit**
   - Backend dependency scanning
   - Frontend dependency scanning
   - Moderate severity threshold

3. **CodeQL Analysis** (GitHub Advanced Security)
   - Static code analysis
   - Security vulnerability detection
   - SARIF report upload

### Running Security Scans Locally

```bash
# Dependency audit (Backend)
cd src/backend
npm audit

# Dependency audit (Frontend)
cd src/frontend
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Trivy filesystem scan
trivy fs .

# Trivy Docker image scan
trivy image ghcr.io/senudajk/devopsify-backend:latest
```

## 📊 Code Quality

### Linting

```bash
# Backend linting
cd src/backend
npm run lint
npm run lint:fix

# Frontend linting
cd src/frontend
npm run lint
npm run lint:fix
```

### Type Checking

```bash
# Backend
cd src/backend
npx tsc --noEmit

# Frontend
cd src/frontend
npm run type-check
```

### Code Formatting

```bash
# Backend
cd src/backend
npm run format

# Frontend
cd src/frontend
npm run format
```

## 🚀 CI/CD Quality Gates

### Pipeline Stages

Our advanced CI/CD pipeline (`quality-gate.yml`) includes:

```yaml
1. Code Quality Checks
   ├── ESLint (Frontend & Backend)
   ├── TypeScript compilation
   └── Prettier formatting

2. Testing
   ├── Backend unit tests
   ├── Backend integration tests
   ├── Frontend unit tests
   └── E2E tests (master/dev only)

3. Security Scanning
   ├── Trivy vulnerability scanner
   ├── NPM audit (dependencies)
   └── Docker image scanning

4. Build Validation
   ├── Build backend (TypeScript → JavaScript)
   ├── Build frontend (React production build)
   └── Artifact upload

5. Docker Build & Push
   ├── Multi-stage builds
   ├── Image tagging (branch, SHA, latest)
   ├── Cache optimization
   └── Multi-platform support

6. Quality Gate Summary
   ├── Result aggregation
   ├── PR comment with status
   └── Pass/fail decision
```

### Quality Gate Criteria

The pipeline **FAILS** if:
- ❌ Code quality checks fail
- ❌ TypeScript compilation errors
- ❌ Backend build fails
- ❌ Frontend build fails

The pipeline **WARNS** but continues if:
- ⚠️ Test failures (with continue-on-error)
- ⚠️ Security vulnerabilities found
- ⚠️ Linting warnings

### Viewing Results

1. **GitHub Actions Tab**: See detailed logs
2. **Pull Request Comments**: Automated quality summary
3. **Security Tab**: Vulnerability reports (SARIF)
4. **Artifacts**: Test reports, coverage, build outputs

## 📈 Test Coverage Goals

| Component | Current | Target |
|-----------|---------|--------|
| Backend API | 70%+ | 80% |
| Frontend Components | 60%+ | 75% |
| Integration Tests | ✅ Complete | Maintain |
| E2E Critical Paths | ✅ Complete | Expand |

## 🔧 Test Development Guidelines

### Writing Good Tests

```typescript
// ✅ GOOD: Descriptive test names
test('should return 404 for non-existent product', async () => {
  const response = await request(app).get('/api/products/invalid-id');
  expect(response.status).toBe(404);
});

// ❌ BAD: Vague test names
test('product test', async () => {
  // ...
});
```

### Test Organization

```typescript
describe('Products API', () => {
  describe('GET /api/products', () => {
    it('should return all products', async () => { /* ... */ });
    it('should return products with correct structure', async () => { /* ... */ });
  });

  describe('GET /api/products/:id', () => {
    it('should return specific product', async () => { /* ... */ });
    it('should return 404 for invalid ID', async () => { /* ... */ });
  });
});
```

### Best Practices

1. **Isolation**: Each test should be independent
2. **Setup/Teardown**: Use beforeEach/afterEach for cleanup
3. **Assertions**: Use specific matchers (toBeGreaterThan vs toBeTruthy)
4. **Error Cases**: Test both success and failure paths
5. **Performance**: Keep tests fast (< 100ms for unit tests)
6. **Coverage**: Aim for meaningful coverage, not 100%

## 🐛 Debugging Tests

### Backend Tests

```bash
# Run single test file
npm test -- health.test.ts

# Run with verbose output
npm test -- --verbose

# Debug with Node inspector
node --inspect-brk node_modules/.bin/jest health.test.ts
```

### Frontend E2E Tests

```bash
# Debug mode (pause execution)
npm run test:e2e:debug

# Headed mode (see browser)
npm run test:e2e:headed

# UI mode (interactive)
npm run test:e2e:ui

# Run specific test file
npx playwright test auth.spec.ts
```

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Trivy Documentation](https://aquasecurity.github.io/trivy/)

## 🎯 Quick Commands Reference

```bash
# Backend
npm test                     # Run all tests
npm run test:coverage        # With coverage
npm run test:integration     # Integration only
npm run lint                 # Check code quality

# Frontend
npm test                     # Run unit tests
npm run test:e2e            # Run E2E tests
npm run test:e2e:ui         # Interactive E2E
npm run lint                 # Check code quality

# Security
npm audit                    # Check dependencies
trivy fs .                   # Scan filesystem
trivy image IMAGE_NAME       # Scan Docker image

# CI/CD
git push                     # Triggers pipeline
# View results in GitHub Actions tab
```

## 🤝 Contributing

When adding new features:

1. ✅ Write tests first (TDD approach recommended)
2. ✅ Ensure all tests pass locally
3. ✅ Check code coverage doesn't decrease
4. ✅ Run linters and fix issues
5. ✅ Push and verify CI/CD pipeline passes
6. ✅ Quality gate must pass before merge

---

**Last Updated**: November 2025  
**Maintained by**: DevOpsify Team

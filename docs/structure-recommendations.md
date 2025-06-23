
# Folder Structure Recommendations

This document analyzes the current folder structure of the Wang Sammo project and provides recommendations for optimization, maintainability, and scalability.

## 📊 Current Structure Analysis

### Current Folder Organization

```
src/
├── components/
│   ├── Navigation.tsx
│   ├── ComplaintForm.tsx
│   ├── QRCodeManager.tsx (⚠️ 209 lines)
│   ├── AnalyticsDashboard.tsx
│   ├── VoiceRecorder.tsx
│   └── ui/ (32 components)
├── pages/
│   ├── Home.tsx
│   ├── Report.tsx
│   ├── Dashboard.tsx
│   ├── Profile.tsx
│   ├── PublicStats.tsx
│   ├── Track.tsx
│   ├── Auth.tsx
│   ├── NotFound.tsx
│   └── Index.tsx
├── contexts/
│   └── LanguageContext.tsx
├── hooks/
│   ├── use-toast.ts
│   └── use-mobile.tsx
├── lib/
│   └── utils.ts
├── utils/
│   └── fileUpload.ts
├── integrations/
│   └── supabase/
└── main.tsx, App.tsx, index.css, etc.
```

## 🎯 Recommended Structure

### Proposed Folder Organization

```
src/
├── app/                          # App-level configuration
│   ├── App.tsx
│   ├── main.tsx
│   └── router.tsx
├── shared/                       # Shared utilities and components
│   ├── components/              # Reusable UI components
│   │   ├── ui/                 # Base UI library (shadcn/ui)
│   │   ├── forms/              # Form-related components
│   │   │   ├── FormField.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   └── VoiceRecorder.tsx
│   │   ├── layout/             # Layout components
│   │   │   ├── Navigation.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── common/             # Common components
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── ConfirmDialog.tsx
│   ├── hooks/                  # Reusable custom hooks
│   │   ├── use-toast.ts
│   │   ├── use-mobile.tsx
│   │   ├── use-auth.ts
│   │   └── use-complaints.ts
│   ├── contexts/               # Global state contexts
│   │   ├── LanguageContext.tsx
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── lib/                    # Core utilities
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   ├── validations.ts
│   │   └── api.ts
│   ├── types/                  # TypeScript type definitions
│   │   ├── complaint.ts
│   │   ├── user.ts
│   │   ├── api.ts
│   │   └── index.ts
│   └── services/               # External service integrations
│       ├── supabase/
│       ├── storage/
│       └── notifications/
├── features/                    # Feature-based modules
│   ├── complaints/
│   │   ├── components/
│   │   │   ├── ComplaintForm/
│   │   │   │   ├── ComplaintForm.tsx
│   │   │   │   ├── ComplaintForm.test.tsx
│   │   │   │   ├── ComplaintFormFields.tsx
│   │   │   │   └── index.ts
│   │   │   ├── ComplaintCard.tsx
│   │   │   └── ComplaintFilters.tsx
│   │   ├── hooks/
│   │   │   ├── useComplaintForm.ts
│   │   │   ├── useComplaintFilters.ts
│   │   │   └── useComplaintActions.ts
│   │   ├── services/
│   │   │   ├── complaintApi.ts
│   │   │   └── fileUpload.ts
│   │   ├── types/
│   │   │   └── complaint.types.ts
│   │   └── utils/
│   │       └── complaintHelpers.ts
│   ├── analytics/
│   │   ├── components/
│   │   │   ├── AnalyticsDashboard/
│   │   │   │   ├── AnalyticsDashboard.tsx
│   │   │   │   ├── StatsCard.tsx
│   │   │   │   ├── ChartContainer.tsx
│   │   │   │   └── index.ts
│   │   │   └── PublicStats.tsx
│   │   ├── hooks/
│   │   │   └── useAnalytics.ts
│   │   └── services/
│   │       └── analyticsApi.ts
│   ├── qr-management/
│   │   ├── components/
│   │   │   ├── QRCodeManager/
│   │   │   │   ├── QRCodeManager.tsx
│   │   │   │   ├── QRCodeGenerator.tsx
│   │   │   │   ├── QRCodePreview.tsx
│   │   │   │   └── QRCodeSettings.tsx
│   │   │   └── QRCodeScanner.tsx
│   │   ├── hooks/
│   │   │   └── useQRCode.ts
│   │   └── services/
│   │       └── qrCodeApi.ts
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   └── services/
│   │       └── authApi.ts
│   └── user-management/
│       ├── components/
│       │   ├── UserProfile.tsx
│       │   └── UserSettings.tsx
│       ├── hooks/
│       │   └── useProfile.ts
│       └── services/
│           └── userApi.ts
├── pages/                       # Page components (thin wrappers)
│   ├── HomePage.tsx
│   ├── ReportPage.tsx
│   ├── DashboardPage.tsx
│   ├── ProfilePage.tsx
│   ├── PublicStatsPage.tsx
│   ├── TrackPage.tsx
│   ├── AuthPage.tsx
│   └── NotFoundPage.tsx
├── assets/                      # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
└── styles/                      # Global styles
    ├── globals.css
    ├── components.css
    └── utilities.css
```

## 🔄 Migration Plan

### Phase 1: Create New Structure (Week 1)

1. **Create new directories**:
   ```bash
   mkdir -p src/app src/shared/{components/{ui,forms,layout,common},hooks,contexts,lib,types,services}
   mkdir -p src/features/{complaints,analytics,qr-management,auth,user-management}/{components,hooks,services,types,utils}
   mkdir -p src/assets/{images,icons,fonts} src/styles
   ```

2. **Move existing files to shared**:
   - `src/hooks/*` → `src/shared/hooks/`
   - `src/contexts/*` → `src/shared/contexts/`
   - `src/lib/*` → `src/shared/lib/`
   - `src/components/ui/*` → `src/shared/components/ui/`

### Phase 2: Feature Extraction (Week 2)

1. **Complaints Feature**:
   - Extract `ComplaintForm.tsx` to `src/features/complaints/components/ComplaintForm/`
   - Move `fileUpload.ts` to `src/features/complaints/services/`
   - Create complaint-specific hooks and types

2. **Analytics Feature**:
   - Move `AnalyticsDashboard.tsx` to `src/features/analytics/components/AnalyticsDashboard/`
   - Break down into smaller components (StatsCard, ChartContainer)

3. **QR Management Feature**:
   - Refactor `QRCodeManager.tsx` (currently 209 lines) into smaller components
   - Create dedicated QR code hooks and services

### Phase 3: Component Refactoring (Week 3)

1. **Break down large components**:
   ```typescript
   // Before: QRCodeManager.tsx (209 lines)
   // After: Multiple focused components
   src/features/qr-management/components/QRCodeManager/
   ├── QRCodeManager.tsx (main container)
   ├── QRCodeGenerator.tsx (generation logic)
   ├── QRCodePreview.tsx (preview display)
   ├── QRCodeSettings.tsx (configuration)
   └── QRCodeInstructions.tsx (usage guide)
   ```

2. **Extract common functionality**:
   - Form validation logic → `src/shared/lib/validations.ts`
   - API utilities → `src/shared/lib/api.ts`
   - Constants → `src/shared/lib/constants.ts`

### Phase 4: Pages Simplification (Week 4)

1. **Convert pages to thin wrappers**:
   ```typescript
   // Before: Dashboard.tsx (contains all logic)
   // After: DashboardPage.tsx (simple wrapper)
   import { DashboardContainer } from '@/features/analytics/components/DashboardContainer';
   
   export default function DashboardPage() {
     return <DashboardContainer />;
   }
   ```

## 📝 Detailed Refactoring Examples

### Example 1: ComplaintForm Refactoring

**Current Structure**:
```
src/components/ComplaintForm.tsx (large monolithic component)
```

**Recommended Structure**:
```
src/features/complaints/components/ComplaintForm/
├── ComplaintForm.tsx              # Main form container
├── ComplaintFormFields.tsx        # Form field components
├── FileUploadSection.tsx          # File upload handling
├── LocationSelector.tsx           # Location selection
├── CategorySelector.tsx           # Category selection
├── ComplaintForm.test.tsx         # Tests
├── ComplaintForm.stories.tsx      # Storybook stories
└── index.ts                       # Export declarations
```

### Example 2: QRCodeManager Refactoring

**Current Structure**:
```
src/components/QRCodeManager.tsx (209 lines - needs refactoring)
```

**Recommended Structure**:
```
src/features/qr-management/components/QRCodeManager/
├── QRCodeManager.tsx              # Main manager (50 lines)
├── QRCodeGenerator.tsx            # Generation logic (40 lines)
├── QRCodePreview.tsx              # Preview display (30 lines)
├── QRCodeSettings.tsx             # Settings form (45 lines)
├── QRCodeInstructions.tsx         # Usage instructions (25 lines)
├── QRCodeDownload.tsx             # Download functionality (20 lines)
└── hooks/
    ├── useQRCodeGeneration.ts     # Generation hook
    └── useQRCodeDownload.ts       # Download hook
```

### Example 3: Analytics Dashboard Refactoring

**Current Structure**:
```
src/components/AnalyticsDashboard.tsx
```

**Recommended Structure**:
```
src/features/analytics/components/AnalyticsDashboard/
├── AnalyticsDashboard.tsx         # Main dashboard
├── StatsCard.tsx                  # Individual stat cards
├── ChartContainer.tsx             # Chart wrapper
├── ComplaintTrends.tsx            # Trend analysis
├── CategoryBreakdown.tsx          # Category statistics
└── TimeRangeSelector.tsx          # Time range controls
```

## 🏗 Implementation Guidelines

### 1. Feature-First Organization

Each feature should be self-contained:
- **Components**: UI components specific to the feature
- **Hooks**: Custom hooks for the feature
- **Services**: API calls and business logic
- **Types**: TypeScript definitions
- **Utils**: Helper functions

### 2. Barrel Exports

Use index.ts files for clean imports:
```typescript
// src/features/complaints/components/index.ts
export { ComplaintForm } from './ComplaintForm';
export { ComplaintCard } from './ComplaintCard';
export { ComplaintFilters } from './ComplaintFilters';

// Usage
import { ComplaintForm, ComplaintCard } from '@/features/complaints/components';
```

### 3. Shared vs Feature Components

**Shared Components** (in `src/shared/components/`):
- Generic UI components
- Layout components
- Common form elements

**Feature Components** (in `src/features/*/components/`):
- Business-specific components
- Feature-coupled components
- Domain-specific logic

### 4. Path Aliases

Update `vite.config.ts` for clean imports:
```typescript
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/shared": path.resolve(__dirname, "./src/shared"),
      "@/features": path.resolve(__dirname, "./src/features"),
      "@/pages": path.resolve(__dirname, "./src/pages"),
    },
  },
});
```

## 🎨 Component Design Principles

### 1. Single Responsibility

Each component should have one clear purpose:
```typescript
// ❌ Bad: Component doing too much
function ComplaintFormWithValidationAndSubmission() {
  // 200+ lines of form logic, validation, and API calls
}

// ✅ Good: Separated concerns
function ComplaintForm() {
  const { formData, validation } = useComplaintForm();
  const { submitComplaint } = useComplaintSubmission();
  // Clean, focused component
}
```

### 2. Composition over Inheritance

Use composition patterns:
```typescript
// ✅ Good: Composable components
function ComplaintForm() {
  return (
    <FormContainer>
      <ComplaintFormFields />
      <FileUploadSection />
      <FormActions />
    </FormContainer>
  );
}
```

### 3. Props Interface Design

Clear, typed props:
```typescript
interface ComplaintFormProps {
  initialData?: Partial<Complaint>;
  onSubmit: (data: ComplaintFormData) => Promise<void>;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}
```

## 📁 Folder Naming Conventions

### Directory Names
- Use kebab-case: `qr-management`, `user-management`
- Be descriptive: `complaint-tracking` not `tracking`
- Group related features: `analytics`, `reporting`

### File Names
- Components: PascalCase (`ComplaintForm.tsx`)
- Hooks: camelCase with 'use' prefix (`useComplaintForm.ts`)
- Services: camelCase with service suffix (`complaintApi.ts`)
- Types: camelCase with type suffix (`complaint.types.ts`)
- Tests: Same as component with `.test.tsx` (`ComplaintForm.test.tsx`)

## 🔧 Tooling Configuration

### ESLint Rules for Structure

Add rules to enforce structure:
```json
{
  "rules": {
    "import/no-relative-parent-imports": "error",
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "pathGroups": [
          {
            "pattern": "@/shared/**",
            "group": "internal",
            "position": "before"
          },
          {
            "pattern": "@/features/**",
            "group": "internal",
            "position": "after"
          }
        ]
      }
    ]
  }
}
```

### File Size Limits

Add limits to prevent large files:
```json
{
  "rules": {
    "max-lines": ["error", { "max": 150, "skipComments": true }],
    "max-lines-per-function": ["error", { "max": 50 }]
  }
}
```

## 📊 Benefits of Proposed Structure

### ✅ Advantages

1. **Scalability**: Easy to add new features without affecting existing ones
2. **Maintainability**: Clear separation of concerns
3. **Testability**: Isolated components are easier to test
4. **Reusability**: Shared components can be used across features
5. **Developer Experience**: Easier to find and modify code
6. **Code Review**: Smaller, focused files are easier to review
7. **Performance**: Better tree-shaking and code splitting

### ⚠️ Considerations

1. **Migration Effort**: Requires significant refactoring time
2. **Learning Curve**: Team needs to adapt to new structure
3. **Import Changes**: Many import statements will need updates
4. **Tool Configuration**: Build tools may need path updates

## 🚀 Next Steps

### Immediate Actions (This Week)

1. **Create new folder structure** (can be done safely)
2. **Start with shared utilities** (low risk, high value)
3. **Identify large components** for refactoring priority

### Short Term (Next 2 Weeks)

1. **Refactor QRCodeManager** (high priority due to size)
2. **Extract complaint-related functionality**
3. **Create feature-specific hooks**

### Long Term (Next Month)

1. **Complete feature extraction**
2. **Implement comprehensive testing**
3. **Add Storybook for component documentation**
4. **Optimize bundle splitting by feature**

## 📚 Additional Resources

- [React Folder Structure Best Practices](https://react.dev/learn/thinking-in-react)
- [Feature-Driven Development](https://en.wikipedia.org/wiki/Feature-driven_development)
- [Component Design Patterns](https://reactpatterns.com/)
- [TypeScript Project Structure](https://typescript-eslint.io/docs/)

---

**This refactoring plan prioritizes maintainability, scalability, and developer experience while minimizing disruption to existing functionality.**

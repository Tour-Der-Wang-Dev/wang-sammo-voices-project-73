
# Project File Structure Explanation

This document provides a comprehensive overview of the Wang Sammo complaint management system file structure, with importance indicators and dependency relationships.

## Root Directory

```
wang-sammo/
├── 🟢 package.json - Project dependencies and scripts configuration
├── 🟢 package-lock.json - Locked dependency versions for reproducible builds
├── 🟢 tsconfig.json - TypeScript compiler configuration
├── 🟡 tsconfig.app.json - TypeScript configuration for application code
├── 🟡 tsconfig.node.json - TypeScript configuration for Node.js tools
├── 🟢 vite.config.ts - Vite bundler configuration with React and path aliases
├── 🟢 tailwind.config.ts - Tailwind CSS configuration with custom colors and animations
├── 🟡 postcss.config.js - PostCSS configuration for CSS processing
├── 🟡 components.json - Shadcn/UI component configuration
├── 🔴 eslint.config.js - ESLint configuration for code quality
├── 🔴 .gitignore - Git ignore patterns
└── 🔴 bun.lockb - Bun package manager lock file
```

## Public Directory

```
public/
├── 🟢 favicon.ico - Browser favicon
├── 🔴 robots.txt - Search engine crawling instructions
└── 🔴 placeholder.svg - Default placeholder image
```

## Source Directory Structure

```
src/
├── 🟢 main.tsx - Application entry point, renders App component
├── 🟢 App.tsx - Root application component with routing and providers
├── 🟡 index.css - Global CSS styles and Tailwind imports
├── 🔴 App.css - Additional application styles
└── 🔴 vite-env.d.ts - Vite environment type definitions
```

### Components Directory

```
src/components/
├── 🟢 Navigation.tsx - Main navigation component (desktop/mobile)
├── 🟢 ComplaintForm.tsx - Core complaint submission form
├── 🟡 QRCodeManager.tsx - QR code generation and management (⚠️ 209 lines - needs refactoring)
├── 🟡 AnalyticsDashboard.tsx - Dashboard analytics and statistics
├── 🔴 VoiceRecorder.tsx - Voice recording functionality
└── ui/ - Shadcn/UI component library
    ├── 🟢 button.tsx - Button component with variants
    ├── 🟢 card.tsx - Card container component
    ├── 🟢 input.tsx - Input field component
    ├── 🟢 label.tsx - Form label component
    ├── 🟢 select.tsx - Select dropdown component
    ├── 🟢 tabs.tsx - Tab navigation component
    ├── 🟡 dialog.tsx - Modal dialog component
    ├── 🟡 toast.tsx - Toast notification component
    ├── 🟡 toaster.tsx - Toast container component
    ├── 🟡 form.tsx - Form wrapper component
    ├── 🟡 textarea.tsx - Textarea input component
    ├── 🟡 checkbox.tsx - Checkbox input component
    ├── 🟡 radio-group.tsx - Radio button group component
    ├── 🟡 progress.tsx - Progress bar component
    ├── 🟡 separator.tsx - Visual separator component
    ├── 🟡 hover-card.tsx - Hover card component
    ├── 🟡 popover.tsx - Popover component
    ├── 🟡 scroll-area.tsx - Scrollable area component
    ├── 🟡 collapsible.tsx - Collapsible content component
    ├── 🟡 resizable.tsx - Resizable panel component
    ├── 🟡 input-otp.tsx - OTP input component
    ├── 🟡 pagination.tsx - Pagination component
    ├── 🟡 drawer.tsx - Mobile drawer component
    ├── 🔴 accordion.tsx - Accordion component
    ├── 🔴 alert-dialog.tsx - Alert dialog component
    ├── 🔴 alert.tsx - Alert component
    ├── 🔴 aspect-ratio.tsx - Aspect ratio component
    ├── 🔴 avatar.tsx - Avatar component
    ├── 🔴 badge.tsx - Badge component
    ├── 🔴 breadcrumb.tsx - Breadcrumb navigation
    ├── 🔴 calendar.tsx - Calendar component
    ├── 🔴 carousel.tsx - Carousel component
    ├── 🔴 chart.tsx - Chart component
    ├── 🔴 command.tsx - Command palette component
    ├── 🔴 context-menu.tsx - Context menu component
    ├── 🔴 dropdown-menu.tsx - Dropdown menu component
    ├── 🔴 menubar.tsx - Menu bar component
    ├── 🔴 navigation-menu.tsx - Navigation menu component
    ├── 🔴 sheet.tsx - Sheet component
    ├── 🔴 sidebar.tsx - Sidebar component
    ├── 🔴 skeleton.tsx - Loading skeleton component
    ├── 🔴 slider.tsx - Slider input component
    ├── 🔴 sonner.tsx - Sonner toast component
    ├── 🔴 switch.tsx - Switch toggle component
    ├── 🔴 table.tsx - Table component
    ├── 🔴 toggle-group.tsx - Toggle group component
    ├── 🔴 toggle.tsx - Toggle component
    ├── 🔴 tooltip.tsx - Tooltip component
    └── 🔴 use-toast.ts - Toast hook
```

### Pages Directory

```
src/pages/
├── 🟢 Home.tsx - Landing page with feature overview
├── 🟢 Report.tsx - Complaint reporting page
├── 🟢 Dashboard.tsx - Admin dashboard with analytics
├── 🟡 Profile.tsx - User profile management
├── 🟡 PublicStats.tsx - Public statistics page
├── 🟡 Track.tsx - Complaint tracking page
├── 🟡 Auth.tsx - Authentication page
├── 🟡 NotFound.tsx - 404 error page
└── 🔴 Index.tsx - Index redirect component
```

### Contexts Directory

```
src/contexts/
└── 🟢 LanguageContext.tsx - Internationalization context (Thai/English)
```

### Hooks Directory

```
src/hooks/
├── 🟡 use-toast.ts - Toast notification hook
└── 🔴 use-mobile.tsx - Mobile detection hook
```

### Library Directory

```
src/lib/
└── 🟢 utils.ts - Utility functions (className merging)
```

### Utils Directory

```
src/utils/
└── 🟡 fileUpload.ts - File upload and validation utilities
```

### Integrations Directory

```
src/integrations/
└── supabase/
    ├── 🟢 client.ts - Supabase client configuration
    └── 🟢 types.ts - Database type definitions
```

## Database Directory

```
supabase/
├── 🟢 config.toml - Supabase project configuration
└── migrations/
    ├── 🟢 001_complaints_system.sql - Initial database schema
    └── 🟢 20250623171953-d373dc62-887d-452d-a144-007a1e1960d6.sql - Schema updates
```

## Documentation Directory

```
docs/
├── 🟢 filesExplainer.md - This file structure documentation
├── 🟢 README.md - Project overview and setup guide
├── 🟡 architecture.svg - System architecture diagram
├── 🟡 scripts.md - Available scripts documentation
└── 🟡 structure-recommendations.md - Folder structure recommendations
```

## GitHub Directory

```
.github/
└── workflows/
    ├── 🟡 ci.yml - Continuous integration workflow
    ├── 🟡 deploy.yml - Deployment workflow
    └── 🔴 dependabot.yml - Dependency update automation
```

## Key Dependencies and Relationships

### Core Framework Dependencies
- **React + TypeScript**: Main application framework
- **Vite**: Build tool and development server
- **React Router**: Client-side routing
- **Tailwind CSS**: Styling framework

### UI Library Dependencies
- **Shadcn/UI**: Component library built on Radix UI
- **Radix UI**: Headless UI components
- **Lucide React**: Icon library

### Backend Integration
- **Supabase**: Backend as a Service (auth, database, storage)
- **@tanstack/react-query**: Server state management

### Form Handling
- **React Hook Form**: Form management
- **Zod**: Schema validation

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **TypeScript**: Type checking

## Import Frequency Analysis

### Most Imported Files (🟢 High Importance)
1. `src/components/ui/button.tsx` - Used across all pages
2. `src/components/ui/card.tsx` - Primary layout component
3. `src/lib/utils.ts` - Utility functions used everywhere
4. `src/components/Navigation.tsx` - Present on all pages
5. `src/contexts/LanguageContext.tsx` - App-wide internationalization

### Moderately Imported Files (🟡 Medium Importance)
1. `src/components/ui/input.tsx` - Form components
2. `src/components/ui/select.tsx` - Dropdown selections
3. `src/hooks/use-toast.ts` - User feedback
4. `src/components/ui/dialog.tsx` - Modal interactions

### Rarely Imported Files (🔴 Low Importance)
- Specialized UI components not used in current implementation
- Development configuration files
- Documentation and metadata files

## Architecture Notes

The project follows a standard React application structure with:
- **Component-based architecture** using functional components
- **Context-based state management** for global state
- **Page-based routing** with React Router
- **Utility-first CSS** with Tailwind
- **Type-safe development** with TypeScript
- **Backend integration** via Supabase

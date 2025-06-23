
# Wang Sammo Complaint Management System

A comprehensive web application for managing community complaints and issues in the Wang Sammo district. Built with modern web technologies and designed for both citizens and administrators.

## 🌟 Features

### For Citizens
- **Multi-language Support**: Thai and English interface
- **Easy Complaint Submission**: Simple form with file upload support
- **QR Code Integration**: Quick access to complaint forms via QR codes
- **Real-time Tracking**: Monitor complaint status and updates
- **Voice Recording**: Audio complaint support
- **Mobile-Friendly**: Responsive design for all devices

### For Administrators
- **Analytics Dashboard**: Comprehensive complaint statistics and trends
- **QR Code Management**: Generate custom QR codes for specific locations/categories
- **User Management**: Role-based access control
- **Real-time Updates**: Live complaint monitoring
- **Public Statistics**: Transparent community reporting

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **Shadcn/UI** component library
- **React Router** for client-side routing
- **React Query** for server state management
- **React Hook Form** with Zod validation

### Backend
- **Supabase** (Backend as a Service)
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - File storage
  - Row Level Security (RLS)

### Development Tools
- **TypeScript** for type safety
- **ESLint** for code quality
- **PostCSS** for CSS processing
- **GitHub Actions** for CI/CD

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **bun**
- **Git**
- A **Supabase** account (for backend services)

## 🛠 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/wang-sammo.git
cd wang-sammo
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using bun
bun install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Additional API Keys
VITE_QR_API_BASE_URL=https://api.qrserver.com/v1/create-qr-code/
```

### 4. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key to the `.env.local` file
3. Run the database migrations:

```bash
# Install Supabase CLI
npm install -g @supabase/cli

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-id

# Run migrations
supabase db push
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## 🗃 Database Schema

The application uses the following main tables:

### Complaints Table
```sql
complaints (
  id: uuid (primary key)
  title: text
  description: text
  category: text
  status: text
  priority: text
  location: text
  citizen_name: text
  citizen_phone: text
  citizen_email: text
  created_at: timestamp
  updated_at: timestamp
  user_id: uuid (foreign key)
)
```

### Files Table
```sql
files (
  id: uuid (primary key)
  complaint_id: uuid (foreign key)
  file_path: text
  file_type: text
  file_size: integer
  created_at: timestamp
)
```

### Users Table (Extended)
```sql
users (
  id: uuid (primary key)
  email: text
  role: text (citizen, admin)
  full_name: text
  phone: text
  created_at: timestamp
)
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Testing Strategy

- **Unit Tests**: Component logic and utilities
- **Integration Tests**: API interactions and data flow
- **E2E Tests**: Complete user workflows
- **Accessibility Tests**: WCAG compliance

## 📦 Building for Production

### 1. Build the Application

```bash
npm run build
```

### 2. Preview Production Build

```bash
npm run preview
```

### 3. Deploy to Hosting Platform

The built files in the `dist` directory can be deployed to any static hosting platform:

- **Vercel**: Connect your GitHub repository
- **Netlify**: Drag and drop the `dist` folder
- **AWS S3**: Upload to S3 bucket with CloudFront
- **GitHub Pages**: Use GitHub Actions workflow

## 🚀 Deployment

### Using Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Using Netlify

1. Connect repository or drag/drop build folder
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

### Environment Variables for Production

```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_key
```

## 🔧 Configuration

### Tailwind CSS Customization

Modify `tailwind.config.ts` to customize:
- Colors and themes
- Typography scales
- Spacing and sizing
- Component variants

### Supabase Configuration

Customize `src/integrations/supabase/client.ts` for:
- Custom authentication flows
- Real-time subscriptions
- File upload settings

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### 1. Fork the Repository

```bash
git fork https://github.com/your-username/wang-sammo.git
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes

- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed

### 4. Run Quality Checks

```bash
# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm run test

# Build to ensure no errors
npm run build
```

### 5. Submit a Pull Request

- Provide a clear description of changes
- Reference any related issues
- Ensure all checks pass

### Code Style Guidelines

- Use TypeScript for all new code
- Follow React best practices
- Use functional components with hooks
- Implement proper error handling
- Add meaningful comments for complex logic
- Use semantic commit messages

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [Project Wiki](https://github.com/your-username/wang-sammo/wiki)
- [API Documentation](docs/api.md)
- [Component Documentation](docs/components.md)

### Getting Help
- **Issues**: [GitHub Issues](https://github.com/your-username/wang-sammo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/wang-sammo/discussions)
- **Email**: support@wangsammo.local

### Troubleshooting

#### Common Issues

1. **Build Errors**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Supabase Connection Issues**
   - Verify environment variables
   - Check Supabase project status
   - Ensure RLS policies are configured

3. **TypeScript Errors**
   ```bash
   # Restart TypeScript service
   npm run type-check
   ```

## 🗺 Roadmap

### Phase 1: Core Features ✅
- [x] Basic complaint submission
- [x] User authentication
- [x] Admin dashboard
- [x] QR code generation

### Phase 2: Enhanced Features ✅
- [x] File upload support
- [x] Real-time updates
- [x] Analytics dashboard
- [x] Multi-language support

### Phase 3: Advanced Features (Planned)
- [ ] Push notifications
- [ ] Email integration
- [ ] Advanced reporting
- [ ] API integrations
- [ ] Mobile app (React Native)

### Phase 4: Enterprise Features (Future)
- [ ] Multi-tenant support
- [ ] Advanced analytics
- [ ] Workflow automation
- [ ] Integration APIs

## 👥 Team

- **Project Lead**: [Your Name]
- **Frontend Developer**: [Developer Name]
- **Backend Developer**: [Developer Name]
- **UI/UX Designer**: [Designer Name]

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for excellent backend services
- [Shadcn/UI](https://ui.shadcn.com) for beautiful components
- [Tailwind CSS](https://tailwindcss.com) for utility-first styling
- [React](https://reactjs.org) team for the amazing framework
- [Vite](https://vitejs.dev) for lightning-fast development

---

**Made with ❤️ for the Wang Sammo community**

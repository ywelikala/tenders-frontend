# Tenders Frontend

A modern React-based frontend application for the Tenders Portal, built with TypeScript, Vite, and Tailwind CSS.

## 🚀 Features

- **Modern Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **UI Components**: shadcn/ui component library
- **State Management**: TanStack Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Docker Support**: Multi-stage Docker build for production deployment

## 🏗️ Architecture

### Project Structure
```
src/
├── components/          # Reusable UI components
│   └── ui/             # shadcn/ui components
├── pages/              # Route-level components
├── hooks/              # Custom React hooks
├── services/           # API services and utilities
├── lib/                # Utility functions
├── types/              # TypeScript type definitions
└── contexts/           # React contexts
```

### Key Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript integration
- **Performance**: Optimized bundle splitting and lazy loading
- **Accessibility**: WCAG compliance with proper ARIA attributes

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
The application will be available at http://localhost:8080

### Build Commands
```bash
# Production build
npm run build

# Development build
npm run build:dev

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🐳 Docker Deployment

### Environment Variables

The application supports configuration through environment variables:

- `API_BASE_URL`: Backend API URL (required)
- `APP_NAME`: Application name (default: "Tenders Portal")
- `APP_VERSION`: Application version (default: "1.0.0")

### Development with Docker

1. Build the Docker image:
```bash
docker build -t tenders-frontend .
```

2. Run the container:
```bash
docker run -p 80:80 \
  -e API_BASE_URL="https://api.yourdomain.com" \
  -e APP_NAME="Tenders Portal" \
  tenders-frontend
```

### Production Deployment

The Docker container is optimized for production with:
- Multi-stage build for smaller image size
- Nginx for serving static files
- Gzip compression enabled
- Security headers configured
- Health check endpoint at `/health`

### Environment Configuration

The application uses a runtime configuration system that allows environment variables to be injected at container startup:

1. **Development**: Uses `public/config.js` for local development
2. **Production**: Environment variables are injected by `docker-entrypoint.sh`

### Docker Compose Example

```yaml
version: '3.8'
services:
  tenders-frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - API_BASE_URL=https://api.yourdomain.com
      - APP_NAME=Tenders Portal
      - APP_VERSION=1.0.0
    restart: unless-stopped
```

## 🔧 Configuration

### API Configuration

The frontend automatically configures the API endpoint based on the environment:

1. **Runtime Config**: `window.ENV.API_BASE_URL` (injected by Docker)
2. **Build-time Env**: `VITE_API_BASE_URL` environment variable
3. **Default Fallback**: `https://lankatender.com/api`

### Deployment Notes

- The frontend is designed to work with a backend API on a subdomain
- No proxy configuration needed - direct API calls are made
- CORS must be configured on the backend to allow frontend domain

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run E2E tests with Playwright
npx playwright test
```

## 📦 Dependencies

### Main Dependencies
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui for components
- TanStack Query for data fetching
- React Router for navigation
- React Hook Form + Zod for forms

### Development Dependencies
- ESLint for code linting
- TypeScript for type checking
- Playwright for E2E testing
- Various Vite plugins

## 🚀 Deployment

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to your web server

### Docker Deployment

1. Build and run with Docker:
```bash
docker build -t tenders-frontend .
docker run -p 80:80 -e API_BASE_URL="your-api-url" tenders-frontend
```

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

---

Built with ❤️ using modern web technologies

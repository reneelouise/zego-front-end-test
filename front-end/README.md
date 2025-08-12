# Zego Front-End Developer Test: Server-Driven UI System

## About Zego

At Zego, we understand that traditional motor insurance holds good drivers back. It's too complicated, too expensive, and it doesn't reflect how well you actually drive. Since 2016, we have been on a mission to change that by offering the lowest priced insurance for good drivers.

From van drivers and gig economy workers to everyday car drivers, our customers are the driving force behind everything we do. We've sold tens of millions of policies and raised over $200 million in funding. And we're only just getting started.

## Our Values

Zego is thoroughly committed to our values, which are the essence of our culture:

<table>
    <tr><td><img src="../doc/assets/blaze_a_trail.png?raw=true" alt="Blaze a trail" width=50></td><td><b>Blaze a trail</b></td><td>Emphasize curiosity and creativity to disrupt the industry through experimentation and evolution.</td></tr>
    <tr><td><img src="../doc/assets/drive_to_win.png?raw=true" alt="Drive to win" width=50></td><td><b>Drive to win</b></td><td>Strive for excellence by working smart, maintaining well-being, and fostering a safe, productive environment.</td></tr>
    <tr><td><img src="../doc/assets/take_the_wheel.png?raw=true" alt="Take the wheel" width=50></td><td><b>Take the wheel</b></td><td>Encourage ownership and trust, empowering individuals to fulfil commitments and prioritize customers.</td></tr>
    <tr><td><img src="../doc/assets/zego_before_ego.png?raw=true" alt="Zego before ego" width=50></td><td><b>Zego before ego</b></td><td>Promote unity by working as one team, celebrating diversity, and appreciating each individual's uniqueness.</td></tr>
</table>

## The Engineering Team

Zego puts technology first in its mission to define the future of the insurance industry. By focusing on our customers' needs we're building the flexible and sustainable insurance products and services that they deserve. And we do that by empowering a diverse, resourceful, and creative team of engineers that thrive on challenge and innovation.

### How We Work

- **Collaboration & Knowledge Sharing** - Engineers work closely with cross-functional teams to gather requirements, deliver well-structured solutions, and contribute to code reviews.
- **Problem Solving & Innovation** - We encourage analytical thinking and a proactive approach to tackling complex problems.
- **Continuous Learning & Growth** – We provide abundant opportunities to learn, experiment and advance, including AI-powered tools and workflows.
- **Ownership & Accountability** - Team members take ownership of their work, ensuring solutions are reliable, scalable, and aligned with business needs.

## The Test: Server-Driven UI in Next.js (React) + TypeScript 🧪

You are tasked with building a basic **server-driven UI system** using **Next.js** and **TypeScript**. The client should render a simple form-driven UI based entirely on configuration data provided by a backend endpoint.

### Requirements

- Build a dynamic form renderer that consumes a config and displays a working UI
- Support five core UI components: Text, Input, Dropdown, Button, and Form wrapper
- Fetch config from `/api/config` and use it to drive rendering
- On form submission, post form data to `/api/submit` and log field contents

### Production Considerations

- **Error handling**: Handle potential errors in fetching config and submitting form
- **Accessibility**: Ensure UI is accessible (ARIA roles, keyboard navigation)
- **Styling**: Use a CSS framework (styled-components, CSS modules, etc.)
- **Testing**: Write unit tests for components and integration tests for form submission
- **Documentation**: Provide clear setup instructions and dependencies
- **E2E Testing**: Think about testing the complete flow and ensuring tests aren't brittle

## 🎯 My Approach & Implementation

### Core Philosophy
• **Server-Driven Architecture**: Forms rendered entirely from JSON configuration
• **Type Safety First**: Full TypeScript coverage for better developer experience
• **Accessibility by Design**: WCAG 2.1 AA compliance from the ground up
• **Testing Excellence**: Comprehensive test coverage with real component testing
• **Production Ready**: Error handling, security, and performance optimizations

### Technical Decisions

#### 🏗️ Architecture Choices
• **Next.js App Router**: Modern features, better performance, and improved developer experience
• **Styled Components**: Component-scoped styling with SSR support via registry
• **Custom Hooks**: Extracted business logic into reusable hooks (`useForm`)
• **Middleware**: Security headers and rate limiting for API protection
• **Separation of Concerns**: Form logic, rendering, and styling in separate files

#### 🎨 Component Design
• **Data-Automation Tags**: Stable selectors for reliable E2E testing
• **ARIA Attributes**: Comprehensive accessibility support
• **Error States**: Visual feedback with proper error handling
• **Loading States**: Proper loading indicators and disabled states

#### 🧪 Testing Strategy
• **Real Component Testing**: Removed heavy mocking to test actual behavior
• **Test Isolation**: Fresh mocks for each test to prevent interference
• **Comprehensive Coverage**: Unit, integration, and E2E tests
• **Stable Selectors**: Using `data-automation` tags instead of brittle text matching

### Key Features Implemented

#### Dynamic Form Rendering
• Forms rendered entirely from `/api/config` JSON configuration
• Support for all five component types: Text, Input, Dropdown, Button, Form
• Real-time validation with user feedback
• Auto-reset functionality after successful submission

#### Accessibility & UX
• WCAG 2.1 AA compliant with proper ARIA attributes
• Keyboard navigation support
• Screen reader announcements
• High contrast and reduced motion support
• Focus management and error field highlighting

#### Error Handling & Security
• Graceful error handling with retry mechanisms
• Input sanitization and validation
• Security headers via Next.js middleware
• Rate limiting for API endpoints with configurable limits
• XSS protection with DOMPurify
• CORS and content security policy headers

#### Performance & Optimization
• Memoized components and hooks
• Suspense boundaries for loading states
• Memory leak prevention
• Optimized re-renders with React.memo

## 🛠️ Project Navigation & Scripts

### 📁 Project Structure
```
front-end/server-driven-ui/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── config/        # GET /api/config
│   │   │   └── submit/        # POST /api/submit
│   │   ├── page.tsx           # Main page component
│   │   └── layout.tsx         # Root layout
│   ├── components/            # UI components
│   │   ├── text/              # Text component
│   │   ├── input/             # Input component
│   │   ├── dropdown/          # Dropdown component
│   │   ├── button/            # Button component
│   │   └── form/              # Form wrapper
│   ├── hooks/                 # Custom React hooks
│   ├── utils/                 # Utility functions and middleware
│   └── lib/                   # Utility libraries
├── .nvmrc                     # Node.js version
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

### 🚀 Available Scripts

#### Development Scripts
```bash
# Start development server with hot reload
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Run linting
yarn lint
```

#### Testing Scripts
```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage report
yarn test:coverage

# Run specific test file
yarn test src/components/form/__tests__/form.test.tsx

# Run E2E tests only
yarn test src/__tests__/e2e.test.tsx
```

#### Code Quality Scripts
```bash
# Format all code with Prettier
yarn format

# Check code formatting without changes
yarn format:check

# Run ESLint
yarn lint
```

#### Component-Specific Testing
```bash
# Test individual components
yarn test src/components/text/__tests__/text.test.tsx
yarn test src/components/input/__tests__/input.test.tsx
yarn test src/components/dropdown/__tests__/dropdown.test.tsx
yarn test src/components/button/__tests__/button.test.tsx
yarn test src/components/form/__tests__/form.test.tsx

# Test hooks
yarn test src/hooks/__tests__/use-form.hook.test.ts

# Test utilities and middleware
yarn test src/utils/__tests__/validation.test.ts
yarn test src/utils/__tests__/form-utils.test.ts
yarn test src/utils/__tests__/middleware.test.ts

# Test API endpoints
yarn test src/app/api/config/__tests__/config.test.ts
yarn test src/app/api/submit/__tests__/submit.test.ts
```

### 🔧 Setup Instructions

#### Prerequisites
• **Node.js**: Version 22.18.0 (specified in `.nvmrc`)
• **Package Manager**: Yarn (recommended)
• **NVM**: For Node.js version management

#### Quick Start
```bash
# Navigate to the project
cd front-end/server-driven-ui

# Install Node.js version (if using nvm)
nvm use

# Install dependencies
yarn install

# Start development server
yarn dev
```

The application will run on `http://localhost:3000`

#### Environment Setup
```bash
# Create environment file (optional)
cp .env.example .env.local

# Install dependencies
yarn install

# Run tests to verify setup
yarn test
```

## 📋 Configuration Format

### Form Configuration Structure
```typescript
interface FormConfig {
  title: string                    // Form title
  description?: string            // Optional form description
  components: UIComponent[]       // Array of form components
  submitUrl: string              // Submission endpoint
  method?: 'POST' | 'PUT' | 'PATCH' // HTTP method
}

interface UIComponent {
  id: string                      // Unique component identifier
  type: 'text' | 'input' | 'dropdown' | 'button' | 'form'
  label?: string                  // Component label
  required?: boolean              // Required field flag
  disabled?: boolean              // Disabled state
  placeholder?: string            // Input placeholder
  options?: DropdownOption[]      // Dropdown options
  children?: UIComponent[]        // Nested components
}
```

### Example Configuration
```json
{
  "title": "User Registration",
  "description": "Please fill out the form below to register",
  "components": [
    {
      "id": "first-name",
      "type": "input",
      "label": "First Name",
      "required": true,
      "placeholder": "Enter your first name"
    },
    {
      "id": "email",
      "type": "input",
      "label": "Email Address",
      "required": true,
      "placeholder": "Enter your email"
    },
    {
      "id": "country",
      "type": "dropdown",
      "label": "Country",
      "required": true,
      "options": [
        { "value": "us", "label": "United States" },
        { "value": "uk", "label": "United Kingdom" }
      ]
    },
    {
      "id": "submit",
      "type": "button",
      "label": "Submit Registration"
    }
  ],
  "submitUrl": "/api/submit",
  "method": "POST"
}
```

## 🔧 API Endpoints

### GET /api/config
Returns form configuration with success/error structure:
```json
{
  "success": true,
  "data": {
    "title": "User Registration Form",
    "description": "Please fill out the form below...",
    "components": [...],
    "submitUrl": "/api/submit",
    "method": "POST"
  },
  "message": "Configuration loaded successfully"
}
```

### POST /api/submit
Handles form submissions with validation:
```json
{
  "success": true,
  "data": {
    "formData": { "first-name": "John", "email": "john@example.com" },
    "timestamp": "2024-01-01T12:00:00.000Z",
    "formId": "User Registration Form"
  },
  "message": "Form submitted successfully"
}
```

## 🧪 Testing Strategy

### Test Framework
• **Vitest**: Fast unit testing framework
• **React Testing Library**: Component testing with user-centric approach
• **JSDOM**: DOM environment for testing

### Test Coverage
• **Unit Tests**: Individual component and hook testing
• **Integration Tests**: API integration and form state management
• **E2E Tests**: Complete user flow testing
• **Test Quality**: No long-living variables, real component testing

### Test Structure
```
src/
├── components/__tests__/     # Component unit tests
├── app/__tests__/           # Page integration tests
├── app/api/__tests__/       # API endpoint tests
├── utils/__tests__/         # Utility function and middleware tests
└── __tests__/e2e.test.tsx   # End-to-end tests
```

### Running Tests
```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test --coverage

# Run specific test file
yarn test src/components/form/__tests__/form.test.tsx
```

## 🎨 Design Decisions & Trade-offs

### Architecture Choices
• **Next.js App Router**: Modern features and better performance
• **Styled Components**: Better component encapsulation and SSR support
• **Custom Hooks**: Reusable logic with better testing capabilities
• **TypeScript**: Full type safety for better developer experience

### Component Design
• **Data-Automation Tags**: Stable selectors for reliable E2E testing
• **Accessibility First**: WCAG 2.1 AA compliance with proper ARIA attributes
• **Error Handling**: Comprehensive error states with user-friendly messages
• **Loading States**: Proper loading indicators for better UX

### Testing Strategy
• **Real Component Testing**: Removed heavy mocking to test actual behavior
• **Test Isolation**: Fresh mocks for each test to prevent interference
• **Comprehensive Coverage**: Unit, integration, and E2E tests for complete validation

### Trade-offs Made
• **Bundle Size**: Styled Components adds some bundle size but provides better developer experience
• **Complexity**: Custom hooks add complexity but improve maintainability
• **Testing Overhead**: Comprehensive testing takes time but ensures reliability

## 🚀 Deployment Considerations

### Production Build
```bash
# Build for production
yarn build

# Start production server
yarn start
```


#### Docker
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]
```

### Performance & Security
• **Static Generation**: Pre-render static pages
• **Code Splitting**: Automatic with Next.js
• **Input Validation**: Server-side validation required
• **CSRF Protection**: Built-in Next.js protection
• **Rate Limiting**: Configurable rate limiting via middleware
• **Security Headers**: Comprehensive security headers via middleware
• **Content Security Policy**: XSS protection and resource restrictions

## 🔮 Future Enhancements

### Advanced Features
• **Real-time Validation**: Server-side validation with live feedback
• **Multi-step Forms**: Wizard-style forms with progress tracking
• **File Upload**: Drag-and-drop file upload with preview
• **Internationalization**: Multi-language support
• **Conditional Logic**: Show/hide fields based on other field values

### Developer Experience
• **Form Builder**: Visual form configuration tool
• **Component Library**: Storybook integration
• **Hot Reload**: Configuration hot reloading for development
• **Type Generation**: Auto-generate TypeScript types from config

## ✅ Acceptance Criteria Implementation

### Dynamic Form Rendering 
• App fetches configuration from `/api/config` on initial load
• UI rendered entirely from fetched configuration
• Supports all five component types

### Component Types 
• **Text**: Static text display with variant support
• **Input**: Text input fields with validation and accessibility
• **Dropdown**: Select menus with options from config
• **Button**: Clickable buttons with loading states
• **Form**: Container that handles submission and renders children

### Form Submission 
• Posts form data to `/api/submit` via POST
• Logs submitted field values to console
• Includes proper error handling and loading states
• Comprehensive validation with user feedback

### Production Considerations 
• **Error Handling**: Graceful error handling with retry mechanisms
• **Accessibility**: WCAG 2.1 AA compliant
• **Styling**: Modern, responsive design
• **Testing**: Comprehensive test coverage
• **Documentation**: Complete setup instructions

##  Ready for Production

The server-driven UI system is **production-ready** with:
• 🚀 **Dynamic Forms**: Rendered entirely from server configuration
• 🎯 **Type Safety**: Full TypeScript coverage
• ♿ **Accessibility**: WCAG 2.1 AA compliant
• 🧪 **Tested**: Comprehensive test coverage
• 📱 **Responsive**: Mobile-first design
• 🔧 **Maintainable**: Clean architecture with separated concerns
• 🛡️ **Secure**: Middleware with security headers and rate limiting

### Key Benefits
• **Server-Driven**: Dynamic forms from JSON configuration
• **Type-Safe**: Full TypeScript coverage
• **Accessible**: WCAG 2.1 AA compliant
• **Tested**: Comprehensive test coverage
• **Responsive**: Mobile-first design
• **Maintainable**: Clean architecture with separated concerns

---

## Instructions

1. Create a repo.
2. Tackle the test.
3. Push the code back.
4. Add us (@2014klee, @danyal-zego, @bogdangoie and @cypherlou) as collaborators and tag us to review.
5. Notify your TA so they can chase the reviewers.

# Hare Krishna Medical Store - Frontend

A modern, responsive frontend application for a medical store/pharmacy built with React and Vite.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm

### Installation & Development

1. **Install Dependencies**

   ```bash
   npm run install:frontend
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   ```

3. **Build for Production**

   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## 🛠️ Tech Stack

### Frontend Framework

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router 7** - Client-side routing

### UI/UX

- **React Bootstrap** - Bootstrap components for React
- **Bootstrap 5.3** - CSS framework
- **Bootstrap Icons** - Icon library
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible headless components

### State Management

- **Redux Toolkit** - State management
- **React Redux** - React bindings for Redux
- **React Query** - Server state management (for future API integration)

### Styling

- **TailwindCSS** - Utility-first CSS framework
- **Custom CSS** - Component-specific styles

### Forms & Validation

- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Additional Features

- **Chart.js** - Data visualization
- **React Chartjs 2** - Chart.js React wrapper
- **Date-fns** - Date utility library
- **jsPDF** - PDF generation
- **QR Code** - QR code generation
- **Excel/XLSX** - Spreadsheet handling

## 📁 Project Structure

```
Frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── common/        # Common UI components
│   │   ├── layout/        # Layout components (Header, Footer)
│   │   └── products/      # Product-specific components
│   ├── pages/             # Page components
│   │   ├── admin/         # Admin dashboard pages
│   │   └── user/          # User account pages
│   ├── store/             # Redux store and slices
│   ├── utils/             # Utility functions
│   ├── styles/            # Custom CSS files
│   └── hooks/             # Custom React hooks
├── package.json
└── vite.config.js
```

## 🎨 Design Features

### Medical Theme

- **Professional Color Scheme**: Red primary color with clean whites and grays
- **Medical Iconography**: Healthcare-appropriate icons and imagery
- **Clean Typography**: Easy-to-read fonts suitable for medical content

### Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Bootstrap Grid**: Responsive layout system
- **Flexible Components**: Adapts to various screen sizes

### User Experience

- **Intuitive Navigation**: Clear menu structure
- **Product Catalog**: Easy browsing and filtering
- **Shopping Cart**: Smooth add-to-cart experience
- **User Authentication**: Login/register functionality
- **Admin Dashboard**: Management interface for store operations

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the Frontend directory:

```env
VITE_APP_NAME="Hare Krishna Medical Store"
VITE_DEBUG=false
VITE_MAX_FILE_SIZE=5242880
```

### Customization

- **Colors**: Modify CSS variables in `src/styles/`
- **Brand**: Update logo and name in `src/components/layout/Header.jsx`
- **Content**: Edit page content in `src/pages/`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run format.fix` - Format code with Prettier

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `Frontend/dist`
4. Deploy

### Netlify

1. Build command: `npm run build`
2. Publish directory: `Frontend/dist`
3. Deploy

### Other Platforms

The build output in `Frontend/dist` can be deployed to any static hosting service.

## 🎯 Features

### Customer Features

- Product browsing and search
- Shopping cart management
- User registration and login
- Order history
- Invoice generation

### Admin Features

- Product management
- Order management
- User management
- Analytics dashboard
- System administration

### Technical Features

- PWA ready
- SEO optimized
- Fast loading
- Responsive design
- Accessible UI
- Error boundaries
- Loading states

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## 📄 License

This project is private and proprietary.

---

**Note**: This is a frontend-only application. For full functionality including user authentication, product management, and order processing, you would need to integrate with a backend API or use a Backend-as-a-Service solution.

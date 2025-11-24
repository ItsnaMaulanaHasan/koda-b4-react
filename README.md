# Daily Greens Frontend

A modern Single Page Application (SPA) for Daily Greens healthy food ordering platform built with React and Vite. This application provides an intuitive user interface for customers to browse, order healthy meals, and for admins to manage the platform with comprehensive analytics.

## Tech Stack

- **React** 19.1.1 - Frontend library
- **Vite** 7.1.7 - Build tool and dev server
- **Redux Toolkit** 2.9.0 - State management
- **React Router DOM** 7.9.3 - Client-side routing
- **Tailwind CSS** 4.1.14 - Utility-first CSS framework
- **ApexCharts** 5.3.5 - Data visualization
- **React Hook Form** 7.63.0 - Form management
- **Yup** 1.7.1 - Schema validation
- **bcryptjs** 3.0.2 - Password hashing
- **Lucide React** 0.544.0 - Icon library

## Key Features

- **Single Page Application** - Fast and seamless navigation
- **User Authentication** - Secure login and registration with JWT
- **Shopping Cart** - Real-time cart management with Redux state
- **Product Catalog** - Browse with filters by diet categories (vegan, keto, low-carb)
- **Admin Dashboard** - Analytics and data visualization with ApexCharts
- **State Persistence** - Redux Persist for cart and user session
- **Form Validation** - React Hook Form with Yup schema validation
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Protected Routes** - Role-based access control

## Prerequisites

Before running this application, make sure you have:

- **Node.js 20.0.0 or higher** installed on your system
- **npm or yarn** package manager
- **Backend API** running (see backend repository)
- **Git** (for cloning the repository)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Backend API URL
VITE_BASE_URL=http://localhost:8080
```

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ItsnaMaulanaHasan/koda-b4-react.git
cd koda-b4-react
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update the variables:

```bash
cp .env.example .env
```

### 4. Run the Application

**Development mode:**

```bash
npm run dev
# or
yarn dev
```

The application will start on `http://localhost:5173`

**Production build:**

```bash
npm run build
# or
yarn build
```

**Preview production build:**

```bash
npm run preview
# or
yarn preview
```

## Key Dependencies

| Package          | Version | Purpose          |
| ---------------- | ------- | ---------------- |
| react            | 19.1.1  | Frontend library |
| vite             | 7.1.7   | Build tool       |
| @reduxjs/toolkit | 2.9.0   | State management |
| react-router-dom | 7.9.3   | Routing          |
| tailwindcss      | 4.1.14  | CSS framework    |
| apexcharts       | 5.3.5   | Charts           |
| react-hook-form  | 7.63.0  | Form management  |
| yup              | 1.7.1   | Validation       |
| bcryptjs         | 3.0.2   | Password hashing |
| lucide-react     | 0.544.0 | Icons            |

## Features Breakdown

### Customer Features

1. **Browse Menu**

   - Filter by categories
   - View nutritional information
   - Search functionality
   - Product details page

2. **Shopping Experience**

   - Add to cart with size and variant selection
   - Real-time cart updates
   - Cart persistence with Redux Persist
   - Checkout process

3. **Order Management**

   - Order history
   - Track order status
   - Transaction details

4. **User Profile**
   - Profile management
   - Password change

### Admin Features

1. **Dashboard Analytics**

   - Sales visualization with ApexCharts
   - Revenue metrics
   - Customer insights
   - Performance indicators

2. **Product Management**

   - CRUD operations for products
   - Image upload
   - Category management
   - Inventory tracking

3. **Order Management**

   - View all orders
   - Update order status
   - Transaction monitoring
   - Order details

4. **User Management**
   - Customer data
   - User roles

## Security

- Password hashing with argon2
- JWT token management
- Protected routes with role-based access
- Form validation to prevent XSS
- Input sanitization

## Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Tailwind CSS utility classes
- Flexible grid layouts

## How to Contribute

### 1. Fork the Repository

Click the **Fork** button at the top right of this page.

### 2. Clone Your Fork

```bash
git clone https://github.com/yourusername/koda-b4-react.git
cd koda-b4-react
```

### 3. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 4. Make Your Changes

- Follow React best practices and conventions
- Write clean, maintainable code
- Use functional components and hooks
- Keep components small and focused
- Update documentation if needed

### 5. Run Linter

```bash
npm run lint
```

### 6. Commit Your Changes

```bash
git add .
git commit -m "Add: description of your changes"
```

**Commit Message Convention:**

- `Feat:` for new features
- `Fix:` for bug fixes
- `Update:` for improvements
- `Refactor:` for code refactoring
- `Docs:` for documentation changes
- `Style:` for styling changes

### 7. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 8. Create a Pull Request

1. Go to the original repository
2. Click **New Pull Request**
3. Select your feature branch
4. Describe your changes clearly
5. Submit the PR

## Deployment

### Build for Production

```bash
npm run build
```

### Docker Deployment

```bash
# Build Docker image
docker build -t daily-greens-frontend .

# Run container
docker run -p 5173:5173 daily-greens-frontend
```

## Contact

For questions or support, please contact:

- Email: your.email@example.com
- GitHub: [@ItsnaMaulanaHasan](https://github.com/ItsnaMaulanaHasan)
- Live Demo: [https://www.dailygreensfresh.store](https://www.dailygreensfresh.store)
- Backend Repository: [https://github.com/ItsnaMaulanaHasan/koda-b4-backend](https://github.com/ItsnaMaulanaHasan/koda-b4-backend)

⭐ If you find this project helpful, don't forget to give it a star on GitHub!

💚 Stay healthy, stay green!

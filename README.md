# Estimate Details - Interactive Construction Estimate Management

## Project Overview

**Estimate Details** is a modern, interactive web application for managing construction estimates with real-time calculations and inline editing capabilities. Built with React and TypeScript, it provides a professional interface for contractors and project managers to view, edit, and manage detailed cost breakdowns.

## Features

- **Interactive Estimate Management**: View and edit construction estimates with real-time updates
- **Inline Editing**: Modify quantities and unit costs directly in the table with immediate feedback
- **Real-time Calculations**: Automatic updates of section totals and grand totals as you type
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Section Organization**: Clean accordion-based layout for easy navigation through estimate sections
- **Professional UI**: Modern interface built with shadcn/ui components and Tailwind CSS

## Technologies Used

This project is built with:

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **shadcn/ui** - Beautiful, accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Query** - Data fetching and state management

## Project Structure

```
src/
├── components/
│   ├── estimate/          # Estimate-specific components
│   │   ├── EstimateHeader.tsx
│   │   ├── EstimateView.tsx
│   │   ├── ItemRow.tsx
│   │   ├── SectionPanel.tsx
│   │   └── types.ts
│   └── ui/               # Reusable UI components
├── pages/                # Page components
├── hooks/                # Custom React hooks
└── lib/                  # Utility functions
```

## How to Run the Project

### Prerequisites

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd estimatedetails
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Data Structure

The application loads estimate data from JSON files containing:

- **Sections**: Major project divisions (e.g., "03.02 Framing - Deck")
- **Items**: Individual line items within each section
- **Properties**: Quantity, unit cost, unit of measurement, tax status, cost codes
- **Calculations**: Automatic totals with markup and tax considerations

## Key Components

- **EstimateView**: Main application component that loads and manages estimate data
- **SectionPanel**: Displays individual sections with collapsible accordion functionality
- **ItemRow**: Renders individual line items with inline editing capabilities
- **EstimateHeader**: Shows grand total and global actions (expand/collapse all)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling

### State Management
- React hooks for local state
- React Query for data fetching
- Callback functions for data updates

## Deployment

The project can be deployed using:

- **Lovable Platform**: Click Share → Publish in the Lovable interface
- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder after building
- **Traditional hosting**: Upload the built files to any web server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary and confidential.

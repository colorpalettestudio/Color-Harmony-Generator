# Palette Pro - Color Harmony Generator

## Overview

Palette Pro is a professional color palette generator application designed for graphic designers and creative professionals. The application provides an interactive color wheel interface for selecting base colors and generating harmonious color palettes using various color theory rules (monochromatic, analogous, complementary, triadic, split-complementary, and tetradic). Users can manipulate color properties, adjust lightness levels, copy colors to clipboard, and utilize modern browser features like the EyeDropper API for color picking. The application includes a color history undo feature (Cmd+Z / Ctrl+Z) that allows users to navigate back through randomly generated colors.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses a modern React-based frontend built with Vite as the build tool and bundler. The component architecture follows a modular design pattern with reusable UI components:

- **React 18** with TypeScript for type safety and modern development practices
- **Wouter** for lightweight client-side routing instead of React Router
- **Tailwind CSS** with custom design system for consistent styling and theming
- **Shadcn/ui** component library providing accessible, customizable UI primitives
- **Radix UI** for headless component primitives ensuring accessibility compliance

### State Management
The application uses React's built-in state management with hooks:
- **Local component state** for UI interactions and color manipulation
- **React Query (TanStack Query)** for server state management and caching
- **Toast notifications** for user feedback using a custom toast system

### Color Processing Engine
The core color manipulation is handled by **Chroma.js**, a powerful color manipulation library that:
- Converts between color formats (HEX, RGB, HSL)
- Generates color harmonies based on color theory rules
- Handles color space calculations and transformations
- Provides color validation and error handling

### Component Design System
The application implements a comprehensive design system with:
- **Theme support** for light and dark modes with CSS custom properties
- **Consistent spacing** system using Tailwind's spacing scale
- **Typography hierarchy** with Inter font for UI and JetBrains Mono for color codes
- **Interactive color wheel** with canvas-based rendering for smooth color selection
- **Responsive design** that adapts to different screen sizes

### Backend Architecture
The backend is built with Express.js and follows a clean architecture pattern:
- **Express.js** server with TypeScript for type safety
- **Modular routing** system with separation of concerns
- **Storage abstraction layer** using an interface pattern for data persistence
- **Development/Production** environment configuration with Vite integration

### Development Tooling
The project includes comprehensive development tooling:
- **ESBuild** for fast server-side bundling in production
- **TypeScript** configuration with strict type checking
- **Vite** for fast development server with hot module replacement
- **Path aliases** for clean import statements (@/, @shared/)

## External Dependencies

### Color Processing
- **Chroma.js** - Core color manipulation and conversion library for generating harmonies and handling color space transformations
- **Canvas API** - Browser native API used for rendering the interactive color wheel with pixel-level color calculations

### UI Framework and Styling
- **React 18** - Frontend framework with modern hooks and concurrent features
- **Tailwind CSS** - Utility-first CSS framework with custom design tokens
- **Radix UI** - Headless component library providing accessible primitives (Dialog, Popover, Select, etc.)
- **Lucide React** - Icon library providing consistent iconography throughout the application

### Development and Build Tools
- **Vite** - Build tool and development server with fast HMR and optimized bundling
- **TypeScript** - Type checking and enhanced developer experience
- **ESBuild** - Fast bundler for production server builds
- **PostCSS** with Autoprefixer for CSS processing

### Routing and State Management
- **Wouter** - Lightweight client-side routing library
- **TanStack React Query** - Server state management with caching and synchronization
- **React Hook Form** with Hookform Resolvers for form management

### Database and ORM (Configured but not actively used)
- **Drizzle ORM** - Type-safe SQL ORM with PostgreSQL dialect support
- **Neon Database** - Serverless PostgreSQL database service
- The database configuration exists for future user data storage but current functionality is client-side only

### Browser APIs
- **EyeDropper API** - Modern browser API for picking colors from the screen (Chrome/Edge support)
- **Clipboard API** - For copying color values to user's clipboard
- **CSS Custom Properties** - For dynamic theming and color system implementation
- **Keyboard Event API** - Handles Cmd+Z / Ctrl+Z keyboard shortcuts for color history undo functionality

## Recent Changes

### November 16, 2025 - Color History Undo Feature
- Implemented color history stack that tracks random color generation
- Added keyboard shortcut support (Cmd+Z on Mac, Ctrl+Z on Windows/Linux) for undoing color changes
- Users can now navigate back through previously generated random colors
- History is preserved during the session and resets on page refresh
- Prevents browser's default undo behavior to ensure smooth color navigation
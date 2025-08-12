# Angular Boilerplate - Project Instructions

## Overview
This project is an Angular boilerplate designed to provide a solid foundation for scalable web applications. It includes a modular folder structure, reusable components, services, and best practices for maintainability.

## Prerequisites
- Node.js (v14 or higher recommended)
- npm (v6 or higher)
- Angular CLI (v15 or higher)

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Run the development server:**
   ```sh
   ng serve
   ```
   The app will be available at `http://localhost:4200/`.

3. **Build for production:**
   ```sh
   ng build --prod
   ```

4. **Run tests:**
   ```sh
   ng test
   ```

## Project Structure
- `src/app/core/` - Core services, guards, and adapters
- `src/app/features/` - Feature modules (e.g., login, users)
- `src/app/shared/` - Shared components, services, models, constants, and utilities
- `src/app/models/` - Global models
- `src/environments/` - Environment configuration files
- `src/styles/` - Global SCSS variables and mixins

## Styling
- Uses SCSS with variables and mixins for consistent styling
- Responsive design via custom mixins (`mobile-only`, `tablet-up`, etc.)

## Useful Commands
- `ng generate component <name>` - Generate a new component
- `ng generate service <name>` - Generate a new service
- `ng lint` - Run linter

## Notes
- Update environment variables in `src/environments/` as needed
- Follow the folder structure for scalability and maintainability
- Refer to the `README.md` files in subfolders for more details

## Support
For questions or issues, please refer to the main `README.md` or contact the project maintainer.

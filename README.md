# Chakra UI Todo Table

A modern, accessible React 19 application featuring a selection-enabled pagination table for managing todos. Built with Vite, TypeScript, and Chakra UI.

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Vite](https://img.shields.io/badge/Vite-6-purple)
![Chakra UI](https://img.shields.io/badge/Chakra%20UI-2.x-teal)

## Features

- ✅ **Selection System** - Multi-select rows with individual and "select all" checkboxes
- ✅ **Inline Editing** - Toggle todo completion status directly in the table
- ✅ **Dirty Tracking** - Visual indicators for modified items
- ✅ **Batch Save** - Save all changes with a single click using PATCH requests
- ✅ **Pagination** - Client-side pagination with configurable page sizes
- ✅ **Optimistic Updates** - Immediate UI feedback with rollback on failure
- ✅ **Error Handling** - Graceful error states with retry functionality
- ✅ **Accessibility** - ARIA labels, keyboard navigation, and screen reader support
- ✅ **Responsive Design** - Works on desktop and mobile devices
- ✅ **Dark Mode** - Automatic system color mode detection

## Tech Stack

- **React 19** - Latest React with hooks
- **TypeScript 5.6** - Strict type checking enabled
- **Vite 6** - Fast development and build tooling
- **Chakra UI 2.x** - Accessible component library
- **Emotion** - CSS-in-JS styling
- **Framer Motion** - Animations

## Project Structure

```
src/
├── api/
│   └── todos.ts          # API service layer
├── components/
│   ├── ActionBar/
│   │   ├── ActionBar.tsx # Action bar with save/clear buttons
│   │   └── index.ts
│   └── TodosTable/
│       ├── TodosTable.tsx # Main table component
│       ├── TodoRow.tsx    # Individual row component
│       └── index.ts
├── hooks/
│   └── useTodos.ts       # Custom hook for todo state management
├── pages/
│   └── Home.tsx          # Main page component
├── theme/
│   └── index.ts          # Chakra UI theme configuration
├── types/
│   └── todo.ts           # TypeScript interfaces
├── App.tsx               # Root component
├── main.tsx              # Entry point
└── vite-env.d.ts         # Vite types
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, pnpm, or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server (opens http://localhost:3000)
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Linting

```bash
# Run ESLint
npm run lint
```

## Usage

1. **View Todos** - On load, the app fetches 200 todos from JSONPlaceholder API
2. **Select Rows** - Click the checkbox in the first column to select rows
3. **Toggle Completion** - Click the "Done/Pending" checkbox to mark todos as complete/incomplete
4. **Action Bar** - When rows are selected or modified, the Action Bar appears showing counts
5. **Save Changes** - Click "Save" to persist all modified todos to the API
6. **Clear Changes** - Click "Clear" to discard all local changes and clear selection

## API

This app uses the [JSONPlaceholder](https://jsonplaceholder.typicode.com/) fake API:

- `GET /todos?_limit=200` - Fetch todos
- `PATCH /todos/:id` - Update a todo's completion status

> Note: JSONPlaceholder is a fake API, so PATCH requests are simulated but don't persist data.

## Accessibility

- All interactive elements have proper ARIA labels
- Keyboard navigation supported throughout
- Visual indicators for loading, error, and success states
- Screen reader announcements for state changes

## License

MIT

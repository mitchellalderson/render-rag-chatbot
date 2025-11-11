# RAG Chatbot Frontend

A modern chatbot interface built with React, Vite, TypeScript, Tailwind CSS, shadcn/ui, and Radix UI. This frontend integrates with the `common-ui` wrapper package.

## Features

- 💬 Modern chat interface with message history
- 🎨 Styled with Tailwind CSS and shadcn/ui components
- 🌙 Dark mode support with CSS variables
- 📜 Scrollable message area using Radix UI ScrollArea
- ⌨️ Real-time message input with loading states
- 🎭 User and assistant avatars with icons from lucide-react
- 🔄 Auto-scroll to latest messages

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **shadcn/ui** - Component library built on Radix UI
- **Lucide React** - Icon library
- **common-ui** - Shared UI wrapper package

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── Chatbot.tsx          # Main chatbot component
│   ├── lib/
│   │   └── utils.ts             # Utility functions (cn)
│   ├── App.tsx                  # Root component with UIWrapper
│   ├── main.tsx                 # Entry point
│   ├── index.css                # Global styles with Tailwind
│   └── vite-env.d.ts           # Vite type definitions
├── index.html                   # HTML template
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── postcss.config.js           # PostCSS configuration
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

From the project root:

```bash
npm install
```

### Development

Start the development server:

```bash
# From project root
npm run dev:frontend

# Or from this directory
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Build

Build for production:

```bash
# From project root
npm run build:frontend

# Or from this directory
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Component Usage

### Chatbot Component

The `Chatbot` component is the main chat interface:

```tsx
import { Chatbot } from './components/Chatbot'

function App() {
  return <Chatbot />
}
```

### With UIWrapper

The app uses the `UIWrapper` from `common-ui` to provide consistent styling:

```tsx
import { UIWrapper } from 'common-ui'
import { Chatbot } from './components/Chatbot'

function App() {
  return (
    <UIWrapper>
      <Chatbot />
    </UIWrapper>
  )
}
```

## Customization

### Styling

The chatbot uses CSS variables for theming. You can customize colors in `src/index.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... more variables */
}
```

### Backend Integration

The chatbot currently uses simulated responses. To integrate with a real backend:

1. Replace the `setTimeout` in `handleSubmit` with an actual API call
2. Update the `assistantMessage` creation with the response from your backend
3. Add error handling for API failures

Example:

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!input.trim() || isLoading) return

  const userMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content: input.trim(),
    timestamp: new Date(),
  }

  setMessages((prev) => [...prev, userMessage])
  setInput('')
  setIsLoading(true)

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage.content }),
    })
    
    const data = await response.json()
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: data.response,
      timestamp: new Date(),
    }
    
    setMessages((prev) => [...prev, assistantMessage])
  } catch (error) {
    console.error('Chat error:', error)
    // Handle error appropriately
  } finally {
    setIsLoading(false)
  }
}
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Dependencies

Key dependencies:

- `react` & `react-dom` - React library
- `@radix-ui/react-scroll-area` - Scrollable area component
- `lucide-react` - Icons
- `tailwindcss` - CSS framework
- `common-ui` - Shared UI wrapper (local package)

## License

This project is part of the RAG Chatbot monorepo.

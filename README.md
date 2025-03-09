# Wrapped Again

Discover your WhatsApp chat story. 
Upload your WhatsApp chat export and get beautiful insights about your conversations, emoji usage, and chat patterns. 
Visit the web app here: https://wrappedagain.lovable.app/

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or bun package manager

## 🛠 Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd wrappedagain
```

2. Install dependencies:
```bash
npm install
# or if using bun
bun install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add your Supabase configuration:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚀 Running the Application

To run the application in development mode:

```bash
npm run dev
# or
bun dev
```

The application will start on `http://localhost:5173` (or another port if 5173 is occupied).

To build for production:

```bash
npm run build
# or
bun run build
```

## 🧪 Linting

To run the linter:

```bash
npm run lint
# or
bun run lint
```

## 📦 Production Preview

To preview the production build locally:

```bash
npm run preview
# or
bun run preview
```

## 🏗 Project Structure

- `/src` - Source code
- `/public` - Static assets
- `/supabase` - Supabase configuration and functions
- `/components` - Reusable UI components

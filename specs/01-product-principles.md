# Product Principles

## 1. User Experience Philosophy
- **Standard Point-and-Click GUI (Norman Door Design Thinking):** Interactions must be obvious, immediate, and free of hidden gestures. Everything should visually afford its function.
- **Desktop-Class Drafting Workspace:** While the layout MUST be fully responsive, the primary design target is a powerful desktop writing interface. Use fluid grid layouts and structural sidebars appropriately.
- **Cursor-Based Pagination:** All feed and read-heavy views must implement cursor-based pagination to handle infinite scrolling or "Load More" paradigms smoothly, matching native application feel.

## 2. Visual Identity & Design System
- **Theme:** Dark mode default.
- **Inspiration:** Linear, Vercel, and Google Gemini web apps. 
- **Components:** `shadcn/ui` combined with Base UI primitives for complex interactions. Clean borders, muted typography for metadata, and high-contrast primary actions.

## 3. Simplicity vs Flexibility
- Prioritize robustness and speed. Because this is for personal use, features should be built for specific workflows (Draft, Bookmark, Thread) rather than generic, complex configurations.

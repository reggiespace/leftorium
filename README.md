<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 👈 Leftorium: The Southpaw Sanctuary

### "The world is right-handed. We’re here to fix that."

Leftorium is a curated platform and community hub designed specifically for the 10% of the population that navigates a right-aligned world. From ergonomic tools to a dedicated lab for pitching new ideas, we make life 10% better for every southpaw.

---

## 🚀 Core Features

-   **Curated Gear**: Discover high-quality products built with left-handed ergonomics in mind.
-   **The Idea Lab**: Pitch and vote on innovative solutions to daily left-handed struggles.
-   **Southpaw Community**: Share feedback and connect with over 800 million world-wide southpaws.
-   **Dynamic Backend**: Powered by Strapi CMS for real-time updates and community content management.

## 🛠 Tech Stack

-   **Frontend**: React 19, TypeScript, Vite
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Backend**: [Strapi 5](https://strapi.io/)
-   **AI Integration**: Google Gemini API for content assistance

## 🎨 UI & Design System

### Design System Page
The application features a comprehensive design system built with **shadcn/ui** and a custom **pastel color palette**. You can preview all UI components, tokens, and color variables in development:

👉 **URL**: `/dev/design-system` (e.g., `http://localhost:3002/#/dev/design-system`)

### Production Safeguard
The Design System page is **development-only**. It is conditionally rendered in `App.tsx` using `import.meta.env.DEV`:

```tsx
{import.meta.env.DEV && (
  <Route path="/dev/design-system" element={<DesignSystem />} />
)}
```

This ensures that the route is inaccessible and the code is stripped from production builds.

## 🏁 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (LTS recommended)
-   [pnpm](https://pnpm.io/) (preferred) or npm

### Installation

1.  **Clone the Repository**
    ```bash
    git clone [your-repo-url]
    cd leftorium
    ```

2.  **Install Dependencies**
    ```bash
    pnpm install
    # or
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file based on [.env.sample](.env.sample):
    ```env
    VITE_STRAPI_URL=http://localhost:1337
    # Optional: GEMINI_API_KEY=your-key-here
    ```

4.  **Run Locally**
    ```bash
    pnpm dev
    # or
    npm run dev
    ```

## 🏗 Backend Configuration

Existing product and user data are managed via Strapi. For detailed instructions on setting up your local Strapi instance, publishing content, and fixing permission issues, please refer to:

👉 **[STRAPI_SETUP.md](STRAPI_SETUP.md)**

---

<div align="center">
Made with ❤️ for the lefties.
</div>

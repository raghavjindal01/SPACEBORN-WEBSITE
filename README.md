# Spaceborn Website

> The Android of drone autonomy through simulation-first intelligence.

This repository contains the official frontend website for **Spaceborn**, showcasing their simulation-first autonomous flight intelligence platforms and systems.

Built using a modern web stack featuring **Next.js**, **React**, **TypeScript**, and **Vanilla CSS** for precise layout and fluid, interactive styling.

---

## 🚀 Getting Started

Follow these instructions to set up the project locally for development and testing.

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v18.x or later is recommended).

### Installation

Clone the repository and install the project dependencies:

```bash
# Install package dependencies
npm install
```

### Development Scripts

In the project directory, you can run the following scripts:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the app in development mode at [http://localhost:3000](http://localhost:3000). |
| `npm run build` | Builds the application for production usage into the `.next` folder. |
| `npm run start` | Starts a Next.js production server using the built assets. |

---

## 📂 Project Structure

Here is a quick overview of the directory layout:

```text
├── app/                  # Next.js App Router directories and page layouts
│   ├── career/           # Career opportunities page
│   ├── partners/         # Partners page
│   ├── globals.css       # Core design system and stylesheet
│   ├── layout.tsx        # Main page wrapper with HTML/body and meta headers
│   └── page.tsx          # Landing page entry point
├── components/           # Reusable UI component code
│   ├── HomePage.tsx      # Core landing page layout and interactive simulators grid
│   └── MobileMenu.tsx    # Mobile navigation drawer component
├── public/               # Static assets (images, videos, icons)
├── package.json          # Package manifest and script definitions
├── tsconfig.json         # TypeScript compiler configurations
└── .gitignore            # Git exclusions
```

---

## 🛠️ Tech Stack & Features

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Vanilla CSS** with customizable animations and custom responsive layouts
- Fully-responsive design (mobile-first transitions)
- High-fidelity background videos & media components

---

## 📄 License

This project is proprietary and confidential. All rights reserved.

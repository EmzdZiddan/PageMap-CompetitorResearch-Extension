# 🗺️ PageMap — Competitor Research Extension

> **Instant competitor website teardown & content intelligence tool for Marketing Strategists, UI/UX Designers, SEO Specialists, and Product Teams.**

[![Chrome Extension](https://img.shields.io/badge/Platform-Chrome%20Extension%20(MV3)-4285F4?logo=googlechrome&logoColor=white)](https://github.com/EmzdZiddan/PageMap-CompetitorResearch-Extension)
[![Built with WXT](https://img.shields.io/badge/Framework-WXT%20v0.19-orange)](https://wxt.dev/)
[![React](https://img.shields.io/badge/UI-React%2018%20%2B%20TailwindCSS-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 1. What is PageMap?

**PageMap** is a high-performance Google Chrome Extension (*Manifest V3*) built to extract, deconstruct, and analyze the content architecture of any competitor website or landing page with a **single click**.

Traditional competitive research usually involves hours of tedious manual inspection via browser DevTools. PageMap automates DOM parsing into an intuitive, visual, and structured dashboard. You can instantly inspect messaging frameworks, heading hierarchies, keyword densities, and media assets, then export clean **Markdown** or **JSON** ready for AI/LLM prompts, copywriting benchmarks, or UX audits.

---

## 🎯 2. Who is it for?

| Role | Core Value & Use Cases |
| :--- | :--- |
| **📈 Marketing Strategists & Copywriters** | • Deconstruct competitor value propositions, hooks, and messaging angles.<br>• Analyze high-frequency keywords and n-gram phrases (1-word, 2-word, 3-word).<br>• Audit Call-to-Action (CTA) strategies and conversion paths. |
| **🎨 UI/UX & Product Designers** | • Dissect Information Architecture (IA) and visual hierarchy.<br>• Inspect media assets (image dimensions, aspect ratios, formats, and SVGs).<br>• Use **Click-to-Highlight** to jump directly to any element on the live webpage. |
| **🔍 SEO Specialists** | • Audit heading hierarchies (H1–H6), identify missing levels or skipped heading gaps, and detect multiple H1 tags.<br>• Perform image accessibility audits (flagging missing Alt Text). |
| **🚀 Founders & Product Managers** | • Conduct rapid competitive teardowns during pitching, product positioning, and feature benchmarking without digging into source code. |

---

## ⚡ 3. Key Features

PageMap organizes page intelligence across **5 dedicated tabs**:

```
┌─────────────────────────────────────────────────────────────┐
│                       🗺️ PageMap                            │
├───────────┬───────────┬─────────────┬───────────┬───────────┤
│ Overview  │  Content  │  Structure  │ Frequency │  Assets   │
└───────────┴───────────┴─────────────┴───────────┴───────────┘
```

### 1. 📊 Overview Tab (Executive Summary)
* **High-Level Metrics:** Instant count of total parsed elements, estimated word count, headings, links, images, and videos.
* **Heading Breakdown:** Visual distribution bars for H1, H2, H3, and H4 tags.
* **Quick Actions:** One-click shortcuts to copy all text, copy links, or download complete reports.

### 2. 📝 Content Tab (Chronological Teardown & Interactive Inspect)
* **DOM-Ordered Stream:** Displays every content element (H1–H6, paragraphs, links, buttons, images, videos) in their exact visual reading order.
* **Smart Filter & Search:** Filter by element type (`All`, `Headings`, `Text`, `Links`, `Buttons`, `Media`) or search keywords in real time.
* **Interactive Scroll & Highlight:** Click any card inside PageMap, and the active browser tab will **automatically scroll to and visually highlight** the target element with a smooth glowing animation.

### 3. 🌲 Structure Tab (Heading Hierarchy & SEO Gap Audit)
* **Visual Heading Tree:** An indented, tree-like outline of all heading tags (H1 through H6) mapping the page’s logical structure.
* **Gap & Anomaly Detection:** Automatically detects and alerts you to skipped heading levels (e.g., an `H2` followed directly by an `H4`).
* **Copy Outline:** Copy a clean, hierarchical outline in one click.

### 4. 🔤 Frequency Tab (Keyword & N-Gram Phrase Analysis)
* **Stop-Word Filtering:** Intelligently filters out common stop-words (English and multilingual) to highlight meaningful keywords.
* **N-Gram Grouping:**
  * **1-Word:** Top single keywords.
  * **2-Word Phrases:** Bigrams (e.g., *"free trial"*, *"competitor analysis"*).
  * **3-Word Phrases:** Trigrams (e.g., *"easy to use"*, *"grow your business"*).
* **Occurrence & Density:** Displays exact occurrence counts and relative frequency percentages.

### 5. 🖼️ Assets Tab (Media & Link Audit)
* **Media Inspector:** Complete gallery of extracted images, SVGs, and videos with preview thumbnails, formats, and natural dimensions.
* **Alt Text Audit:** Immediately flags images with missing or empty `alt` attributes.
* **Links & Actionables:** Comprehensive list of all outbound links, internal routes, and actionable button triggers.
* **Direct Export:** Copy asset URLs or download media directly.

### 💾 Flexible Export Options
* **Copy to Clipboard:** Copy formatted plain text, link lists, or heading outlines.
* **Download Markdown (`.md`):** Comprehensive, beautifully formatted report including metadata, page stats, heading tree, and full content. Perfect for feeding directly into ChatGPT, Claude, or Gemini.
* **Download JSON (`.json`):** Clean, structured raw data for analytics pipelines or automated data scrapers.

---

## 🛠️ 4. Tech Stack & Architecture

* **Extension Framework:** [WXT (Next-Gen Web Extension Framework)](https://wxt.dev/)
* **Manifest Version:** Chrome Extension Manifest V3 (MV3)
* **UI & Styling:** [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Bundler:** Vite (WXT-managed)
* **Permissions:** `activeTab`, `scripting` (Zero tracking, strictly local processing on the active tab).

---

## 🚀 5. Getting Started & Setup Guide

### 📋 Prerequisites
Ensure your local environment has:
* **Node.js** >= 18.0.0 ([Download Node.js](https://nodejs.org/))
* **npm** (bundled with Node.js), **pnpm**, or **yarn**
* Any Chromium-based browser (Google Chrome, Brave, Microsoft Edge, Arc, etc.)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/EmzdZiddan/PageMap-CompetitorResearch-Extension.git
cd PageMap-CompetitorResearch-Extension
```

---

### Step 2: Install Dependencies
```bash
npm install
```

---

### Step 3: Run or Build the Extension

Choose one of the following modes:

#### Option A: Development Mode (Live Reload / HMR)
Best for active development with auto-rebuild on file changes:
```bash
npm run dev
```
> WXT will compile the extension and output the development build into `.output/chrome-mv3`.

#### Option B: Production Build
Best for generating an optimized, lightweight build ready for daily use:
```bash
npm run build
```
> The production bundle will be generated inside `.output/chrome-mv3`.

---

### Step 4: Load the Extension into Google Chrome

1. Open **Google Chrome**.
2. Navigate to `chrome://extensions/` in the URL address bar.
3. In the top-right corner, toggle on **Developer mode**.
4. In the top-left corner, click **Load unpacked**.
5. Select the build directory from this project:
   ```text
   <path-to-repo>/PageMap-CompetitorResearch-Extension/.output/chrome-mv3
   ```
6. **PageMap - Competitor Research Tool** is now installed! 🎉
7. *(Recommended)* Click the puzzle icon 🧩 on the Chrome toolbar and pin 📌 **PageMap** for quick access.

---

## 💡 6. How to Use (Research Workflow)

```
1. Visit Target Page ──▶ 2. Click PageMap Icon ──▶ 3. Instant Extraction ──▶ 4. Inspect & Export
   Competitor Site           in Chrome Toolbar          (5 Analysis Tabs)        (Markdown / JSON)
```

1. **Navigate:** Open any public landing page or competitor site (e.g., `https://stripe.com` or `https://linear.app`).
2. **Launch:** Click the PageMap extension icon on your browser toolbar.
3. **Analyze:** The popup automatically parses the active page's DOM in milliseconds.
4. **Explore:**
   * Review high-level statistics in **Overview**.
   * Read the copy sequence and click cards to highlight them in **Content**.
   * Evaluate heading hierarchy and SEO structure in **Structure**.
   * Discover core messaging angles in **Frequency**.
   * Audit visuals and missing alt text in **Assets**.
5. **Export:** Click **Export** in the top header and choose **Download Markdown** or **JSON** to store your research or prompt an AI model.

> [!NOTE]
> **Browser Security Policy:**
> Chrome security restricts content script injection on internal pages (e.g., `chrome://`, `chrome-extension://`, `about:blank`, and the *Chrome Web Store*). Use PageMap on standard public web pages (`http://` or `https://`).

---

## 📁 7. Project Structure

```text
PageMap-CompetitorResearch-Extension/
├── components/             # React UI components
│   ├── tabs/               # Main tab views (Overview, Content, Structure, Frequency, Assets)
│   ├── ContentCard.tsx     # Item card with copy, URL open, and DOM highlight triggers
│   ├── EmptyState.tsx      # State for empty pages or restricted browser URLs
│   ├── Header.tsx          # Top navigation bar, title, and quick-export menu
│   ├── LoadingState.tsx    # Smooth animated loader during DOM analysis
│   └── Footer.tsx          # Extension metadata & repository links
├── entrypoints/            # WXT extension entry points
│   ├── background.ts       # MV3 Service Worker (lifecycle & messaging)
│   ├── content.ts          # Content script injected into host DOM for extraction & highlight
│   └── popup/              # Extension popup application (React App)
│       ├── App.tsx         # Main application controller & state store
│       ├── index.html      # HTML container for popup window
│       ├── main.tsx        # React root mounter
│       └── style.css       # Tailwind CSS directives & custom utility classes
├── lib/                    # Core business logic and utilities
│   ├── exporter/           # Markdown, JSON, and plain-text export generators
│   ├── frequency/          # Multilingual stop-words & n-gram tokenizer engine
│   ├── highlighter/        # Smooth auto-scroll and visual overlay highlight handler
│   ├── hooks/              # Custom React hooks (timeout feedback, observer)
│   ├── parser/             # Deep DOM traversal and content sanitizer
│   └── utils.ts            # Helper utilities (clsx, string formatters, clipboard copy)
├── public/                 # Static assets & extension icons (16px, 32px, 48px, 128px)
├── types/                  # TypeScript interface and type declarations
├── package.json            # Scripts & project dependencies
├── tailwind.config.js      # Tailwind design system tokens & colors
├── tsconfig.json           # TypeScript configuration
└── wxt.config.ts           # WXT configuration & Manifest V3 settings
```

---

## 📜 8. Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server with Hot Module Replacement (HMR) for Chrome. |
| `npm run dev:firefox` | Starts the development server targeting Mozilla Firefox. |
| `npm run build` | Compiles an optimized production build into `.output/chrome-mv3`. |
| `npm run build:firefox` | Compiles a production build targeting Firefox MV2/MV3. |
| `npm run zip` | Bundles the compiled extension into a `.zip` archive ready for Chrome Web Store submission. |
| `npm run compile` | Runs TypeScript type checking (`tsc --noEmit`). |

---

## 🤝 9. Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'feat: Add AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a **Pull Request**.

---

## 📄 10. License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<p align="center">
  Crafted with ❤️ for digital strategists, designers, and builders.<br>
  <b><a href="https://github.com/EmzdZiddan/PageMap-CompetitorResearch-Extension">EmzdZiddan/PageMap-CompetitorResearch-Extension</a></b>
</p>

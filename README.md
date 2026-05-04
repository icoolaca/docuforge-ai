# DocuForge AI

**Smart Document-to-HTML Converter** — Upload any CSV or PDF, let AI parse and organize every detail, then export as a beautifully formatted, print-ready HTML page or PDF.

![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Styling-CSS_Variables-blue)
![Claude API](https://img.shields.io/badge/AI-Claude_Sonnet-orange)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Features

- **AI-Powered Parsing** — Uses Claude Sonnet API to intelligently extract and structure all data from your documents
- **Custom AI Prompts** — Guide the AI with your own instructions or use quick presets (Spec Sheet, Financial Report, Inventory List, General Extract)
- **Smart Section Detection** — Automatically organizes content into features, specifications, data tables, key-value pairs, text blocks, notes, and image placeholders
- **Full Branding Customization** — Live color pickers for 7 theme variables + logo upload, all reflected instantly
- **Editable Header & Footer** — Click-to-edit company name, tagline, and footer contact info
- **Responsive Layout** — Fluid sizing with `clamp()`, auto-fit grids, and mobile-first breakpoints — works on any screen size
- **Print / Save as PDF** — Optimized `@media print` stylesheet with proper page breaks and color preservation
- **Download Standalone HTML** — Export a fully self-contained `.html` file with all styles, fonts, and logo embedded — zero dependencies

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A Claude API key from [Anthropic](https://console.anthropic.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/icoolaca/docuforge-ai.git
cd docuforge-ai

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Usage

1. **Upload** a `.csv` or `.pdf` file via drag-and-drop or file picker
2. **Customize AI instructions** (optional) — pick a preset or type your own prompt
3. Click **Parse & Generate** — the AI analyzes your document and builds a structured page
4. **Customize branding** — open the Branding panel to adjust colors and upload a logo
5. **Edit header/footer** — click the ✏️ buttons to add your company info
6. **Export** — use **Print / PDF** for paper output or **Download HTML** for a standalone web page

---

## Project Structure

```
docuforge-ai/
├── src/
│   └── DocumentConverter.jsx    # Main React component (self-contained)
├── README.md
├── LICENSE
└── .gitignore
```

### Component Architecture

`DocumentConverter.jsx` is a single-file React component that includes:

- **State management** — file handling, parsed sections, branding colors, header/footer content
- **AI integration** — Claude Sonnet API call with dynamic system prompt injection
- **Section renderers** — typed renderers for features, specs, tables, key-values, text, notes, images
- **Branding engine** — CSS variables updated live via React state
- **Export engine** — HTML generation with embedded styles, fonts, and base64 logo
- **Shared CSS function** — `getSharedCSS()` used both inline and in exported HTML for consistency

### Section Types

| Type | Description | Rendering |
|------|-------------|-----------|
| `features` | Bullet-point feature lists | 2-column responsive grid |
| `specs` | Label/value specification pairs | Paired 4-column table (collapses on mobile) |
| `table` | Tabular data with headers | Full data table with sticky headers |
| `text` | Paragraph content | Formatted prose block |
| `key-values` | Key-value pairs | 2-column card grid |
| `notes` | Warnings or notes | Amber-styled callout block |
| `images` | Image descriptions | Dashed placeholder cards |

---

## Integration Guide

### As a Standalone React Component

```jsx
import DocumentConverter from './src/DocumentConverter';

function App() {
  return <DocumentConverter />;
}
```

The component is fully self-contained — no external CSS files, no additional dependencies beyond React.

### API Configuration

The component calls the Claude API directly from the browser. For production use, you should proxy API calls through your backend:

```javascript
// Replace the fetch URL in DocumentConverter.jsx
const res = await fetch("/api/parse-document", { ... });
```

### Required Libraries

- `react` (v18+)
- Google Fonts: **DM Sans** (body) + **JetBrains Mono** (monospace values)
- No other runtime dependencies

---

## Customization

### Default Colors

| Variable | Default | Purpose |
|----------|---------|---------|
| `primary` | `#1e3a5f` | Header bar, company name |
| `accent` | `#2b6cb0` | Links, values, table headers |
| `accentLight` | `#e8f1fb` | Hover states, highlights |
| `surface` | `#f5f7fa` | Alternating rows, backgrounds |
| `text` | `#1a2332` | Primary text |
| `text2` | `#4a5568` | Secondary text |
| `border` | `#dfe4ec` | Dividers, borders |

All colors are editable at runtime via the Branding panel.

### Adding Custom Presets

Edit the `PRESETS` array at the top of `DocumentConverter.jsx`:

```javascript
const PRESETS = [
  { label: "My Custom Type", prompt: "Your AI instructions here..." },
  // ...
];
```

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Author

**John Lutao**

---

## Acknowledgments

- [Anthropic Claude API](https://docs.anthropic.com/) — AI-powered document parsing
- [DM Sans](https://fonts.google.com/specimen/DM+Sans) — Primary typeface
- [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) — Monospace typeface

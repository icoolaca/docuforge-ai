# DocuForge AI

**Smart Document-to-HTML Converter** — Upload any CSV or PDF, let AI parse and organize every detail, then export as a beautifully formatted, print-ready HTML page or PDF.

🚀 **Live Demo:** [https://icoolaca.github.io/docuforge-ai](https://icoolaca.github.io/docuforge-ai)

🔗 **Repository:** [https://github.com/icoolaca/docuforge-ai](https://github.com/icoolaca/docuforge-ai)

![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)
![Claude API](https://img.shields.io/badge/AI-Claude_Sonnet-orange)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Features

- **AI-Powered Parsing** — Uses Claude Sonnet API to intelligently extract and structure all data from your documents
- **Custom AI Prompts** — Guide the AI with your own instructions or use quick presets (Spec Sheet, Financial Report, Inventory List, General Extract)
- **Smart Section Detection** — Automatically organizes content into features, specifications, data tables, key-value pairs, text blocks, notes, and image placeholders
- **Full Branding Customization** — Live color pickers for 7 theme variables + logo upload, all reflected instantly
- **Editable Header & Footer** — Click-to-edit company name, tagline, and footer contact info
- **Responsive Layout** — Fluid sizing with `clamp()`, auto-fit grids, and mobile-first breakpoints
- **Print / Save as PDF** — Optimized print stylesheet with proper page breaks and color preservation
- **Download Standalone HTML** — Export a self-contained `.html` file with all styles embedded
- **API Key Management** — Enter your Claude API key once, stored locally in your browser

---

## Quick Start

### Option 1 — GitHub Pages (No Setup)

Visit the **[Live Demo](https://icoolaca.github.io/docuforge-ai)**, enter your Claude API key, and start converting documents immediately.

### Option 2 — Self-Hosted

```bash
git clone https://github.com/icoolaca/docuforge-ai.git
cd docuforge-ai
```

Open `index.html` in any browser — that's it. No build step, no `npm install`, no dependencies to manage.

---

## Usage

1. **Enter your Claude API key** — get one at [console.anthropic.com](https://console.anthropic.com/)
2. **Upload** a `.csv` or `.pdf` file via drag-and-drop or file picker
3. **Customize AI instructions** (optional) — pick a preset or type your own prompt
4. Click **Parse & Generate**
5. **Customize branding** — open the Branding panel to adjust colors and upload a logo
6. **Edit header/footer** — click the ✏️ buttons to add your company info
7. **Export** — use **Print / PDF** for paper output or **Download HTML** for a standalone web page

---

## Project Structure

```
docuforge-ai/
├── index.html       # Complete app — single file, zero dependencies
├── README.md
├── LICENSE
└── .gitignore
```

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

Edit the `PRESETS` array inside `index.html`:

```javascript
const PRESETS = [
  { label: "My Custom Type", prompt: "Your AI instructions here..." },
  // ...
];
```

---

## Deploying to GitHub Pages

1. Push `index.html` to the `main` branch
2. Go to **Settings → Pages** in your repo
3. Set Source to **Deploy from a branch**, select `main` / `/ (root)`
4. Your app will be live at `https://<username>.github.io/docuforge-ai/`

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

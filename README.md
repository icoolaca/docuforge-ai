# DocuForge AI

**Smart Document-to-HTML Converter** — Upload any CSV or PDF, let AI parse and organize every detail, then export as a beautifully formatted, print-ready HTML page or PDF.

🚀 **Live Demo:** [https://icoolaca.github.io/docuforge-ai](https://icoolaca.github.io/docuforge-ai)

🔗 **Repository:** [https://github.com/icoolaca/docuforge-ai](https://github.com/icoolaca/docuforge-ai)

![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)
![Gemini API](https://img.shields.io/badge/AI-Gemini_2.5_Flash-4285F4?logo=google&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Features

- **AI-Powered Parsing** — Uses Google Gemini 2.5 Flash (free tier) to intelligently extract and structure all data
- **Custom AI Prompts** — Guide the AI with your own instructions or use quick presets (Spec Sheet, Financial Report, Inventory List, General Extract)
- **Smart Section Detection** — Auto-organizes content into features, specs, tables, key-values, text, notes, and image placeholders
- **Full Branding Customization** — Live color pickers for 7 theme variables + logo upload
- **Editable Header & Footer** — Click-to-edit company name, tagline, and contact info
- **Responsive Layout** — Fluid sizing, auto-fit grids, mobile-first breakpoints
- **Print / Save as PDF** — Optimized print stylesheet with page breaks and color preservation
- **Download Standalone HTML** — Self-contained `.html` file with all styles embedded

---

## Quick Start

### Option 1 — Live Demo (No Setup)

Visit the **[Live Demo](https://icoolaca.github.io/docuforge-ai)**, enter your Claude API key, and start converting.

### Option 2 — Self-Hosted

```bash
git clone https://github.com/icoolaca/docuforge-ai.git
```

Open `index.html` in any browser. No build step, no npm, no dependencies.

---

## Usage

1. Enter your **Gemini API key** — free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey) (no credit card needed)
2. **Upload** a `.csv` or `.pdf` file
3. Optionally **customize AI instructions** or pick a preset
4. Click **Parse & Generate**
5. **Customize branding** — colors and logo
6. **Export** via Print/PDF or Download HTML

---

## Project Structure

```
docuforge-ai/
├── index.html    # Complete app — single file, zero dependencies
├── README.md
└── LICENSE
```

---

## License

MIT License — see [LICENSE](LICENSE) for details.

## Author

**John Lutao**
